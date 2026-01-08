"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import {
  User,
  Mail,
  Settings,
  ShoppingBag,
  Heart,
  MapPin,
  Camera,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, signOut, isLoading } = useAuth();

  const router = useRouter();
  const userData = {
    name: user?.user_metadata?.name || "Guest User",
    email: user?.email || "No email provided",
    location: "New York, USA", // You can sync this from your DB later
    joined: new Date(user?.created_at || Date.now()).toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric",
      }
    ),
    avatar: "/api/placeholder/150/150",
  };

  useEffect(() => {
    if (!isLoading && !user) {
      toast.error("You are not logged in!");
      router.push("/");
    }
  }, [user]);

  const handleSignout = async () => {
    await signOut();
    router.replace("/");
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-12">
      <div className="relative h-48 md:h-64 bg-primary">
        <div className="absolute inset-0 bg-linear-to-r from-black/20 to-transparent" />
        <div className="container mx-auto px-4 h-full relative">
          <div className="absolute -bottom-16 left-4 md:left-8">
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background overflow-hidden bg-card shadow-xl">
                <User className="w-full h-full p-8 text-muted-foreground" />
              </div>
              <button className="absolute bottom-2 right-2 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform">
                <Camera size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Content Section */}
      <div className="container mx-auto px-4 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Stats & Info */}
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-3xl border shadow-sm">
              <h1 className="text-2xl font-serif font-bold text-card-foreground">
                {userData.name}
              </h1>
              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                <Mail size={16} /> {userData.email}
              </p>
              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                <MapPin size={16} /> {userData.location}
              </p>

              <div className="mt-6 pt-6 border-t flex justify-around text-center">
                <div>
                  <p className="font-bold text-lg">12</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Orders
                  </p>
                </div>
                <div className="border-x px-8">
                  <p className="font-bold text-lg">45</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Saved
                  </p>
                </div>
                <div>
                  <p className="font-bold text-lg">2</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Quotes
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSignout()}
              className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl font-medium hover:bg-red-100 transition-colors"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>

          {/* Right Column: Navigation & Settings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-3xl border shadow-sm overflow-hidden">
              <div className="p-6 border-b bg-muted/10">
                <h2 className="font-bold text-lg">Account Settings</h2>
              </div>

              <div className="divide-y">
                <ProfileNavItem
                  icon={<ShoppingBag size={20} />}
                  label="Order History"
                  description="Manage your recent tile purchases"
                />
                <ProfileNavItem
                  icon={<Heart size={20} />}
                  label="My Favorites"
                  description="Your saved styles and inspirations"
                />
                <ProfileNavItem
                  icon={<Settings size={20} />}
                  label="Security"
                  description="Change password and 2FA settings"
                />
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/10 p-6 rounded-3xl">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary text-primary-foreground rounded-2xl">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="font-bold">Member Since</h3>
                  <p className="text-sm text-muted-foreground">
                    {userData.joined}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Component for the list items
const ProfileNavItem = ({
  icon,
  label,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
}) => (
  <button className="w-full flex items-center justify-between p-6 hover:bg-muted/50 transition-colors text-left group">
    <div className="flex items-center gap-4">
      <div className="text-muted-foreground group-hover:text-primary transition-colors">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-card-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
    <div className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
      →
    </div>
  </button>
);

export default Profile;
