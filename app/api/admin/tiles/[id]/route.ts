// app/api/admin/tiles/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Unwrapping the promise
    const { id } = await params;

    const tile = await prisma.tile.findUnique({
      where: { id: id },
      include: {
        dealer: true,
        images: true,
      },
    });

    if (!tile) {
      return NextResponse.json({ error: "Tile not found" }, { status: 404 });
    }

    return NextResponse.json(tile);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Fetch error" }, { status: 500 });
  }
}
