"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Search, ChevronDown, X, Filter } from "lucide-react";
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
import type { Tile } from "@/types";
import { TileCard } from "@/components/card/TilesCard";
import { api } from "@/lib/api";
import { useSearchParams } from "next/navigation";

// Interfaces
interface FilterOption {
  value: string;
  label: string;
  count: number;
}

interface BackendFilters {
  categories: FilterOption[];
  sizes: FilterOption[];
  finishes: FilterOption[];
  applications: FilterOption[];
}

// 1. The main logic moved into a sub-component
const TilesContent = () => {
  const searchParams = useSearchParams();
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  
  const [availableFilters, setAvailableFilters] = useState<BackendFilters | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchFilterMetadata();
    
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (key === "search") setSearchQuery(value);
      else params[key] = value;
    });
    setSelectedFilters(params);
  }, [searchParams]); // Added searchParams to dependency array

  useEffect(() => {
    fetchTiles();
  }, [selectedFilters]);

  const fetchFilterMetadata = async () => {
    try {
      const res = await api.get("/public/filters");
      setAvailableFilters(res.data);
    } catch (err) {
      console.error("Failed to fetch filter metadata:", err);
    }
  };

  const fetchTiles = async (customSearch?: string) => {
    setLoading(true);
    try {
      const params: Record<string, string> = { ...selectedFilters };
      const search = customSearch !== undefined ? customSearch : searchQuery;
      if (search.trim()) params.search = search.trim();

      const res = await api.get("/public/tiles", { params });
      setTiles(Array.isArray(res.data?.tiles) ? res.data.tiles : []);
      setTotalCount(res.data?.totalCount || res.data?.tiles?.length || 0);
    } catch (err) {
      console.error("Failed to fetch tiles:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSelect = (key: string, value: string) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilter = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFilters((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const clearAll = () => {
    setSelectedFilters({});
    setSearchQuery("");
  };

  const renderFilterDropdown = (key: string, label: string, options: FilterOption[]) => {
    const isSelected = !!selectedFilters[key];
    const selectedLabel = options.find(o => o.value === selectedFilters[key])?.label;

    return (
      <DropdownMenu key={key}>
        <DropdownMenuTrigger asChild>
          <Button variant={isSelected ? "default" : "outline"} className="gap-2">
            {isSelected ? selectedLabel : label}
            {isSelected ? (
              <X className="w-3 h-3 ml-1" onClick={(e) => clearFilter(key, e)} />
            ) : (
              <ChevronDown className="w-4 h-4 opacity-50" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Filter by {label}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {options.map((opt) => (
            <DropdownMenuItem 
              key={opt.value} 
              onClick={() => handleFilterSelect(key, opt.value)}
              className="flex justify-between items-center"
            >
              <span>{opt.label}</span>
              <span className="text-xs text-muted-foreground bg-muted px-1.5 rounded">{opt.count}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Browse Collection</h1>
        <p className="text-muted-foreground">
          {loading ? "Searching..." : `Found ${totalCount} premium tiles`}
        </p>
      </div>

      <div className="flex flex-col gap-4 mb-8">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, SKU..."
              className="pl-10 h-11"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchTiles()}
            />
          </div>
          <Button onClick={() => fetchTiles()} className="h-11 px-8">Search</Button>
        </div>

        <div className="flex flex-wrap items-center gap-2 p-2 bg-muted/50 rounded-xl border">
          <div className="p-2 border-r mr-1">
            <Filter className="w-4 h-4 text-muted-foreground" />
          </div>
          
          {availableFilters && (
            <>
              {renderFilterDropdown("category", "Category", availableFilters.categories)}
              {renderFilterDropdown("size", "Size", availableFilters.sizes)}
              {renderFilterDropdown("finish", "Finish", availableFilters.finishes)}
              {renderFilterDropdown("application", "Application", availableFilters.applications)}
            </>
          )}

          {(Object.keys(selectedFilters).length > 0 || searchQuery) && (
            <Button variant="ghost" size="sm" onClick={clearAll} className="text-destructive ml-auto">
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-4/5 bg-muted animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiles.map((tile) => (
            <TileCard key={tile.id} tile={tile} />
          ))}
        </div>
      )}
    </div>
  );
};

// 2. The default export wrapped in Suspense
export default function AllTiles() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-7xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-10 w-48 bg-muted rounded mb-8" />
        <div className="h-12 w-full bg-muted rounded-xl mb-4" />
        <div className="grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-muted rounded-2xl" />
          ))}
        </div>
      </div>
    }>
      <TilesContent />
    </Suspense>
  );
}