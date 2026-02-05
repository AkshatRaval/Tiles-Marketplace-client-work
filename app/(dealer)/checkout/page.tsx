"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Package,
  MapPin,
  Phone,
  Mail,
  User,
  CheckCircle2,
  Loader2,
  Calendar,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import Image from "next/image";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [cart, setCart] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form fields
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  // Errors
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (!isLoading && !user) {
      toast.error("Please login to continue");
      router.push("/login");
      return;
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load cart
      const cartRes = await api.get("/cart");
      setCart(cartRes.data);

      // Pre-fill user data
      if (user) {
        setEmail(user.email || "");

        // Try to load user profile for additional data
        try {
          const profileRes = await api.get("/users/profile");
          if (profileRes.data) {
            setCustomerName(profileRes.data.name || "");
            setPhone(profileRes.data.phone || "");
            setAddress(profileRes.data.address || "");
            setCity(profileRes.data.city || "");
          }
        } catch (err) {
          console.log("No profile data found");
        }
      }
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!customerName.trim()) newErrors.customerName = "Name is required";
    if (!phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(phone.replace(/\D/g, ""))) {
      newErrors.phone = "Enter valid 10-digit phone number";
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter valid email";
    }
    if (!city.trim()) newErrors.city = "City is required";
    if (!address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!cart?.items || cart.items.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setSubmitting(true);

    try {
      // Create booking for each cart item
      const bookingPromises = cart.items.map((item: any) =>
        api.post("/bookings", {
          tileId: item.tileId,
          userId: user?.id || null,
          customerName: customerName.trim(),
          phone: phone.trim(),
          email: email.trim() || null,
          address: address.trim(),
          city: city.trim(),
          quantityBox: item.quantityBox,
        }),
      );

      await Promise.all(bookingPromises);

      // Clear cart after successful booking
      for (const item of cart.items) {
        try {
          await api.delete(`/cart/${item.id}`);
        } catch (err) {
          console.error("Failed to clear cart item:", err);
        }
      }

      setSuccess(true);
      toast.success("Appointments booked successfully!");
    } catch (error: any) {
      console.error("Booking failed:", error);
      toast.error(error.response?.data?.error || "Failed to book appointment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Appointments Confirmed!</h1>
          <p className="text-muted-foreground mb-2">
            We've received your viewing requests for {cart.items.length}{" "}
            {cart.items.length === 1 ? "item" : "items"}.
          </p>
          <p className="text-muted-foreground mb-8">
            Our team will contact you within 24 hours to schedule the viewing.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => router.push("/tiles")}
              className="w-full"
              size="lg"
            >
              Continue Shopping
            </Button>
            <Button
              onClick={() => router.push("/bookings")}
              variant="outline"
              className="w-full"
              size="lg"
            >
              View My Appointments
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">
            Add some items to cart before booking an appointment
          </p>
          <Button onClick={() => router.push("/tiles")} size="lg">
            Browse Tiles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b sticky top-0 z-40 bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            href="/cart"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Cart
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Calendar className="text-primary w-10 h-10" />
            Schedule Viewing Appointment
          </h1>
          <p className="text-muted-foreground text-lg">
            Book a free viewing appointment - No payment required
          </p>
        </div>

        {/* Info Banner */}
        <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
          <div className="text-sm text-blue-900 dark:text-blue-100">
            <p className="font-semibold mb-1">How it works:</p>
            <p>
              1. Fill in your details below
              <br />
              2. We'll review your request
              <br />
              3. Our team will contact you within 24 hours to schedule a viewing
              <br />
              4. Visit our showroom or arrange on-site viewing
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="bg-card border rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Your Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="John Doe"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background outline-none transition-all ${
                        errors.customerName ? "border-red-500" : ""
                      }`}
                    />
                    {errors.customerName && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.customerName}
                      </p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="9876543210"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background outline-none transition-all ${
                          errors.phone ? "border-red-500" : ""
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email (Optional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background outline-none transition-all ${
                          errors.email ? "border-red-500" : ""
                        }`}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-card border rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Site/Delivery Address
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House/Flat No., Street, Area, Landmark"
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background outline-none resize-none transition-all ${
                        errors.address ? "border-red-500" : ""
                      }`}
                    />
                    {errors.address && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Mumbai"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background outline-none transition-all ${
                        errors.city ? "border-red-500" : ""
                      }`}
                    />
                    {errors.city && (
                      <p className="text-sm text-red-500 mt-1">{errors.city}</p>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border rounded-2xl p-6 sticky top-24 space-y-6">
              <h2 className="text-xl font-bold">Appointment Summary</h2>

              {/* Items List */}
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {cart.items.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 bg-muted/50 rounded-xl"
                  >
                    <div className="w-16 h-16 bg-background rounded-lg overflow-hidden shrink-0">
                      {item.tile.images?.[0] ? (
                        <Image
                          src={item.tile.images[0].imageUrl}
                          alt={item.tile.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-full h-full p-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                        {item.tile.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Quantity: {item.quantityBox}{" "}
                        {item.quantityBox === 1 ? "box" : "boxes"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Items */}
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Total Items</span>
                  <span className="font-bold">{cart.totalItems} boxes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Products</span>
                  <span className="font-bold">{cart.items.length}</span>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                onClick={handleSubmit}
                className="w-full h-14 text-base font-bold"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Booking Appointments...
                  </>
                ) : (
                  <>
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Viewing Appointments
                  </>
                )}
              </Button>

              {/* Info Box */}
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <p className="text-xs text-center text-green-900 dark:text-green-100 leading-relaxed">
                  💡 <strong>Free Viewing</strong>
                  <br />
                  No payment required. Schedule a free viewing to see the tiles
                  in person before making a decision.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
