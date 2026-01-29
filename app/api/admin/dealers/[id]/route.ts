// app/api/admin/dealers/[id]/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Await params first
    const { id } = await context.params;

    const dealer = await prisma.dealer.findUnique({
      where: {
        id: id,
      },
      include: {
        tiles: {
          include: {
            images: {
              take: 1,
            },
          },
        },
        _count: {
          select: {
            tiles: true,
          },
        },
      },
    });

    if (!dealer) {
      return NextResponse.json(
        { error: "Dealer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(dealer);
  } catch (error: any) {
    console.error("FETCH_DEALER_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch dealer", details: error.message },
      { status: 500 }
    );
  }
}