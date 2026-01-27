import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface RouteParams {
  params: { id: string };
}

export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const dealer = await prisma.dealer.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { tiles: true },
        },
        tiles: true,
      },
    });

    if (!dealer) {
      return NextResponse.json({ error: "Dealer not found" }, { status: 404 });
    }

    return NextResponse.json(dealer);
  } catch (error: any) {
    console.error("ADMIN_DEALER_GET_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch dealer", details: error.message },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const body = await req.json();

    const updated = await prisma.dealer.update({
      where: { id: params.id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.shopName !== undefined && { shopName: body.shopName }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.city !== undefined && { city: body.city }),
        ...(body.state !== undefined && { state: body.state }),
        ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("ADMIN_DEALER_UPDATE_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update dealer", details: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  try {
    await prisma.dealer.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("ADMIN_DEALER_DELETE_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to delete dealer", details: error.message },
      { status: 500 },
    );
  }
}

