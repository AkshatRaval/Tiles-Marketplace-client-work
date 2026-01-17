"use client";

import React, { useState, useEffect } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TILE_FILTERS } from "@/constants/Filters";
import type { Tile } from "@/types";
import { TileCard } from "@/components/card/TilesCard";
import { api } from "@/lib/api";

/**
 * MUST MATCH BACKEND QUERY PARAMS
 */
const FILTER_KEY_MAP: Record<string, string> = {
  Material: "material",
  Finish: "finish",
  Category: "category",
  Size: "size",
};

const AllTiles = () => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>(
    {}
  );

  // Initial load
  useEffect(() => {
    fetchTiles();
  }, []);

  // ======================
  // ✅ SERVER FETCH
  // ======================
  const fetchTiles = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};

      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      Object.entries(selectedFilters).forEach(([category, value]) => {
        const key = FILTER_KEY_MAP[category];
        if (key) params[key] = value;
      });

      const res = await api.get("/admin/tiles", { params });
      setTiles(Array.isArray(res.data?.tiles) ? res.data.tiles : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSelect = (category: string, value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleClearFilter = (category: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFilters((prev) => {
      const copy = { ...prev };
      delete copy[category];
      return copy;
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
    setSearchQuery("");
    fetchTiles();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 mb-6">
      {/* Header */}
      <div className="mb-6 space-y-2">
        <h1 className="text-4xl font-serif font-bold">Browse Tiles</h1>
        <p className="text-muted-foreground">
          Showing {tiles.length} results from verified dealers
        </p>
      </div>

      {/* Search */}
      <div className="w-full mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search tiles by name..."
          className="pl-10 h-12"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-secondary rounded-lg border border-dashed mb-8">
        {(Object.keys(selectedFilters).length > 0 || searchQuery) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-destructive"
          >
            Reset All
          </Button>
        )}

        {Object.entries(TILE_FILTERS).map(([categoryName, items]) => {
          const isSelected = !!selectedFilters[categoryName];
          const selectedValue = selectedFilters[categoryName];

          return (
            <DropdownMenu key={categoryName}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={isSelected ? "secondary" : "outline"}
                  className="h-10 px-4 gap-2 min-w-35"
                >
                  <span className="truncate max-w-25">
                    {isSelected ? selectedValue : categoryName}
                  </span>

                  {isSelected ? (
                    <div
                      role="button"
                      onClick={(e) => handleClearFilter(categoryName, e)}
                      className="p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <ChevronDown className="w-4 h-4 opacity-50" />
                  )}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start" className="w-55">
                <DropdownMenuLabel>Select {categoryName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {items.map((item: string) => (
                  <DropdownMenuItem
                    key={item}
                    onClick={() => handleFilterSelect(categoryName, item)}
                  >
                    {item}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        })}

        {/* ✅ UPDATE BUTTON */}
        <Button
          onClick={fetchTiles}
          className="ml-auto"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </Button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tiles.map((tile) => (
            <TileCard key={tile.id} tile={tile} />
          ))}
        </div>
      )}

      {!loading && tiles.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground">
            No tiles match your filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default AllTiles;
