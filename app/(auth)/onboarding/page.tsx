"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  Home,
  Briefcase,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { prisma } from "@/lib/prisma";
import { User } from "@/types";
import { useAuth } from "@/components/auth-provider";
import { api } from "@/lib/api";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    duty: "",
    lookingFor: [] as string[],
    city: "",
    phone: "",
    referral: "",
  });

  const totalSteps = 3;

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));
  const { user } = useAuth();
  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      const body: User = {
        id: user?.id,
        name: "",
        email: user?.email,
        role: "customer",
        duty: formData.duty,
        lookingFor: formData.lookingFor,
        city: formData.city,
        phone: formData.phone,
        referral: formData.referral,
      };
      const res = await api.post("/users/create", body)
      console.log(res)
      toast.success("Profile updated successfully!");
      router.push("/");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      lookingFor: prev.lookingFor.includes(interest)
        ? prev.lookingFor.filter((i) => i !== interest)
        : [...prev.lookingFor, interest],
    }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4 sm:p-8">
      <div className="w-full max-w-6xl h-full md:h-[90vh] bg-background rounded-[40px] overflow-hidden flex flex-col md:flex-row border shadow-2xl">
        {/* Left Side - Progress & Branding */}
        <div className="relative hidden md:flex w-1/2 flex-col justify-between p-12 text-white">
          <div className="absolute inset-0 z-0">
            <Image
              src="/heroPage.jpg"
              alt="Onboarding"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <Sparkles className="text-primary" />
              <span className="font-bold text-xl tracking-tight uppercase">
                Tiles Market
              </span>
            </div>

            <div className="space-y-6">
              <h1 className="font-serif text-5xl leading-tight">
                Tell us a bit <br /> about yourself
              </h1>
              <p className="text-white/70 text-lg font-light">
                Help us customize your experience to find the perfect tiles for
                your needs.
              </p>
            </div>
          </div>

          {/* Stepper Indicator */}
          <div className="relative z-10 flex gap-4">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center gap-2">
                <div
                  className={`h-2 w-12 rounded-full transition-all duration-500 ${
                    step >= num ? "bg-primary" : "bg-white/20"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Form Content */}
        <div className="w-full md:w-1/2 bg-card p-8 md:p-16 flex flex-col">
          <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
            {/* Step 1: Role Selection */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-serif">I am a...</h2>
                  <p className="text-muted-foreground">
                    Select the option that best describes you.
                  </p>
                </div>
                <div className="grid gap-4">
                  {[
                    { id: "homeowner", label: "Homeowner / Buyer", icon: Home },
                    {
                      id: "designer",
                      label: "Architect / Designer",
                      icon: Briefcase,
                    },
                  ].map((role) => (
                    <button
                      key={role.id}
                      onClick={() =>
                        setFormData({ ...formData, duty: role.id })
                      }
                      className={`flex items-center gap-4 p-6 rounded-2xl border-2 transition-all ${
                        formData.duty === role.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <role.icon
                        className={
                          formData.duty === role.id
                            ? "text-primary"
                            : "text-muted-foreground"
                        }
                      />
                      <span className="font-semibold">{role.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: lookingFor */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-serif">
                    What are you looking for?
                  </h2>
                  <p className="text-muted-foreground">
                    Select all that apply to your project.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Marble",
                    "Ceramic",
                    "Wood Finish",
                    "Outdoor",
                    "Mosaic",
                    "Kitchen",
                    "Bathroom",
                    "Wall Tiles",
                  ].map((item) => (
                    <button
                      key={item}
                      onClick={() => toggleInterest(item)}
                      className={`p-3 rounded-xl border text-sm transition-all ${
                        formData.lookingFor.includes(item)
                          ? "bg-primary text-white border-primary"
                          : "bg-muted/50 hover:border-primary/50"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Location, Contact & Discovery */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-serif">Almost there!</h2>
                  <p className="text-muted-foreground">
                    We need these details for logistics and updates.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">
                      Location (City)
                    </label>
                    <div className="relative">
                      <MapPin
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="e.g. Raipur"
                        className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91 00000-00000"
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>

                  {/* Referral Section */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium">
                      How did you hear about us? (Optional)
                    </label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an Option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem defaultChecked value="not_selected">
                            Select an option
                          </SelectItem>
                          <SelectItem value="google">Google Search</SelectItem>
                          <SelectItem value="social">Social Media</SelectItem>
                          <SelectItem value="friend">
                            Friend / Referral
                          </SelectItem>
                          <SelectItem value="ads">Advertisement</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center gap-4 mt-10">
              {step > 1 && (
                <button
                  onClick={prevStep}
                  className="flex items-center justify-center p-3.5 rounded-xl border border-border hover:bg-muted transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
              )}

              {step < totalSteps ? (
                <button
                  onClick={nextStep}
                  disabled={step === 1 && !formData.duty}
                  className="flex-1 bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 shadow-lg shadow-primary/20"
                >
                  Continue <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  disabled={isSubmitting || !formData.city}
                  className="flex-1 bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 shadow-lg shadow-primary/20"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    "Complete Setup"
                  )}
                  {!isSubmitting && <Check size={18} />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
