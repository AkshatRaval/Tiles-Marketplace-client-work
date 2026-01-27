import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const normalizeEnum = (value: string) =>
  value.toUpperCase().replace(/\s+/g, "_");

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const search = searchParams.get("search");
    const material = searchParams.get("material");
    const finish = searchParams.get("finish");
    const category = searchParams.get("category");
    const size = searchParams.get("size");

    const where: any = {
      isPublished: true, // Only show published tiles
    };

    // Apply filters
    if (material) {
      where.material = { equals: material, mode: "insensitive" };
    }
    if (finish) {
      where.finish = { equals: normalizeEnum(finish), mode: "insensitive" };
    }
    if (category) {
      where.category = { equals: normalizeEnum(category), mode: "insensitive" };
    }
    if (size) {
      where.size = { contains: size, mode: "insensitive" };
    }

    // Search functionality
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Fetch tiles and count in parallel
    const [tiles, totalCount] = await Promise.all([
      prisma.tile.findMany({
        where,
        take: limit,
        skip,
        include: {
          dealer: { 
            select: { 
              name: true, 
              shopName: true,
              city: true,
            } 
          },
          images: { take: 3 },
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
  } catch (error: any) {
    console.error("FETCH_PUBLIC_TILES_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch tiles", details: error.message },
      { status: 500 }
    );
  }
}