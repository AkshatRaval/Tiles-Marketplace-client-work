import React, { ReactNode } from "react";
import Navbar from "@/components/Navigation";
import { WishlistProvider } from "@/components/wishlist-provider";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <WishlistProvider>
      <div>
        <Navbar />
        {children}
      </div>
    </WishlistProvider>
  );
};

export default layout;
