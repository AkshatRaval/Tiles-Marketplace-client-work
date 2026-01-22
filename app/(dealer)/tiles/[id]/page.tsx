"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Layers,
  Maximize,
  Sparkles,
  FileDown,
  CheckCircle2,
  Info,
  PhoneCall,
  Share2,
  Shield,
  Truck,
  RefreshCw,
  Award,
  ZoomIn,
  X,
  Star,
  ThumbsUp,
  MessageSquare,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Heart,
} from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import TileNotFound from "./not-found";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [tile, setTile] = useState<any>(null);
  const [relatedTiles, setRelatedTiles] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [zoomModal, setZoomModal] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    checkAuth();
  }, []);
  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const checkAuth = () =>
    setIsAuthenticated(!!localStorage.getItem("authToken"));

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/tiles/${id}`);
      setTile(response.data);

      try {
        const r = await api.get(`/reviews/tile/${id}`);
        setReviews(r.data || []);
      } catch {}

      try {
        const all = await api.get("/admin/tiles");
        let rel = all.data.filter(
          (t: any) => t.category === response.data.category && t.id !== id,
        );
        if (rel.length < 4) rel = all.data.filter((t: any) => t.id !== id);
        setRelatedTiles(rel.slice(0, 4));
      } catch {}

      setLoading(false);
    } catch {
      setError(true);
      setLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const r = await api.post("/auth/login", { email, password });
      localStorage.setItem("authToken", r.data.token);
      setIsAuthenticated(true);
      setShowAuthModal(false);
      setEmail("");
      setPassword("");
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !tile) {
    return <TileNotFound />;
  }

  const currentImage = tile.images?.[activeImg]?.imageUrl;

  return (
    <>
      <div className="bg-background min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-40 backdrop-blur-lg bg-background/80">
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

        <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
          {/* Main Product Section */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 mb-24">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-muted rounded-2xl overflow-hidden group">
                {currentImage ? (
                  <>
                    <img
                      src={currentImage}
                      alt={tile.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={() => setZoomModal(true)}
                        className="w-10 h-10 bg-background rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                      >
                        <ZoomIn className="w-5 h-5" />
                      </button>
                      <button className="w-10 h-10 bg-background rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        <Heart className="w-5 h-5" />
                      </button>
                      <button className="w-10 h-10 bg-background rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Layers className="w-16 h-16" />
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
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        activeImg === idx
                          ? "border-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <img
                        src={img.imageUrl}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="inline-block px-3 py-1 bg-muted rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
                {tile.category}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                {tile.name}
              </h1>

              {/* Reviews */}
              {reviews.length > 0 && (
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(Number(avgRating))
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{avgRating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({reviews.length} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-bold">${tile.pricePerSqft}</span>
                <span className="text-xl text-muted-foreground">/sq ft</span>
              </div>

              {/* Stock Status */}
              <div className="mb-8">
                {tile.stock > 0 ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">
                      In Stock - Ready to Ship
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-destructive">
                    <X className="w-5 h-5" />
                    <span className="font-medium">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {tile.description && tile.description !== "NOTDEFINED" && (
                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                  {tile.description}
                </p>
              )}

              {/* Specifications */}
              <div className="border rounded-xl p-6 mb-8">
                <h3 className="font-semibold mb-4">Specifications</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Material</span>
                    <span className="font-medium">{tile.material}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Finish</span>
                    <span className="font-medium">{tile.finish}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Size</span>
                    <span className="font-medium">{tile.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SKU</span>
                    <span className="font-medium font-mono text-sm">
                      {tile.sku}
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3 mb-8">
                <Button
                  onClick={() =>
                    isAuthenticated
                      ? router.push(`/checkout/booking/${id}`)
                      : setShowAuthModal(true)
                  }
                  size="lg"
                  className="w-full h-14 text-base"
                  disabled={tile.stock === 0}
                >
                  <PhoneCall className="w-5 h-5 mr-2" />
                  Book Now
                </Button>

                {tile.pdfUrl && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full h-14 text-base"
                    onClick={() => window.open(tile.pdfUrl, "_blank")}
                  >
                    <FileDown className="w-5 h-5 mr-2" />
                    Download Specifications
                  </Button>
                )}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <div>
                    <div className="font-semibold text-sm">Quality</div>
                    <div className="text-xs text-muted-foreground">
                      Guaranteed
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <Truck className="w-6 h-6 text-green-600" />
                  <div>
                    <div className="font-semibold text-sm">Shipping</div>
                    <div className="text-xs text-muted-foreground">
                      3-5 Days
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <RefreshCw className="w-6 h-6 text-purple-600" />
                  <div>
                    <div className="font-semibold text-sm">Returns</div>
                    <div className="text-xs text-muted-foreground">30 Days</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <Award className="w-6 h-6 text-orange-600" />
                  <div>
                    <div className="font-semibold text-sm">Certified</div>
                    <div className="text-xs text-muted-foreground">
                      ISO Quality
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t pt-16 mb-24">
            <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>

            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              {/* Rating Summary */}
              <div className="text-center p-8 border rounded-2xl bg-card">
                {reviews.length > 0 ? (
                  <>
                    <div className="text-6xl font-bold mb-2">{avgRating}</div>
                    <div className="flex justify-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.round(Number(avgRating))
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-muted text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Based on {reviews.length}{" "}
                      {reviews.length === 1 ? "review" : "reviews"}
                    </p>
                  </>
                ) : (
                  <>
                    <Star className="w-16 h-16 mx-auto mb-4 text-muted" />
                    <p className="text-muted-foreground">No reviews yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Be the first to review
                    </p>
                  </>
                )}
              </div>

              {/* Write Review */}
              <div className="lg:col-span-2 p-8 border rounded-2xl bg-card">
                <h3 className="text-xl font-bold mb-6">Write a Review</h3>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= reviewRating
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-muted text-muted"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">
                    Your Review
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience with this product..."
                    className="w-full p-4 border rounded-xl min-h-30 focus:ring-2 focus:ring-primary focus:border-transparent resize-none bg-background"
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {reviewText.length}/500
                  </p>
                </div>

                <Button
                  onClick={async () => {
                    if (!isAuthenticated) {
                      setShowAuthModal(true);
                      return;
                    }
                    if (!reviewText.trim()) {
                      alert("Please write a review");
                      return;
                    }
                    try {
                      const r = await api.post(`/reviews/tile/${id}`, {
                        rating: reviewRating,
                        comment: reviewText,
                      });
                      setReviews([r.data, ...reviews]);
                      setReviewText("");
                      setReviewRating(5);
                    } catch {}
                  }}
                  className="w-full h-12"
                  disabled={!reviewText.trim()}
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Submit Review
                </Button>

                {!isAuthenticated && (
                  <p className="text-sm text-muted-foreground text-center mt-4">
                    Please sign in to leave a review
                  </p>
                )}
              </div>
            </div>

            {/* Review List */}
            {reviews.length > 0 && (
              <div className="space-y-6">
                {reviews.map((review: any) => (
                  <div
                    key={review.id}
                    className="p-6 border rounded-2xl bg-card"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                        {review.userName.charAt(0).toUpperCase()}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{review.userName}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "fill-muted text-muted"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {new Date(
                                  review.createdAt,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          {review.verified && (
                            <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full text-xs font-semibold">
                              Verified Purchase
                            </span>
                          )}
                        </div>

                        <p className="text-foreground leading-relaxed mb-4">
                          {review.comment}
                        </p>

                        <button
                          onClick={() => {
                            if (!isAuthenticated) {
                              setShowAuthModal(true);
                              return;
                            }
                            api
                              .post(`/reviews/${review.id}/helpful`)
                              .then(() => {
                                setReviews(
                                  reviews.map((r: any) =>
                                    r.id === review.id
                                      ? { ...r, helpful: r.helpful + 1 }
                                      : r,
                                  ),
                                );
                              });
                          }}
                          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          Helpful ({review.helpful})
                        </button>
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
                <Link
                  href="/tiles"
                  className="text-sm font-medium hover:underline text-primary"
                >
                  View All →
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedTiles.map((item: any) => (
                  <Link
                    key={item.id}
                    href={`/tiles/${item.id}`}
                    className="group block"
                  >
                    <div className="border rounded-2xl overflow-hidden bg-card hover:shadow-xl transition-shadow duration-300">
                      <div className="aspect-square bg-muted overflow-hidden">
                        {item.images?.[0] ? (
                          <img
                            src={item.images[0].imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <Layers className="w-12 h-12" />
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-semibold mb-2 line-clamp-2 min-h-12 group-hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold">
                            ${item.pricePerSqft}
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
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setZoomModal(false)}
        >
          <button
            onClick={() => setZoomModal(false)}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <img
            src={currentImage}
            alt={tile.name}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card rounded-3xl max-w-md w-full p-8 relative shadow-2xl border">
            <button
              onClick={() => {
                setShowAuthModal(false);
                setEmail("");
                setPassword("");
              }}
              className="absolute top-6 right-6 w-10 h-10 hover:bg-muted rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
            <p className="text-muted-foreground mb-8">Sign in to continue</p>

            <form onSubmit={handleAuthSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base"
                disabled={authLoading}
              >
                {authLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button
                  onClick={() => router.push("/signup")}
                  className="font-semibold text-primary hover:underline"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
