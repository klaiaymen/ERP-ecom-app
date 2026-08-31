"use client";

import * as React from "react";
import Link from "next/link";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

export function CartSheet() {
  const {
    items,
    isOpen,
    setIsOpen,
    removeItem,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
  } = useCart();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger
        className="inline-flex shrink-0 items-center justify-center relative rounded-xl border border-border bg-card h-9 w-9 text-foreground hover:bg-accent transition-all cursor-pointer"
        aria-label="Panier d'achats"
      >
        <ShoppingBag className="h-4 w-4" />
        {totalItems > 0 && (
          <span className="absolute -top-1.5 -right-1.5 h-5 min-w-[20px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shadow-sm animate-in zoom-in">
            {totalItems}
          </span>
        )}
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-md p-6 bg-card border-border">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2 text-lg font-bold">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <span>Mon Panier ({totalItems})</span>
          </SheetTitle>
        </SheetHeader>

        <Separator />

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
              <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-3">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="font-semibold text-foreground">Votre panier est vide</p>
              <p className="text-xs mt-1">Découvrez nos produits et commencez vos achats.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="mt-4 rounded-xl text-xs"
              >
                Continuer mes achats
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.variantId}
                className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border bg-card/60 hover:border-border/80 transition-colors"
              >
                <div className="h-14 w-14 rounded-lg bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-foreground truncate">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {item.variantName}
                  </p>
                  <p className="text-xs font-semibold text-primary mt-1">
                    {item.price.toFixed(2)} €
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  <div className="flex items-center border border-border rounded-lg bg-background">
                    <button
                      onClick={() =>
                        updateQuantity(item.variantId, item.quantity - 1)
                      }
                      className="px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-l-lg transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-2 text-xs font-bold">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.variantId, item.quantity + 1)
                      }
                      className="px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-r-lg transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="pt-4 border-t border-border flex-col gap-3">
            <div className="space-y-1.5 w-full text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Sous-total</span>
                <span>{totalPrice.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Livraison</span>
                <span className="text-emerald-500 font-medium">Calculée au paiement</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm font-bold text-foreground pt-1">
                <span>Total estimé</span>
                <span className="text-primary">{totalPrice.toFixed(2)} €</span>
              </div>
            </div>

            <Button
              render={<Link href="/checkout" />}
              className="w-full rounded-xl font-bold shadow-md shadow-primary/20 gap-2 h-10"
              onClick={() => setIsOpen(false)}
            >
              Passer la commande <ArrowRight className="h-4 w-4" />
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
