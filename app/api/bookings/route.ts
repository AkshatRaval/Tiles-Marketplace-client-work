import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - Fetch user's bookings
export async function GET(req: Request) {
  try {
    // Try multiple auth methods
    let userId = req.headers.get("x-user-id");
    
    // Fallback: try to get from auth token
    if (!userId) {
      const authHeader = req.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        // Here you would decode JWT and get userId
        // userId = decodeToken(authHeader.substring(7)).userId;
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId: userId,
      },
      include: {
        tile: {
          include: {
            images: {
              take: 1,
            },
            dealer: {
              select: {
                name: true,
                shopName: true,
                city: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(bookings);
  } catch (error: any) {
    console.error("BOOKINGS_GET_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings", details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new booking
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const {
      userId, // Accept from body for flexibility
      tileId,
      customerName,
      phone,
      email,
      city,
      address,
      quantityBox,
    } = body;

    // Validation
    if (!tileId || !customerName || !phone || !city || !quantityBox) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (quantityBox < 1) {
      return NextResponse.json(
        { error: "Quantity must be at least 1" },
        { status: 400 }
      );
    }

    // Check if tile exists and has stock
    const tile = await prisma.tile.findUnique({
      where: { id: tileId },
      select: { stock: true, name: true },
    });

    if (!tile) {
      return NextResponse.json(
        { error: "Tile not found" },
        { status: 404 }
      );
    }

    if (tile.stock < quantityBox) {
      return NextResponse.json(
        { error: `Only ${tile.stock} boxes available` },
        { status: 400 }
      );
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        tileId: tileId,
        customerName: customerName,
        phone: phone,
        email: email || null,
        city: city,
        address: address || null,
        quantityBox: quantityBox,
        status: "NEW",
        userId: userId || null,
      },
      include: {
        tile: {
          include: {
            images: { take: 1 },
            dealer: {
              select: {
                name: true,
                shopName: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    console.error("BOOKING_CREATE_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create booking", details: error.message },
      { status: 500 }
    );
  }
}