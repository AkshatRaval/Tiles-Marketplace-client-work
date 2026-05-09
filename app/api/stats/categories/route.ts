import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // category is a TileCategory[] array — groupBy doesn't work on array columns.
    // Use raw SQL unnest to get per-category counts.
    const rows = await prisma.$queryRaw<
      Array<{ category: string; count: bigint }>
    >`
      SELECT unnest(category) AS category, COUNT(*) AS count
      FROM "Tile"
      WHERE "isPublished" = true
      GROUP BY unnest(category)
      ORDER BY count DESC
    `;

    const formattedCategories = rows.map((row) => ({
      category: row.category,
      count: Number(row.count),
    }));

    const response = NextResponse.json({ categories: formattedCategories });
    // Category counts change rarely — cache for 5 minutes
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600"
    );
    return response;
  } catch (error) {
    console.error("CATEGORY_STATS_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch category stats" },
      { status: 500 }
    );
  }
}