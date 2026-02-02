// types/index.ts

export interface Tile {
  id: string;
  name: string;
  sku: string;
  category: string;
  material: string;
  finish: string;
  size: string;
  pricePerSqft: number;
  pricePerBox: number;
  stock: number;
  description?: string;
  pdfUrl?: string;
  isPublished: boolean;
  dealerId: string;
  // NO dealer object - hidden from end users
  images: TileImage[];
  createdAt: string;
  updatedAt: string;
}

export interface TileImage {
  id: string;
  imageUrl: string;
  tileId: string;
  createdAt: string;
}

export interface CartItem {
  id: string;
  cartId: string;
  tileId: string;
  tile: Tile;
  quantityBox: number;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  tileId: string;
  tile: Tile;
  createdAt: string;
}

export interface Booking {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  city: string;
  address?: string;
  quantityBox: number;
  status: "NEW" | "CONTACTED" | "CONFIRMED" | "CANCELLED";
  tileId: string;
  tile: Tile;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  duty?: string;
  lookingFor?: string[];
  referral?: string;
  isOnboarded: boolean;
  createdAt: string;
  updatedAt: string;
}