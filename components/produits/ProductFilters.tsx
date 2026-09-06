"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, Filter, RotateCcw, Package, DollarSign, Building2, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductFiltersProps {
  categories: { id: string; name: string }[];
  suppliers: { id: string; name: string }[];
}

export function ProductFilters({ categories, suppliers }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = React.useTransition();

  // Local state initialized from URL
  const [search, setSearch] = React.useState(searchParams.get("search") || "");
  const [categoryId, setCategoryId] = React.useState(searchParams.get("categoryId") || "all");
  const [supplierId, setSupplierId] = React.useState(searchParams.get("supplierId") || "all");
  const [stockStatus, setStockStatus] = React.useState(searchParams.get("stockStatus") || "all");
  const [minPrice, setMinPrice] = React.useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = React.useState(searchParams.get("maxPrice") || "");

  // Update URL helper
  const updateUrl = React.useCallback(
    (newParams: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      
      // Reset page to 1 on filter change
      params.set("page", "1");

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === "" || value === "all") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams]
  );

  // Debounced search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== (searchParams.get("search") || "")) {
        updateUrl({ search });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [search, searchParams, updateUrl]);

  const handleReset = () => {
    setSearch("");
    setCategoryId("all");
    setSupplierId("all");
    setStockStatus("all");
    setMinPrice("");
    setMaxPrice("");

    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasActiveFilters =
    search ||
    categoryId !== "all" ||
    supplierId !== "all" ||
    stockStatus !== "all" ||
    minPrice ||
    maxPrice;

  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-sm">
      <CardHeader className="pb-3 border-b border-border/40">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
            <Filter className="h-4 w-4 text-primary" /> Filtres du Catalogue
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Réinitialiser
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-5">
        {/* Search Bar */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground">
            Recherche par Nom / SKU
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Ex: T-Shirt, SKU-001..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs h-9 bg-background/80"
            />
          </div>
        </div>

        {/* Stock Status Filter */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <Package className="h-3.5 w-3.5 text-primary" /> Statut du Stock
          </Label>
          <Select
            value={stockStatus}
            onValueChange={(val) => {
              const value = val || "all";
              setStockStatus(value);
              updateUrl({ stockStatus: value });
            }}
          >
            <SelectTrigger className="h-9 text-xs bg-background/80">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les produits</SelectItem>
              <SelectItem value="in_stock">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> En stock
                </span>
              </SelectItem>
              <SelectItem value="low_stock">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500" /> Stock faible
                </span>
              </SelectItem>
              <SelectItem value="out_of_stock">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-500" /> Rupture de stock
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5 text-primary" /> Catégorie
          </Label>
          <Select
            value={categoryId}
            onValueChange={(val) => {
              const value = val || "all";
              setCategoryId(value);
              updateUrl({ categoryId: value });
            }}
          >
            <SelectTrigger className="h-9 text-xs bg-background/80">
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Supplier Filter */}
        {suppliers && suppliers.length > 0 && (
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-primary" /> Fournisseur
            </Label>
            <Select
              value={supplierId}
              onValueChange={(val) => {
                const value = val || "all";
                setSupplierId(value);
                updateUrl({ supplierId: value });
              }}
            >
              <SelectTrigger className="h-9 text-xs bg-background/80">
                <SelectValue placeholder="Tous les fournisseurs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les fournisseurs</SelectItem>
                {suppliers.map((sup) => (
                  <SelectItem key={sup.id} value={sup.id}>
                    {sup.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Price Range */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-primary" /> Prix (TND / €)
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value);
                updateUrl({ minPrice: e.target.value });
              }}
              className="h-9 text-xs bg-background/80"
            />
            <Input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value);
                updateUrl({ maxPrice: e.target.value });
              }}
              className="h-9 text-xs bg-background/80"
            />
          </div>
        </div>

        {isPending && (
          <div className="text-[11px] text-primary animate-pulse font-medium text-center pt-1">
            Mise à jour du catalogue...
          </div>
        )}
      </CardContent>
    </Card>
  );
}
