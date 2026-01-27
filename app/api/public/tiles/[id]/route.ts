import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tile = await prisma.tile.findFirst({
      where: {
        id: params.id,
        isPublished: true,
      },
      include: {
        dealer: {
          select: {
            name: true,
            shopName: true,
            city: true,
          },
        },
        images: true,
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
    console.error("FETCH_TILE_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch tile", details: error.message },
      { status: 500 }
    );
  }
}