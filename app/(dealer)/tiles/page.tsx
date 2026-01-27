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
import { useSearchParams } from "next/navigation";

const FILTER_KEY_MAP: Record<string, string> = {
  Material: "material",
  Finish: "finish",
  Category: "category",
  Size: "size",
};

const AllTiles = () => {
  const searchParams = useSearchParams();
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const urlSearch = searchParams?.get("search");
    const urlCategory = searchParams?.get("category");
    const urlMaterial = searchParams?.get("material");
    const urlFinish = searchParams?.get("finish");
    
    if (urlSearch) setSearchQuery(urlSearch);
     
    const initialFilters: Record<string, string> = {};
    if (urlCategory) initialFilters.Category = urlCategory;
    if (urlMaterial) initialFilters.Material = urlMaterial;
    if (urlFinish) initialFilters.Finish = urlFinish;
    
    if (Object.keys(initialFilters).length > 0) {
      setSelectedFilters(initialFilters);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchTiles();
  }, [selectedFilters]);

  const fetchTiles = async (customSearch?: string) => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      const search = customSearch !== undefined ? customSearch : searchQuery;
      
      if (search.trim()) {
        params.search = search.trim();
      }
      
      Object.entries(selectedFilters).forEach(([category, value]) => {
        const key = FILTER_KEY_MAP[category];
        if (key) params[key] = value;
      });

      const res = await api.get("/public/tiles", { params });
      setTiles(Array.isArray(res.data?.tiles) ? res.data.tiles : []);
      setTotalCount(res.data?.totalCount || res.data?.tiles?.length || 0);
    } catch (err) {
      console.error("Failed to fetch tiles:", err);
      setTiles([]);
      setTotalCount(0);
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
    fetchTiles("");
  };

  const handleSearch = () => {
    fetchTiles();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const activeFilterCount = Object.keys(selectedFilters).length + (searchQuery ? 1 : 0);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 mb-6">
      <div className="mb-6 space-y-2">
        <h1 className="text-4xl font-serif font-bold">Browse Tiles</h1>
        <p className="text-muted-foreground">
          {loading ? "Loading..." : `Showing ${tiles.length} ${totalCount > tiles.length ? `of ${totalCount}` : ""} results`}
        </p>
      </div>

      {/* Search Bar */}
      <div className="w-full mb-4 relative flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search tiles by name, SKU, or description..."
            className="pl-10 h-12"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <Button
          onClick={handleSearch}
          className="h-12 px-6"
          disabled={loading}
        >
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-muted rounded-lg border mb-8">
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-destructive hover:text-destructive"
          >
            <X className="w-4 h-4 mr-1" />
            Clear All ({activeFilterCount})
          </Button>
        )}
        
        {Object.entries(TILE_FILTERS).map(([categoryName, items]) => {
          const isSelected = !!selectedFilters[categoryName];
          const selectedValue = selectedFilters[categoryName];
          
          return (
            <DropdownMenu key={categoryName}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={isSelected ? "default" : "outline"}
                  className="h-10 px-4 gap-2 min-w-30"
                >
                  <span className="truncate max-w-25">
                    {isSelected ? selectedValue : categoryName}
                  </span>

                  {isSelected ? (
                    <div
                      role="button"
                      onClick={(e) => handleClearFilter(categoryName, e)}
                      className="p-0.5 hover:bg-primary-foreground/20 rounded"
                    >
                      <X className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <ChevronDown className="w-4 h-4 opacity-50" />
                  )}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start" className="w-50">
                <DropdownMenuLabel>Select {categoryName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {items.map((item: string) => (
                  <DropdownMenuItem
                    key={item}
                    onClick={() => handleFilterSelect(categoryName, item)}
                    className={selectedValue === item ? "bg-muted" : ""}
                  >
                    {item}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        })}
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      ) : tiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tiles.map((tile) => (
            <TileCard key={tile.id} tile={tile} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="mb-4">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No tiles found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery || activeFilterCount > 0 
              ? "Try adjusting your search or filters"
              : "No tiles available at the moment"}
          </p>
          {activeFilterCount > 0 && (
            <Button onClick={clearAllFilters} variant="outline">
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default AllTiles;