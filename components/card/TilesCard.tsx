"use client";

import { MapPin, Heart, Ruler, Box, ChevronRight, Loader2, ShoppingCart, Eye } from "lucide-react";
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
  
  const { user } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const router = useRouter();

  const inWishlist = isInWishlist(tile.id);

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
      color: "bg-emerald-100 text-emerald-900 border-emerald-300",
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
      
      if (error.response?.status === 401) {
        toast.error("Please login to add to wishlist");
        router.push("/login?redirect=/tiles");
      } else if (error.response?.data?.error?.includes("already in wishlist")) {
        toast.error("Already in wishlist");
      } else {
        toast.error("Something went wrong");
      }
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
      
      if (error.response?.status === 401) {
        toast.error("Please login to add to cart");
        router.push("/login?redirect=/tiles");
      } else {
        toast.error("Failed to add to cart");
      }
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

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 z-10 flex gap-2">
            {/* Wishlist Heart Button */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full backdrop-blur-md transition-all",
                inWishlist
                  ? "bg-white text-red-500 opacity-100"
                  : "bg-white/20 text-white opacity-0 group-hover:opacity-100 hover:bg-white hover:text-red-500"
              )}
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
            >
              {wishlistLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Heart
                  className={cn(
                    "h-5 w-5 transition-all",
                    inWishlist && "fill-current"
                  )}
                />
              )}
            </Button>

            {/* Add to Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full backdrop-blur-md transition-all bg-white/20 text-white opacity-0 group-hover:opacity-100 hover:bg-white hover:text-primary"
              )}
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

          {/* Stock Badge */}
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
              <div className="space-y-1 flex-1">
                <h3 className="text-lg font-bold leading-none tracking-tight transition-colors group-hover:text-primary line-clamp-2">
                  {tile.name}
                </h3>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                  {tile.finish} • {tile.category.replace(/_/g, " ")}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xl font-black text-primary">
                  ₹{tile.pricePerSqft}
                </p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">
                  / sq.ft
                </p>
              </div>
            </div>

            {/* Description Preview */}
            {tile.description && tile.description !== "NOTDEFINED" && (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                {tile.description}
              </p>
            )}

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
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(`/tiles/${tile.id}`);
                  }}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View Details
                </Button>
              </div>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-muted-foreground" />
            </div>
          </CardContent>
        </Link>
      </Card>
    </div>
  );
}