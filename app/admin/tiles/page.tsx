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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

const AdminTiles = () => {
  const [tiles, setTiles] = useState<any[]>([]);
  const [selectedTile, setSelectedTile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

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
  }, []);

  const fetchTiles = async () => {
    try {
      const res = await fetch("/api/admin/tiles");
      const data = await res.json();
      setTiles(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (name: string, value: any) => {
    setFormdata((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "photos" | "pdf"
  ) => {
    const files = e.target.files;
    if (!files) return;

    if (type === "photos") {
      const urls = Array.from(files).map((f) => URL.createObjectURL(f));
      updateField("imageUrls", urls);
      setFileNames({ ...fileNames, photos: `${files.length} images selected` });
    } else {
      updateField("pdfUrl", URL.createObjectURL(files[0]));
      setFileNames({ ...fileNames, pdf: files[0].name });
    }
  };

  const handleAddTile = async () => {
    try {
      const payload = {
        name: formdata.name,
        sku: formdata.sku,
        category: formdata.category.toUpperCase(),
        material: formdata.material,
        size: formdata.size,
        finish: formdata.finish.toUpperCase(),
        pricePerSqft: Number(formdata.pricePerSqft),
        pricePerBox: Number(formdata.pricePerBox),
        stock: Number(formdata.stock),
        description: formdata.description,
        dealerId: formdata.dealerId,
        imageUrls: formdata.imageUrls,
        pdfUrl: formdata.pdfUrl,
      };

      await api.post("/admin/tiles", payload);
      fetchTiles();
      alert("Tile created");
    } catch (e) {
      alert("Failed to create tile");
    }
  };

  return (
    <div className="min-h-screen bg-background p-8 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black uppercase">Tiles Inventory</h1>

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
                      className="min-h-[120px]"
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
                    <div className="space-y-2">
                      <Label>Tile Size</Label>
                      <Input
                        placeholder="600x600, 600x1200"
                        onChange={(e) => updateField("size", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Material</Label>
                      <Input
                        placeholder="Porcelain, Ceramic, Vitrified"
                        onChange={(e) =>
                          updateField("material", e.target.value)
                        }
                      />
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
                      <Label>Dealer ID</Label>
                      <Input
                        placeholder="Dealer reference UUID"
                        onChange={(e) =>
                          updateField("dealerId", e.target.value)
                        }
                      />
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
                  className="flex-1 font-black uppercase"
                  onClick={handleAddTile}
                >
                  Create Tile
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* ===================== TABLE ===================== */}
      <div className="bg-card rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tile</TableHead>
              <TableHead>Specs</TableHead>
              <TableHead>Pricing</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Dealer</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tiles.map((tile) => (
              <TableRow
                key={tile.id}
                className="hover:bg-muted cursor-pointer"
                onClick={() => setSelectedTile(tile)}
              >
                <TableCell>
                  <div className="font-bold">{tile.name}</div>
                  <div className="text-xs opacity-50">{tile.sku}</div>
                </TableCell>

                <TableCell className="text-sm opacity-70">
                  {tile.size} • {tile.material} • {tile.finish}
                </TableCell>

                <TableCell>
                  ₹{tile.pricePerSqft}/sqft
                  <div className="text-xs opacity-50">
                    ₹{tile.pricePerBox}/box
                  </div>
                </TableCell>

                <TableCell>
                  <Badge>{tile.stock} boxes</Badge>
                </TableCell>

                <TableCell className="text-xs opacity-50">
                  {tile.dealerId}
                </TableCell>

                <TableCell
                  className="text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreVertical size={18} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedTile(tile)}>
                        <Eye size={14} className="mr-2" /> View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Pencil size={14} className="mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 size={14} className="mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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

              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <b>SKU:</b> {selectedTile.sku}
                </div>
                <div>
                  <b>Category:</b> {selectedTile.category}
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
    </div>
  );
};

export default AdminTiles;
