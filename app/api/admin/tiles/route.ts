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
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch tiles" },
      { status: 500 }
    );
  }
}
