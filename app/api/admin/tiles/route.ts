import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const normalizeEnum = (value: string) =>
  value.toUpperCase().replace(/\s+/g, "_");

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = 20;
    const skip = (page - 1) * limit;

    const search = searchParams.get("search");
    const material = searchParams.get("material");
    const finish = searchParams.get("finish");
    const category = searchParams.get("category");
    const size = searchParams.get("size");

    const where: any = {};

    if (material) where.material = normalizeEnum(material);
    if (finish) where.finish = normalizeEnum(finish);
    if (category) where.category = normalizeEnum(category);
    if (size) where.size = size;

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    const [tiles, totalCount] = await Promise.all([
      prisma.tile.findMany({
        where,
        take: limit,
        skip,
        include: {
          dealer: { select: { name: true, shopName: true } },
          images: { 
            orderBy: { createdAt: "asc" }, // ✅ Order images by creation time (first uploaded = first shown)
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.tile.count({ where }),
    ]);

    return NextResponse.json({
      tiles,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("GET_TILES_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch tiles" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
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
      imageUrls,
      pdfUrl,
    } = body;

    // ✅ Validation
    if (!name || !sku || !category || !material || !finish || !size) {
      return NextResponse.json(
        { error: "Missing required fields: name, sku, category, material, finish, size" },
        { status: 400 }
      );
    }

    if (!dealerId) {
      return NextResponse.json(
        { error: "Dealer ID is required" },
        { status: 400 }
      );
    }

    if (!imageUrls || imageUrls.length === 0) {
      return NextResponse.json(
        { error: "At least one image is required" },
        { status: 400 }
      );
    }

    // ✅ Check if dealer exists
    const dealerExists = await prisma.dealer.findUnique({
      where: { id: dealerId },
    });

    if (!dealerExists) {
      return NextResponse.json(
        { error: "Dealer not found" },
        { status: 404 }
      );
    }

    // ✅ Check if SKU already exists
    const existingSku = await prisma.tile.findUnique({
      where: { sku: sku },
    });

    if (existingSku) {
      return NextResponse.json(
        { error: "A tile with this SKU already exists" },
        { status: 400 }
      );
    }

    // ✅ Create tile - REMOVED dealerId from data (can't have both dealerId and dealer relation)
    const newTile = await prisma.tile.create({
      data: {
        name: name,
        sku: sku,
        size: size,
        material: material,
        finish: normalizeEnum(finish) as any,
        category: normalizeEnum(category) as any,
        pricePerSqft: parseFloat(pricePerSqft) || 0,
        pricePerBox: parseFloat(pricePerBox) || 0,
        stock: parseInt(stock) || 0,
        description: description || null,
        pdfUrl: pdfUrl || null,
        // ✅ ONLY use dealer relation, NOT dealerId
        dealer: {
          connect: { id: dealerId },
        },
        // ✅ Create images in order they were uploaded
        images: {
          create: imageUrls.map((url: string, index: number) => ({
            imageUrl: url,
          })),
        },
      },
      include: {
        images: {
          orderBy: { createdAt: "asc" }, // ✅ Return images in order
        },
        dealer: true,
      },
    });

    return NextResponse.json(newTile, { status: 201 });

  } catch (error: any) {
    console.error("CREATE_TILE_ERROR:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A tile with this SKU already exists" },
        { status: 400 }
      );
    }

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Dealer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create tile", details: error.message },
      { status: 500 }
    );
  }
}