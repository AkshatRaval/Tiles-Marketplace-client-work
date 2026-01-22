import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    if (
      !body.customerName ||
      !body.phone ||
      !body.email ||
      !body.address ||
      !body.userId ||
      !body.tileId
    ) {
      return NextResponse.json(
        {
          error: "Missing Required Fields",
        },
        { status: 400 },
      );
    }

    const booking = await prisma.booking.create({
      data: {
        customerName: body.customerName,
        phone: body.phone,
        email: body.email,
        address: body.address,
        city: body.city,
        pincode: body.pincode,
        quantityBox: body.quantityBox,
        status: body.status || "PENDING",
        tile: {
          connect: { id: body.tileId },
        },
        user: {
          connect: { id: body.userId },
        },
      },
      include: {
        user: true,
      },
    });
    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    console.error("CREATE_BOOKING_ERROR:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A Booking is already exists." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create Booking", details: error.message },
      { status: 500 }
    );
  }
};
