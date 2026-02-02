// app/api/wishlist/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - Fetch user's wishlist
export async function GET(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const wishlist = await prisma.wishlist.findMany({
      where: {
        userId: userId,
      },
      include: {
        tile: {
          include: {
            images: {
              take: 1,
            },
            dealer: {
              select: {
                name: true,
                shopName: true,
                city: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(wishlist);
  } catch (error: any) {
    console.error("WISHLIST_GET_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { tileId } = await req.json();

    if (!tileId) {
      return NextResponse.json(
        { error: "Tile ID is required" },
        { status: 400 }
      );
    }

    // Check if already in wishlist
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_tileId: {
          userId: userId,
          tileId: tileId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Tile already in wishlist" },
        { status: 400 }
      );
    }

    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId: userId,
        tileId: tileId,
      },
      include: {
        tile: {
          include: {
            images: {
              take: 1,
            },
          },
        },
      },
    });

    return NextResponse.json(wishlistItem, { status: 201 });
  } catch (error: any) {
    console.error("WISHLIST_POST_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to add to wishlist", details: error.message },
      { status: 500 }
    );
  }
}