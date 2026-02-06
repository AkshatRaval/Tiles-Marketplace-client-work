import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React from "react";

const BookingPage = () => {
  return (
    <div className="min-h-screen p-8 space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase">User Bookings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage Bookings and meetings
          </p>
        </div>
      </div>
      <div className="bg-card rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tiles</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </div>
    </div>
  );
};

export default BookingPage;
