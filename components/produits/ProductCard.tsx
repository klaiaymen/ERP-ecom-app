"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Trash2,
  QrCode,
  PackageCheck,
  PackageX,
  AlertTriangle,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { deleteProduct, duplicateProduct } from "@/actions/produits";

export interface EnrichedProductItem {
  id: string;
  name: string;
  sku: string;
  slug: string;
  price: string;
  costPrice?: string | null;
  description?: string | null;
  totalStock: number;
  minThreshold: number;
  stockStatus: "in_stock" | "low_stock" | "out_of_stock";
  mainImageUrl: string;
  category?: { id: string; name: string } | null;
  supplier?: { id: string; name: string } | null;
  variants?: Array<{ id: string; name: string; sku: string }>;
  qrCodeUrl?: string | null;
}

interface ProductCardProps {
  product: EnrichedProductItem;
  onEdit?: (product: EnrichedProductItem) => void;
  onPrintQr?: (product: EnrichedProductItem) => void;
}

export function ProductCard({ product, onEdit, onPrintQr }: ProductCardProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [isDuplicating, setIsDuplicating] = React.useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteProduct(product.id);
      toast.success(`Le produit "${product.name}" a été supprimé.`);
    } catch (err: any) {
      toast.error(err?.message || "Erreur lors de la suppression du produit.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleDuplicate = async () => {
    try {
      setIsDuplicating(true);
      toast.loading("Duplication en cours...");
      await duplicateProduct(product.id);
      toast.dismiss();
      toast.success(`Produit "${product.name}" dupliqué avec succès.`);
    } catch (err: any) {
      toast.dismiss();
      toast.error(err?.message || "Erreur lors de la duplication.");
    } finally {
      setIsDuplicating(false);
    }
  };

  // Status Badge styling
  const renderStockBadge = () => {
    if (product.stockStatus === "in_stock") {
      return (
        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 gap-1 font-semibold text-[10px]">
          <PackageCheck className="h-3 w-3" /> En stock ({product.totalStock})
        </Badge>
      );
    }
    if (product.stockStatus === "low_stock") {
      return (
        <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20 gap-1 font-semibold text-[10px]">
          <AlertTriangle className="h-3 w-3" /> Faible ({product.totalStock})
        </Badge>
      );
    }
    return (
      <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 hover:bg-rose-500/20 gap-1 font-semibold text-[10px]">
        <PackageX className="h-3 w-3" /> Rupture
      </Badge>
    );
  };

  const priceNum = parseFloat(product.price);
  const costNum = product.costPrice ? parseFloat(product.costPrice) : null;
  const margin = costNum && priceNum > 0 ? ((priceNum - costNum) / priceNum) * 100 : null;

  return (
    <>
      <Card className="group relative overflow-hidden border-border/60 bg-card hover:shadow-lg transition-all duration-300 hover:border-primary/40 flex flex-col justify-between">
        {/* Header Badges & Actions */}
        <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto">{renderStockBadge()}</div>

          <div className="pointer-events-auto">
            <DropdownMenu>
              <DropdownMenuTrigger
                className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-md border border-border/40 shadow-sm opacity-90 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <MoreVertical className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="p-0">
                  <Link href={`/dashboard/produits/${product.id}`} className="flex items-center gap-2 w-full px-2 py-1.5 text-xs">
                    <Eye className="h-4 w-4 text-muted-foreground" /> Voir la fiche
                  </Link>
                </DropdownMenuItem>
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(product)} className="gap-2">
                    <Edit className="h-4 w-4 text-muted-foreground" /> Modifier
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleDuplicate} disabled={isDuplicating} className="gap-2">
                  <Copy className="h-4 w-4 text-muted-foreground" /> Dupliquer
                </DropdownMenuItem>
                {onPrintQr && (
                  <DropdownMenuItem onClick={() => onPrintQr(product)} className="gap-2">
                    <QrCode className="h-4 w-4 text-muted-foreground" /> Imprimer QR
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowDeleteConfirm(true)}
                  className="gap-2 text-rose-600 focus:text-rose-600 dark:text-rose-400"
                >
                  <Trash2 className="h-4 w-4" /> Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Product Image Preview */}
        <Link href={`/dashboard/produits/${product.id}`} className="block relative aspect-square bg-muted/30 overflow-hidden">
          <img
            src={product.mainImageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60";
            }}
          />
          {product.variants && product.variants.length > 0 && (
            <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-border/40 text-[10px] font-bold text-muted-foreground flex items-center gap-1">
              <Layers className="h-3 w-3 text-primary" /> {product.variants.length} variantes
            </div>
          )}
        </Link>

        {/* Card Body */}
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="font-mono bg-muted/60 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold">
              {product.sku}
            </span>
            {product.category && (
              <span className="font-medium text-primary/90 truncate max-w-[120px]">
                {product.category.name}
              </span>
            )}
          </div>

          <Link href={`/dashboard/produits/${product.id}`} className="block group/title">
            <h3 className="font-bold text-sm line-clamp-1 text-foreground group-hover/title:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>

          {product.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </CardContent>

        {/* Card Footer: Pricing */}
        <CardFooter className="px-4 py-3 bg-muted/20 border-t border-border/40 flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground block text-[10px]">Prix TTC</span>
            <span className="text-base font-extrabold text-foreground">
              {priceNum.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} TND
            </span>
          </div>

          {margin !== null && (
            <div className="text-right">
              <span className="text-[10px] text-muted-foreground block">Marge</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                +{margin.toFixed(0)}%
              </span>
            </div>
          )}
        </CardFooter>
      </Card>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-rose-600">
              <Trash2 className="h-5 w-5" /> Supprimer le produit ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le produit <strong>{product.name}</strong> (SKU: {product.sku}) ?
              <br />
              Cette action retirera le produit du catalogue actif tout en conservant l&apos;historique de vos commandes et stocks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              {isDeleting ? "Suppression..." : "Confirmer la suppression"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
