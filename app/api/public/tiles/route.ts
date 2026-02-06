import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Extracting all potential filters
    const category = searchParams.get("category");
    const material = searchParams.get("material");
    const finish = searchParams.get("finish");
    const size = searchParams.get("size");
    const application = searchParams.get("application");
    const mount = searchParams.get("mount");
    const search = searchParams.get("search");
    
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isPublished: true,
    };

    // Strict Enum/String matches
    if (category) where.category = category;
    if (material) where.material = material;
    if (finish) where.finish = finish;
    if (size) where.size = size;
    if (application) where.application = application;
    if (mount) where.mount = mount;
    
    // Price range logic
    if (minPrice || maxPrice) {
      where.pricePerSqft = {};
      if (minPrice) where.pricePerSqft.gte = parseFloat(minPrice);
      if (maxPrice) where.pricePerSqft.lte = parseFloat(maxPrice);
    }

    // Search logic (Corrected to only use String fields)
    if (search) {
      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { sku: { contains: search, mode: "insensitive" } },
          ],
        },
      ];
    }

    const [tiles, total] = await Promise.all([
      prisma.tile.findMany({
        where,
        include: {
          images: {
            orderBy: { createdAt: 'asc' }
          }
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.tile.count({ where }),
    ]);

    return NextResponse.json({
      tiles,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("PUBLIC_TILES_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch tiles", details: error.message },
      { status: 500 }
    );
  }
}