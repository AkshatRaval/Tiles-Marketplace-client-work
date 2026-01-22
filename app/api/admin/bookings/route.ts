// app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Get all bookings for a user
export async function GET(request: NextRequest) {
  try {
    // Get userId from auth token (implement your auth logic)
    const userId = request.headers.get('x-user-id'); // Example: get from middleware

    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        tile: {
          include: {
            images: {
              take: 1
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(bookings);
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { message: 'Failed to fetch bookings', error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const {
      tileId,
      customerName,
      phone,
      email,
      address,
      city,
      pincode,
      quantityBox
    } = body;

    if (!tileId || !customerName || !phone || !address || !city || !quantityBox) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
      return NextResponse.json(
        { message: 'Invalid phone number' },
        { status: 400 }
      );
    }

    // Validate email if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate pincode if provided (6 digits)
    if (pincode && !/^\d{6}$/.test(pincode)) {
      return NextResponse.json(
        { message: 'Invalid pincode' },
        { status: 400 }
      );
    }

    // Check if tile exists
    const tile = await prisma.tile.findUnique({
      where: { id: tileId }
    });

    if (!tile) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    // Get userId from auth token (optional)
    const userId = request.headers.get('x-user-id');

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        tileId,
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email?.trim() || null,
        address: address.trim(),
        city: city.trim(),
        pincode: pincode?.trim() || null,
        quantityBox: parseInt(quantityBox),
        userId: userId || null,
        status: 'PENDING'
      },
      include: {
        tile: {
          include: {
            images: {
              take: 1
            }
          }
        }
      }
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { message: 'Failed to create booking', error: error.message },
      { status: 500 }
    );
  }
}