"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Store,
  Phone,
  Mail,
  MapPin,
  FileText,
  Calendar,
  Package,
  Edit,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";

export default function DealerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const dealerId = params?.id as string;

  const [dealer, setDealer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (dealerId) {
      fetchDealer();
    }
  }, [dealerId]);

  const fetchDealer = async () => {
    try {
      const res = await api.get(`/admin/dealers/${dealerId}`);
      setDealer(res.data);
    } catch (error) {
      console.error("Failed to fetch dealer:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!dealer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Store className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Dealer Not Found</h2>
          <Button onClick={() => router.push("/admin/dealers")}>
            Back to Dealers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => router.push("/admin/dealers")}
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Dealers
          </button>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Store size={32} className="text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{dealer.name}</h1>
                <p className="text-lg text-muted-foreground">{dealer.shopName}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Status Badge */}
        <div className="mb-6">
          <Badge variant={dealer.isActive ? "default" : "secondary"} className="text-sm px-4 py-2">
            {dealer.isActive ? "Active Dealer" : "Inactive"}
          </Badge>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-card border">
            <div className="flex items-center gap-3 mb-2">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Phone</span>
            </div>
            <p className="text-lg font-semibold">{dealer.phone}</p>
          </Card>

          <Card className="p-6 bg-card border">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Email</span>
            </div>
            <p className="text-lg font-semibold">{dealer.email || "—"}</p>
          </Card>

          <Card className="p-6 bg-card border">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Location</span>
            </div>
            <p className="text-lg font-semibold">
              {dealer.city}, {dealer.state}
            </p>
          </Card>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 bg-card border">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Total Tiles</span>
            </div>
            <p className="text-3xl font-bold">{dealer.tiles?.length || 0}</p>
          </Card>

          <Card className="p-6 bg-card border">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Member Since</span>
            </div>
            <p className="text-3xl font-bold">
              {new Date(dealer.createdAt).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </p>
          </Card>
        </div>

        {/* Tiles Inventory */}
        <Card className="p-6 bg-card border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Tiles Inventory</h2>
            <Badge variant="secondary">{dealer.tiles?.length || 0} Products</Badge>
          </div>

          {!dealer.tiles || dealer.tiles.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No tiles registered for this dealer yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {dealer.tiles.map((tile: any) => (
                <Link
                  key={tile.id}
                  href={`/admin/tiles`}
                  className="group block"
                >
                  <Card className="overflow-hidden border hover:shadow-lg transition-all duration-300 bg-card">
                    <div className="relative aspect-square bg-muted">
                      {tile.images?.[0] ? (
                        <Image
                          src={tile.images[0].imageUrl}
                          alt={tile.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="text-xs text-muted-foreground uppercase mb-1">
                        {tile.category?.replace(/_/g, " ")}
                      </div>
                      <h3 className="font-semibold mb-2 line-clamp-2 min-h-[3rem]">
                        {tile.name}
                      </h3>
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div>
                          <div className="text-xl font-bold">
                            ₹{tile.pricePerSqft}
                          </div>
                          <div className="text-xs text-muted-foreground">/sq ft</div>
                        </div>
                        <Badge variant={tile.stock > 0 ? "default" : "secondary"}>
                          {tile.stock} boxes
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}