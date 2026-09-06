"use client";

import * as React from "react";
import { ShoppingBag, Check, Layers, PackageCheck, PackageX, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";

export interface PublicProduct {
  id: string;
  name: string;
  sku: string;
  price: string;
  description?: string | null;
  mainImageUrl: string;
  totalStock: number;
  stockStatus: "in_stock" | "low_stock" | "out_of_stock";
  category?: { name: string } | null;
  variants?: Array<{ id: string; name: string; sku: string; price?: string | null }>;
}

export function PublicProductGrid({ products }: { products: PublicProduct[] }) {
  const { addItem, setIsOpen } = useCart();
  const [addedId, setAddedId] = React.useState<string | null>(null);

  const handleAddToCart = (product: PublicProduct) => {
    if (product.totalStock === 0) {
      toast.error("Ce produit est actuellement en rupture de stock.");
      return;
    }

    const firstVariant = product.variants?.[0];
    const variantId = firstVariant?.id || product.id;
    const priceNum = firstVariant?.price ? parseFloat(firstVariant.price) : parseFloat(product.price);

    addItem({
      productId: product.id,
      variantId: variantId,
      name: product.name,
      variantName: firstVariant ? firstVariant.name : "Standard",
      price: priceNum,
      imageUrl: product.mainImageUrl,
      quantity: 1,
    });

    setAddedId(product.id);
    toast.success(`"${product.name}" ajouté à votre panier !`);
    setIsOpen(true);

    setTimeout(() => {
      setAddedId(null);
    }, 1500);
  };

  if (products.length === 0) {
    return (
      <div className="p-12 border border-dashed border-border rounded-2xl bg-card text-center space-y-2">
        <ShoppingBag className="h-10 w-10 text-muted-foreground mx-auto" />
        <h3 className="font-bold text-base text-foreground">Catalogue bientôt disponible</h3>
        <p className="text-xs text-muted-foreground">
          Aucun produit n&apos;est actuellement mis en ligne dans la boutique.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => {
        const priceNum = parseFloat(product.price);
        const isOutOfStock = product.totalStock === 0;

        return (
          <Card
            key={product.id}
            className="group relative overflow-hidden border-border/60 bg-card hover:shadow-xl transition-all duration-300 hover:border-primary/40 flex flex-col justify-between"
          >
            {/* Stock status badge */}
            <div className="absolute top-3 left-3 z-10">
              {product.stockStatus === "in_stock" ? (
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-semibold text-[10px] gap-1">
                  <PackageCheck className="h-3 w-3" /> En stock
                </Badge>
              ) : product.stockStatus === "low_stock" ? (
                <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-semibold text-[10px] gap-1">
                  <AlertTriangle className="h-3 w-3" /> Stock faible
                </Badge>
              ) : (
                <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 font-semibold text-[10px] gap-1">
                  <PackageX className="h-3 w-3" /> Rupture
                </Badge>
              )}
            </div>

            {/* Product Image */}
            <div className="relative aspect-square bg-muted/20 overflow-hidden">
              <img
                src={product.mainImageUrl}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60";
                }}
              />
              {product.variants && product.variants.length > 1 && (
                <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-border/40 text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                  <Layers className="h-3 w-3 text-primary" /> {product.variants.length} choix
                </div>
              )}
            </div>

            {/* Content */}
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span className="font-mono bg-muted/60 px-1.5 py-0.5 rounded font-bold uppercase">
                  {product.sku}
                </span>
                <span className="font-medium text-primary">{product.category?.name || "Général"}</span>
              </div>

              <h3 className="font-extrabold text-sm line-clamp-1 text-foreground group-hover:text-primary transition-colors">
                {product.name}
              </h3>

              {product.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              )}
            </CardContent>

            {/* Footer with Price and Add to Cart button */}
            <CardFooter className="px-4 py-3 bg-muted/20 border-t border-border/40 flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] text-muted-foreground block">Prix TTC</span>
                <span className="text-base font-extrabold text-primary">
                  {priceNum.toFixed(2).replace(".", ",")} TND
                </span>
              </div>

              <Button
                size="sm"
                disabled={isOutOfStock || addedId === product.id}
                onClick={() => handleAddToCart(product)}
                className="h-9 px-3 text-xs font-bold gap-1.5 rounded-xl bg-primary text-primary-foreground shadow-sm hover:shadow transition-all"
              >
                {addedId === product.id ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Ajouté !
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-3.5 w-3.5" /> Ajouter
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
