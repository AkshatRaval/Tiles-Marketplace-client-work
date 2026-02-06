import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { status, meetingDate, adminNotes } = body;

    // Build update data object
    const updateData: any = {};

    if (status) {
      updateData.status = status;
    }

    if (meetingDate !== undefined) {
      updateData.meetingDate = meetingDate ? new Date(meetingDate) : null;
    }

    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes || null;
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        tiles: {
          include: {
            tile: {
              include: {
                images: { take: 1 },
                dealer: {
                  select: {
                    name: true,
                    shopName: true,
                    phone: true,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("ADMIN_UPDATE_BOOKING_ERROR:", error);
    return NextResponse.json(
      { error: error.message, details: error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.booking.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("ADMIN_DELETE_BOOKING_ERROR:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}