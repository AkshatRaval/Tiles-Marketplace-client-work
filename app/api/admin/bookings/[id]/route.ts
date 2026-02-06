import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { status, meetingDate, notes } = body;

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        status,
        meetingDate: meetingDate ? new Date(meetingDate) : null,
        adminNotes: notes || null,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}