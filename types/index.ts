export interface Tile {
  id: string;
  name: string;
  images: string[];
  category: 'kitchen' | 'bathroom' | 'hall' | 'outdoor';
  size: string;
  material: string;
  finish: string;
  priceRange: string;
  minPrice: number;
  maxPrice: number;
  city: string;
  stock: 'in-stock' | 'limited' | 'out-of-stock';
  status: 'pending' | 'approved' | 'rejected';
  dealerId: string;
  dealerName: string;
  description: string;
  pdfUrl?: string;
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
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'dealer' | 'admin';
}

export type TileCategory = 'kitchen' | 'bathroom' | 'hall' | 'outdoor';
export type TileFinish = 'glossy' | 'matte' | 'satin' | 'textured';
export type TileStatus = 'pending' | 'approved' | 'rejected';
export type StockStatus = 'in-stock' | 'limited' | 'out-of-stock';
