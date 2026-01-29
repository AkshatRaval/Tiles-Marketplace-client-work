"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  MoreVertical,
  Search,
  Eye,
  Pencil,
  Trash2,
  Store,
  Phone,
  Mail,
  MapPin,
  FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";

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
import { api } from "@/lib/api";

const AdminDealers = () => {
  const router = useRouter();
  const [dealers, setDealers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [formdata, setFormdata] = useState({
    name: "",
    shopName: "",
    phone: "",
    email: "",
    city: "",
    state: "",
    country: "India",
    isActive: true,
  });

  useEffect(() => {
    fetchDealers();
  }, []);

  const fetchDealers = async () => {
    try {
      const res = await fetch("/api/admin/dealers");
      const data = await res.json();
      setDealers(Array.isArray(data.dealers) ? data.dealers : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (name: string, value: any) => {
    setFormdata((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddDealer = async () => {
    setLoading(true);
    try {
      const payload = {
        name: formdata.name || "NOTDEFINED",
        shopName: formdata.shopName || "NOTDEFINED",
        phone: formdata.phone || "NOTDEFINED",
        email: formdata.email || "",
        city: formdata.city || "NOTDEFINED",
        state: formdata.state || "NOTDEFINED",
        country: formdata.country || "India",
        isActive: formdata.isActive,
      };

      await api.post("/admin/dealers", payload);
      fetchDealers();
      alert("Dealer created successfully");
      
      setFormdata({
        name: "",
        shopName: "",
        phone: "",
        email: "",
        city: "",
        state: "",
        country: "India",
        isActive: true,
      });
    } catch (e) {
      console.error(e);
      alert("Failed to create dealer");
    } finally {
      setLoading(false);
    }
  };

  const filteredDealers = dealers.filter((dealer) =>
    dealer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dealer.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dealer.phone.includes(searchTerm) ||
    dealer.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dealer.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-8 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase">Dealers Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage dealer accounts and partnerships
          </p>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button className="gap-2">
              <Plus size={18} /> Add Dealer
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-full sm:max-w-xl p-0">
            <div className="flex flex-col h-full bg-background">
              <div className="p-8 border-b bg-muted/40">
                <SheetTitle className="text-3xl font-black uppercase tracking-tight">
                  Add New Dealer
                </SheetTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Register a new dealer partner in the system
                </p>
              </div>

              <form className="flex-1 overflow-y-auto p-8 space-y-10">
                <section className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                    Dealer Information
                  </h3>

                  <div className="space-y-2">
                    <Label>Owner Name *</Label>
                    <Input
                      placeholder="e.g. Rajesh Kumar"
                      value={formdata.name}
                      onChange={(e) => updateField("name", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Shop Name *</Label>
                    <Input
                      placeholder="e.g. Kumar Tiles & Ceramics"
                      value={formdata.shopName}
                      onChange={(e) => updateField("shopName", e.target.value)}
                    />
                  </div>
                </section>

                <section className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                    Contact Details
                  </h3>

                  <div className="space-y-2">
                    <Label>Phone Number *</Label>
                    <Input
                      placeholder="e.g. +91 98765 43210"
                      value={formdata.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email (Optional)</Label>
                    <Input
                      type="email"
                      placeholder="e.g. dealer@example.com"
                      value={formdata.email}
                      onChange={(e) => updateField("email", e.target.value)}
                    />
                  </div>
                </section>

                <section className="space-y-6 pb-10">
                  <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                    Location
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>City *</Label>
                      <Input
                        placeholder="e.g. Mumbai"
                        value={formdata.city}
                        onChange={(e) => updateField("city", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>State *</Label>
                      <Select
                        value={formdata.state}
                        onValueChange={(v) => updateField("state", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
                          <SelectItem value="Gujarat">Gujarat</SelectItem>
                          <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                          <SelectItem value="Karnataka">Karnataka</SelectItem>
                          <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                          {/* Add other states */}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input
                      placeholder="India"
                      value={formdata.country}
                      onChange={(e) => updateField("country", e.target.value)}
                      disabled
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formdata.isActive}
                      onChange={(e) => updateField("isActive", e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <Label htmlFor="isActive" className="cursor-pointer">
                      Active Dealer (can access system)
                    </Label>
                  </div>
                </section>
              </form>

              <div className="p-6 border-t bg-background flex gap-4">
                <SheetClose asChild>
                  <Button variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </SheetClose>

                <Button
                  className={`flex-2 ${loading ? "bg-primary/90" : "bg-primary"}`}
                  onClick={handleAddDealer}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span>Creating...</span>
                    </div>
                  ) : (
                    "Create Dealer"
                  )}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* SEARCH BAR */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search dealers by name, shop, phone, or location..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Badge variant="secondary" className="px-4 py-2">
          {filteredDealers.length} Dealers
        </Badge>
      </div>

      {/* TABLE */}
      <div className="bg-card rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dealer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Tiles</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredDealers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {searchTerm ? "No dealers found matching your search" : "No dealers yet"}
                </TableCell>
              </TableRow>
            ) : (
              filteredDealers.map((dealer) => (
                <TableRow
                  key={dealer.id}
                  className="hover:bg-muted cursor-pointer"
                  onClick={() => router.push(`/admin/dealers/${dealer.id}`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Store size={18} className="text-primary" />
                      </div>
                      <div>
                        <div className="font-bold">{dealer.name}</div>
                        <div className="text-xs opacity-50">{dealer.shopName}</div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2 opacity-70">
                        <Phone size={14} />
                        {dealer.phone}
                      </div>
                      {dealer.email && (
                        <div className="flex items-center gap-2 opacity-70">
                          <Mail size={14} />
                          {dealer.email}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2 text-sm opacity-70">
                      <MapPin size={14} />
                      {dealer.city}, {dealer.state}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline">
                      {dealer._count?.tiles || 0} tiles
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge variant={dealer.isActive ? "default" : "secondary"}>
                      {dealer.isActive ? "Active" : "Inactive"}
                    </Badge>
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
                        <DropdownMenuItem onClick={() => router.push(`/admin/dealers/${dealer.id}`)}>
                          <Eye size={14} className="mr-2" /> View Details
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminDealers;