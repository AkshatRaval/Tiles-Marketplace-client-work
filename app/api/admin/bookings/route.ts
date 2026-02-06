import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          { customerName: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
          { city: { contains: search, mode: "insensitive" } },
        ],
      },
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
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bookings });
  } catch (error: any) {
    console.error("ADMIN_FETCH_BOOKINGS_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}