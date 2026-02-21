import React, { ReactNode } from "react";
import Navbar from "@/components/Navigation";
import { WishlistProvider } from "@/components/wishlist-provider";
import Footer from "@/components/footer";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <WishlistProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </WishlistProvider>
  );
};

export default layout;
