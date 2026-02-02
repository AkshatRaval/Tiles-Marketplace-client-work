import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const review = await prisma.review.update({
      where: {
        id: id,
      },
      data: {},
    });

    return NextResponse.json(review);
  } catch (error: any) {
    console.error("HELPFUL_REVIEW_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to mark as helpful", details: error.message },
      { status: 500 }
    );
  }
}