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
    // category is now an array field — use "has" filter
    if (category) where.category = { has: normalizeEnum(category) };
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
            orderBy: { createdAt: "asc" },
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
      category, // now an array
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
      imageUrls,
      pdfUrl,
    } = body;

    // Validate required fields — category must be a non-empty array
    if (
      !name ||
      !sku ||
      !Array.isArray(category) ||
      category.length === 0 ||
      !material ||
      !finish ||
      !size ||
      !color ||
      !application ||
      !mount
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: name, sku, category (array), material, finish, size, color, application, or mount",
        },
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

    // Check dealer exists
    const dealerExists = await prisma.dealer.findUnique({
      where: { id: dealerId },
    });
    if (!dealerExists) {
      return NextResponse.json(
        { error: "Dealer not found" },
        { status: 404 }
      );
    }

    // Check SKU uniqueness
    const existingSku = await prisma.tile.findUnique({ where: { sku } });
    if (existingSku) {
      return NextResponse.json(
        { error: "A tile with this SKU already exists" },
        { status: 400 }
      );
    }

    // Normalize category array
    const normalizedCategories = category.map((c: string) => normalizeEnum(c));

    const newTile = await prisma.tile.create({
      data: {
        name,
        sku,
        size,
        material: normalizeEnum(material) as any,
        description: description || null,
        pdfUrl: pdfUrl || null,
        finish: normalizeEnum(finish) as any,
        category: normalizedCategories as any,
        color: normalizeEnum(color) as any,
        application: normalizeEnum(application) as any,
        mount: normalizeEnum(mount) as any,
        pricePerSqft: parseFloat(pricePerSqft) || 0,
        pricePerBox: parseFloat(pricePerBox) || 0,
        stock: parseInt(stock) || 0,
        dealer: { connect: { id: dealerId } },
        images: {
          create: imageUrls.map((url: string) => ({ imageUrl: url })),
        },
      },
      include: {
        images: true,
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

    return NextResponse.json(
      { error: "Failed to create tile", details: error.message },
      { status: 500 }
    );
  }
}
