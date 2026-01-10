"use server";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const body = await req.json();
  try {
    await prisma.users.create({
      data: {
        id: body.id,
        name: body.name,
        email: body.email,
        role: body.role,
        duty: body.duty,
        lookingFor: body.lookingFor,
        city: body.city,
        phone: body.phone,
        referral: body.referral,
        bookings: { create: [] },
      },
    });
    return NextResponse.json({ data: "adfsdfsa" }, { status: 200 });
  } catch(err: any) {
    return NextResponse.json({errorMessage: err.message})
  }
};
