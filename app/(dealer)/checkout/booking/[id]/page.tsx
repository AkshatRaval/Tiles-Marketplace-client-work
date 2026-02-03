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
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import Image from "next/image";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form fields
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [notes, setNotes] = useState("");

  // Errors
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (!user) {
      toast.error("Please login to continue");
      router.push("/login");
      return;
    }
    loadCart();
  }, [user]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const res = await api.get("/cart");
      setCart(res.data);

      // Pre-fill user data
      if (user) {
        setEmail(user.email || "");
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
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
    if (!address.trim()) newErrors.address = "Address is required";
    if (!city.trim()) newErrors.city = "City is required";

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
      // Create appointment for each cart item
      const bookingPromises = cart.items.map((item: any) =>
        api.post("/bookings", {
          tileId: item.tileId,
          customerName: customerName.trim(),
          phone: phone.trim(),
          email: email.trim() || null,
          address: address.trim(),
          city: city.trim(),
          quantityBox: item.quantityBox,
        })
      );

      await Promise.all(bookingPromises);

      // Clear cart after successful booking
      for (const item of cart.items) {
        await api.delete(`/cart/${item.id}`);
      }

      setSuccess(true);
      toast.success("Appointment booked successfully!");
    } catch (error: any) {
      console.error("Booking failed:", error);
      toast.error("Failed to book appointment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Appointment Confirmed!</h1>
          <p className="text-muted-foreground mb-8">
            We've received your appointment request. Our team will contact you
            shortly to confirm the details.
          </p>
          <div className="space-y-3">
            <Button onClick={() => router.push("/tiles")} className="w-full">
              Continue Shopping
            </Button>
            <Button
              onClick={() => router.push("/bookings")}
              variant="outline"
              className="w-full"
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Cart is Empty</h1>
          <p className="text-muted-foreground mb-6">
            Add some items to cart first
          </p>
          <Button onClick={() => router.push("/tiles")}>Browse Tiles</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b sticky top-0 z-40 bg-background">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            href="/cart"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Cart
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Calendar className="text-primary" />
            Schedule Viewing Appointment
          </h1>
          <p className="text-muted-foreground">
            No payment required - we'll contact you to schedule a visit
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="bg-card border rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <User className="w-5 h-5" />
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
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary bg-background ${
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
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary bg-background ${
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
                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary bg-background"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-card border rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Site Address
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House No, Street, Area"
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary bg-background resize-none ${
                        errors.address ? "border-red-500" : ""
                      }`}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Mumbai"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary bg-background ${
                          errors.city ? "border-red-500" : ""
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        PIN Code (Optional)
                      </label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="400001"
                        maxLength={6}
                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary bg-background"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any specific requirements or preferred time..."
                      rows={2}
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary bg-background resize-none"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-card border rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">Appointment Summary</h2>

              <div className="space-y-4 mb-6">
                {cart.items.map((item: any) => (
                  <div key={item.id} className="flex gap-3 pb-4 border-b last:border-0">
                    <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden shrink-0">
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
                        {item.quantityBox} boxes
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-6 pb-6 border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Items</span>
                  <span className="font-medium">{cart.totalItems} boxes</span>
                </div>
              </div>

              <Button
                type="submit"
                onClick={handleSubmit}
                className="w-full h-14 text-base"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Booking...
                  </>
                ) : (
                  <>
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule Appointment
                  </>
                )}
              </Button>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs text-center text-muted-foreground">
                  💡 This is a viewing appointment request. Our team will
                  contact you to confirm the details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}