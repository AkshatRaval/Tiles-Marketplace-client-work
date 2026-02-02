"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "./auth-provider";

interface WishlistContextType {
  wishlistIds: Set<string>;
  isInWishlist: (tileId: string) => boolean;
  addToWishlist: (tileId: string) => Promise<void>;
  removeFromWishlist: (tileId: string) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlistIds: new Set(),
  isInWishlist: () => false,
  addToWishlist: async () => {},
  removeFromWishlist: async () => {},
  refreshWishlist: async () => {},
});

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (user && !isLoading) {
      refreshWishlist();
    } else {
      setWishlistIds(new Set());
    }
  }, [user, isLoading]);

  const refreshWishlist = async () => {
    if (!user) return;

    try {
      const response = await api.get("/wishlist");
      const ids = new Set<any>(response.data.map((item: any) => item.tileId));
      setWishlistIds(ids);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    }
  };

  const isInWishlist = (tileId: string) => {
    return wishlistIds.has(tileId);
  };

  const addToWishlist = async (tileId: string) => {
    try {
      await api.post("/wishlist", { tileId });
      setWishlistIds((prev) => new Set(prev).add(tileId));
    } catch (error) {
      throw error;
    }
  };

  const removeFromWishlist = async (tileId: string) => {
    try {
      // Find wishlist item by tileId
      const response = await api.get("/wishlist");
      const item = response.data.find((w: any) => w.tileId === tileId);
      
      if (item) {
        await api.delete(`/wishlist/${item.id}`);
        setWishlistIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(tileId);
          return newSet;
        });
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
};