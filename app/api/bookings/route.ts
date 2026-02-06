import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - Fetch user's bookings
export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // Build where clause
    const where: any = {};
    if (userId) {
      where.userId = userId;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        tiles: {
          include: {
            tile: {
              include: {
                images: { take: 1 },
                dealer: {
                  select: {
                    id: true,
                    name: true,
                    shopName: true,
                    phone: true,
                    city: true,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error: any) {
    console.error("FETCH_BOOKINGS_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings", details: error.message },
      { status: 500 }
    );
  }
};

// POST - Create booking
export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.customerName || !body.phone || !body.city) {
      return NextResponse.json(
        { error: "Customer name, phone, and city are required" },
        { status: 400 }
      );
    }

    if (!body.tileId) {
      return NextResponse.json(
        { error: "Tile ID is required" },
        { status: 400 }
      );
    }

    // Verify tile exists
    const tile = await prisma.tile.findUnique({
      where: { id: body.tileId },
      select: { id: true },
    });

    if (!tile) {
      return NextResponse.json(
        { error: "Tile not found" },
        { status: 404 }
      );
    }

    // Create booking with BookingTile relation
    const booking = await prisma.booking.create({
      data: {
        customerName: body.customerName,
        phone: body.phone,
        email: body.email || null,
        address: body.address || null,
        city: body.city,
        quantityBox: body.quantityBox || 1,
        status: "NEW",
        userId: body.userId || null,
        tiles: {
          create: {
            tileId: body.tileId,
            quantity: body.quantityBox || 1,
          },
        },
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
        user: true,
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    console.error("CREATE_BOOKING_ERROR:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A booking already exists." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create booking", details: error.message },
      { status: 500 }
    );
  }
};