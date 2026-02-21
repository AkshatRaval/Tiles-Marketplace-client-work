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
  Phone,
  Hammer,
  User,
  Mail,
  Building2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/components/auth-provider";
import { api } from "@/lib/api";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    duty: "",
    lookingFor: [] as string[],
    referral: "",
  });

  const totalSteps = 4;

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      // Send userId AND email in the request body
      await api.post("/users/profile", {
        userId: user?.id, // Include userId here
        email: user?.email, // Include email for user creation
        ...formData,
        isOnboarded: true,
      });
      toast.success("Profile completed successfully!");
      router.push("/");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.error || "Something went wrong");
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

  const roles = [
    {
      id: "homeowner",
      label: "Homeowner / Buyer",
      icon: Home,
      description: "Looking for tiles for my home",
    },
    {
      id: "designer",
      label: "Architect / Designer",
      icon: Briefcase,
      description: "Sourcing tiles for client projects",
    },
    {
      id: "contractor",
      label: "Contractor / Builder",
      icon: Hammer,
      description: "Buying tiles for construction projects",
    },
  ];

  const tileInterests = [
    "Marble",
    "Ceramic",
    "Porcelain",
    "Vitrified",
    "Wood Finish",
    "Stone Effect",
    "Outdoor Tiles",
    "Mosaic",
    "Kitchen Tiles",
    "Bathroom Tiles",
    "Living Room",
    "Wall Tiles",
    "Floor Tiles",
    "Designer Collection",
    "Budget Friendly",
    "Premium Range",
  ];

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-6xl h-full md:h-[90vh] bg-background rounded-3xl overflow-hidden flex flex-col md:flex-row border shadow-2xl">
        {/* Left Side - Image & Progress */}
        <div className="relative hidden md:flex w-1/2 flex-col justify-between p-12 text-white">
          <div className="absolute inset-0 z-0">
            <Image
              src="/heroPage.jpg"
              alt="Onboarding"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/80 backdrop-blur-sm" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <Sparkles className="text-primary w-6 h-6" />
              <span className="font-bold text-xl tracking-tight uppercase">
                BookMyTile
              </span>
            </div>

            <div className="space-y-6">
              <h1 className="font-serif text-5xl leading-tight">
                Welcome to <br />
                Your Tile Journey
              </h1>
              <p className="text-white/80 text-lg font-light leading-relaxed">
                Let's get to know you better. Complete your profile to unlock
                personalized recommendations and connect with trusted dealers.
              </p>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="relative z-10 space-y-3">
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((num) => (
                <div
                  key={num}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= num ? "bg-primary" : "bg-white/20"
                    }`}
                />
              ))}
            </div>
            <p className="text-sm text-white/60">
              Step {step} of {totalSteps}
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 bg-card p-8 md:p-16 flex flex-col overflow-y-auto">
          <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold">Let's start with basics</h2>
                  <p className="text-muted-foreground">
                    Tell us your name and contact details
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <User size={16} className="text-primary" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full px-4 py-3 h-12 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Mail size={16} className="text-primary" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder={user?.email || "your@email.com"}
                      disabled
                      className="w-full px-4 py-3 h-12 bg-muted border border-border rounded-xl outline-none opacity-60 cursor-not-allowed"
                      value={user?.email || ""}
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Phone size={16} className="text-primary" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 h-12 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Address */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold">Where are you located?</h2>
                  <p className="text-muted-foreground">
                    Help us connect you with nearby dealers
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Building2 size={16} className="text-primary" />
                      Address
                    </label>
                    <textarea
                      placeholder="House/Flat No., Street, Landmark"
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                      rows={3}
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">City</label>
                      <input
                        type="text"
                        placeholder="e.g. Mumbai"
                        className="w-full px-4 py-3 h-12 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">PIN Code</label>
                      <input
                        type="text"
                        placeholder="400001"
                        maxLength={6}
                        className="w-full px-4 py-3 h-12 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        value={formData.pincode}
                        onChange={(e) =>
                          setFormData({ ...formData, pincode: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <MapPin size={16} className="text-primary" />
                      State
                    </label>
                    <Select
                      value={formData.state}
                      onValueChange={(value) =>
                        setFormData({ ...formData, state: value })
                      }
                    >
                      <SelectTrigger className="w-full h-12">
                        <SelectValue placeholder="Select your state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {indianStates.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Role & Interests */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold">Tell us about yourself</h2>
                  <p className="text-muted-foreground">
                    Who are you and what interests you?
                  </p>
                </div>

                {/* Role Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">I am a...</label>
                  <div className="grid gap-3">
                    {roles.map((role) => (
                      <button
                        key={role.id}
                        onClick={() =>
                          setFormData({ ...formData, duty: role.id })
                        }
                        className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${formData.duty === role.id
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border hover:border-primary/50 hover:bg-accent/50"
                          }`}
                      >
                        <div
                          className={`p-2.5 rounded-lg ${formData.duty === role.id
                              ? "bg-primary/10"
                              : "bg-muted"
                            }`}
                        >
                          <role.icon
                            className={
                              formData.duty === role.id
                                ? "text-primary"
                                : "text-muted-foreground"
                            }
                            size={20}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm mb-0.5">
                            {role.label}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {role.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">
                    I'm interested in... (select multiple)
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2">
                    {tileInterests.map((item) => (
                      <button
                        key={item}
                        onClick={() => toggleInterest(item)}
                        className={`p-3 rounded-lg border text-xs font-medium transition-all ${formData.lookingFor.includes(item)
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "bg-card hover:bg-accent border-border hover:border-primary/50"
                          }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formData.lookingFor.length} selected
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Referral */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold">One last thing!</h2>
                  <p className="text-muted-foreground">
                    How did you hear about BookMyTile?
                  </p>
                </div>

                <div className="space-y-4">
                  <Select
                    value={formData.referral}
                    onValueChange={(value) =>
                      setFormData({ ...formData, referral: value })
                    }
                  >
                    <SelectTrigger className="w-full h-12">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="google">Google Search</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="friend">Friend / Referral</SelectItem>
                        <SelectItem value="dealer">Dealer Recommendation</SelectItem>
                        <SelectItem value="ads">Advertisement</SelectItem>
                        <SelectItem value="website">Other Website</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <div className="p-5 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-sm mb-1">
                          You're all set! 🎉
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Get ready to discover premium tiles, compare prices,
                          and connect with trusted dealers across India.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center gap-3 mt-10">
              {step > 1 && (
                <button
                  onClick={prevStep}
                  className="flex items-center justify-center p-3.5 rounded-xl border border-border hover:bg-accent transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
              )}

              {step < totalSteps ? (
                <button
                  onClick={nextStep}
                  disabled={
                    (step === 1 && (!formData.name || !formData.phone)) ||
                    (step === 2 && (!formData.city || !formData.state)) ||
                    (step === 3 && (!formData.duty || formData.lookingFor.length === 0))
                  }
                  className="flex-1 bg-primary text-primary-foreground h-12 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 transition-all"
                >
                  Continue <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  disabled={isSubmitting}
                  className="flex-1 bg-primary text-primary-foreground h-12 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 shadow-lg shadow-primary/20 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Completing...
                    </>
                  ) : (
                    <>
                      Complete Setup <Check size={18} />
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Skip Option */}
            {step === 4 && !isSubmitting && (
              <button
                onClick={handleComplete}
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground mt-4 transition-colors"
              >
                Skip this step
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;