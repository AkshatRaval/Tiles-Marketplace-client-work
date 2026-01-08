"use client";
import { MapPin, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { Tile } from '@/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface TileCardProps {
  tile: Tile;
  className?: string;
}

export function TileCard({ tile, className }: TileCardProps) {
  const stockColors = {
    'in-stock': 'bg-success/10 text-success border-success/20',
    'limited': 'bg-warning/10 text-warning-foreground border-warning/20',
    'out-of-stock': 'bg-destructive/10 text-destructive border-destructive/20',
  };

  const stockLabels = {
    'in-stock': 'In Stock',
    'limited': 'Limited Stock',
    'out-of-stock': 'Out of Stock',
  };

  return (
    <Link href={`/tiles/${tile.id}`} className='m-0 p-0'>
      <Card className={cn(
        "group p-0 overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer",
        className
      )}>
        <div className="relative aspect-square overflow-hidden">
          <img
            src={tile.images[0]}
            alt={tile.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <Button 
            className="absolute top-3 right-3 p-2 rounded-full bg-card/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Heart className="h-4 w-4 text-foreground" />
          </Button>
          <Badge 
            variant="outline" 
            className={cn(
              "absolute bottom-3 left-3 text-xs font-medium",
              stockColors[tile.stock]
            )}
          >
            {stockLabels[tile.stock]}
          </Badge>
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {tile.name}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{tile.size} • {tile.finish}</p>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-primary">{tile.priceRange}</span>
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <MapPin className="h-3 w-3" />
              <span>{tile.city}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
