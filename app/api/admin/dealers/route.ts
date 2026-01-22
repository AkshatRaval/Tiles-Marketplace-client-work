import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);

    // Check if this is a simple request (for dropdowns)
    const simple = searchParams.get("simple") === "true";

    // For dropdown usage - just return id and name
    if (simple) {
      const dealers = await prisma.dealer.findMany({
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          name: "asc",
        },
      });
      return NextResponse.json(dealers);
    }

    // For admin dealers page - return all data with pagination and search
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search") || "";

    // Build where clause for searching
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { phone: { contains: search, mode: "insensitive" as const } },
            { city: { contains: search, mode: "insensitive" as const } },
            { state: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [dealers, dealersCount] = await Promise.all([
      prisma.dealer.findMany({
        where,
        include: {
          _count: {
            select: {
              tiles: true,
            },
          },
          tiles: true, // Include all tile data through relation
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.dealer.count({ where }),
    ]);

    return NextResponse.json({
      dealers,
      pagination: {
        total: dealersCount,
        page,
        limit,
        totalPages: Math.ceil(dealersCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching dealers:", error);
    return NextResponse.json(
      { error: "Failed to fetch dealers" },
      { status: 500 },
    );
  }
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    // Validate required fields
    if (
      !body.name ||
      !body.shopName ||
      !body.phone ||
      !body.city ||
      !body.state
    ) {
      return NextResponse.json(
        {
          error: "Missing required fields: name, shopName, phone, city, state",
        },
        { status: 400 },
      );
    }

    // Create new dealer
    const dealer = await prisma.dealer.create({
      data: {
        name: body.name,
        shopName: body.shopName,
        phone: body.phone,
        email: body.email || null,
        city: body.city,
        state: body.state,
        country: body.country || "India",
        isActive: body.isActive !== undefined ? body.isActive : true,
      },
    });

    return NextResponse.json(dealer, { status: 201 });
  } catch (error) {
    console.error("Error creating dealer:", error);
    return NextResponse.json(
      { error: "Failed to create dealer" },
      { status: 500 },
    );
  }
};
