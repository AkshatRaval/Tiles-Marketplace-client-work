"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Trash2, Plus, Minus, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/components/auth-provider";

export default function CartPage() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      toast.error("Please login to view cart");
      router.push("/login");
      return;
    }
    fetchCart();
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api.get("/cart");
      setCart(res.data);
    } catch (error: any) {
      console.error("Failed to fetch cart:", error);
      if (error.response?.status === 401) {
        toast.error("Please login");
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      setUpdating(itemId);
      await api.patch(`/cart/${itemId}`, {
        quantityBox: newQuantity,
      });
      await fetchCart();
      toast.success("Updated quantity");
    } catch (error) {
      console.error("Failed to update quantity:", error);
      toast.error("Failed to update");
    } finally {
      setUpdating(null);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      await api.delete(`/cart/${itemId}`);
      await fetchCart();
      toast.success("Removed from cart");
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      toast.error("Failed to remove");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  const isEmpty = !cart?.items || cart.items.length === 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold flex items-center gap-3 mb-2">
            <ShoppingCart className="text-primary" size={36} />
            Shopping Cart
          </h1>
          {!isEmpty && (
            <p className="text-muted-foreground">
              {cart.totalItems} {cart.totalItems === 1 ? "item" : "items"} in your cart
            </p>
          )}
        </div>

        {isEmpty ? (
          <div className="text-center py-20 bg-card border rounded-3xl">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-3xl font-bold mb-3">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Add some tiles to get started
            </p>
            <Button size="lg" onClick={() => router.push("/tiles")}>
              Browse Tiles
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item: any) => (
                <div
                  key={item.id}
                  className="border rounded-2xl p-6 bg-card hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-6">
                    {/* Image - ALWAYS 0th image */}
                    <Link
                      href={`/tiles/${item.tile.id}`}
                      className="relative w-28 h-28 flex-shrink-0 bg-muted rounded-xl overflow-hidden group"
                    >
                      {item.tile.images?.[0] ? (
                        <Image
                          src={item.tile.images[0].imageUrl}
                          alt={item.tile.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingCart className="w-10 h-10 text-muted-foreground" />
                        </div>
                      )}
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <Link href={`/tiles/${item.tile.id}`}>
                            <h3 className="font-bold text-lg mb-1 hover:text-primary transition-colors line-clamp-2">
                              {item.tile.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.tile.material} • {item.tile.size}
                          </p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-primary">
                              ₹{item.tile.pricePerBox}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              per box
                            </span>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                        >
                          <Trash2 size={20} />
                        </Button>
                      </div>

                      {/* Quantity Controls & Stock */}
                      <div className="flex items-center justify-between gap-4 pt-4 border-t">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">
                            Quantity:
                          </span>
                          <div className="flex items-center border rounded-lg">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantityBox - 1)
                              }
                              disabled={
                                updating === item.id || item.quantityBox === 1
                              }
                              className="p-2 hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-4 py-2 font-bold min-w-[3rem] text-center">
                              {updating === item.id ? (
                                <Loader2
                                  size={16}
                                  className="animate-spin mx-auto"
                                />
                              ) : (
                                item.quantityBox
                              )}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantityBox + 1)
                              }
                              disabled={
                                updating === item.id ||
                                item.quantityBox >= item.tile.stock
                              }
                              className="p-2 hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {item.tile.stock} available
                          </Badge>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right">
                          <div className="text-xl font-bold">
                            ₹
                            {(item.tile.pricePerBox * item.quantityBox).toFixed(
                              2
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.quantityBox}{" "}
                            {item.quantityBox === 1 ? "box" : "boxes"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary - Sticky */}
            <div className="lg:col-span-1">
              <div className="border rounded-2xl p-6 bg-card sticky top-24 space-y-6">
                <h2 className="text-2xl font-bold">Order Summary</h2>

                <div className="space-y-3 py-6 border-y">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Items</span>
                    <span className="font-bold">{cart.totalItems} boxes</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Subtotal</span>
                    <span className="font-bold text-primary">
                      ₹{cart.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    size="lg"
                    className="w-full h-14 text-base"
                    onClick={() => router.push("/checkout")}
                  >
                    Schedule Viewing
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => router.push("/tiles")}
                  >
                    Continue Shopping
                  </Button>
                </div>

                <div className="p-4 bg-muted/50 rounded-xl">
                  <p className="text-xs text-center text-muted-foreground leading-relaxed">
                    💡 No payment required. Schedule a free viewing appointment
                    to see the tiles in person.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}