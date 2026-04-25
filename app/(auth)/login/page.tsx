"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Sparkles, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, isLoading } = useAuth();
  const router = useRouter();
  const hasToasted = useRef(false);

  useEffect(() => {
    if (!isLoading && user && !hasToasted.current) {
      hasToasted.current = true;
      toast.success("Welcome back!");
      router.replace("/");
    }
  }, [user, isLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Please fill in all fields");
    }

    setIsSubmitting(true);
    try {
      const body = { email, password };
      const res = await api.post("auth/login", body);

      if (res.data.success) {
        toast.success("Logged in successfully!");
        router.push("/");
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.errorMsg || "Invalid credentials";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || (user && !hasToasted.current)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  const handleGoogleLogin = () => {
    const width = 500;
    const height = 650;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      "/api/auth/google",
      "google-auth-popup",
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=no,resizable=no`,
    );

    const handleMessage = (event: MessageEvent) => {
      // Security: only accept messages from your own origin
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === "GOOGLE_AUTH_SUCCESS") {
        window.removeEventListener("message", handleMessage);
        popup?.close();
        toast.success("Signed in with Google!");
        router.push("/");
      }
    };

    window.addEventListener("message", handleMessage);

    // Cleanup if user manually closes popup without completing auth
    const popupChecker = setInterval(() => {
      if (popup?.closed) {
        clearInterval(popupChecker);
        window.removeEventListener("message", handleMessage);
      }
    }, 500);
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-6xl h-full md:h-[90vh] bg-background rounded-[40px] overflow-hidden flex sm:row border shadow-2xl">
        {/* Left Side - Visuals */}
        <div className="relative hidden md:flex w-1/2 flex-col justify-between p-12 text-white">
          <div className="absolute inset-0 z-0">
            <Image
              src="/heroPage.jpg"
              alt="Welcome back"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 text-sm font-medium tracking-widest uppercase opacity-90">
              <span>Welcome Back</span>
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

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 bg-card p-8 md:p-16 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto space-y-6">
            <div className="text-center flex justify-center items-center gap-2">
              <Sparkles className="text-primary" />
              <span className="font-bold text-xl tracking-tight uppercase">
                Tiles Market
              </span>
            </div>

            <div className="text-center space-y-2">
              <h2 className="font-serif text-4xl text-card-foreground">
                Login
              </h2>
              <p className="text-muted-foreground text-sm">
                Enter your credentials to access your account
              </p>
            </div>

            <form className="space-y-4 mt-4" onSubmit={handleLogin}>
              {/* Email Field */}
              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium" htmlFor="password">
                    Password
                  </label>
                  <Link
                    href="#"
                    className="text-xs text-muted-foreground hover:text-primary"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all pr-10"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-primary/20"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    "Sign In"
                  )}
                </button>

                <button
                  type="button"
                  className="w-full bg-background border border-border py-3.5 rounded-xl text-sm font-medium hover:bg-muted transition-colors flex items-center justify-center gap-2"
                  onClick={handleGoogleLogin} // 👈 just add this
                >
                  <Image
                    src="/assets/google.ico"
                    width={16}
                    height={16}
                    alt="Google"
                  />
                  Sign In with Google
                </button>
              </div>
            </form>

            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="font-bold text-foreground hover:underline"
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
