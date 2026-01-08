import { TileCard } from "@/components/card/TilesCard";
import tileMarble from "@/public/assets/tiles-marble.png"
import { Tile } from "@/types";

const page = () => {
    const tile: Tile = {
    id: 't1',
    name: 'Carrara White Marble',
    images: ["/assets/tiles-marble.png"],
    category: 'hall',
    size: '60x60 cm',
    material: 'Marble',
    finish: 'Polished',
    priceRange: '₹150 - ₹200/sqft',
    minPrice: 150,
    maxPrice: 200,
    city: 'Mumbai',
    stock: 'in-stock',
    status: 'approved',
    dealerId: 'd1',
    dealerName: 'Kumar Tiles & Ceramics',
    description: 'Elegant Carrara white marble tiles with beautiful grey veining. Perfect for living rooms and hallways. Imported from Italy.',
    createdAt: '2024-01-10',
  }
  return (
    <div className="flex items-center justify-center min-h-screen">
      <TileCard key={tile.id} tile={tile} />
    </div>
  );
};

export default page;
