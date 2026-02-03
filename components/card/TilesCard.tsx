"use client";

import { Heart, Ruler, Box, ShoppingCart, Loader2, Eye, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Tile } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/components/auth-provider";
import { useWishlist } from "@/components/wishlist-provider";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

interface TileCardProps {
  tile: Tile;
  className?: string;
}

export function TileCard({ tile, className }: TileCardProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const [currentImg, setCurrentImg] = useState(0);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const { user } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const router = useRouter();

  const inWishlist = isInWishlist(tile.id);

  const getStockInfo = (count: number) => {
    if (count <= 0)
      return {
        label: "Out of Stock",
        color: "bg-red-500/10 text-red-600 border-red-500/20",
        dotColor: "bg-red-500"
      };
    if (count < 15)
      return {
        label: "Low Stock",
        color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
        dotColor: "bg-amber-500"
      };
    return {
      label: "In Stock",
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      dotColor: "bg-emerald-500"
    };
  };

  const stockStatus = getStockInfo(tile.stock);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const index = Math.round(
      scrollRef.current.scrollLeft / scrollRef.current.offsetWidth
    );
    setCurrentImg(index);
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to add to wishlist");
      router.push("/login?redirect=/tiles");
      return;
    }

    setWishlistLoading(true);

    try {
      if (inWishlist) {
        await removeFromWishlist(tile.id);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(tile.id);
        toast.success("Added to wishlist!");
      }
    } catch (error: any) {
      console.error("Wishlist error:", error);
      toast.error("Something went wrong");
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to add to cart");
      router.push("/login?redirect=/tiles");
      return;
    }

    if (tile.stock === 0) {
      toast.error("Out of stock");
      return;
    }

    setCartLoading(true);

    try {
      await api.post("/cart", {
        tileId: tile.id,
        quantityBox: 1,
      });
      toast.success("Added to cart!");
    } catch (error: any) {
      console.error("Cart error:", error);
      toast.error("Failed to add to cart");
    } finally {
      setCartLoading(false);
    }
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
    <div 
      className={cn("group block", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden border-0 bg-card shadow-md hover:shadow-2xl transition-all duration-500 rounded-3xl">
        {/* Image Slider */}
        <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            onTouchStart={() => (isDragging.current = false)}
            onTouchMove={() => (isDragging.current = true)}
            className="flex h-full w-full snap-x snap-mandatory overflow-x-auto"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
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
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </Link>
              </div>
            ))}
          </div>

          {/* Overlay gradient on hover */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-500",
            isHovered ? "opacity-100" : "opacity-0"
          )} />

          {/* Image Dots */}
          {tile.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {tile.images.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "h-1 rounded-full transition-all duration-300",
                    currentImg === idx ? "w-6 bg-white" : "w-1.5 bg-white/60"
                  )}
                />
              ))}
            </div>
          )}

          {/* Material Badge */}
          <div className="absolute top-4 left-4 z-10">
            <Badge className="bg-black/80 backdrop-blur-xl text-white border-white/20 py-1.5 px-3 text-xs font-bold uppercase tracking-wider shadow-xl">
              {tile.material}
            </Badge>
          </div>

          {/* Stock Badge */}
          <div className="absolute top-4 right-4 z-10">
            <Badge
              variant="outline"
              className={cn(
                "backdrop-blur-xl text-xs font-bold py-1.5 px-3 shadow-xl border-2",
                stockStatus.color
              )}
            >
              <span className={cn("w-1.5 h-1.5 rounded-full mr-2 inline-block", stockStatus.dotColor)} />
              {stockStatus.label}
            </Badge>
          </div>

          {/* Action Buttons - Slide in on hover */}
          <div className={cn(
            "absolute bottom-4 right-4 flex flex-col gap-2 transition-all duration-500 z-10",
            isHovered ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}>
            {/* Wishlist Button */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-11 w-11 rounded-2xl backdrop-blur-xl shadow-2xl transition-all duration-300 border-2",
                inWishlist
                  ? "bg-red-500 text-white border-red-500 hover:bg-red-600"
                  : "bg-white/90 text-gray-700 border-white/50 hover:bg-white hover:text-red-500 hover:border-red-500"
              )}
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
            >
              {wishlistLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Heart
                  className={cn(
                    "h-5 w-5 transition-transform duration-300",
                    inWishlist && "fill-current scale-110"
                  )}
                />
              )}
            </Button>

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 rounded-2xl bg-primary/90 backdrop-blur-xl shadow-2xl text-primary-foreground hover:bg-primary border-2 border-primary transition-all duration-300"
              onClick={handleAddToCart}
              disabled={cartLoading || tile.stock === 0}
            >
              {cartLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <ShoppingCart className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Info Section */}
        <CardContent className="p-5">
          <Link href={`/tiles/${tile.id}`}>
            <div className="mb-3">
              <h3 className="font-bold text-lg leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors duration-300">
                {tile.name}
              </h3>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                {tile.finish} • {tile.category.replace(/_/g, " ")}
              </p>
            </div>

            {/* Description Preview */}
            {tile.description && tile.description !== "NOTDEFINED" && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                {tile.description}
              </p>
            )}

            {/* Price */}
            <div className="flex items-end justify-between mb-4 pb-4 border-b border-border/50">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    ₹{tile.pricePerSqft}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground">
                    /sq ft
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Per Box</p>
                <p className="text-sm font-bold">₹{tile.pricePerBox}</p>
              </div>
            </div>

            {/* Specifications */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Ruler className="h-4 w-4" />
                <span className="font-medium">{tile.size}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Box className="h-4 w-4" />
                <span className="font-medium">{tile.stock} boxes</span>
              </div>
            </div>
          </Link>

          {/* View Details Button - Shows on hover */}
          <div className={cn(
            "mt-4 transition-all duration-300",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          )}>
            <Link href={`/tiles/${tile.id}`}>
              <Button 
                variant="outline" 
                className="w-full group/btn border-2 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Eye className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                View Details
                <Sparkles className="h-4 w-4 ml-auto opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}