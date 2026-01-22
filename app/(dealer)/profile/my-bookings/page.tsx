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
  Eye,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function MyBookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login?redirect=/bookings");
      return;
    }
    setIsAuthenticated(true);
    loadBookings();
  };

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get("/bookings");
      setBookings(response.data);
    } catch (error) {
      console.error("Failed to load bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "PROCESSING":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
      case "COMPLETED":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "CANCELLED":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      case "CONFIRMED":
      case "PROCESSING":
        return <Loader2 className="w-4 h-4" />;
      case "COMPLETED":
        return <CheckCircle2 className="w-4 h-4" />;
      case "CANCELLED":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b sticky top-0 z-40 backdrop-blur-lg bg-background/80">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/tiles"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Products
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground">
            View and manage all your product bookings
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-muted mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Bookings Yet</h2>
            <p className="text-muted-foreground mb-8">
              You haven't placed any bookings. Start shopping!
            </p>
            <Link href="/tiles">
              <Button size="lg">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-card border rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-6">
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-muted rounded-xl overflow-hidden shrink-0">
                    {booking.tile?.images?.[0] ? (
                      <img
                        src={booking.tile.images[0].imageUrl}
                        alt={booking.tile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Package className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-1">
                          {booking.tile?.name || "Product"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Booking ID: {booking.id.slice(0, 8).toUpperCase()}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {getStatusIcon(booking.status)}
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Customer</p>
                        <p className="font-medium">{booking.customerName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{booking.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Quantity</p>
                        <p className="font-medium">{booking.quantityBox} boxes</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">City</p>
                        <p className="font-medium">{booking.city}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Link href={`/tiles/${booking.tileId}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View Product
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}