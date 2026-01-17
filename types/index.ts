export interface Tile {
  id: string;
  name: string;
  images: {
    id: string;
    imageUrl: string;
    createdAt: string;
    tileId: string;
  }[];
  category: TileCategory;
  size: string;
  material: string;
  finish: string;
  priceRange: string;
  minPrice: number;
  maxPrice: number;
  city: string;
  stock: "in-stock" | "limited" | "out-of-stock";
  status: "pending" | "approved" | "rejected";
  dealerId: string;
  dealerName: string;
  description: string;
  pdfUrl?: string;
  pricePerBox: number;
  pricePerSqft: number;
  createdAt: string;
}

export interface Dealer {
  id: string;
  name: string;
  shopName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  logo?: string;
  about: string;
  verified: boolean;
  totalTiles: number;
  approvedTiles: number;
  createdAt: string;
}

export interface User {
  id: string | undefined;
  name: string | undefined;
  email: string | undefined;
  role: "customer" | "dealer" | "admin";
  duty: string | "homeowner" | "designer";
  lookingFor: string[];
  city: string;
  phone: string;
  referral: string;
}

export type TileCategory =
  | "floor"
  | "kitchen"
  | "bathroom"
  | "hall"
  | "outdoor"
  | "wall";
export type TileFinish = "glossy" | "matte" | "satin" | "textured";
export type TileStatus = "pending" | "approved" | "rejected";
export type StockStatus = "in-stock" | "limited" | "out-of-stock";
