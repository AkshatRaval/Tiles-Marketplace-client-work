// app/api/public/tiles/[id]/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const tile = await prisma.tile.findUnique({
      where: {
        id: id,
        isPublished: true, // Only show published tiles
      },
      include: {
        images: true,
        // DO NOT include dealer info - keep dealer anonymous
        dealer: false,
      },
    });

    if (!tile) {
      return NextResponse.json(
        { error: "Tile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(tile);
  } catch (error: any) {
    console.error("TILE_GET_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch tile", details: error.message },
      { status: 500 }
    );
  }
}