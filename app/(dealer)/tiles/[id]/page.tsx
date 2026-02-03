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
  ThumbsUp,
  Package,
} from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth-provider";
import { useWishlist } from "@/components/wishlist-provider";
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
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  
  // Review form
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const { user } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const inWishlist = tile ? isInWishlist(tile.id) : false;

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/public/tiles/${id}`);
      setTile(response.data);

      // Load reviews
      try {
        const r = await api.get(`/reviews/tile/${id}`);
        setReviews(r.data || []);
      } catch (err) {
        console.error("Failed to load reviews:", err);
      }

      // Load related tiles
      try {
        const all = await api.get("/public/tiles");
        let rel =
          all.data.tiles?.filter(
            (t: any) => t.category === response.data.category && t.id !== id
          ) || [];

        if (rel.length < 4) {
          rel = all.data.tiles?.filter((t: any) => t.id !== id) || [];
        }
        setRelatedTiles(rel.slice(0, 4));
      } catch (err) {
        console.error("Failed to load related tiles:", err);
      }
    } catch (err) {
      console.error("Failed to load tile:", err);
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
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
      console.error("Cart error:", error);
      toast.error("Failed to add to cart");
    } finally {
      setCartLoading(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error("Please login");
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
      console.error("Wishlist error:", error);
      toast.error("Something went wrong");
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleReviewSubmit = async () => {
    if (!reviewText.trim() || !reviewName.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    setSubmittingReview(true);

    try {
      const res = await api.post(`/reviews/tile/${id}`, {
        name: reviewName,
        rating: reviewRating,
        comment: reviewText,
      });
      setReviews([res.data, ...reviews]);
      setReviewText("");
      setReviewName("");
      setReviewRating(5);
      toast.success("Review submitted!");
    } catch (error) {
      console.error("Review error:", error);
      toast.error("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!tile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Tile not found</h1>
          <Button onClick={() => router.push("/tiles")}>Browse Tiles</Button>
        </div>
      </div>
    );
  }

  const currentImage = tile.images?.[activeImg]?.imageUrl;

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-card/50 backdrop-blur-lg sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Link
              href="/tiles"
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Products
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Main Product Section */}
          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-muted rounded-3xl overflow-hidden group">
                {currentImage ? (
                  <>
                    <Image
                      src={currentImage}
                      alt={tile.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <button
                      onClick={() => setZoomModal(true)}
                      className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
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

              {/* Thumbnails */}
              {tile.images?.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {tile.images.map((img: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImg(idx)}
                      className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                        activeImg === idx
                          ? "border-primary shadow-lg scale-105"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Image
                        src={img.imageUrl}
                        alt=""
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="lg:sticky lg:top-24 h-fit">
              <Badge className="mb-4 text-xs">
                {tile.category?.replace(/_/g, " ")}
              </Badge>

              <h1 className="text-4xl font-bold mb-4 leading-tight">{tile.name}</h1>

              {/* Reviews Summary */}
              {reviews.length > 0 && (
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(Number(avgRating))
                            ? "fill-amber-400 text-amber-400"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-bold">{avgRating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-8 p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl border border-primary/20">
                <span className="text-5xl font-black bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  ₹{tile.pricePerSqft}
                </span>
                <span className="text-xl text-muted-foreground">/sq ft</span>
              </div>

              {/* Stock */}
              <div className="mb-8">
                {tile.stock > 0 ? (
                  <div className="flex items-center gap-2 text-green-600 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-semibold">In Stock ({tile.stock} boxes available)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                    <X className="w-5 h-5" />
                    <span className="font-semibold">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {tile.description && tile.description !== "NOTDEFINED" && (
                <div className="mb-8">
                  <h3 className="font-bold text-lg mb-3">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {tile.description}
                  </p>
                </div>
              )}

              {/* Specifications */}
              <div className="border-2 rounded-2xl p-6 mb-8 bg-card">
                <h3 className="font-bold text-lg mb-4">Specifications</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground font-medium">Material</span>
                    <span className="font-bold">{tile.material}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground font-medium">Finish</span>
                    <span className="font-bold">{tile.finish}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground font-medium">Size</span>
                    <span className="font-bold">{tile.size}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground font-medium">Price per Box</span>
                    <span className="font-bold text-primary">₹{tile.pricePerBox}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    size="lg"
                    className="flex-1 h-14 text-base font-bold shadow-lg shadow-primary/30"
                    disabled={cartLoading || tile.stock === 0}
                  >
                    {cartLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <ShoppingCart className="w-5 h-5 mr-2" />
                    )}
                    Add to Cart
                  </Button>

                  <Button
                    onClick={handleWishlistToggle}
                    size="lg"
                    variant="outline"
                    className={cn(
                      "h-14 px-6 border-2 transition-all",
                      inWishlist
                        ? "bg-red-50 border-red-500 text-red-500 hover:bg-red-100"
                        : "hover:border-red-500 hover:text-red-500"
                    )}
                    disabled={wishlistLoading}
                  >
                    {wishlistLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Heart
                        className={`w-5 h-5 ${inWishlist ? "fill-current" : ""}`}
                      />
                    )}
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-6 border-2"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Link copied!");
                    }}
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t pt-16 mb-20">
            <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>

            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              {/* Rating Summary */}
              <div className="text-center p-8 border-2 rounded-3xl bg-gradient-to-br from-card to-muted/50">
                {reviews.length > 0 ? (
                  <>
                    <div className="text-6xl font-black mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      {avgRating}
                    </div>
                    <div className="flex justify-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-6 h-6 ${
                            i < Math.round(Number(avgRating))
                              ? "fill-amber-400 text-amber-400"
                              : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">
                      Based on {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                    </p>
                  </>
                ) : (
                  <>
                    <Star className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground font-medium">No reviews yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Be the first to review!
                    </p>
                  </>
                )}
              </div>

              {/* Write Review */}
              <div className="lg:col-span-2 p-8 border-2 rounded-3xl bg-card">
                <h3 className="text-xl font-bold mb-6">Write a Review</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full p-3 border-2 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-3">
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="transition-transform hover:scale-125"
                        >
                          <Star
                            className={`w-10 h-10 ${
                              star <= reviewRating
                                ? "fill-amber-400 text-amber-400"
                                : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your experience with this tile..."
                      className="w-full p-4 border-2 rounded-xl min-h-[120px] focus:ring-2 focus:ring-primary focus:border-primary resize-none bg-background"
                      maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {reviewText.length}/500 characters
                    </p>
                  </div>

                  <Button
                    onClick={handleReviewSubmit}
                    className="w-full h-12 font-bold"
                    disabled={submittingReview || !reviewText.trim() || !reviewName.trim()}
                  >
                    {submittingReview ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-5 h-5 mr-2" />
                        Submit Review
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Review List */}
            {reviews.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold mb-6">All Reviews</h3>
                {reviews.map((review: any) => (
                  <div
                    key={review.id}
                    className="p-6 border-2 rounded-2xl bg-card hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-lg">
                        {review.name?.charAt(0).toUpperCase() || "U"}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-bold text-lg">
                              {review.name || "Anonymous"}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? "fill-amber-400 text-amber-400"
                                        : "fill-gray-200 text-gray-200"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {new Date(review.createdAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric"
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-muted-foreground leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Related Products */}
          {relatedTiles.length > 0 && (
            <div className="border-t pt-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">You May Also Like</h2>
                <Link href="/tiles" className="text-sm font-medium hover:underline">
                  View All →
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedTiles.map((item: any) => (
                  <Link
                    key={item.id}
                    href={`/tiles/${item.id}`}
                    className="group"
                  >
                    <div className="border-2 rounded-2xl overflow-hidden bg-card hover:shadow-2xl hover:border-primary/50 transition-all duration-300">
                      <div className="aspect-square bg-muted overflow-hidden">
                        {item.images?.[0] ? (
                          <Image
                            src={item.images[0].imageUrl}
                            alt={item.name}
                            width={400}
                            height={400}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Layers className="w-12 h-12 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-primary">
                            ₹{item.pricePerSqft}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            /sq ft
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
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setZoomModal(false)}
        >
          <button
            onClick={() => setZoomModal(false)}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <Image
            src={currentImage}
            alt={tile.name}
            width={1200}
            height={1200}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </>
  );
}