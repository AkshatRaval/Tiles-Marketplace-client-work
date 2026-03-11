// app/api/stats/testimonials/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "5");

    // Get top-rated reviews to use as testimonials
    const reviews = await prisma.review.findMany({
      where: {
        rating: { gte: 4 }, // Only 4-5 star reviews
        comment: { not: null }, // Must have a comment
      },
      include: {
        tile: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { rating: "desc" },
      take: limit,
    });

    // Transform reviews into testimonial format
    const testimonials = reviews.map((review: any) => ({
      id: review.id,
      name: review.name,
      role: "Customer", // Or you can make this dynamic
      rating: review.rating,
      text: review.comment || "",
      avatar: review.name.substring(0, 2).toUpperCase(),
      createdAt: review.createdAt,
    }));

    return NextResponse.json({
      testimonials,
    });
  } catch (error) {
    console.error("TESTIMONIALS_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}