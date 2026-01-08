"use server";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const body = await req.json();
  await prisma.users.create({
    data: {
      name: body.name || "asdf",
      email: body.email || "asdf",
      phone: body.phone || "adfs",
      city: body.city || "adf",
      bookings: { create: [] },
    },
  });
  return NextResponse.json({ msg: "Helllo ji hogya bkl" });
};
