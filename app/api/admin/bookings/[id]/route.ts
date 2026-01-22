// app/api/bookings/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Get single booking by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        tile: {
          include: {
            images: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!booking) {
      return NextResponse.json(
        { message: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(booking);
  } catch (error: any) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { message: 'Failed to fetch booking', error: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Update booking status (for admin)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    // Validate status
    const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: 'Invalid status' },
        { status: 400 }
      );
    }

    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id }
    });

    if (!existingBooking) {
      return NextResponse.json(
        { message: 'Booking not found' },
        { status: 404 }
      );
    }

    // Update booking
    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
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

    return NextResponse.json(booking);
  } catch (error: any) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { message: 'Failed to update booking', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Cancel/Delete booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id }
    });

    if (!existingBooking) {
      return NextResponse.json(
        { message: 'Booking not found' },
        { status: 404 }
      );
    }

    // Delete booking
    await prisma.booking.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Booking deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { message: 'Failed to delete booking', error: error.message },
      { status: 500 }
    );
  }
}