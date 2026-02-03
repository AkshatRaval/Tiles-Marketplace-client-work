"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Eye,
  ArrowLeft,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  PhoneCall,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

export default function MyBookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get("/bookings");
      setBookings(response.data || []);
    } catch (error: any) {
      console.error("Failed to load bookings:", error);
      if (error.response?.status === 401) {
        toast.error("Please login to view bookings");
        router.push("/login?redirect=/bookings");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    const statusMap = {
      NEW: {
        label: "Pending Review",
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        icon: <Clock className="w-4 h-4" />,
        description: "Waiting for admin confirmation",
        borderColor: "border-yellow-200 dark:border-yellow-800",
      },
      CONTACTED: {
        label: "In Progress",
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        icon: <PhoneCall className="w-4 h-4" />,
        description: "Dealer will contact you soon",
        borderColor: "border-blue-200 dark:border-blue-800",
      },
      CONFIRMED: {
        label: "Confirmed",
        color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        icon: <CheckCircle2 className="w-4 h-4" />,
        description: "Booking confirmed by dealer",
        borderColor: "border-green-200 dark:border-green-800",
      },
      CANCELLED: {
        label: "Cancelled",
        color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        icon: <XCircle className="w-4 h-4" />,
        description: "Booking was cancelled",
        borderColor: "border-red-200 dark:border-red-800",
      },
    };

    return (
      statusMap[status as keyof typeof statusMap] || {
        label: status,
        color: "bg-gray-100 text-gray-800",
        icon: <Package className="w-4 h-4" />,
        description: "",
        borderColor: "border-gray-200",
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/profile"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 flex items-center gap-3">
            <ShoppingBag className="w-10 h-10 text-primary" />
            My Bookings
          </h1>
          <p className="text-muted-foreground text-lg">
            Track and manage all your tile bookings
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2">
                How Bookings Work
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                After placing a booking, our team will review your request.
                Once approved, the dealer will contact you directly to discuss
                delivery arrangements, payment terms, and schedule. You'll
                receive updates via email and phone.
              </p>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="text-center py-20 bg-card border rounded-3xl">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-3xl font-bold mb-3">No Bookings Yet</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              You haven't placed any bookings. Explore our tile collection to
              find the perfect match for your project!
            </p>
            <Link href="/tiles">
              <Button size="lg" className="px-8">
                Browse Tiles
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const statusInfo = getStatusInfo(booking.status);

              return (
                <div
                  key={booking.id}
                  className={`bg-card border-2 ${statusInfo.borderColor} rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300`}
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Product Image */}
                      <Link
                        href={`/tiles/${booking.tileId}`}
                        className="relative w-full lg:w-40 h-40 bg-muted rounded-xl overflow-hidden shrink-0 group"
                      >
                        {booking.tile?.images?.[0] ? (
                          <Image
                            src={booking.tile.images[0].imageUrl}
                            alt={booking.tile.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-16 h-16 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </Link>

                      {/* Booking Details */}
                      <div className="flex-1">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                          <div>
                            <Link
                              href={`/tiles/${booking.tileId}`}
                              className="hover:text-primary transition-colors"
                            >
                              <h3 className="text-2xl font-bold mb-2">
                                {booking.tile?.name || "Product"}
                              </h3>
                            </Link>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <span className="font-medium">Booking ID:</span>
                              <code className="px-2 py-0.5 bg-muted rounded font-mono text-xs">
                                {booking.id.slice(0, 8).toUpperCase()}
                              </code>
                            </p>
                          </div>

                          <div className="flex flex-col items-start sm:items-end gap-2">
                            <Badge
                              className={`${statusInfo.color} border-0 px-4 py-2 text-sm font-bold`}
                            >
                              <span className="flex items-center gap-2">
                                {statusInfo.icon}
                                {statusInfo.label}
                              </span>
                            </Badge>
                            {statusInfo.description && (
                              <p className="text-xs text-muted-foreground">
                                {statusInfo.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
                          <InfoBox
                            icon={<Package size={18} />}
                            label="Quantity"
                            value={`${booking.quantityBox} boxes`}
                          />
                          <InfoBox
                            icon={<Phone size={18} />}
                            label="Contact"
                            value={booking.phone}
                          />
                          <InfoBox
                            icon={<MapPin size={18} />}
                            label="Location"
                            value={booking.city}
                          />
                          {booking.email && (
                            <InfoBox
                              icon={<Mail size={18} />}
                              label="Email"
                              value={booking.email}
                            />
                          )}
                          <InfoBox
                            icon={<Calendar size={18} />}
                            label="Booked On"
                            value={new Date(
                              booking.createdAt
                            ).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          />
                          {booking.tile?.dealer && (
                            <InfoBox
                              icon={<User size={18} />}
                              label="Dealer"
                              value={booking.tile.dealer.shopName}
                            />
                          )}
                        </div>

                        {/* Address */}
                        {booking.address && (
                          <div className="bg-muted/50 rounded-xl p-4 mb-4 border border-border/50">
                            <p className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">
                              Delivery Address
                            </p>
                            <p className="text-sm leading-relaxed">
                              {booking.address}
                            </p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3">
                          <Link href={`/tiles/${booking.tileId}`}>
                            <Button variant="outline">
                              <Eye className="w-4 h-4 mr-2" />
                              View Product
                            </Button>
                          </Link>

                          {booking.status === "NEW" && (
                            <Button
                              variant="ghost"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Cancel Booking
                            </Button>
                          )}

                          {booking.status === "CONFIRMED" &&
                            booking.tile?.dealer?.phone && (
                              <Button variant="default">
                                <PhoneCall className="w-4 h-4 mr-2" />
                                Contact Dealer
                              </Button>
                            )}
                        </div>
                      </div>
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

// Helper Component
const InfoBox = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
    <div className="p-2 bg-background rounded-lg text-muted-foreground">
      {icon}
    </div>
    <div>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="font-semibold text-sm leading-tight">{value}</p>
    </div>
  </div>
);