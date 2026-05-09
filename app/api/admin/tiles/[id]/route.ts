// app/api/admin/tiles/[id]/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { deleteMediaFromCloudinary } from "@/lib/cloudinary";

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
        images: { orderBy: { createdAt: "asc" } },
        dealer: true,
      },
    });

    if (!tile) {
      return NextResponse.json({ error: "Tile not found" }, { status: 404 });
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

// PATCH - Update tile (with Cloudinary media cleanup)
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
      color,
      application,
      mount,
      pricePerSqft,
      pricePerBox,
      stock,
      description,
      dealerId,
      imageUrls, // new image URLs already uploaded to Cloudinary
      pdfUrl,    // new PDF URL already uploaded to Cloudinary
      isPublished,
    } = body;

    // Fetch existing tile with images for Cloudinary cleanup
    const existingTile = await prisma.tile.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!existingTile) {
      return NextResponse.json({ error: "Tile not found" }, { status: 404 });
    }

    // If SKU is being changed, check uniqueness
    if (sku && sku !== existingTile.sku) {
      const skuExists = await prisma.tile.findUnique({ where: { sku } });
      if (skuExists) {
        return NextResponse.json(
          { error: "A tile with this SKU already exists" },
          { status: 400 }
        );
      }
    }

    // If dealerId is being changed, verify dealer exists
    if (dealerId && dealerId !== existingTile.dealerId) {
      const dealerExists = await prisma.dealer.findUnique({
        where: { id: dealerId },
      });
      if (!dealerExists) {
        return NextResponse.json({ error: "Dealer not found" }, { status: 404 });
      }
    }

    // Build update data
    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (sku !== undefined) updateData.sku = sku;
    if (size !== undefined) updateData.size = size;
    if (material !== undefined) updateData.material = normalizeEnum(material);
    if (finish !== undefined) updateData.finish = normalizeEnum(finish);
    if (color !== undefined) updateData.color = normalizeEnum(color);
    if (application !== undefined) updateData.application = normalizeEnum(application);
    if (mount !== undefined) updateData.mount = normalizeEnum(mount);
    if (pricePerSqft !== undefined) updateData.pricePerSqft = parseFloat(pricePerSqft);
    if (pricePerBox !== undefined) updateData.pricePerBox = parseFloat(pricePerBox);
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (description !== undefined) updateData.description = description || null;
    if (isPublished !== undefined) updateData.isPublished = isPublished;

    // Handle category array
    if (category !== undefined) {
      const cats = Array.isArray(category) ? category : [category];
      updateData.category = cats.map((c: string) => normalizeEnum(c));
    }

    // Handle dealer update
    if (dealerId !== undefined) {
      updateData.dealer = { connect: { id: dealerId } };
    }

    // Handle images update — delete old from Cloudinary, replace in DB
    if (imageUrls !== undefined && Array.isArray(imageUrls)) {
      const oldImageUrls = existingTile.images.map((img) => img.imageUrl);

      // Delete old images from DB
      await prisma.tileImage.deleteMany({ where: { tileId: id } });

      // Delete old images from Cloudinary (fire-and-forget)
      deleteMediaFromCloudinary(oldImageUrls).catch(console.error);

      updateData.images = {
        create: imageUrls.map((url: string) => ({ imageUrl: url })),
      };
    }

    // Handle PDF update — delete old from Cloudinary
    if (pdfUrl !== undefined) {
      if (existingTile.pdfUrl && existingTile.pdfUrl !== pdfUrl) {
        deleteMediaFromCloudinary([], existingTile.pdfUrl).catch(console.error);
      }
      updateData.pdfUrl = pdfUrl || null;
    }

    const updatedTile = await prisma.tile.update({
      where: { id },
      data: updateData,
      include: {
        images: { orderBy: { createdAt: "asc" } },
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

// DELETE - Delete tile and its Cloudinary assets
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const tile = await prisma.tile.findUnique({
      where: { id },
      include: {
        images: true,
        cartItems: true,
        bookingTiles: true,
        reviews: true,
        wishlist: true,
      },
    });

    if (!tile) {
      return NextResponse.json({ error: "Tile not found" }, { status: 404 });
    }

    if (tile.cartItems.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete tile that is in carts" },
        { status: 400 }
      );
    }

    if (tile.bookingTiles.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete tile that has bookings" },
        { status: 400 }
      );
    }

    // Collect Cloudinary URLs before deleting from DB
    const imageUrls = tile.images.map((img) => img.imageUrl);
    const pdfUrl = tile.pdfUrl;

    // Delete related DB records
    await prisma.tileImage.deleteMany({ where: { tileId: id } });
    await prisma.review.deleteMany({ where: { tileId: id } });
    await prisma.wishlist.deleteMany({ where: { tileId: id } });

    // Delete the tile
    await prisma.tile.delete({ where: { id } });

    // Delete Cloudinary assets after DB deletion (fire-and-forget)
    deleteMediaFromCloudinary(imageUrls, pdfUrl).catch(console.error);

    return NextResponse.json(
      { message: "Tile deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE_TILE_ERROR:", error);

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Tile not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Failed to delete tile", details: error.message },
      { status: 500 }
    );
  }
}