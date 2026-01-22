"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";

export default function Booking() {
  const router = useRouter();
  const params = useParams();
  const tileId = params?.id as string;

  const [tile, setTile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Form fields
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [quantityBox, setQuantityBox] = useState(1);

  // Errors
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    const loadData = async () => {
      if (!tileId) {
        setError("No product selected");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/admin/tiles/${tileId}`);
        setTile(response.data);
        setError("");
        
        // Load user data from localStorage
        const userName = localStorage.getItem("userName");
        const userEmail = localStorage.getItem("userEmail");
        if (userName) setCustomerName(userName);
        if (userEmail) setEmail(userEmail);
      } catch (err) {
        console.error("Failed to load product:", err);
        setError("Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [tileId]);

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
    if (pincode && !/^\d{6}$/.test(pincode)) {
      newErrors.pincode = "Enter valid 6-digit pincode";
    }
    if (quantityBox < 1) newErrors.quantityBox = "Minimum 1 box required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
const {user} = useAuth()
console.log(user)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!tileId) {
      alert("Product not selected");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/users/bookings", {
        tileId,
        userId: user?.id,
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim() || null,
        address: address.trim(),
        city: city.trim(),
        pincode: pincode.trim() || null,
        quantityBox,
      });

      setSuccess(true);
    } catch (err: any) {
      console.error("Booking failed:", err);
      alert(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !tile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Cannot Load Product</h1>
          <p className="text-muted-foreground mb-8">
            {error || "Product not found"}
          </p>
          <Link href="/tiles">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Booking Successful!</h1>
          <p className="text-muted-foreground mb-8">
            Your booking has been placed. We'll contact you soon!
          </p>
          <div className="space-y-3">
            <Link href="/tiles">
              <Button className="w-full">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalPrice = tile.pricePerSqft * quantityBox * 10;

  // Main form
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b sticky top-0 z-40 backdrop-blur-lg bg-background/80">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            href={`/tiles/${tileId}`}
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Product
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Complete Your Booking</h1>
          <p className="text-muted-foreground">Fill in your details to place the order</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="bg-card border rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
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
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-background ${
                        errors.customerName ? "border-red-500" : ""
                      }`}
                    />
                    {errors.customerName && (
                      <p className="text-sm text-red-500 mt-1">{errors.customerName}</p>
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
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-background ${
                          errors.phone ? "border-red-500" : ""
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Email (Optional)</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-background ${
                          errors.email ? "border-red-500" : ""
                        }`}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-card border rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Delivery Address
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
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-background resize-none ${
                        errors.address ? "border-red-500" : ""
                      }`}
                    />
                    {errors.address && (
                      <p className="text-sm text-red-500 mt-1">{errors.address}</p>
                    )}
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
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-background ${
                          errors.city ? "border-red-500" : ""
                        }`}
                      />
                      {errors.city && (
                        <p className="text-sm text-red-500 mt-1">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Pincode (Optional)</label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="400001"
                        maxLength={6}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-background ${
                          errors.pincode ? "border-red-500" : ""
                        }`}
                      />
                      {errors.pincode && (
                        <p className="text-sm text-red-500 mt-1">{errors.pincode}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <div className="bg-card border rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Quantity
                </h2>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setQuantityBox(Math.max(1, quantityBox - 1))}
                    className="w-12 h-12 border rounded-xl hover:bg-muted transition-colors flex items-center justify-center font-bold text-xl"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantityBox}
                    onChange={(e) => setQuantityBox(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    className="w-24 text-center px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary bg-background font-bold text-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantityBox(quantityBox + 1)}
                    className="w-12 h-12 border rounded-xl hover:bg-muted transition-colors flex items-center justify-center font-bold text-xl"
                  >
                    +
                  </button>
                  <span className="text-sm text-muted-foreground">boxes</span>
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  Each box covers approximately 10 sq ft
                </p>
              </div>
            </form>
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-card border rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="flex gap-4 mb-6 pb-6 border-b">
                <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden shrink-0">
                  {tile.images?.[0] ? (
                    <img src={tile.images[0].imageUrl} alt={tile.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 line-clamp-2">{tile.name}</h3>
                  <p className="text-sm text-muted-foreground">{tile.category}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price/sq ft</span>
                  <span className="font-medium">${tile.pricePerSqft}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Quantity</span>
                  <span className="font-medium">{quantityBox} boxes</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Coverage</span>
                  <span className="font-medium">{quantityBox * 10} sq ft</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <Button
                type="submit"
                onClick={handleSubmit}
                className="w-full h-14 text-base"
                disabled={submitting}
              >
                {submitting ? "Processing..." : "Place Booking"}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                By placing this booking, you agree to our terms
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}