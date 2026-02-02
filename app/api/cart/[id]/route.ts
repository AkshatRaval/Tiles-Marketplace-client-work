// app/api/cart/[id]/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// PATCH - Update cart item quantity
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const { quantityBox } = await req.json();

    if (!quantityBox || quantityBox < 1) {
      return NextResponse.json(
        { error: "Invalid quantity" },
        { status: 400 }
      );
    }

    // Verify cart item belongs to user
    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
      include: {
        cart: true,
      },
    });

    if (!cartItem || cartItem.cart.userId !== userId) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    // Update quantity
    const updated = await prisma.cartItem.update({
      where: { id },
      data: {
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

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("CART_PATCH_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update cart item", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Remove item from cart
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    // Verify cart item belongs to user
    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
      include: {
        cart: true,
      },
    });

    if (!cartItem || cartItem.cart.userId !== userId) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    // Delete cart item
    await prisma.cartItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("CART_DELETE_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to remove from cart", details: error.message },
      { status: 500 }
    );
  }
}