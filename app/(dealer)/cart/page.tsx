"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Trash2, Plus, Minus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function CartPage() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api.get("/cart");
      setCart(res.data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
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
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setUpdating(null);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      await api.delete(`/cart/${itemId}`);
      await fetchCart();
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const isEmpty = !cart?.items || cart.items.length === 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <ShoppingCart className="text-primary" size={36} />
            Shopping Cart
          </h1>
          {!isEmpty && (
            <p className="text-muted-foreground mt-2">
              {cart.totalItems} {cart.totalItems === 1 ? "item" : "items"} in your cart
            </p>
          )}
        </div>

        {isEmpty ? (
          <div className="text-center py-20">
            <ShoppingCart className="w-24 h-24 mx-auto text-muted-foreground/30 mb-6" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add some tiles to get started
            </p>
            <Button onClick={() => router.push("/tiles")}>
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
                  className="border rounded-xl p-6 bg-card flex gap-6 items-center"
                >
                  {/* Image */}
                  <Link
                    href={`/tiles/${item.tile.id}`}
                    className="relative w-24 h-24 flex-shrink-0 bg-muted rounded-lg overflow-hidden"
                  >
                    {item.tile.images?.[0] ? (
                      <Image
                        src={item.tile.images[0].imageUrl}
                        alt={item.tile.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </Link>

                  {/* Details */}
                  <div className="flex-1">
                    <Link href={`/tiles/${item.tile.id}`}>
                      <h3 className="font-semibold mb-1 hover:text-primary transition-colors">
                        {item.tile.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.tile.material} • {item.tile.size}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">
                        ₹{item.tile.pricePerBox}
                      </span>
                      <span className="text-sm text-muted-foreground">per box</span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantityBox - 1)
                          }
                          disabled={updating === item.id || item.quantityBox === 1}
                          className="p-2 hover:bg-accent transition-colors disabled:opacity-50"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                          {updating === item.id ? (
                            <Loader2 size={16} className="animate-spin mx-auto" />
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
                          className="p-2 hover:bg-accent transition-colors disabled:opacity-50"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <Badge variant="outline" className="text-xs">
                        {item.tile.stock} boxes available
                      </Badge>
                    </div>
                  </div>

                  {/* Subtotal & Remove */}
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <div className="text-xl font-bold">
                        ₹{(item.tile.pricePerBox * item.quantityBox).toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.quantityBox} {item.quantityBox === 1 ? "box" : "boxes"}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="border rounded-xl p-6 bg-card sticky top-24">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₹{cart.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Items</span>
                    <span className="font-medium">{cart.totalItems} boxes</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="text-2xl font-bold">
                        ₹{cart.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full h-12 mb-3"
                  onClick={() => router.push("/checkout")}
                >
                  Proceed to Checkout
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push("/tiles")}
                >
                  Continue Shopping
                </Button>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    🚚 Free delivery on orders above ₹10,000
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