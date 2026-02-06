"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Heart,
  Share2,
  ShoppingCart,
  Loader2,
  Star,
  CheckCircle2,
  X,
  ZoomIn,
  Layers,
  MessageSquare,
  Package,
  FileText,
  ArrowRight,
} from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth-provider";
import { useWishlist } from "@/components/wishlist-provider";
import { LoginDialog } from "@/components/auth/login-dialog";
import Image from "next/image";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function TilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [tile, setTile] = useState<any>(null);
  const [relatedTiles, setRelatedTiles] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [zoomModal, setZoomModal] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // User data from DB
  const [dbUser, setDbUser] = useState<any>(null);

  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  const { user } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const inWishlist = tile ? isInWishlist(tile.id) : false;

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  // Fetch real DB user when auth state changes
  useEffect(() => {
    if (user) {
      fetchUserProfile();
    } else {
      setDbUser(null);
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const res = await api.get("/users/profile");
      setDbUser(res.data);
    } catch (err) {
      console.error("Failed to fetch DB user:", err);
    }
  };
  const loadData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/public/tiles/${id}`);
      setTile(response.data);

      const [revRes, allTilesRes] = await Promise.all([
        api.get(`/reviews/tile/${id}`).catch(() => ({ data: [] })),
        api.get("/public/tiles").catch(() => ({ data: { tiles: [] } })),
      ]);

      setReviews(revRes.data);

      let rel =
        allTilesRes.data.tiles?.filter(
          (t: any) => t.category === response.data.category && t.id !== id,
        ) || [];
      if (rel.length < 4)
        rel = allTilesRes.data.tiles?.filter((t: any) => t.id !== id) || [];
      setRelatedTiles(rel.slice(0, 4));
    } catch (err) {
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = () => {
    if (!user || !dbUser) {
      setShowLoginPopup(true);
      return false;
    }
    return true;
  };

  const handleAddToCart = async () => {
    if (!checkAuth()) return;
    if (tile.stock === 0) {
      toast.error("Out of stock");
      return;
    }
    setCartLoading(true);
    try {
      await api.post("/cart", { tileId: tile.id, quantityBox: 1 });
      toast.success("Added to cart!");
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setCartLoading(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!checkAuth()) return;
    setWishlistLoading(true);
    try {
      if (inWishlist) {
        await removeFromWishlist(tile.id);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(tile.id);
        toast.success("Added to wishlist!");
      }
    } catch {
      toast.error("Error updating wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleReviewSubmit = async () => {
    if (!checkAuth()) return;
    if (!reviewText.trim()) {
      toast.error("Please write a comment");
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await api.post(`/reviews/tile/${id}`, {
        name: dbUser.name || "Verified Customer",
        rating: reviewRating,
        comment: reviewText,
      });
      setReviews([res.data, ...reviews]);
      setReviewText("");
      toast.success("Review submitted!");
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  if (!tile)
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <h1 className="text-2xl font-bold mb-4">Tile not found</h1>
        <Button onClick={() => router.push("/tiles")}>Browse Tiles</Button>
      </div>
    );

  const currentImage = tile.images?.[activeImg]?.imageUrl;

  return (
    <>
      <LoginDialog open={showLoginPopup} onOpenChange={setShowLoginPopup} />
      <div className="min-h-screen bg-background pb-20">
        {/* Navigation Header */}
        <div className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link
              href="/tiles"
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Back to Collection
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Main Product Info Section */}
          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            {/* Gallery Section */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-muted rounded-[2rem] overflow-hidden border group shadow-sm">
                {currentImage ? (
                  <>
                    <Image
                      src={currentImage}
                      alt={tile.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      priority
                    />
                    <button
                      onClick={() => setZoomModal(true)}
                      className="absolute bottom-6 right-6 w-12 h-12 bg-background/90 backdrop-blur shadow-2xl rounded-2xl flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <ZoomIn className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Layers className="w-16 h-16 text-muted-foreground" />
                  </div>
                )}
              </div>
              {tile.images?.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {tile.images.map((img: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImg(idx)}
                      className={cn(
                        "aspect-square rounded-2xl overflow-hidden border-2 transition-all",
                        activeImg === idx
                          ? "border-primary scale-95 shadow-inner"
                          : "border-transparent opacity-70 hover:opacity-100",
                      )}
                    >
                      <Image
                        src={img.imageUrl}
                        alt=""
                        width={150}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="flex items-center gap-2 mb-6">
                <Badge
                  variant="secondary"
                  className="px-3 py-1 rounded-full uppercase tracking-widest text-[10px]"
                >
                  {tile.category?.replace(/_/g, " ")}
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">
                  SKU: {tile.sku}
                </span>
              </div>
              <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
                {tile.name}
              </h1>

              {/* Review Summary */}
              {reviews.length > 0 && (
                <div className="flex items-center gap-2 mb-8">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-4 h-4",
                          i < Math.round(Number(avgRating))
                            ? "fill-current"
                            : "text-muted",
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold">{avgRating}</span>
                  <span className="text-xs text-muted-foreground">
                    ({reviews.length} Verified Reviews)
                  </span>
                </div>
              )}

              {/* Pricing */}
              <div className="mb-10 flex items-center gap-4">
                <div className="px-8 py-6 bg-primary text-primary-foreground rounded-3xl inline-flex flex-col">
                  <span className="text-sm font-medium opacity-80">
                    Per Sq. Ft.
                  </span>
                  <span className="text-4xl font-black">
                    ₹{tile.pricePerSqft}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-sm">
                    Box price
                  </span>
                  <span className="text-xl font-bold">₹{tile.pricePerBox}</span>
                </div>
              </div>

              {/* Stock */}
              <div className="mb-10">
                {tile.stock > 0 ? (
                  <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-5 py-3 rounded-2xl w-fit border border-emerald-100 dark:border-emerald-900">
                    <CheckCircle2 className="w-5 h-5" />{" "}
                    <span className="font-semibold text-sm">
                      In Stock: {tile.stock} Boxes
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-destructive bg-destructive/5 px-5 py-3 rounded-2xl w-fit border border-destructive/10">
                    <X className="w-5 h-5" />{" "}
                    <span className="font-semibold text-sm">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                {[
                  { label: "Material", val: tile.material },
                  { label: "Finish", val: tile.finish },
                  { label: "Size", val: tile.size },
                  { label: "Usage", val: tile.application },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="p-4 rounded-2xl bg-muted/50 border border-border/50"
                  >
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">
                      {s.label}
                    </p>
                    <p className="text-sm font-semibold">
                      {s.val?.replace(/_/g, " ")}
                    </p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="flex-1 h-16 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20"
                  disabled={cartLoading || tile.stock === 0}
                >
                  {cartLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <ShoppingCart className="mr-2" />
                  )}{" "}
                  Add to Cart
                </Button>
                <Button
                  onClick={handleWishlistToggle}
                  variant="outline"
                  size="lg"
                  className={cn(
                    "h-16 w-16 rounded-2xl border-2",
                    inWishlist && "text-red-500 border-red-200 bg-red-50",
                  )}
                >
                  {wishlistLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Heart className={cn(inWishlist && "fill-current")} />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="max-w-4xl mx-auto border-t pt-20">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold mb-2">Community Feedback</h2>
                <p className="text-muted-foreground">
                  What other homeowners and architects are saying.
                </p>
              </div>
              {(!user || !dbUser) && (
                <Badge variant="outline" className="px-4 py-2 border-dashed">
                  Login to write a review
                </Badge>
              )}
            </div>

            <div className="grid md:grid-cols-12 gap-12">
              <div className="md:col-span-4 space-y-6">
                <div className="p-8 rounded-[2rem] bg-card border shadow-sm text-center">
                  <p className="text-sm font-bold text-muted-foreground uppercase mb-2">
                    Average Rating
                  </p>
                  <h3 className="text-7xl font-black mb-4">{avgRating}</h3>
                  <div className="flex justify-center text-amber-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-5 h-5",
                          i < Math.round(Number(avgRating))
                            ? "fill-current"
                            : "text-muted",
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Based on {reviews.length} reviews
                  </p>
                </div>
              </div>

              <div className="md:col-span-8">
                {user && dbUser ? (
                  <div className="p-8 rounded-[2rem] border bg-card/50 space-y-6 mb-12">
                    <h4 className="font-bold text-xl">Share your thoughts</h4>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          onClick={() => setReviewRating(s)}
                          className="transition-transform active:scale-90"
                        >
                          <Star
                            className={cn(
                              "w-8 h-8",
                              s <= reviewRating
                                ? "text-amber-400 fill-current"
                                : "text-muted",
                            )}
                          />
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Write your review here..."
                      className="w-full bg-background rounded-2xl p-4 border-2 focus:border-primary outline-none min-h-[120px] transition-all"
                    />
                    <Button
                      onClick={handleReviewSubmit}
                      disabled={submittingReview}
                      className="w-full h-12 rounded-xl font-bold"
                    >
                      {submittingReview ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Submit Verified Review"
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="p-12 rounded-[2rem] border-2 border-dashed border-muted flex flex-col items-center justify-center text-center space-y-4 mb-12">
                    <MessageSquare className="w-12 h-12 text-muted" />
                    <p className="font-medium">
                      Sign in to share your experience with this product
                    </p>
                    <Button
                      onClick={() => setShowLoginPopup(true)}
                      variant="secondary"
                    >
                      Sign In Now
                    </Button>
                  </div>
                )}

                <div className="space-y-6">
                  {reviews.map((r: any) => (
                    <div
                      key={r.id}
                      className="p-6 rounded-2xl bg-muted/30 border border-transparent hover:border-border transition-all"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                          {r.name?.[0]}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{r.name}</p>
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "w-3 h-3",
                                  i < r.rating ? "fill-current" : "text-muted",
                                )}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="ml-auto text-[10px] text-muted-foreground uppercase font-bold">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {r.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedTiles.length > 0 && (
            <div className="mt-32">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <h2 className="text-4xl font-bold tracking-tight mb-2">
                    Inspired by your choice
                  </h2>
                  <p className="text-muted-foreground">
                    Similar textures and categories you might prefer.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => router.push("/tiles")}
                  className="group"
                >
                  View Collection{" "}
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedTiles.map((item: any) => (
                  <Link
                    key={item.id}
                    href={`/tiles/${item.id}`}
                    className="group block"
                  >
                    <div className="bg-card rounded-[2rem] overflow-hidden border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                      <div className="aspect-[4/5] relative overflow-hidden bg-muted">
                        {item.images?.[0] ? (
                          <Image
                            src={item.images[0].imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Layers className="text-muted opacity-20" />
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <Badge
                          variant="outline"
                          className="mb-3 text-[9px] uppercase font-bold text-muted-foreground border-muted-foreground/20"
                        >
                          {item.category?.replace(/_/g, " ")}
                        </Badge>
                        <h3 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-black">
                            ₹{item.pricePerSqft}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-bold uppercase">
                            / sq.ft
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Zoom Modal */}
      {zoomModal && currentImage && (
        <div
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center p-8"
          onClick={() => setZoomModal(false)}
        >
          <button className="absolute top-8 right-8 w-14 h-14 bg-muted rounded-full flex items-center justify-center hover:rotate-90 transition-transform">
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full h-full max-w-5xl">
            <Image
              src={currentImage}
              alt={tile.name}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
