"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  LogOut,
  Edit2,
  Save,
  X,
  ShoppingBag,
  Heart,
  Package,
  Loader2,
  Calendar,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import Link from "next/link";

const Profile = () => {
  const { user, signOut, isLoading } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ bookings: 0, wishlist: 0, cart: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    if (!isLoading && !user) {
      toast.error("Please login to view your profile");
      router.push("/login");
    } else if (user) {
      loadData();
    }
  }, [user, isLoading]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load profile
      const profileRes = await api.get("/users/profile");
      setProfile(profileRes.data);
      setEditForm({
        name: profileRes.data.name || "",
        phone: profileRes.data.phone || "",
        address: profileRes.data.address || "",
        city: profileRes.data.city || "",
        state: profileRes.data.state || "",
        pincode: profileRes.data.pincode || "",
      });

      // Load stats
      try {
        const [bookingsRes, wishlistRes, cartRes] = await Promise.all([
          api.get("/bookings"),
          api.get("/wishlist"),
          api.get("/cart"),
        ]);
        
        setStats({
          bookings: bookingsRes.data?.length || 0,
          wishlist: wishlistRes.data?.length || 0,
          cart: cartRes.data?.items?.length || 0,
        });
      } catch (err) {
        console.error("Failed to load stats:", err);
      }
    } catch (error: any) {
      console.error("Failed to load profile:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await api.patch("/users/profile", editForm);
      await loadData();
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSignout = async () => {
    await signOut();
    toast.success("Logged out successfully");
    router.replace("/");
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Banner */}
      <div className="relative h-56 bg-gradient-to-br from-primary via-primary/90 to-primary/70">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-32 relative z-10 pb-12">
        {/* Profile Card */}
        <div className="bg-card rounded-3xl border shadow-xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-32 h-32 rounded-full border-4 border-background bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg flex items-center justify-center">
                <User className="w-16 h-16 text-primary" />
              </div>
              <button className="absolute bottom-0 right-0 p-2.5 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform">
                <Camera size={18} />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {profile?.name || "User"}
                  </h1>
                  <div className="space-y-1">
                    <p className="text-muted-foreground flex items-center gap-2 justify-center sm:justify-start">
                      <Mail size={16} />
                      {profile?.email || "No email"}
                    </p>
                    {profile?.phone && (
                      <p className="text-muted-foreground flex items-center gap-2 justify-center sm:justify-start">
                        <Phone size={16} />
                        {profile.phone}
                      </p>
                    )}
                    {profile?.city && (
                      <p className="text-muted-foreground flex items-center gap-2 justify-center sm:justify-start">
                        <MapPin size={16} />
                        {profile.city}
                        {profile.state && `, ${profile.state}`}
                      </p>
                    )}
                  </div>
                </div>

                {/* Edit Controls */}
                <div className="flex gap-2">
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} size="sm">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={() => setIsEditing(false)}
                        variant="outline"
                        size="sm"
                        disabled={saving}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button onClick={handleSaveProfile} size="sm" disabled={saving}>
                        {saving ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        Save
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Member Since */}
              {profile?.createdAt && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-sm">
                  <Calendar size={14} />
                  <span className="text-muted-foreground">Member since </span>
                  <span className="font-medium">
                    {new Date(profile.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Link href="/profile/my-bookings">
            <div className="bg-card border rounded-2xl p-6 hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">My Bookings</p>
                  <p className="text-3xl font-bold">{stats.bookings}</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/wishlist">
            <div className="bg-card border rounded-2xl p-6 hover:shadow-lg hover:border-red-500/50 transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl group-hover:scale-110 transition-transform">
                  <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Wishlist</p>
                  <p className="text-3xl font-bold">{stats.wishlist}</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/cart">
            <div className="bg-card border rounded-2xl p-6 hover:shadow-lg hover:border-green-500/50 transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl group-hover:scale-110 transition-transform">
                  <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Cart Items</p>
                  <p className="text-3xl font-bold">{stats.cart}</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Profile Information
              </h2>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 border rounded-xl bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        className="w-full px-4 py-2.5 border rounded-xl bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        value={editForm.phone}
                        onChange={(e) =>
                          setEditForm({ ...editForm, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Address
                    </label>
                    <textarea
                      className="w-full px-4 py-2.5 border rounded-xl bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none transition-all"
                      rows={2}
                      value={editForm.address}
                      onChange={(e) =>
                        setEditForm({ ...editForm, address: e.target.value })
                      }
                      placeholder="House/Flat No., Street, Landmark"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 border rounded-xl bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        value={editForm.city}
                        onChange={(e) =>
                          setEditForm({ ...editForm, city: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 border rounded-xl bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        value={editForm.state}
                        onChange={(e) =>
                          setEditForm({ ...editForm, state: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        PIN Code
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        className="w-full px-4 py-2.5 border rounded-xl bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        value={editForm.pincode}
                        onChange={(e) =>
                          setEditForm({ ...editForm, pincode: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                  <InfoField label="Full Name" value={profile?.name} />
                  <InfoField label="Email" value={profile?.email} />
                  <InfoField label="Phone" value={profile?.phone} />
                  <InfoField label="City" value={profile?.city} />
                  <InfoField label="State" value={profile?.state} />
                  <InfoField label="PIN Code" value={profile?.pincode} />
                  <div className="sm:col-span-2">
                    <InfoField label="Address" value={profile?.address} />
                  </div>
                </div>
              )}
            </div>

            {/* Preferences */}
            {profile?.duty && (
              <div className="bg-card border rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Preferences
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Role</p>
                    <p className="font-medium capitalize">
                      {profile.duty.replace("_", " ")}
                    </p>
                  </div>

                  {profile.lookingFor && profile.lookingFor.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Interested In
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {profile.lookingFor.map((item: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-card border rounded-2xl p-6">
              <h3 className="font-bold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <ActionButton
                  href="/profile/my-bookings"
                  icon={<ShoppingBag size={18} />}
                  label="View Bookings"
                />
                <ActionButton
                  href="/wishlist"
                  icon={<Heart size={18} />}
                  label="My Wishlist"
                />
                <ActionButton
                  href="/cart"
                  icon={<Package size={18} />}
                  label="Shopping Cart"
                />
              </div>
            </div>

            {/* Sign Out */}
            <Button
              onClick={handleSignout}
              variant="destructive"
              className="w-full h-12"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const InfoField = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <p className="text-sm text-muted-foreground mb-1">{label}</p>
    <p className="font-medium">{value || "Not set"}</p>
  </div>
);

const ActionButton = ({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) => (
  <Link href={href}>
    <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors text-left group">
      <div className="text-muted-foreground group-hover:text-primary transition-colors">
        {icon}
      </div>
      <span className="font-medium">{label}</span>
      <span className="ml-auto text-muted-foreground group-hover:translate-x-1 transition-transform">
        →
      </span>
    </button>
  </Link>
);

export default Profile;