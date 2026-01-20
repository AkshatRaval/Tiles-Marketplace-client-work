"use client";
import React, { useEffect, useState } from "react";
import {
  Plus,
  Users,
  Globe,
  Zap,
  ArrowUpRight,
  PieChart as PieIcon,
  Loader2,
  Database,
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { api } from "@/lib/api";

// Simple reusable component for empty states
const NoData = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center h-full w-full py-10 text-muted-foreground/40">
    <Database size={40} strokeWidth={1} className="mb-2" />
    <p className="text-xs font-bold uppercase tracking-widest italic">
      {message}
    </p>
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/dashboard");
        const result = await response.data;
        setData(result);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-sm font-black uppercase tracking-widest opacity-50 italic">
          Initializing Engine...
        </p>
      </div>
    );
  }

  if (!data)
    return (
      <div className="p-10 text-center italic opacity-50 uppercase font-black">
        Link to database failed.
      </div>
    );

  return (
    <section className="w-full space-y-4 md:space-y-6 p-3 md:p-6 bg-background min-h-screen">
      {/* 1. THE HERO COMMAND CENTER */}
      <div className="relative overflow-hidden bg-secondary/40 border border-border/60 rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-0" />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6 md:mb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full w-fit">
              <Zap size={14} className="text-primary fill-primary" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                System Live
              </span>
            </div>
            <h2 className="text-2xl md:text-4xl font-black tracking-tighter italic uppercase">
              Analytics
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground font-medium">
              Monitoring user behavior and booking velocity.
            </p>
          </div>

          <div className="flex w-full md:w-auto gap-3 md:gap-4">
            <div className="flex-1 md:flex-none bg-background/60 backdrop-blur-md p-3 md:p-5 rounded-2xl md:rounded-3xl border border-border min-w-0 md:min-w-[140px]">
              <p className="text-[9px] md:text-[10px] uppercase font-bold text-muted-foreground mb-1">
                Conversion
              </p>
              <div className="flex items-end gap-1 md:gap-2">
                <span className="text-xl md:text-3xl font-black">
                  {data.conversionRate}%
                </span>
                {/* Show a green up arrow if conversion is > 20%, otherwise a neutral state */}
                <ArrowUpRight
                  size={16}
                  className={
                    data.conversionRate > 20
                      ? "text-emerald-500 mb-1"
                      : "text-orange-500 mb-1"
                  }
                />
              </div>
            </div>
            <div className="bg-background/60 backdrop-blur-md p-3 md:p-5 rounded-2xl md:rounded-3xl border border-border min-w-0 md:min-w-[140px]">
              <p className="text-[9px] md:text-[10px] uppercase font-bold text-muted-foreground mb-1">
                Active Now
              </p>
              <div className="flex items-center gap-1 md:gap-2">
                <span className="text-xl md:text-3xl font-black">
                  {data.activeNow || 0}
                </span>
                <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        <div className="h-[250px] md:h-[380px] w-full flex items-center justify-center">
          {data.userGrowthData && data.userGrowthData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data.userGrowthData}
                margin={{ left: -20, right: 5 }}
              >
                <defs>
                  <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--muted-foreground))"
                  opacity={0.05}
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "currentColor", fontSize: 10, fontWeight: 700 }}
                  className="text-muted-foreground"
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: "15px",
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  fill="url(#userGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <NoData message="No registration trends found" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
        {/* PIE CHART */}
        <div className="md:col-span-12 lg:col-span-4 bg-secondary/30 border border-border/40 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] h-auto min-h-[350px] md:h-[420px] flex flex-col">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h3 className="font-black text-sm md:text-lg uppercase tracking-tight italic">
              Bookings
            </h3>
            <PieIcon className="text-primary" size={20} />
          </div>
          <div className="flex-1 min-h-[200px] flex items-center justify-center">
            {data.bookingStats && data.bookingStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.bookingStats}
                    innerRadius="60%"
                    outerRadius="85%"
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.bookingStats.map((entry: any, i: number) => (
                      <Cell
                        key={`cell-${i}`}
                        fill={entry.name === "PENDING" ? "#f59e0b" : "#10b981"}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <NoData message="No booking data recorded" />
            )}
          </div>
        </div>

        {/* CITY RADIAL CHART */}
        <div className="md:col-span-6 lg:col-span-4 bg-secondary/30 border border-border/40 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] h-auto min-h-[350px] md:h-[420px] flex flex-col relative">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-black text-sm md:text-lg uppercase tracking-tight italic">
              Hubs
            </h3>
            <Globe className="text-primary" size={20} />
          </div>
          <div className="flex-1 min-h-[200px] flex items-center justify-center">
            {data.cityRadialData && data.cityRadialData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="25%"
                  outerRadius="100%"
                  barSize={10}
                  data={data.cityRadialData}
                  startAngle={180}
                  endAngle={-180}
                >
                  <RadialBar background dataKey="count" cornerRadius={10} />
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
            ) : (
              <NoData message="No hub locations available" />
            )}
          </div>
          <div className="mt-4 flex flex-col gap-1">
            {data.cityRadialData?.map((city: any) => (
              <div
                key={city.name}
                className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tighter"
              >
                <span className="flex items-center gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: city.fill }}
                  />
                  {city.name}
                </span>
                <span className="opacity-60">{city.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA BLOCK */}
        <div className="md:col-span-6 lg:col-span-4 group min-h-[250px] md:h-[420px]">
          <Link href="/admin/tiles" className="h-full w-full block">
            <div className="h-full bg-primary rounded-[1.5rem] md:rounded-[2rem] p-8 md:p-10 flex flex-col items-center justify-center text-primary-foreground relative overflow-hidden transition-all active:scale-95 duration-200">
              <div className="absolute inset-0 border-[15px] md:border-[20px] border-white/5 rounded-[1.5rem] md:rounded-[2rem]" />
              <div className="relative z-10 bg-white text-primary p-4 md:p-7 rounded-2xl md:rounded-[2.5rem] shadow-2xl mb-4 md:mb-8 flex items-center justify-center">
                <Plus size={32} strokeWidth={4} />
              </div>
              <div className="relative z-10 text-center space-y-2">
                <h3 className="text-xl md:text-3xl font-black uppercase tracking-tighter italic">
                  List New Tile
                </h3>
                <p className="text-xs md:text-sm text-primary-foreground/80 font-medium max-w-[180px] md:max-w-[200px] mx-auto leading-tight">
                  Sync inventory with your PostgreSQL database.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
