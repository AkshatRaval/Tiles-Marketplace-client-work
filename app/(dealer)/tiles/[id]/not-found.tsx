"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const TileNotFound = () => {
  const router = useRouter();
  return (
    <div className="relative w-full overflow-hidden">
      <div className="absolute top-0 -right-48 p-12 blur-lg pointer-events-none select-none">
        <svg
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          className="w-16 h-16 md:w-100 md:h-100"
          aria-hidden="true"
        >
          <path
            className="fill-accent"
            d="M38.5,-56.6C52.4,-51,67.8,-44.5,76.1,-32.8C84.4,-21.2,85.7,-4.3,84.1,12.6C82.5,29.6,78,46.7,66.8,55.8C55.6,65,37.7,66.2,22.3,66.3C6.9,66.4,-6.1,65.5,-17.7,61.6C-29.4,57.6,-39.8,50.6,-47.3,41.3C-54.8,32.1,-59.3,20.6,-65.9,6.6C-72.4,-7.5,-81,-24.2,-74.9,-32.8C-68.8,-41.4,-48,-41.8,-33,-46.9C-18.1,-52.1,-9.1,-61.9,1.6,-64.4C12.3,-66.9,24.6,-62.2,38.5,-56.6Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      {/* Bottom-left blob */}
      <div className="absolute bottom-5 -left-48 p-12 blur-lg pointer-events-none select-none">
        <svg
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          className="w-16 h-16 md:w-100 md:h-100"
          aria-hidden="true"
        >
          <path
            className="fill-accent"
            d="M38.5,-56.6C52.4,-51,67.8,-44.5,76.1,-32.8C84.4,-21.2,85.7,-4.3,84.1,12.6C82.5,29.6,78,46.7,66.8,55.8C55.6,65,37.7,66.2,22.3,66.3C6.9,66.4,-6.1,65.5,-17.7,61.6C-29.4,57.6,-39.8,50.6,-47.3,41.3C-54.8,32.1,-59.3,20.6,-65.9,6.6C-72.4,-7.5,-81,-24.2,-74.9,-32.8C-68.8,-41.4,-48,-41.8,-33,-46.9C-18.1,-52.1,-9.1,-61.9,1.6,-64.4C12.3,-66.9,24.6,-62.2,38.5,-56.6Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      <section className=" w-full flex flex-col justify-center items-center min-h-[90vh]">
        <div className="relative w-1/3">
          <Image
            src="/assets/main404.svg"
            width={0}
            height={0}
            alt="404 illustration"
            className="w-full object-cover"
          />
        </div>
        <div className="flex flex-col items-center gap-2 justify-center mt-5">
          <h1 className="text-2xl font-bold md:text-5xl">
            Oh no. We lost this page
          </h1>
          <p className="max-w-lg w-full text-center">
            We searched everywhere but couldn't find what you're looking for.
            Let's find a better place for you to go.
          </p>
          <Button variant="secondary" onClick={() => router.push("/")}>
            <ArrowLeft /> Back to Home
          </Button>
        </div>
      </section>
    </div>
  );
};

export default TileNotFound;
