import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

async function getUserIdFromAuth(req: Request) {
  let userId = req.headers.get("x-user-id");

  if (!userId) {
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      // TODO: Decode JWT token to get user ID
      // For now, you can extract userId from token
      // userId = decodeToken(token).userId;
    }
  }

  return userId;
}

// GET - Fetch user profile
export async function GET(req: Request) {
  try {
    const userId = await getUserIdFromAuth(req);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - No user ID found" },
        { status: 401 }
      );
    }

    const user = await prisma.endUser.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        role: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        pincode: true,
        duty: true,
        lookingFor: true,
        referral: true,
        isOnboarded: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("PROFILE_GET_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile", details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create/Update user profile (Onboarding)
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      userId, // Accept userId from body for onboarding
      name,
      phone,
      address,
      city,
      state,
      pincode,
      duty,
      lookingFor,
      referral,
      isOnboarded,
    } = body;

    // Get userId from auth or body
    let finalUserId = await getUserIdFromAuth(req);
    if (!finalUserId && userId) {
      finalUserId = userId;
    }

    if (!finalUserId) {
      return NextResponse.json(
        { error: "Unauthorized - No user ID provided" },
        { status: 401 }
      );
    }

    // Validation
    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      );
    }

    // Get user's email first (need it for create)
    const existingUser = await prisma.endUser.findUnique({
      where: { id: finalUserId },
      select: { email: true },
    });

    const userEmail = existingUser?.email || body.email || "user@example.com";

    // Upsert EndUser with all profile data
    const updatedUser = await prisma.endUser.upsert({
      where: { id: finalUserId },
      update: {
        name: name,
        phone: phone,
        address: address || null,
        city: city || null,
        state: state || null,
        pincode: pincode || null,
        duty: duty || null,
        lookingFor: lookingFor || [],
        referral: referral || null,
        isOnboarded: isOnboarded !== undefined ? isOnboarded : true,
      },
      create: {
        id: finalUserId,
        name: name,
        email: userEmail,
        phone: phone,
        address: address || null,
        city: city || null,
        state: state || null,
        pincode: pincode || null,
        duty: duty || null,
        lookingFor: lookingFor || [],
        referral: referral || null,
        isOnboarded: isOnboarded !== undefined ? isOnboarded : true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        pincode: true,
        duty: true,
        lookingFor: true,
        referral: true,
        isOnboarded: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("PROFILE_POST_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to save profile", details: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Update specific profile fields
export async function PATCH(req: Request) {
  try {
    const userId = await getUserIdFromAuth(req);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const updateData = await req.json();

    // Remove undefined fields
    const cleanData = Object.fromEntries(
      Object.entries(updateData).filter(([_, v]: [any, any]) => v !== undefined)
    );

    const updatedUser = await prisma.endUser.update({
      where: { id: userId },
      data: cleanData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        pincode: true,
        duty: true,
        lookingFor: true,
        referral: true,
        isOnboarded: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("PROFILE_PATCH_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update profile", details: error.message },
      { status: 500 }
    );
  }
}