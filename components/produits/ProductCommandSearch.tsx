"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Package, ArrowRight, QrCode } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { EnrichedProductItem } from "./ProductCard";

interface ProductCommandSearchProps {
  products: EnrichedProductItem[];
}

export function ProductCommandSearch({ products }: ProductCommandSearchProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (productId: string) => {
    setOpen(false);
    router.push(`/dashboard/produits/${productId}`);
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="relative h-9 w-full sm:w-64 justify-start text-xs text-muted-foreground bg-muted/30 border-border/60 hover:bg-muted/60"
      >
        <Search className="mr-2 h-3.5 w-3.5" />
        <span>Recherche rapide...</span>
        <kbd className="pointer-events-none absolute right-2 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Rechercher par nom, SKU ou référence..." />
        <CommandList className="max-h-[350px]">
          <CommandEmpty>Aucun produit correspondant trouvé.</CommandEmpty>
          <CommandGroup heading="Produits du Catalogue">
            {products.map((product) => (
              <CommandItem
                key={product.id}
                value={`${product.name} ${product.sku} ${product.category?.name || ""}`}
                onSelect={() => handleSelect(product.id)}
                className="flex items-center justify-between p-2 text-xs cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded overflow-hidden bg-muted shrink-0 border border-border/40">
                    <img
                      src={product.mainImageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60";
                      }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground">{product.name}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      SKU: {product.sku} • {product.category?.name || "Sans catégorie"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-xs text-primary">
                    {parseFloat(product.price).toLocaleString("fr-FR")} TND
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
