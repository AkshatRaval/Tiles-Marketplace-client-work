// app/api/admin/tiles/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface RouteParams {
  params: { id: string };
}

export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const tile = await prisma.tile.findUnique({
      where: { id: params.id },
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
    console.error("ADMIN_TILE_GET_ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch tile" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const body = await req.json();

    const {
      name,
      sku,
      category,
      material,
      size,
      finish,
      pricePerSqft,
      pricePerBox,
      stock,
      description,
      dealerId,
      isPublished,
    } = body;

    const updated = await prisma.tile.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(sku !== undefined && { sku }),
        ...(category !== undefined && {
          category: category.toUpperCase().replace(/\s+/g, "_") as any,
        }),
        ...(material !== undefined && { material }),
        ...(size !== undefined && { size }),
        ...(finish !== undefined && {
          finish: finish.toUpperCase().replace(/\s+/g, "_") as any,
        }),
        ...(pricePerSqft !== undefined && {
          pricePerSqft: Number(pricePerSqft) || 0,
        }),
        ...(pricePerBox !== undefined && {
          pricePerBox: Number(pricePerBox) || 0,
        }),
        ...(stock !== undefined && {
          stock: Math.round(Number(stock)) || 0,
        }),
        ...(description !== undefined && { description }),
        ...(dealerId && {
          dealer: {
            connect: { id: dealerId },
          },
        }),
        ...(isPublished !== undefined && { isPublished: Boolean(isPublished) }),
      },
      include: {
        dealer: {
          select: { name: true, shopName: true },
        },
        images: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("ADMIN_TILE_UPDATE_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update tile", details: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  try {
    await prisma.tile.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("ADMIN_TILE_DELETE_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to delete tile", details: error.message },
      { status: 500 },
    );
  }
}
