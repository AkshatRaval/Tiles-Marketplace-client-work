"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Sparkles, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, isLoading } = useAuth();
  const router = useRouter();
  const hasToasted = useRef(false);

  useEffect(() => {
    if (!isLoading && user && !hasToasted.current) {
      hasToasted.current = true;
      toast.success("You are already logged in!");
      router.replace("/");
    }
  }, [user, isLoading, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email || !password) {
      return toast.error("Please fill in all fields");
    }
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setIsSubmitting(true);
    try {
      const body = { email, password };
      const res = await api.post("auth/signup", body);

      if (res.data.success) {
        toast.success("Account created! Check your email for verification.");
        router.push("/onboarding");
      } else {
        toast.error(res.data.message || "Registration failed");
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.errorMsg || "Something went wrong";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevent "flicker" of the signup form if user is already auth'd
  if (isLoading || (user && !hasToasted.current)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-6xl h-full md:h-[90vh] bg-background rounded-[40px] overflow-hidden flex sm:row border shadow-2xl">
        
        {/* Left Side - Visuals */}
        <div className="relative hidden md:flex w-1/2 flex-col justify-between p-12 text-white">
          <div className="absolute inset-0 z-0">
            <Image
              src="/heroPage.jpg"
              alt="Join us"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 text-sm font-medium tracking-widest uppercase opacity-90">
              <span>Join the Community</span>
              <div className="h-px w-12 bg-white/60"></div>
            </div>
          </div>

          <div className="relative z-10 max-w-lg mb-10">
            <h1 className="font-serif text-6xl leading-tight mb-6">
              Start <br /> Your Journey <br /> With Us
            </h1>
            <p className="text-white/80 text-lg font-light leading-relaxed">
              Create an account today to access exclusive features and manage
              your tile preferences effortlessly.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 bg-card p-8 md:p-16 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto space-y-6">
            <div className="text-center flex justify-center items-center gap-2">
              <Sparkles className="text-primary" />
              <span className="font-bold text-xl tracking-tight uppercase">Tiles Market</span>
            </div>

            <div className="text-center space-y-2">
              <h2 className="font-serif text-4xl text-card-foreground">Create Account</h2>
              <p className="text-muted-foreground text-sm">Enter your details below to get started</p>
            </div>

            <form className="space-y-4 mt-4" onSubmit={handleSignup}>
              {/* Name Field */}
              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="email">Email</label>
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
                <label className="text-sm font-medium" htmlFor="password">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Min. 6 characters"
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
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Create Account"}
                </button>

                <button
                  type="button"
                  className="w-full bg-background border border-border py-3.5 rounded-xl text-sm font-medium hover:bg-muted transition-colors flex items-center justify-center gap-2">
                  <Image src="/assets/google.ico" width={16} height={16} alt="Google" />
                  Sign Up with Google
                </button>
              </div>
            </form>

            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-bold text-foreground hover:underline">
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}