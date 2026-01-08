"use client";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import Image from "next/image";
import React, { useState } from "react";
import { Search, ArrowRight } from "lucide-react"; 

const MainHome = () => {
  // const { setTheme } = useTheme();
  // const [color, setColor] = useState("light");
  // const themeHandle = () => {
  //   setColor(color === "light" ? "dark" : "light");
  //   setTheme(color);
  // };

  return (
    <div>
      <div className="relative w-full h-175 flex items-center">
        <Image
          src="/heroPage.jpg"
          alt="Premium kitchen with marble tiles"
          fill
          className="object-cover"
          priority
        />

        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex flex-col items-start">
          {/* Headline */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight max-w-4xl">
            Discover Premium Tiles <br /> for Your Dream Space
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl leading-relaxed ">
            Connect with trusted tile dealers across India. Browse thousands of
            tiles, compare prices, and find the perfect match for your home.
          </p>
          <div className="mt-10 flex flex-col md:flex-row items-center gap-4 w-full max-w-3xl">
            <div className="grow flex items-center bg-white rounded-md overflow-hidden h-14 px-4 w-full">
              <Search className="text-gray-400 w-6 h-6 mr-3" />
              <input
                type="text"
                placeholder="Search for tiles, styles, or dealers..."
                className="w-full h-full border-none outline-none text-gray-700 text-lg placeholder:text-gray-400"
              />
            </div>
            <Button className="bg-primary hover:bg-orange-700 text-white text-lg font-medium h-14 px-10 rounded-md w-full md:w-auto transition-colors">
              Search Tiles
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <a
              href="#"
              className="group flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-medium px-8 py-3 rounded-md transition-all"
            >
              Browse All Tiles
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#"
              className="text-white font-medium px-6 py-3 rounded-md hover:bg-white/10 transition-colors"
            >
              Become a Dealer
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainHome;
