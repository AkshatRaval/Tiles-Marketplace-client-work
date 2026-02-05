"use client";

import { Heart, ShoppingCart, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Tile } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState, useRef } from "react";
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
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  
  const { user } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const router = useRouter();

  const inWishlist = isInWishlist(tile.id);

  const getStockBadge = (count: number) => {
    if (count <= 0) return { label: "Out of Stock", color: "bg-red-500" };
    if (count < 15) return { label: "Low Stock", color: "bg-amber-500" };
    return { label: "In Stock", color: "bg-emerald-500" };
  };

  const stock = getStockBadge(tile.stock);

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
      router.push("/login");
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
    } catch (error) {
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
      router.push("/login");
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
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setCartLoading(false);
    }
  };

  return (
    <div className={cn("group block", className)}>
      <div className="bg-card border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
        {/* Image Gallery with Horizontal Scroll */}
        <div className="relative aspect-square bg-muted overflow-hidden">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            onTouchStart={() => (isDragging.current = false)}
            onTouchMove={() => (isDragging.current = true)}
            className="flex h-full w-full snap-x snap-mandatory overflow-x-auto scrollbar-hide"
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

            {tile.images && tile.images.length > 0 ? (
              tile.images.map((img, idx) => (
                <div key={idx} className="relative h-full w-full shrink-0 snap-center">
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
                      src={img.imageUrl}
                      alt={tile.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                      priority={idx === 0}
                    />
                  </Link>
                </div>
              ))
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No Image
              </div>
            )}
          </div>

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between pointer-events-none">
            <Badge className="bg-black/70 text-white text-xs px-2 py-1 pointer-events-none">
              {tile.material}
            </Badge>
            <div className="flex gap-2 pointer-events-auto">
              <button
                onClick={handleWishlistToggle}
                disabled={wishlistLoading}
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md",
                  inWishlist
                    ? "bg-red-500 text-white"
                    : "bg-white/90 text-gray-700 hover:bg-white"
                )}
              >
                {wishlistLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Heart className={cn("w-4 h-4", inWishlist && "fill-current")} />
                )}
              </button>
              <button
                onClick={handleAddToCart}
                disabled={cartLoading || tile.stock === 0}
                className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all shadow-md disabled:opacity-50"
              >
                {cartLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ShoppingCart className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Stock Badge */}
          <div className="absolute bottom-3 left-3 pointer-events-none">
            <div className="flex items-center gap-1.5 bg-black/70 text-white text-xs px-2.5 py-1 rounded-full">
              <span className={cn("w-1.5 h-1.5 rounded-full", stock.color)} />
              {stock.label}
            </div>
          </div>

          {tile.images && tile.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none">
              {tile.images.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "h-1 rounded-full transition-all",
                    currentImg === idx ? "w-4 bg-white" : "w-1 bg-white/60"
                  )}
                />
              ))}
            </div>
          )}
        </div>

        <Link href={`/tiles/${tile.id}`} className="block p-4">
          <h3 className="font-bold text-base mb-1 line-clamp-2 group-hover:text-primary transition-colors">
            {tile.name}
          </h3>
          
          <p className="text-xs text-muted-foreground mb-3">
            {tile.finish} • {tile.category.replace(/_/g, " ")}
          </p>

          {/* Price */}
          <div className="flex items-baseline justify-between mb-3 pb-3 border-b">
            <div>
              <span className="text-2xl font-bold">₹{tile.pricePerSqft}</span>
              <span className="text-xs text-muted-foreground ml-1">/sqft</span>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">per box</div>
              <div className="text-sm font-semibold">₹{tile.pricePerBox}</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{tile.size}</span>
            <span>{tile.stock} boxes</span>
          </div>
        </Link>
      </div>
    </div>
  );
}