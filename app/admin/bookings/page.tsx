"use client";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";
import { Booking } from "@/types";
import React, { useEffect, useState } from "react";

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>();
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/admin/bookings");
      const data = await res.data;
      setBookings(Array.isArray(data.bookings) ? data.bookings : []);
    } catch (error) {
      console.error("Failed to fetch Bookings:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="min-h-screen bg-background p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black uppercase">Incoming Booking</h1>
      </div>
      <div className="bg-card rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Quantity Box</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tile</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminBookings;
