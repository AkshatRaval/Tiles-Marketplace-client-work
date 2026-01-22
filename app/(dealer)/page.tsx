"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Search,
  ArrowRight,
  Star,
  Package,
  Shield,
  Truck,
  Users,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Award,
  ChevronLeft,
  ChevronRight,
  Heart,
  BadgeCheck,
} from "lucide-react";
import { api } from "@/lib/api";

const MainHome = () => {
  const [featuredTiles, setFeaturedTiles] = useState<any[]>([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadFeaturedTiles();
    
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 3);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadFeaturedTiles = async () => {
    try {
      const response = await api.get("/tiles", { params: { limit: 8 } });
      setFeaturedTiles(response.data.tiles || []);
    } catch (error) {
      console.error("Failed to load tiles:", error);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/tiles?search=${encodeURIComponent(searchQuery)}`;
    } else {
      window.location.href = `/tiles`;
    }
  };

  const categories = [
    { name: "Floor Tiles", count: "500+", link: "/tiles?category=FLOOR" },
    { name: "Wall Tiles", count: "400+", link: "/tiles?category=WALL" },
    { name: "Bathroom", count: "300+", link: "/tiles?category=BATHROOM" },
    { name: "Kitchen", count: "250+", link: "/tiles?category=KITCHEN" },
  ];

  const stats = [
    { value: "5000+", label: "Premium Tiles", icon: Package },
    { value: "10,000+", label: "Happy Customers", icon: Users },
    { value: "50+", label: "Trusted Dealers", icon: Award },
    { value: "100%", label: "Quality Assured", icon: BadgeCheck },
  ];

  const features = [
    { icon: Shield, title: "Quality Guaranteed", description: "100% authentic products from verified dealers" },
    { icon: Truck, title: "Fast Delivery", description: "Quick and safe delivery across India" },
    { icon: BadgeCheck, title: "Certified Dealers", description: "Work with trusted and verified suppliers" },
    { icon: CheckCircle, title: "Best Prices", description: "Competitive pricing with exclusive deals" },
  ];

  const testimonials = [
    { name: "Priya Sharma", role: "Homeowner, Mumbai", rating: 5, text: "Found the perfect tiles for my kitchen renovation! The quality is outstanding and delivery was super fast.", avatar: "PS" },
    { name: "Rajesh Kumar", role: "Interior Designer, Delhi", rating: 5, text: "As a professional designer, I need reliable suppliers. This platform has never disappointed me.", avatar: "RK" },
    { name: "Anita Desai", role: "Architect, Bangalore", rating: 5, text: "The best platform for sourcing tiles. Easy to compare prices and amazing quality!", avatar: "AD" },
  ];

  return (
    <div className="bg-background">
      {/* YOUR EXISTING HERO - UNCHANGED */}
      <div className="relative w-full h-[600px] flex items-center">
        <Image
          src="/heroPage.jpg"
          alt="Premium kitchen with marble tiles"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex flex-col items-start">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight max-w-4xl">
            Discover Premium Tiles <br /> for Your Dream Space
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl leading-relaxed">
            Connect with trusted tile dealers across India. Browse thousands of tiles, compare prices, and find the perfect match for your home.
          </p>
          <div className="mt-10 flex flex-col md:flex-row items-center gap-4 w-full max-w-3xl">
            <div className="grow flex items-center bg-white rounded-md overflow-hidden h-14 px-4 w-full">
              <Search className="text-gray-400 w-6 h-6 mr-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search for tiles, styles, or dealers..."
                className="w-full h-full border-none outline-none text-gray-700 text-lg placeholder:text-gray-400"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="bg-primary hover:bg-orange-700 text-white text-lg font-medium h-14 px-10 rounded-md w-full md:w-auto transition-colors"
            >
              Search Tiles
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Link href="/tiles" className="group flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-medium px-8 py-3 rounded-md transition-all">
              Browse All Tiles
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/dealers" className="text-white font-medium px-6 py-3 rounded-md hover:bg-white/10 transition-colors">
              Become a Dealer
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-card border-y py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-3">
                  <stat.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="py-16 max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full mb-3">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-primary text-xs font-bold uppercase">Featured</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Trending This Month</h2>
            <p className="text-muted-foreground mt-2">Handpicked premium tiles</p>
          </div>
          <Link href="/tiles">
            <Button variant="outline" className="hidden md:flex">
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {featuredTiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTiles.slice(0, 8).map((tile) => (
              <Link key={tile.id} href={`/tiles/${tile.id}`}>
                <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border hover:border-primary/50">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {tile.images?.[0] ? (
                      <Image
                        src={tile.images[0].imageUrl}
                        alt={tile.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-bold">NEW</span>
                    </div>
                    <button className="absolute top-3 right-3 w-8 h-8 bg-background rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-primary font-semibold mb-1 uppercase">{tile.category}</div>
                    <h3 className="font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">{tile.name}</h3>
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">(4.8)</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold">${tile.pricePerSqft}</span>
                      <span className="text-xs text-muted-foreground">/sq ft</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="bg-muted py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Shop by Category</h2>
            <p className="text-muted-foreground">Find tiles for every space</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, index) => (
              <Link key={index} href={cat.link}>
                <Card className="group p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary">
                  <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{cat.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">{cat.count} Products</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Why Choose Us</h2>
          <p className="text-muted-foreground">Your trusted partner</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-muted py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Customer Reviews</h2>
            <p className="text-muted-foreground">What our customers say</p>
          </div>
          <div className="relative">
            <Card className="p-8 md:p-12">
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <blockquote className="text-xl md:text-2xl text-center mb-8 leading-relaxed font-medium">
                "{testimonials[currentTestimonial].text}"
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                  {testimonials[currentTestimonial].avatar}
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg">{testimonials[currentTestimonial].name}</div>
                  <div className="text-sm text-muted-foreground">{testimonials[currentTestimonial].role}</div>
                </div>
              </div>
            </Card>
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev - 1 + 3) % 3)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 w-10 h-10 bg-background border-2 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev + 1) % 3)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 w-10 h-10 bg-background border-2 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`h-2 rounded-full transition-all ${index === currentTestimonial ? "bg-primary w-8" : "bg-muted-foreground/30 w-2"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-6 text-center text-primary-foreground">
          <Sparkles className="w-12 h-12 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Space?</h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            Browse thousands of premium tiles and start your dream project today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tiles">
              <Button size="lg" variant="secondary" className="text-lg px-10 h-14">
                Explore Tiles <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-primary-foreground hover:bg-white/20 text-lg px-10 h-14">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainHome;