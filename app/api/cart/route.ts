// app/api/cart/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - Fetch user's cart
export async function GET(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: {
        userId: userId,
      },
      include: {
        items: {
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
        },
      },
    });

    if (!cart) {
      return NextResponse.json({
        items: [],
        totalItems: 0,
        totalPrice: 0,
      });
    }

    const totalItems = cart.items.reduce((sum: any, item: any) => sum + item.quantityBox, 0);
    const totalPrice = cart.items.reduce(
      (sum: any, item: any) => sum + item.tile.pricePerBox * item.quantityBox,
      0
    );

    return NextResponse.json({
      ...cart,
      totalItems,
      totalPrice,
    });
  } catch (error: any) {
    console.error("CART_GET_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart", details: error.message },
      { status: 500 }
    );
  }
}

// POST - Add item to cart
export async function POST(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { tileId, quantityBox } = await req.json();

    if (!tileId || !quantityBox || quantityBox < 1) {
      return NextResponse.json(
        { error: "Invalid data" },
        { status: 400 }
      );
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: userId },
      });
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_tileId: {
          cartId: cart.id,
          tileId: tileId,
        },
      },
    });

    let cartItem;

    if (existingItem) {
      // Update quantity
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantityBox: existingItem.quantityBox + quantityBox,
        },
        include: {
          tile: {
            include: {
              images: { take: 1 },
            },
          },
        },
      });
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          tileId: tileId,
          quantityBox: quantityBox,
        },
        include: {
          tile: {
            include: {
              images: { take: 1 },
            },
          },
        },
      });
    }

    return NextResponse.json(cartItem, { status: 201 });
  } catch (error: any) {
    console.error("CART_POST_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to add to cart", details: error.message },
      { status: 500 }
    );
  }
}