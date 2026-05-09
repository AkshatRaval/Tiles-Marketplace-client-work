import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // category is a TileCategory[] array — groupBy doesn't work on array columns.
    // Use raw SQL unnest to get per-category counts.
    const catRows = await prisma.$queryRaw<
      Array<{ category: string; count: bigint }>
    >`
      SELECT unnest(category) AS category, COUNT(*) AS count
      FROM "Tile"
      WHERE "isPublished" = true
      GROUP BY unnest(category)
      ORDER BY count DESC
    `;

    const [sizeData, finishData, appData] = await Promise.all([
      prisma.tile.groupBy({
        by: ["size"],
        where: { isPublished: true },
        _count: { size: true },
      }),
      prisma.tile.groupBy({
        by: ["finish"],
        where: { isPublished: true },
        _count: { finish: true },
      }),
      prisma.tile.groupBy({
        by: ["application"],
        where: { isPublished: true },
        _count: { application: true },
      }),
    ]);

    const filters = {
      categories: catRows.map((item) => ({
        value: item.category,
        label: item.category.replace(/_/g, " "),
        count: Number(item.count),
      })),
      sizes: sizeData.map((item: any) => ({
        value: item.size,
        label: item.size,
        count: item._count.size,
      })),
      finishes: finishData.map((item: any) => ({
        value: item.finish,
        label: item.finish.replace(/_/g, " "),
        count: item._count.finish,
      })),
      applications: appData.map((item: any) => ({
        value: item.application,
        label: item.application.replace(/_/g, " "),
        count: item._count.application,
      })),
    };

    return NextResponse.json(filters);
  } catch (error) {
    console.error("FILTER_STATS_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch filter stats" },
      { status: 500 }
    );
  }
}