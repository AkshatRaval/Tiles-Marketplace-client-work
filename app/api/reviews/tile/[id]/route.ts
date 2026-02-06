
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const reviews = await prisma.review.findMany({
      where: {
        tileId: id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(reviews || []);
  } catch (error: any) {
    console.error("FETCH_REVIEWS_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { name, rating, comment } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    if (!comment || !comment.trim()) {
      return NextResponse.json(
        { error: "Comment is required" },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        tileId: id,
        name: name,
        rating,
        comment: comment.trim(),
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    console.error("CREATE_REVIEW_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create review", details: error.message },
      { status: 500 }
    );
  }
}