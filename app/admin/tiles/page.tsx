"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  MoreVertical,
  Search,
  UploadCloud,
  FileText,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import Image from "next/image";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

async function uploadToCloudinary(file: File, type: "image" | "raw") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "tiles");

  const endpoint =
    type === "image"
      ? `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
      : `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`;

  const res = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Cloudinary upload failed");

  const data = await res.json();
  return data.secure_url as string;
}

const AdminTiles = () => {
  const [tiles, setTiles] = useState<any[]>([]);
  const [selectedTile, setSelectedTile] = useState<any | null>(null);
  const [editingTile, setEditingTile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<{
    category?: string;
    material?: string;
    finish?: string;
    size?: string;
  }>({});

  // ✅ NEW: Dealers state
  const [dealers, setDealers] = useState<any[]>([]);

  /* ✅ NEW: FILE STATES (NO UPLOAD HERE) */
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null);

  const [fileNames, setFileNames] = useState({ photos: "", pdf: "" });

  const [formdata, setFormdata] = useState({
    name: "",
    sku: "",
    category: "",
    material: "",
    size: "",
    finish: "",
    pricePerSqft: "",
    pricePerBox: "",
    stock: "",
    dealerId: "",
    description: "",
    imageUrls: [] as string[],
    pdfUrl: "",
  });

  useEffect(() => {
    fetchTiles();
    fetchDealers();
  }, []);

  const fetchTiles = async (
    overrides?: Partial<{
      search: string;
      category: string;
      material: string;
      finish: string;
      size: string;
    }>,
  ) => {
    try {
      const params: Record<string, string> = {};

      const effectiveSearch =
        overrides?.search !== undefined ? overrides.search : search;
      if (effectiveSearch.trim()) {
        params.search = effectiveSearch.trim();
      }

      const effectiveFilters = {
        ...filters,
        ...overrides,
      };

      if (effectiveFilters.material) params.material = effectiveFilters.material;
      if (effectiveFilters.finish) params.finish = effectiveFilters.finish;
      if (effectiveFilters.category)
        params.category = effectiveFilters.category;
      if (effectiveFilters.size) params.size = effectiveFilters.size;

      const res = await api.get("/admin/tiles", { params });
      const data = await res.data;
      setTiles(Array.isArray(data.tiles) ? data.tiles : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Fetch dealers for dropdown
  const fetchDealers = async () => {
    try {
      const res = await api.get("/admin/dealers?simple=true");
      const data = await res.data;
      setDealers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to fetch dealers:", e);
    }
  };

  const updateField = (name: string, value: any) => {
    setFormdata((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= FILE SELECT (NO UPLOAD) ================= */

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "photos" | "pdf",
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (type === "photos") {
      const images = Array.from(files);
      setSelectedImages(images);
      setFileNames((p) => ({
        ...p,
        photos: `${images.length} images selected`,
      }));
    } else {
      setSelectedPdf(files[0]);
      setFileNames((p) => ({
        ...p,
        pdf: files[0].name,
      }));
    }
  };

  /* ================= SUBMIT = UPLOAD ================= */

  const handleAddTile = async () => {
    setLoading(true);
    try {
      if (!selectedImages.length) {
        alert("Please select at least one image");
        return;
      }

      // 1️⃣ Upload images
      const imageUrls = await Promise.all(
        selectedImages.map((file) => uploadToCloudinary(file, "image")),
      );

      // 2️⃣ Upload PDF (optional)
      let pdfUrl = "";
      if (selectedPdf) {
        pdfUrl = await uploadToCloudinary(selectedPdf, "raw");
      }

      // 3️⃣ Send to backend
      const payload = {
        name: formdata.name || "NOTDEFINED",
        sku: formdata.sku || "NOTDEFINED",
        category: formdata.category.toUpperCase() || "NOTDEFINED",
        material: formdata.material || "NOTDEFINED",
        size: formdata.size || "NOTDEFINED",
        finish: formdata.finish.toUpperCase(),
        pricePerSqft: Number(formdata.pricePerSqft) || 0.0,
        pricePerBox: Number(formdata.pricePerBox) || 0.0,
        stock: Number(formdata.stock) || 0.0,
        description: formdata.description || "NOTDEFINED",
        dealerId: formdata.dealerId || "",
        imageUrls,
        pdfUrl,
      };

      await api.post("/admin/tiles", payload);
      fetchTiles();
      alert("Tile created");
    } catch (e) {
      console.error(e);
      alert("Failed to create tile");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchTiles({ search });
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    const updated = {
      ...filters,
      [key]: value,
    };
    setFilters(updated);
    fetchTiles({ [key]: value });
  };

  const openEdit = (tile: any) => {
    setEditingTile({
      ...tile,
      pricePerSqft: tile.pricePerSqft?.toString() ?? "",
      pricePerBox: tile.pricePerBox?.toString() ?? "",
      stock: tile.stock?.toString() ?? "",
    });
  };

  const handleUpdateTile = async () => {
    if (!editingTile) return;
    setLoading(true);
    try {
      await api.patch(`/admin/tiles/${editingTile.id}`, {
        name: editingTile.name,
        sku: editingTile.sku,
        category: editingTile.category,
        material: editingTile.material,
        size: editingTile.size,
        finish: editingTile.finish,
        pricePerSqft: editingTile.pricePerSqft,
        pricePerBox: editingTile.pricePerBox,
        stock: editingTile.stock,
        description: editingTile.description,
        dealerId: editingTile.dealerId || editingTile.dealer?.id,
      });
      await fetchTiles();
      setEditingTile(null);
      alert("Tile updated");
    } catch (e) {
      console.error(e);
      alert("Failed to update tile");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTile = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tile?")) return;
    setLoading(true);
    try {
      await api.delete(`/admin/tiles/${id}`);
      await fetchTiles();
      if (selectedTile?.id === id) setSelectedTile(null);
      alert("Tile deleted");
    } catch (e) {
      console.error(e);
      alert("Failed to delete tile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase">Tiles Inventory</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage products, pricing and availability
          </p>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button className="gap-2">
              <Plus size={18} /> Add Tile
            </Button>
          </SheetTrigger>

          {/* ===================== ADD TILE SHEET ===================== */}
          <SheetContent side="right" className="w-full sm:max-w-xl p-0">
            <div className="flex flex-col h-full bg-background">
              {/* ================= HEADER ================= */}
              <div className="p-8 border-b bg-muted/40">
                <SheetTitle className="text-3xl font-black uppercase tracking-tight">
                  Add New Tile
                </SheetTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Create and publish a new tile product to inventory
                </p>
              </div>

              {/* ================= FORM ================= */}
              <form className="flex-1 overflow-y-auto p-8 space-y-10">
                {/* ===== MEDIA ===== */}
                <section className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                    Media & Documents
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="group border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition">
                      <UploadCloud className="mb-2 opacity-60 group-hover:text-primary" />
                      <span className="text-xs font-semibold text-center">
                        {fileNames.photos || "Upload Tile Images"}
                      </span>
                      <input
                        type="file"
                        multiple
                        hidden
                        onChange={(e) => handleFileChange(e, "photos")}
                      />
                    </label>

                    <label className="group border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition">
                      <FileText className="mb-2 opacity-60 group-hover:text-primary" />
                      <span className="text-xs font-semibold text-center truncate">
                        {fileNames.pdf || "Upload Technical PDF"}
                      </span>
                      <input
                        type="file"
                        hidden
                        accept=".pdf"
                        onChange={(e) => handleFileChange(e, "pdf")}
                      />
                    </label>
                  </div>
                </section>

                {/* ===== BASIC INFO ===== */}
                <section className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                    Basic Information
                  </h3>

                  <div className="space-y-2">
                    <Label>Product Name</Label>
                    <Input
                      placeholder="e.g. Carrara White Marble"
                      onChange={(e) => updateField("name", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>SKU</Label>
                    <Input
                      placeholder="Unique internal product code"
                      onChange={(e) => updateField("sku", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Finish, texture, use-cases, etc."
                      className="min-h-30"
                      onChange={(e) =>
                        updateField("description", e.target.value)
                      }
                    />
                  </div>
                </section>

                {/* ===== CLASSIFICATION ===== */}
                <section className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                    Classification
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select onValueChange={(v) => updateField("category", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="floor">Floor</SelectItem>
                          <SelectItem value="wall">Wall</SelectItem>
                          <SelectItem value="bathroom">Bathroom</SelectItem>
                          <SelectItem value="kitchen">Kitchen</SelectItem>
                          <SelectItem value="outdoor">Outdoor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Finish Type</Label>
                      <Select onValueChange={(v) => updateField("finish", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select finish" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="glossy">Glossy</SelectItem>
                          <SelectItem value="matte">Matte</SelectItem>
                          <SelectItem value="satin">Satin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* ✅ CHANGED: Tile Size - Now using Select */}
                    <div className="space-y-2">
                      <Label>Tile Size</Label>
                      <Select onValueChange={(v) => updateField("size", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="600x600">600x600</SelectItem>
                          <SelectItem value="600x1200">600x1200</SelectItem>
                          <SelectItem value="800x800">800x800</SelectItem>
                          <SelectItem value="800x1600">800x1600</SelectItem>
                          <SelectItem value="1000x1000">1000x1000</SelectItem>
                          <SelectItem value="300x600">300x600</SelectItem>
                          <SelectItem value="400x400">400x400</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* ✅ CHANGED: Material - Now using Select */}
                    <div className="space-y-2">
                      <Label>Material</Label>
                      <Select onValueChange={(v) => updateField("material", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select material" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Porcelain">Porcelain</SelectItem>
                          <SelectItem value="Ceramic">Ceramic</SelectItem>
                          <SelectItem value="Vitrified">Vitrified</SelectItem>
                          <SelectItem value="Marble">Marble</SelectItem>
                          <SelectItem value="Granite">Granite</SelectItem>
                          <SelectItem value="Natural Stone">
                            Natural Stone
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </section>

                {/* ===== PRICING ===== */}
                <section className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                    Pricing
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Price per Sqft (₹)</Label>
                      <Input
                        type="number"
                        placeholder="e.g. 120"
                        onChange={(e) =>
                          updateField("pricePerSqft", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Price per Box (₹)</Label>
                      <Input
                        type="number"
                        placeholder="e.g. 1500"
                        onChange={(e) =>
                          updateField("pricePerBox", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </section>

                {/* ===== INVENTORY & DEALER ===== */}
                <section className="space-y-6 pb-10">
                  <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                    Inventory & Dealer
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Stock (Boxes)</Label>
                      <Input
                        type="number"
                        placeholder="Available quantity"
                        onChange={(e) => updateField("stock", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Dealer</Label>
                      <Select onValueChange={(v) => updateField("dealerId", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select dealer" />
                        </SelectTrigger>
                        <SelectContent>
                          {dealers.length === 0 ? (
                            <SelectItem value="none" disabled>
                              No dealers available
                            </SelectItem>
                          ) : (
                            dealers.map((dealer) => (
                              <SelectItem key={dealer.id} value={dealer.id}>
                                {dealer.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </section>
              </form>

              {/* ================= FOOTER ================= */}
              <div className="p-6 border-t bg-background flex gap-4">
                <SheetClose asChild>
                  <Button variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </SheetClose>

                <Button
                  className={`flex-2 ${loading ? "bg-primary/90" : "bg-primary"}`}
                  onClick={handleAddTile}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span>Creating...</span>
                    </div>
                  ) : (
                    "Create Tile"
                  )}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* SEARCH + FILTERS */}
      <div className="bg-card border rounded-xl p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 flex items-center gap-3">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search by name or SKU..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} disabled={loading}>
            <Search size={16} className="mr-2" />
            Search
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select
            onValueChange={(v) => handleFilterChange("category", v)}
            value={filters.category}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FLOOR">Floor</SelectItem>
              <SelectItem value="WALL">Wall</SelectItem>
              <SelectItem value="BATHROOM">Bathroom</SelectItem>
              <SelectItem value="KITCHEN">Kitchen</SelectItem>
              <SelectItem value="OUTDOOR">Outdoor</SelectItem>
            </SelectContent>
          </Select>

          <Select
            onValueChange={(v) => handleFilterChange("finish", v)}
            value={filters.finish}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Finish" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GLOSSY">Glossy</SelectItem>
              <SelectItem value="MATTE">Matte</SelectItem>
              <SelectItem value="SATIN">Satin</SelectItem>
            </SelectContent>
          </Select>

          <Select
            onValueChange={(v) => handleFilterChange("size", v)}
            value={filters.size}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="600x600">600x600</SelectItem>
              <SelectItem value="600x1200">600x1200</SelectItem>
              <SelectItem value="800x800">800x800</SelectItem>
              <SelectItem value="800x1600">800x1600</SelectItem>
              <SelectItem value="1000x1000">1000x1000</SelectItem>
              <SelectItem value="300x600">300x600</SelectItem>
              <SelectItem value="400x400">400x400</SelectItem>
            </SelectContent>
          </Select>

          <Select
            onValueChange={(v) => handleFilterChange("material", v)}
            value={filters.material}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Material" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Porcelain">Porcelain</SelectItem>
              <SelectItem value="Ceramic">Ceramic</SelectItem>
              <SelectItem value="Vitrified">Vitrified</SelectItem>
              <SelectItem value="Marble">Marble</SelectItem>
              <SelectItem value="Granite">Granite</SelectItem>
              <SelectItem value="Natural Stone">Natural Stone</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* GRID OF TILE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tiles.map((tile) => (
          <div
            key={tile.id}
            className="bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer flex flex-col"
            onClick={() => setSelectedTile(tile)}
          >
            <div className="relative w-full aspect-square bg-muted">
              {tile.images?.[0]?.imageUrl ? (
                <Image
                  src={tile.images[0].imageUrl}
                  alt={tile.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <UploadCloud className="w-8 h-8" />
                </div>
              )}
              <div className="absolute top-2 left-2">
                <Badge className="text-[10px] uppercase">
                  {tile.category?.toString().replace(/_/g, " ")}
                </Badge>
              </div>
              <div className="absolute top-2 right-2 flex gap-1">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEdit(tile);
                  }}
                >
                  <Pencil size={14} />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTile(tile.id);
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold line-clamp-2">{tile.name}</h3>
                  <p className="text-xs text-muted-foreground">SKU: {tile.sku}</p>
                </div>
              </div>

              <div className="text-xs text-muted-foreground flex flex-wrap gap-2">
                <span>{tile.size}</span>
                <span>•</span>
                <span>{tile.material}</span>
                <span>•</span>
                <span>{tile.finish}</span>
              </div>

              <div className="flex items-center justify-between mt-2">
                <div>
                  <div className="text-lg font-bold">
                    ₹{tile.pricePerSqft}
                    <span className="text-xs text-muted-foreground"> /sqft</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ₹{tile.pricePerBox} /box
                  </div>
                </div>
                <Badge variant={tile.stock > 0 ? "default" : "secondary"}>
                  {tile.stock} boxes
                </Badge>
              </div>

              <div className="mt-2 text-xs text-muted-foreground">
                Dealer: {tile.dealer?.name || "—"}
              </div>
            </div>
          </div>
        ))}

        {tiles.length === 0 && !loading && (
          <div className="col-span-full text-center text-muted-foreground py-12">
            No tiles found for current filters.
          </div>
        )}
      </div>

      {/* ===================== DETAILS DIALOG ===================== */}
      <Dialog open={!!selectedTile} onOpenChange={() => setSelectedTile(null)}>
        <DialogContent className="max-w-2xl">
          {selectedTile && (
            <>
              <DialogHeader>
                <DialogTitle className="uppercase font-black">
                  {selectedTile.name}
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-6 text-sm mt-4">
                <div>
                  <b>SKU:</b> {selectedTile.sku}
                </div>
                <div>
                  <b>Category:</b>{" "}
                  {selectedTile.category?.toString().replace(/_/g, " ")}
                </div>
                <div>
                  <b>Size:</b> {selectedTile.size}
                </div>
                <div>
                  <b>Finish:</b> {selectedTile.finish}
                </div>
                <div>
                  <b>Price:</b> ₹{selectedTile.pricePerSqft}/sqft
                </div>
                <div>
                  <b>Stock:</b> {selectedTile.stock} boxes
                </div>
                <div>
                  <b>Dealer:</b> {selectedTile.dealer?.name || "—"}
                </div>
                <div>
                  <b>Created:</b>{" "}
                  {new Date(selectedTile.createdAt).toLocaleDateString()}
                </div>
                <div className="col-span-2">
                  <b>Description</b>
                  <p className="opacity-70">
                    {selectedTile.description || "—"}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* EDIT TILE DIALOG */}
      <Dialog open={!!editingTile} onOpenChange={() => setEditingTile(null)}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          {editingTile && (
            <>
              <DialogHeader>
                <DialogTitle className="font-black uppercase">
                  Edit Tile
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={editingTile.name}
                    onChange={(e) =>
                      setEditingTile({ ...editingTile, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>SKU</Label>
                  <Input
                    value={editingTile.sku}
                    onChange={(e) =>
                      setEditingTile({ ...editingTile, sku: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input
                      value={editingTile.category}
                      onChange={(e) =>
                        setEditingTile({
                          ...editingTile,
                          category: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Finish</Label>
                    <Input
                      value={editingTile.finish}
                      onChange={(e) =>
                        setEditingTile({
                          ...editingTile,
                          finish: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Size</Label>
                    <Input
                      value={editingTile.size}
                      onChange={(e) =>
                        setEditingTile({
                          ...editingTile,
                          size: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Material</Label>
                    <Input
                      value={editingTile.material}
                      onChange={(e) =>
                        setEditingTile({
                          ...editingTile,
                          material: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price per Sqft (₹)</Label>
                    <Input
                      type="number"
                      value={editingTile.pricePerSqft}
                      onChange={(e) =>
                        setEditingTile({
                          ...editingTile,
                          pricePerSqft: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price per Box (₹)</Label>
                    <Input
                      type="number"
                      value={editingTile.pricePerBox}
                      onChange={(e) =>
                        setEditingTile({
                          ...editingTile,
                          pricePerBox: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Stock (boxes)</Label>
                    <Input
                      type="number"
                      value={editingTile.stock}
                      onChange={(e) =>
                        setEditingTile({
                          ...editingTile,
                          stock: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Dealer</Label>
                    <Select
                      value={editingTile.dealerId || editingTile.dealer?.id}
                      onValueChange={(v) =>
                        setEditingTile({
                          ...editingTile,
                          dealerId: v,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select dealer" />
                      </SelectTrigger>
                      <SelectContent>
                        {dealers.map((dealer) => (
                          <SelectItem key={dealer.id} value={dealer.id}>
                            {dealer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={editingTile.description || ""}
                    onChange={(e) =>
                      setEditingTile({
                        ...editingTile,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditingTile(null)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateTile} disabled={loading}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTiles;
