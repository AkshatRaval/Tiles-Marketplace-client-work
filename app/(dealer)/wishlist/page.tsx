"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Trash2, ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await api.get("/wishlist");
      setWishlist(res.data);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (id: string) => {
    try {
      await api.delete(`/wishlist/${id}`);
      setWishlist(wishlist.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
    }
  };

  const addToCart = async (tileId: string) => {
    try {
      await api.post("/cart", {
        tileId: tileId,
        quantityBox: 1,
      });
      alert("Added to cart!");
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Heart className="text-primary" size={36} />
            My Wishlist
          </h1>
          <p className="text-muted-foreground mt-2">
            {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
          </p>
        </div>

        {/* Wishlist Grid */}
        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-24 h-24 mx-auto text-muted-foreground/30 mb-6" />
            <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Start adding tiles you love to keep track of them
            </p>
            <Button onClick={() => router.push("/tiles")}>
              Browse Tiles
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="group border rounded-xl overflow-hidden bg-card hover:shadow-lg transition-all duration-300"
              >
                {/* Image */}
                <Link href={`/tiles/${item.tile.id}`} className="block relative aspect-square bg-muted">
                  {item.tile.images?.[0] ? (
                    <Image
                      src={item.tile.images[0].imageUrl}
                      alt={item.tile.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Heart className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeFromWishlist(item.id);
                    }}
                    className="absolute top-3 right-3 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>

                  {/* Stock Badge */}
                  {item.tile.stock === 0 && (
                    <Badge variant="destructive" className="absolute bottom-3 left-3">
                      Out of Stock
                    </Badge>
                  )}
                </Link>

                {/* Content */}
                <div className="p-5">
                  <Link href={`/tiles/${item.tile.id}`}>
                    <h3 className="font-semibold mb-2 line-clamp-2 min-h-[3rem] hover:text-primary transition-colors">
                      {item.tile.name}
                    </h3>
                  </Link>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-2xl font-bold">
                        ₹{item.tile.pricePerSqft}
                      </div>
                      <div className="text-xs text-muted-foreground">per sq ft</div>
                    </div>
                    <Badge variant="outline">
                      {item.tile.stock} boxes
                    </Badge>
                  </div>

                  {/* Dealer Info */}
                  {item.tile.dealer && (
                    <p className="text-xs text-muted-foreground mb-3">
                      By {item.tile.dealer.shopName}
                    </p>
                  )}

                  {/* Add to Cart Button */}
                  <Button
                    onClick={() => addToCart(item.tile.id)}
                    disabled={item.tile.stock === 0}
                    className="w-full"
                    size="sm"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}