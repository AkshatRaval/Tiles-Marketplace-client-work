"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
  Calendar,
  MapPin,
  ShoppingBag,
  ChevronRight,
  Download,
  Ban,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { useAuth } from "@/components/auth-provider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface BookingTile {
  id: string;
  tileId: string;
  quantity: number;
  tile: {
    id: string;
    name: string;
    images: { id: string; imageUrl: string }[];
  };
}

interface Booking {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  city: string;
  address?: string;
  quantityBox: number;
  status: string;
  meetingDate?: string;
  createdAt: string;
  tiles: BookingTile[];
}

export default function MyBookings() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please login to view bookings");
      router.push("/login");
      return;
    }

    if (user) {
      loadBookings();
    }
  }, [user, authLoading]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/bookings?userId=${user?.id}`);
      setBookings(response.data.bookings || []);
    } catch (error: any) {
      console.error("Failed to load bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      setCancellingId(bookingId);
      await api.patch(`/bookings/${bookingId}/cancel`);
      toast.success("Booking cancelled successfully");
      
      // Update local state
      setBookings(bookings.map(b => 
        b.id === bookingId ? { ...b, status: 'CANCELLED' } : b
      ));
    } catch (error: any) {
      console.error("Failed to cancel booking:", error);
      toast.error(error.response?.data?.error || "Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  const handleDownloadTicket = async (bookingId: string) => {
    try {
      setDownloadingId(bookingId);
      const response = await api.get(`/bookings/${bookingId}/ticket`, {
        responseType: 'blob',
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `booking-${bookingId.slice(0, 8)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Ticket downloaded successfully");
    } catch (error: any) {
      console.error("Failed to download ticket:", error);
      toast.error("Failed to download ticket");
    } finally {
      setDownloadingId(null);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      NEW: {
        label: "Pending",
        icon: Clock,
        className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800",
      },
      CONFIRMED: {
        label: "Confirmed",
        icon: CheckCircle2,
        className: "bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800",
      },
      COMPLETE: {
        label: "Completed",
        icon: CheckCircle2,
        className: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800",
      },
      CANCELLED: {
        label: "Cancelled",
        icon: XCircle,
        className: "bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800",
      },
      REJECTED: {
        label: "Rejected",
        icon: XCircle,
        className: "bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800",
      },
    };

    return (
      configs[status as keyof typeof configs] || {
        label: status,
        icon: Package,
        className: "bg-muted text-muted-foreground border",
      }
    );
  };

  const canCancelBooking = (status: string) => {
    return status === 'NEW' || status === 'CONFIRMED';
  };

  const canDownloadTicket = (status: string) => {
    return status === 'CONFIRMED' || status === 'COMPLETE';
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/profile"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground">
            {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}
          </p>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="text-center py-16 md:py-24">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-2">No bookings yet</h2>
            <p className="text-muted-foreground mb-6">
              Start browsing tiles to place your first booking
            </p>
            <Link href="/tiles">
              <Button>Browse Tiles</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const statusConfig = getStatusConfig(booking.status);
              const StatusIcon = statusConfig.icon;
              const mainTile = booking.tiles[0];

              return (
                <div
                  key={booking.id}
                  className="bg-card border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-4 md:p-6">
                    {/* Header with Status and Booking ID */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${statusConfig.className}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusConfig.label}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ID: {booking.id.slice(0, 8).toUpperCase()}
                        </span>
                      </div>
                      
                      {/* Meeting Date (only if CONFIRMED or COMPLETE) */}
                      {booking.meetingDate && (booking.status === 'CONFIRMED' || booking.status === 'COMPLETE') && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {new Date(booking.meetingDate).toLocaleDateString(
                              "en-US",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Main Content */}
                    <div className="flex gap-4 mb-4">
                      {/* Image */}
                      {mainTile && (
                        <Link
                          href={`/tiles/${mainTile.tileId}`}
                          className="relative w-20 h-20 md:w-24 md:h-24 bg-muted rounded-lg overflow-hidden shrink-0 group"
                        >
                          {mainTile.tile.images?.[0] ? (
                            <Image
                              src={mainTile.tile.images[0].imageUrl}
                              alt={mainTile.tile.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-8 h-8 text-muted-foreground" />
                            </div>
                          )}
                        </Link>
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="mb-3">
                          {mainTile && (
                            <Link
                              href={`/tiles/${mainTile.tileId}`}
                              className="hover:text-primary transition-colors"
                            >
                              <h3 className="font-bold text-lg leading-tight mb-1">
                                {mainTile.tile.name}
                              </h3>
                            </Link>
                          )}
                          {booking.tiles.length > 1 && (
                            <p className="text-xs text-muted-foreground">
                              +{booking.tiles.length - 1} more item{booking.tiles.length - 1 > 1 ? 's' : ''}
                            </p>
                          )}
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Package className="w-4 h-4" />
                            <span>{booking.quantityBox} boxes</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate">{booking.city}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Address (if present) */}
                    {booking.address && (
                      <div className="bg-muted/50 rounded-lg px-3 py-2 mb-4">
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          Delivery Address
                        </p>
                        <p className="text-sm">{booking.address}</p>
                      </div>
                    )}

                    {/* All Items (if multiple) */}
                    {booking.tiles.length > 1 && (
                      <div className="bg-muted/30 rounded-lg px-3 py-2 mb-4">
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          All Items
                        </p>
                        <div className="space-y-1.5">
                          {booking.tiles.map((bt) => (
                            <div
                              key={bt.id}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="truncate">{bt.tile.name}</span>
                              <span className="text-muted-foreground shrink-0 ml-2">
                                ×{bt.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      {mainTile && (
                        <Link href={`/tiles/${mainTile.tileId}`} className="flex-1 min-w-[200px]">
                          <Button
                            variant="outline"
                            className="w-full justify-between group"
                            size="sm"
                          >
                            <span>View Product</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      )}

                      {/* Download Ticket Button */}
                      {canDownloadTicket(booking.status) && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleDownloadTicket(booking.id)}
                          disabled={downloadingId === booking.id}
                          className="flex-1 min-w-[150px]"
                        >
                          {downloadingId === booking.id ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Downloading...
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4 mr-2" />
                              Download Ticket
                            </>
                          )}
                        </Button>
                      )}

                      {/* Cancel Button */}
                      {canCancelBooking(booking.status) && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={cancellingId === booking.id}
                              className="flex-1 min-w-[120px]"
                            >
                              {cancellingId === booking.id ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Cancelling...
                                </>
                              ) : (
                                <>
                                  <Ban className="w-4 h-4 mr-2" />
                                  Cancel
                                </>
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to cancel this booking? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>No, keep it</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleCancelBooking(booking.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Yes, cancel booking
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>

                    {/* Booked Date (footer) */}
                    <div className="mt-4 pt-3 border-t text-xs text-muted-foreground">
                      Booked on {new Date(booking.createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}