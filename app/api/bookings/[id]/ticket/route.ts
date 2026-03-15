import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    // Get booking with all details
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        tiles: {
          include: {
            tile: {
              include: {
                dealer: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Calculate totals
    const totalAmount = booking.tiles.reduce(
      (sum: any, bt: any) => sum + bt.tile.pricePerBox * bt.quantity,
      0,
    );

    const statusConfig: Record<string, { color: string; bg: string }> = {
      NEW: { color: "#FB8C00", bg: "#FFF3E0" },
      CONFIRMED: { color: "#43A047", bg: "#E8F5E9" },
      COMPLETE: { color: "#9C27B0", bg: "#F3E5F5" },
      CANCELLED: { color: "#E53935", bg: "#FFEBEE" },
      REJECTED: { color: "#E53935", bg: "#FFEBEE" },
    };

    const currentStatus = statusConfig[booking.status] || {
      color: "#757575",
      bg: "#FAFAFA",
    };

    // Generate modern HTML invoice
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice - ${booking.id.slice(0, 8)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #1a1a1a;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
    }

    .invoice-wrapper {
      max-width: 850px;
      margin: 0 auto;
      background: white;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      border-radius: 16px;
      overflow: hidden;
    }

    .accent-bar {
      height: 8px;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    }

    .invoice-content {
      padding: 50px 60px;
    }

    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 50px;
      padding-bottom: 30px;
      border-bottom: 3px solid #f0f0f0;
      position: relative;
    }

    .header::after {
      content: '';
      position: absolute;
      bottom: -3px;
      left: 0;
      width: 100px;
      height: 3px;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    }

    .brand {
      flex: 1;
    }

    .brand-name {
      font-size: 42px;
      font-weight: 800;
      letter-spacing: -1px;
      margin-bottom: 8px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .brand-tagline {
      font-size: 13px;
      color: #666;
      font-weight: 500;
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    .invoice-meta {
      text-align: right;
    }

    .invoice-label {
      font-size: 11px;
      color: #999;
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .invoice-number {
      font-size: 28px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 12px;
    }

    .invoice-date {
      font-size: 14px;
      color: #666;
      font-weight: 500;
    }

    /* Cards Grid */
    .cards-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 50px;
    }

    .card {
      background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%);
      border-radius: 12px;
      padding: 24px;
      border: 1px solid #e8ebff;
      position: relative;
      overflow: hidden;
    }

    .card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
    }

    .card-title {
      font-size: 11px;
      color: #667eea;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-bottom: 16px;
    }

    .card-content {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .card-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-row-label {
      font-size: 12px;
      color: #666;
      font-weight: 500;
    }

    .card-row-value {
      font-size: 15px;
      color: #1a1a1a;
      font-weight: 600;
    }

    /* Status Badge */
    .status-card {
      background: ${currentStatus.bg};
      border: 1px solid ${currentStatus.color}33;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 32px 24px;
    }

    .status-card::before {
      background: ${currentStatus.color};
    }

    .status-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: ${currentStatus.color}22;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      margin-bottom: 12px;
    }

    .status-label {
      font-size: 11px;
      color: #666;
      font-weight: 600;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .status-value {
      font-size: 22px;
      font-weight: 700;
      color: ${currentStatus.color};
      letter-spacing: 0.5px;
    }

    /* Section */
    .section {
      margin-bottom: 40px;
    }

    .section-header {
      font-size: 12px;
      color: #667eea;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 2px solid #f0f0f0;
      position: relative;
    }

    .section-header::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 60px;
      height: 2px;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    }

    .customer-card {
      background: #fafbff;
      border: 1px solid #e8ebff;
      border-radius: 12px;
      padding: 28px;
    }

    .customer-name {
      font-size: 22px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 16px;
      letter-spacing: -0.5px;
    }

    .customer-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #444;
    }

    .info-icon {
      width: 20px;
      text-align: center;
    }

    .info-item.full-width {
      grid-column: 1 / -1;
    }

    /* Table */
    .table-container {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #e8ebff;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    th {
      padding: 16px 20px;
      text-align: left;
      font-size: 11px;
      font-weight: 700;
      color: white;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    th:last-child {
      text-align: right;
    }

    tbody tr {
      border-bottom: 1px solid #f0f0f0;
      transition: background 0.2s;
    }

    tbody tr:hover {
      background: #fafbff;
    }

    tbody tr:last-child {
      border-bottom: none;
    }

    td {
      padding: 18px 20px;
      font-size: 14px;
      color: #444;
    }

    td:last-child {
      text-align: right;
    }

    .item-number {
      font-weight: 700;
      color: #667eea;
      font-size: 15px;
    }

    .item-name {
      font-weight: 600;
      color: #1a1a1a;
    }

    .item-qty {
      font-weight: 600;
    }

    .item-amount {
      font-weight: 700;
      color: #1a1a1a;
      font-size: 15px;
    }

    /* Summary */
    .summary {
      margin-top: 32px;
      display: flex;
      justify-content: flex-end;
    }

    .summary-box {
      width: 100%;
      max-width: 350px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 14px 0;
      font-size: 14px;
      color: #666;
      border-bottom: 1px solid #f0f0f0;
    }

    .summary-row-value {
      font-weight: 600;
      color: #1a1a1a;
    }

    .summary-total {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px 24px;
      border-radius: 12px;
      margin-top: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .summary-total-label {
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
      opacity: 0.9;
    }

    .summary-total-value {
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }

    /* Notes */
    .notes {
      background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);
      border-left: 4px solid #ffa726;
      border-radius: 12px;
      padding: 24px;
      margin-top: 40px;
    }

    .notes-title {
      font-size: 13px;
      font-weight: 700;
      color: #f57c00;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .notes-list {
      list-style: none;
      padding: 0;
    }

    .notes-list li {
      font-size: 13px;
      color: #5d4037;
      margin-bottom: 10px;
      padding-left: 24px;
      position: relative;
      line-height: 1.6;
    }

    .notes-list li:before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #ffa726;
      font-weight: 700;
      font-size: 16px;
    }

    .notes-list li:last-child {
      margin-bottom: 0;
    }

    /* Footer */
    .footer {
      margin-top: 60px;
      padding-top: 30px;
      border-top: 2px solid #f0f0f0;
      text-align: center;
    }

    .footer-brand {
      font-size: 15px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 8px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .footer-contact {
      font-size: 12px;
      color: #999;
      font-weight: 500;
    }

    @media print {
      body {
        background: white;
        padding: 0;
      }
      .invoice-wrapper {
        box-shadow: none;
        border-radius: 0;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-wrapper">
    <div class="accent-bar"></div>
    <div class="invoice-content">
      
      <!-- Header -->
      <div class="header">
        <div class="brand">
          <div class="brand-name">TilesMarket</div>
          <div class="brand-tagline">Premium Tile Solutions</div>
        </div>
        <div class="invoice-meta">
          <div class="invoice-label">Invoice</div>
          <div class="invoice-number">#${booking.id.slice(0, 8).toUpperCase()}</div>
          <div class="invoice-date">${new Date(
            booking.createdAt,
          ).toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}</div>
        </div>
      </div>

      <!-- Info Cards -->
      <div class="cards-grid">
        <div class="card">
          <div class="card-title">Booking Information</div>
          <div class="card-content">
            <div class="card-row">
              <span class="card-row-label">Booking ID</span>
              <span class="card-row-value">${booking.id.slice(0, 12).toUpperCase()}</span>
            </div>
            <div class="card-row">
              <span class="card-row-label">Date Issued</span>
              <span class="card-row-value">${new Date(
                booking.createdAt,
              ).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}</span>
            </div>
            ${
              booking.meetingDate
                ? `
            <div class="card-row">
              <span class="card-row-label">Meeting Date</span>
              <span class="card-row-value">${new Date(
                booking.meetingDate,
              ).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}</span>
            </div>
            `
                : ""
            }
          </div>
        </div>

        <div class="card status-card">
          <div class="status-icon">✓</div>
          <div class="status-label">Status</div>
          <div class="status-value">${booking.status}</div>
        </div>
      </div>

      <!-- Customer Information -->
      <div class="section">
        <div class="section-header">Customer Details</div>
        <div class="customer-card">
          <div class="customer-name">${booking.customerName}</div>
          <div class="customer-info">
            ${booking.email ? `<div class="info-item"><span class="info-icon">✉</span> ${booking.email}</div>` : ""}
            <div class="info-item"><span class="info-icon">📱</span> ${booking.phone}</div>
            <div class="info-item"><span class="info-icon">📍</span> ${booking.city}</div>
            ${booking.address ? `<div class="info-item full-width"><span class="info-icon">🏠</span> ${booking.address}</div>` : ""}
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <div class="section">
        <div class="section-header">Order Items</div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th style="width: 8%">#</th>
                <th style="width: 45%">Product</th>
                <th style="width: 15%">Quantity</th>
                <th style="width: 17%">Price/Box</th>
                <th style="width: 15%">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${booking.tiles
                .map(
                  (bt: any, index: number) => `
                <tr>
                  <td class="item-number">${index + 1}</td>
                  <td class="item-name">${bt.tile.name}</td>
                  <td class="item-qty">${bt.quantity} Box${bt.quantity > 1 ? "es" : ""}</td>
                  <td>₹${bt.tile.pricePerBox.toLocaleString("en-IN")}</td>
                  <td class="item-amount">₹${(bt.tile.pricePerBox * bt.quantity).toLocaleString("en-IN")}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <!-- Summary -->
        <div class="summary">
          <div class="summary-box">
            <div class="summary-row">
              <span>Subtotal</span>
              <span class="summary-row-value">₹${totalAmount.toLocaleString("en-IN")}</span>
            </div>
            <div class="summary-row">
              <span>Total Boxes</span>
              <span class="summary-row-value">${booking.quantityBox}</span>
            </div>
            <div class="summary-total">
              <span class="summary-total-label">Total Amount</span>
              <span class="summary-total-value">₹${totalAmount.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div class="notes">
        <div class="notes-title">
          <span>⚠</span>
          <span>Important Information</span>
        </div>
        <ul class="notes-list">
          <li>This is a booking confirmation. Final pricing will be confirmed by the dealer.</li>
          <li>Delivery charges and applicable taxes may vary based on location and quantity.</li>
          <li>Please present this invoice during product pickup or delivery.</li>
        </ul>
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="footer-brand">TilesMarket - Premium Tile Solutions</div>
        <div class="footer-contact">www.tilesmarket.com • contact@tilesmarket.com • +91 1234 567 890</div>
      </div>

    </div>
  </div>
</body>
</html>
    `;

    // Generate PDF using puppeteer-core + @sparticuz/chromium (Vercel compatible)
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1280, height: 720 },
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "0mm",
        right: "0mm",
        bottom: "0mm",
        left: "0mm",
      },
    });

    await browser.close();

    // Convert Uint8Array to Buffer
    const buffer = Buffer.from(pdfBuffer);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${booking.id.slice(0, 8)}.pdf"`,
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("GENERATE_INVOICE_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
