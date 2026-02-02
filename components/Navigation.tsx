"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Heart, Menu, Sun, Moon, ShoppingCart, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-provider";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { api } from "@/lib/api";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState<Number>(0); // Example cart count
  const [wishlistCount, setWishlistCount] = useState<Number>(0); // Example wishlist count
  const isMobile = useIsMobile();
  const { isLoading, user, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Collections", href: "/tiles" },
    { name: "About", href: "/about" },
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
    setMobileMenuOpen(false);
  };

  const fetchCount = async () => {
    try {
      const [cartRes, wishlistRes] = await Promise.all([
        api.get("/cart"),
        api.get("/wishlist")
      ]);
      setCartCount(cartRes.data.totalItems);
      setWishlistCount(wishlistRes.data.totalItems);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchCount();
  }, []);
  

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm shadow-sm transition-transform group-hover:scale-105">
            TH
          </div>
          <span className="text-lg font-bold tracking-tight hidden sm:inline-block">
            TileHub
          </span>
        </Link>

        {/* Centered Desktop Navigation */}
        {!isMobile && (
          <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-1">
          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 relative"
            >
              {theme === "dark" ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              )}
            </Button>
          )}

          {/* Wishlist with Badge */}
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 relative"
              onClick={() => router.push("/wishlist")}
            >
              <Heart className="h-[1.2rem] w-[1.2rem]" />
              {wishlistCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] rounded-full"
                >
                  {wishlistCount}
                </Badge>
              )}
            </Button>
          )}

          {/* Cart with Badge */}
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 relative"
              onClick={() => router.push("/cart")}
            >
              <ShoppingCart className="h-[1.2rem] w-[1.2rem]" />
              {cartCount > 0 && (
                <Badge
                  variant="default"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] rounded-full"
                >
                  {cartCount}
                </Badge>
              )}
            </Button>
          )}

          {/* Desktop Auth */}
          {!isMobile && (
            <>
              {!isLoading && !user ? (
                <div className="flex items-center gap-2 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/login")}
                  >
                    Log in
                  </Button>
                  <Button size="sm" onClick={() => router.push("/signup")}>
                    Sign Up
                  </Button>
                </div>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full border-2 border-primary/20 relative ml-2"
                    >
                      <User className="h-[1.2rem] w-[1.2rem]" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/orders")}>
                      Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/wishlist")}>
                      <Heart className="mr-2 h-4 w-4" />
                      Wishlist
                      {wishlistCount > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          {wishlistCount}
                        </Badge>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/cart")}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Cart
                      {cartCount > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          {cartCount}
                        </Badge>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={signOut}
                      className="text-destructive"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </>
          )}

          {/* Mobile Menu Sheet */}
          {isMobile && (
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-4 mt-8">
                  {/* Navigation Links */}
                  <nav className="flex flex-col gap-2">
                    {navLinks.map((link) => (
                      <Button
                        key={link.name}
                        variant="ghost"
                        className="justify-start h-12 text-base"
                        onClick={() => handleNavigation(link.href)}
                      >
                        {link.name}
                      </Button>
                    ))}
                  </nav>

                  <div className="border-t my-4" />

                  {/* Quick Actions */}
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      className="justify-start h-12"
                      onClick={() => handleNavigation("/wishlist")}
                    >
                      <Heart className="h-4 w-4 mr-3" />
                      Wishlist
                      {wishlistCount > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          {wishlistCount}
                        </Badge>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start h-12"
                      onClick={() => handleNavigation("/cart")}
                    >
                      <ShoppingCart className="h-4 w-4 mr-3" />
                      Cart
                      {cartCount > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          {cartCount}
                        </Badge>
                      )}
                    </Button>
                  </div>

                  <div className="border-t my-4" />

                  {/* User Actions */}
                  {!isLoading && !user ? (
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        className="w-full h-12"
                        onClick={() => handleNavigation("/login")}
                      >
                        Log in
                      </Button>
                      <Button
                        className="w-full h-12"
                        onClick={() => handleNavigation("/signup")}
                      >
                        Sign Up
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="ghost"
                        className="justify-start h-12"
                        onClick={() => handleNavigation("/profile")}
                      >
                        <User className="h-4 w-4 mr-3" />
                        Profile
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start h-12"
                        onClick={() => handleNavigation("/orders")}
                      >
                        Orders
                      </Button>
                      <div className="border-t my-2" />
                      <Button
                        variant="ghost"
                        className="justify-start h-12 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          signOut();
                          setMobileMenuOpen(false);
                        }}
                      >
                        Logout
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;