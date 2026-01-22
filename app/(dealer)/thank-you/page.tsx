"use client";

import React from "react";
import Link from "next/link";
import { Download, Home, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button"; // Adjust path based on your project structure

const ThankYou = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <div className="max-w-md w-full p-8 bg-card shadow-xl border rounded-2xl text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-green-400/20 rounded-full">
            <CheckCircle2 className="w-16 h-16 text-green-500" strokeWidth={1.5} />
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Order Confirmed!
        </h1>
        <p className="text-slate-500 mb-8">
          Thank you for your purchase. We’ve sent a confirmation email with your order details.
        </p>

        {/* Action Buttons using Shadcn */}
        <div className="flex flex-col gap-3">
          <Button 
            onClick={() => window.print()} 
            className="w-full h-12 text-md font-semibold"
          >
            <Download className="mr-2 h-5 w-5" />
            Download Receipt
          </Button>

          <Button 
            variant="outline" 
            asChild 
            className="w-full h-12 text-md font-semibold"
          >
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Footer Support */}
        <p className="mt-10 text-xs text-slate-400">
          Need assistance?{" "}
          <a href="mailto:support@example.com" className="text-muted-foreground font-medium hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
};

export default ThankYou;