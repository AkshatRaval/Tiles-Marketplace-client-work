import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [totalTiles, totalDealers, totalOrders] = await Promise.all([
      prisma.tile.count(),
      prisma.dealer.count(),
      prisma.booking.count(),
    ]);

    return NextResponse.json({
      totalTiles,
      totalDealers,
      totalOrders,
    });
  } catch (error) {
    console.error("PLATFORM_STATS_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch platform stats" },
      { status: 500 }
    );
  }
}