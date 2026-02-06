"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { Booking, BookingStatus } from "@/types";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const BookingPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [search, setSearch] = useState("");

  // Form state
  const [status, setStatus] = useState<BookingStatus>("NEW");
  const [meetingDate, setMeetingDate] = useState<Date | undefined>();
  const [adminNotes, setAdminNotes] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/bookings?search=${search}`);
      const data = res.data;
      setBookings(Array.isArray(data.bookings) ? data.bookings : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [search]);

  const handleOpenDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setStatus(booking.status);
    setMeetingDate(booking.meetingDate ? new Date(booking.meetingDate) : undefined);
    setAdminNotes(booking.adminNotes || "");
    setIsDialogOpen(true);
  };

  const handleUpdateBooking = async () => {
    if (!selectedBooking) return;

    try {
      setUpdating(true);
      const res = await api.patch(`/admin/bookings/${selectedBooking.id}`, {
        status,
        meetingDate: meetingDate?.toISOString(),
        adminNotes,
      });

      // Update local state
      setBookings((prev) =>
        prev.map((b) => (b.id === selectedBooking.id ? res.data : b))
      );

      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to update booking:", error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadgeVariant = (status: BookingStatus) => {
    switch (status) {
      case "NEW":
        return "default";
      case "CONFIRMED":
        return "secondary";
      case "COMPLETE":
        return "outline";
      case "CANCELLED":
      case "REJECTED":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen p-8 space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase">User Bookings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage bookings and meetings
          </p>
        </div>
        <div className="w-full md:w-72">
          <Input
            placeholder="Search by name, phone, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Tiles</TableHead>
              <TableHead>Total Boxes</TableHead>
              <TableHead>Meeting Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Loading bookings...
                </TableCell>
              </TableRow>
            ) : bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  No bookings found
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">
                    {booking.customerName}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{booking.phone}</div>
                      {booking.email && (
                        <div className="text-muted-foreground">{booking.email}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{booking.city}</div>
                      {booking.address && (
                        <div className="text-muted-foreground text-xs">
                          {booking.address}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {booking.tiles.map((bt) => (
                        <div key={bt.id} className="text-sm">
                          {bt.tile.name} (x{bt.quantity})
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{booking.quantityBox}</TableCell>
                  <TableCell>
                    {booking.meetingDate
                      ? format(new Date(booking.meetingDate), "PPP")
                      : "Not set"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(booking.status)}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenDialog(booking)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Booking Management Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Booking</DialogTitle>
            <DialogDescription>
              Update booking status, set meeting date, and add admin notes
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <Label className="text-xs text-muted-foreground">Customer</Label>
                  <p className="font-medium">{selectedBooking.customerName}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Phone</Label>
                  <p className="font-medium">{selectedBooking.phone}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">City</Label>
                  <p className="font-medium">{selectedBooking.city}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Total Boxes</Label>
                  <p className="font-medium">{selectedBooking.quantityBox}</p>
                </div>
              </div>

              {/* Tiles */}
              <div>
                <Label className="text-sm font-medium">Selected Tiles</Label>
                <div className="mt-2 space-y-2">
                  {selectedBooking.tiles.map((bt) => (
                    <div
                      key={bt.id}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      {bt.tile.images[0] && (
                        <img
                          src={bt.tile.images[0].imageUrl}
                          alt={bt.tile.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{bt.tile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {bt.quantity} boxes
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as BookingStatus)}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">New</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="COMPLETE">Complete</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Meeting Date */}
              <div>
                <Label>Meeting Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !meetingDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {meetingDate ? format(meetingDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={meetingDate}
                      onSelect={setMeetingDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Admin Notes */}
              <div>
                <Label htmlFor="notes">Admin Notes</Label>
                <Textarea
                  id="notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add any internal notes about this booking..."
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateBooking} disabled={updating}>
              {updating ? "Updating..." : "Update Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingPage;