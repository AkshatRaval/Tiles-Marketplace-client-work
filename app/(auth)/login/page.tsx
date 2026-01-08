"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { user, isLoading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && user) {
      // console.log(user)
      toast.success("Welcome back!");
      router.push("/");
    }
  }, [user]);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const body = { email, password };
    try {
      const result = await api.post("/auth/login", body);
      if (!result.data.success) {
        toast.error("Not done yet bitch");
      } else {
        toast.success("Logged in successfully!")
        router.push('/profile')
      }
    } catch (error) {
      toast.error("Not done yet bitch");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-350 h-[90vh] bg-background rounded-[40px] overflow-hidden flex flex-col md:flex-row">
        <div className="relative hidden md:flex w-1/2 flex-col justify-between p-12 text-white">
          <div className="absolute inset-0 z-0">
            <Image
              src="/heroPage.jpg"
              alt="Abstract Background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 text-sm font-medium tracking-widest uppercase opacity-90">
              <span>A Wise Quote</span>
              <div className="h-px w-12 bg-white/60"></div>
            </div>
          </div>

          <div className="relative z-10 max-w-lg mb-10">
            <h1 className="font-serif text-6xl leading-tight mb-6">
              Get <br /> Everything <br /> You Want
            </h1>
            <p className="text-white/80 text-lg font-light leading-relaxed">
              You can get everything you want if you work hard, trust the
              process, and stick to the plan.
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-card p-8 md:p-16 flex flex-col justify-center items-center">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center flex justify-center items-center gap-2 mb-4">
              <Sparkles />
              <span className="font-bold text-xl tracking-tight">
                Tiles Market
              </span>
            </div>

            <div className="text-center space-y-2">
              <h2 className="font-serif text-4xl text-card-foreground">
                Welcome Back
              </h2>
              <p className="text-muted-foreground text-sm">
                Enter your email and password to access your account
              </p>
            </div>

            <form className="space-y-6 mt-8" onSubmit={handleLogin}>
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-card-foreground"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-card border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-accent-foreground transition-all text-sm placeholder:text-card-foreground"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-card-foreground"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 bg-card border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-accent-foreground transition-all text-sm placeholder:text-card-foreground pr-10"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 cursor-pointer top-1/2 -translate-y-1/2 text-accent-foreground hover:text-accent-foreground/80"
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 rounded border-accent text-card-foreground/50 focus:ring-accent-foreground"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-card-foreground/50"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  href="#"
                  className="text-sm font-medium text-card-foreground/50 hover:underline"
                >
                  Forgot Password
                </Link>
              </div>

              <div className="space-y-4 pt-2">
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-3.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-black/20"
                >
                  Sign In
                </button>

                <button
                  type="button"
                  className="w-full bg-white text-gray-700 border border-gray-200 py-3.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  Sign In with Google
                </button>
              </div>
            </form>

            <div className="text-center mt-8">
              <p className="text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="font-bold text-black hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
