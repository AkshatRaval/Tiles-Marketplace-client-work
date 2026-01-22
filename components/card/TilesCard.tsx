"use client";

import { MapPin, Heart, Ruler, Box, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Tile } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import Image from "next/image";

interface TileCardProps {
  tile: Tile;
  className?: string;
}

export function TileCard({ tile, className }: TileCardProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const [currentImg, setCurrentImg] = useState(0);

  const getStockInfo = (count: number) => {
    if (count <= 0)
      return {
        label: "Out of Stock",
        color: "bg-destructive/10 text-destructive border-destructive/20",
      };
    if (count < 15)
      return {
        label: "Limited Stock",
        color: "bg-warning/10 text-warning-foreground border-warning/20",
      };
    return {
      label: "In Stock",
      color: "bg-emerald-200 text-emerald-900 border-emerald-700/50",
    };
  };

  // @ts-ignore
  const stockStatus = getStockInfo(tile.stock);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const index = Math.round(
      scrollRef.current.scrollLeft / scrollRef.current.offsetWidth
    );
    setCurrentImg(index);
  };

  const cloudinaryLoader = ({
    src,
    width,
    quality,
  }: {
    src: string;
    width: number;
    quality?: number;
  }) => {
    const params = [
      "f_auto",
      "c_limit",
      `w_${width}`,
      `q_${quality || "auto"}`,
    ];
    return src.replace("/upload/", `/upload/${params.join(",")}/`);
  };

  return (
    <div className={cn("group block", className)}>
      <Card className="overflow-hidden border-none bg-transparent shadow-none">
        {/* Image Slider */}
        <div className="relative aspect-square overflow-hidden rounded-2xl shadow-md transition-all duration-300 group-hover:shadow-xl">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            onTouchStart={() => (isDragging.current = false)}
            onTouchMove={() => (isDragging.current = true)}
            className="flex h-full w-full snap-x snap-mandatory overflow-x-auto touch-pan-y"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {/* WebKit scrollbar hide */}
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {tile.images.map((img, idx) => (
              <div
                key={idx}
                className="relative h-full w-full shrink-0 snap-center"
              >
                <Link
                  href={`/tiles/${tile.id}`}
                  className="block h-full w-full"
                  onClick={(e) => {
                    if (isDragging.current) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                >
                  <Image
                    loader={cloudinaryLoader}
                    src={img.imageUrl}
                    alt={tile.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={idx === 0}
                    className="object-cover"
                  />
                </Link>
              </div>
            ))}
          </div>

          {/* Dots */}
          {tile.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 pointer-events-none">
              {tile.images.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-all duration-300",
                    currentImg === idx ? "w-4 bg-white" : "bg-white/50"
                  )}
                />
              ))}
            </div>
          )}

          {/* Material Badge */}
          <div className="absolute top-3 left-3 pointer-events-none">
            <Badge className="bg-black/60 backdrop-blur-md text-white border-none py-1 px-3 text-[10px] font-bold uppercase tracking-widest">
              {tile.material}
            </Badge>
          </div>

          {/* Heart */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 z-10 rounded-full bg-white/20 backdrop-blur-md text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white hover:text-red-500"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Heart className="h-5 w-5" />
          </Button>

          {/* Stock */}
          <Badge
            variant="outline"
            className={cn(
              "absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-tighter pointer-events-none",
              stockStatus.color
            )}
          >
            {stockStatus.label}
          </Badge>
        </div>

        {/* Info */}
        <Link href={`/tiles/${tile.id}`}>
          <CardContent className="px-1 py-4 cursor-pointer">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold leading-none tracking-tight transition-colors group-hover:text-primary">
                  {tile.name}
                </h3>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                  {tile.finish} • {tile.category}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-primary">
                  ₹{tile.pricePerSqft}
                </p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">
                  / sq.ft
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4 border-t pt-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <Ruler className="h-3.5 w-3.5" />
                <span>{tile.size}</span>
              </div>
              <div className="flex items-center gap-1.5 border-l pl-4 text-xs font-semibold text-muted-foreground">
                <Box className="h-3.5 w-3.5" />
                <span>₹{tile.pricePerBox}/Box</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span className="text-[11px] font-bold uppercase">
                  Dealer Location
                </span>
              </div>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </CardContent>
        </Link>
      </Card>
    </div>
  );
}
