"use client";

import React, { useState, useMemo } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Or your InputGroup if preferred
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { TILE_FILTERS } from "@/constants/Filters";
import type { Tile } from "@/types/index";
// --- Mock Data ---
const MOCK_TILES_DATA: Tile[] = [];

const AllTiles = () => {
  // --- State ---
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});

  // --- Handlers ---
  const handleFilterSelect = (category: string, value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleClearFilter = (category: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Stop dropdown from toggling
    const newFilters = { ...selectedFilters };
    delete newFilters[category];
    setSelectedFilters(newFilters);
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
    setSearchQuery("");
  };

  // --- Filter Logic ---
  // const filteredTiles = useMemo(() => {
  //   return MOCK_TILES_DATA.filter((tile) => {
  //     // 1. Search Check
  //     const matchesSearch = tile.name.toLowerCase().includes(searchQuery.toLowerCase());

  //     // 2. Dropdown Filter Check
  //     const matchesFilters = Object.entries(selectedFilters).every(([key, value]) => {
  //       return tile[key] === value;
  //     });

  //     return matchesSearch && matchesFilters;
  //   });
  // }, [searchQuery, selectedFilters]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 mb-6">
      {/* Header */}
      <div className="mb-6 space-y-2">
        <h1 className="text-4xl font-serif font-bold text-foreground tracking-tight">
          Browse Tiles
        </h1>
        <p className="text-muted-foreground text-base">
          Showing 100 results from verified dealers 
        </p>
      </div>

      {/* Search Bar */}
      <div className="w-full mb-4 relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search tiles by name..."
            className="pl-10 h-12 text-base shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-secondary rounded-lg border border-dashed">
        
        {/* Reset All Button */}
        {(Object.keys(selectedFilters).length > 0 || searchQuery) && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters} 
            className="text-destructive hover:text-destructive hover:bg-red-50"
          >
            Reset All
          </Button>
        )}

        {/* Dynamic Filters Loop */}
        {Object.entries(TILE_FILTERS).map(([categoryName, items]) => {
          const isSelected = !!selectedFilters[categoryName];
          const selectedValue = selectedFilters[categoryName];

          return (
            <DropdownMenu key={categoryName}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={isSelected ? "secondary" : "outline"}
                  className={`h-10 px-4 rounded-md font-normal text-sm flex items-center justify-between gap-2 min-w-35 ${
                    isSelected ? "border-primary/20 bg-primary/5" : "border-input bg-background"
                  }`}
                >
                  <span className="truncate max-w-25">
                    {isSelected ? selectedValue : categoryName}
                  </span>
                  
                  {isSelected ? (
                    <div
                      role="button"
                      onClick={(e) => handleClearFilter(categoryName, e)}
                      className="hover:bg-background rounded-full p-0.5"
                    >
                      <X className="w-3.5 h-3.5 opacity-70" />
                    </div>
                  ) : (
                    <ChevronDown className="w-4 h-4 opacity-50" />
                  )}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start" className="w-55">
                <DropdownMenuLabel>Select {categoryName}</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <div className="max-h-75 overflow-y-auto">
                  {items.map((item: string) => (
                    <DropdownMenuItem
                      key={item}
                      className="cursor-pointer flex justify-between"
                      onClick={() => handleFilterSelect(categoryName, item)}
                    >
                      {item}
                      {selectedValue === item && <span className="text-primary text-xs">✓</span>}
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        })}
      </div>
    </div>
  );
};

export default AllTiles;