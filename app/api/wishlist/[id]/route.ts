// app/api/wishlist/[id]/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// DELETE - Remove from wishlist
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

    // Delete wishlist item
    await prisma.wishlist.delete({
      where: {
        id: id,
        userId: userId, // Ensure user owns this wishlist item
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("WISHLIST_DELETE_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to remove from wishlist", details: error.message },
      { status: 500 }
    );
  }
}