import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // 1. Fetch Users for Growth Chart and Active Count
    const users = await prisma.endUser.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true },
    });

    // 2. Market Reach (City Stats)
    const cityStats = await prisma.endUser.groupBy({
      by: ["city"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 4,
    });

    // 3. Booking Status Distribution
    const bookingStats = await prisma.booking.groupBy({
      by: ["status"],
      _count: { id: true },
    });

    // 4. CALCULATION: Conversion Rate
    // Get unique user IDs who have made at least one booking
    const usersWithBookings = await prisma.booking.groupBy({
      by: ["userId"],
    });

    const totalUsersCount = await prisma.endUser.count();
    
    const conversionRate = totalUsersCount > 0 
      ? Math.round((usersWithBookings.length / totalUsersCount) * 100) 
      : 0;

    // 5. CALCULATION: Active Now (Users joined in last 24h)
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);
    const activeNow = users.filter(u => new Date(u.createdAt) >= oneDayAgo).length;

    // 6. Format City Data
    const cityRadialData = cityStats.map((c, i) => ({
      name: c.city || "Unknown",
      count: c._count.id,
      fill: ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"][i],
    }));

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const userGrowthData = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dayName = days[d.getDay()];
      
      const count = users.filter(
        (u) => new Date(u.createdAt).toDateString() === d.toDateString()
      ).length;

      return { 
        date: dayName, 
        users: count,
      };
    });

    return NextResponse.json({
      userGrowthData,
      cityRadialData,
      bookingStats: bookingStats.map((b) => ({
        name: b.status,
        value: b._count.id,
      })),
      conversionRate,
      activeNow
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};