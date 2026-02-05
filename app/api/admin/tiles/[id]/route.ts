// app/api/admin/tiles/[id]/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const normalizeEnum = (value: string) =>
  value.toUpperCase().replace(/\s+/g, "_");

// GET single tile
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const tile = await prisma.tile.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { createdAt: "asc" }, // ✅ First uploaded = first shown
        },
        dealer: true,
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
    console.error("GET_TILE_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch tile", details: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Update tile
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
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
      imageUrls,
      pdfUrl,
      isPublished,
    } = body;

    // Check if tile exists
    const existingTile = await prisma.tile.findUnique({
      where: { id },
    });

    if (!existingTile) {
      return NextResponse.json(
        { error: "Tile not found" },
        { status: 404 }
      );
    }

    // If SKU is being changed, check if new SKU already exists
    if (sku && sku !== existingTile.sku) {
      const skuExists = await prisma.tile.findUnique({
        where: { sku },
      });

      if (skuExists) {
        return NextResponse.json(
          { error: "A tile with this SKU already exists" },
          { status: 400 }
        );
      }
    }

    // If dealerId is being changed, check if dealer exists
    if (dealerId && dealerId !== existingTile.dealerId) {
      const dealerExists = await prisma.dealer.findUnique({
        where: { id: dealerId },
      });

      if (!dealerExists) {
        return NextResponse.json(
          { error: "Dealer not found" },
          { status: 404 }
        );
      }
    }

    // Build update data
    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (sku !== undefined) updateData.sku = sku;
    if (size !== undefined) updateData.size = size;
    if (material !== undefined) updateData.material = material;
    if (finish !== undefined) updateData.finish = normalizeEnum(finish);
    if (category !== undefined) updateData.category = normalizeEnum(category);
    if (pricePerSqft !== undefined) updateData.pricePerSqft = parseFloat(pricePerSqft);
    if (pricePerBox !== undefined) updateData.pricePerBox = parseFloat(pricePerBox);
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (description !== undefined) updateData.description = description || null;
    if (pdfUrl !== undefined) updateData.pdfUrl = pdfUrl || null;
    if (isPublished !== undefined) updateData.isPublished = isPublished;

    // Handle dealer update
    if (dealerId !== undefined) {
      updateData.dealer = {
        connect: { id: dealerId },
      };
    }

    // Handle images update
    if (imageUrls !== undefined && Array.isArray(imageUrls)) {
      // Delete old images
      await prisma.tileImage.deleteMany({
        where: { tileId: id },
      });

      // Create new images
      updateData.images = {
        create: imageUrls.map((url: string) => ({
          imageUrl: url,
        })),
      };
    }

    const updatedTile = await prisma.tile.update({
      where: { id },
      data: updateData,
      include: {
        images: {
          orderBy: { createdAt: "asc" },
        },
        dealer: true,
      },
    });

    return NextResponse.json(updatedTile);
  } catch (error: any) {
    console.error("UPDATE_TILE_ERROR:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A tile with this SKU already exists" },
        { status: 400 }
      );
    }

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Tile or related record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update tile", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete tile
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Check if tile exists
    const tile = await prisma.tile.findUnique({
      where: { id },
      include: {
        cartItems: true,
        bookings: true,
        reviews: true,
        wishlist: true,
      },
    });

    if (!tile) {
      return NextResponse.json(
        { error: "Tile not found" },
        { status: 404 }
      );
    }

    // Check if tile is being used
    if (tile.cartItems.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete tile that is in carts" },
        { status: 400 }
      );
    }

    if (tile.bookings.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete tile that has bookings" },
        { status: 400 }
      );
    }

    // Delete related records first (due to cascade, this might not be needed but good practice)
    await prisma.tileImage.deleteMany({
      where: { tileId: id },
    });

    await prisma.review.deleteMany({
      where: { tileId: id },
    });

    await prisma.wishlist.deleteMany({
      where: { tileId: id },
    });

    // Delete the tile
    await prisma.tile.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Tile deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE_TILE_ERROR:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Tile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete tile", details: error.message },
      { status: 500 }
    );
  }
}