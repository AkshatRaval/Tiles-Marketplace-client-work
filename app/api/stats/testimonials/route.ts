import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    const reviews = await prisma.review.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const testimonials = reviews.map((review) => ({
      id: review.id,
      name: review.name,
      role: "Customer",
      rating: review.rating,
      text: review.comment ?? "",
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, role, rating, text, avatar, tileId } = body;

    // Validation
    if (!name || !rating || !text || !tileId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        name,
        rating,
        comment: text,
        tile: { connect: { id: tileId } },
      },
    });

    const testimonial = {
      id: review.id,
      name: review.name,
      role: role || "Customer",
      rating: review.rating,
      text: review.comment ?? "",
      avatar: avatar || review.name.substring(0, 2).toUpperCase(),
      createdAt: review.createdAt,
    };

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error("CREATE_TESTIMONIAL_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}