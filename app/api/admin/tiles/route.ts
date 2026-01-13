import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tiles = await prisma.tile.findMany({
      include: {
        dealer: {
          select: {
            id: true,
            name: true,
            shopName: true,
            city: true,
          },
        },
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(tiles);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch tiles" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const tile = await prisma.tile.create({
      data: {
        name: body.name,
        sku: body.sku,
        size: body.size,
        material: body.material,
        finish: body.finish,
        category: body.category,
        pricePerSqft: Number(body.pricePerSqft),
        pricePerBox: Number(body.pricePerBox),
        stock: Number(body.stock),
        description: body.description,
        pdfUrl: body.pdfUrl,
        dealerId: body.dealerId,

        images: {
          create: body.imageUrls.map((url: string) => ({
            imageUrl: url,
          })),
        },
      },
      include: {
        images: true,
        dealer: true,
      },
    });

    return NextResponse.json(tile, { status: 201 });
  } catch (error) {
    console.error("Create Tile Error:", error);
    return NextResponse.json(
      { error: "Failed to create tile" },
      { status: 500 }
    );
  }
}