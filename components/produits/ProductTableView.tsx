"use client";

import * as React from "react";
import Link from "next/link";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  Trash2,
  QrCode,
  PackageCheck,
  PackageX,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { EnrichedProductItem } from "./ProductCard";

interface ProductTableViewProps {
  products: EnrichedProductItem[];
  onEdit?: (product: EnrichedProductItem) => void;
  onPrintQr?: (product: EnrichedProductItem) => void;
}

export function ProductTableView({ products, onEdit, onPrintQr }: ProductTableViewProps) {
  const [selectedProduct, setSelectedProduct] = React.useState<EnrichedProductItem | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isDuplicatingId, setIsDuplicatingId] = React.useState<string | null>(null);

  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      setIsDeleting(true);
      await deleteProduct(selectedProduct.id);
      toast.success(`Produit "${selectedProduct.name}" supprimé.`);
    } catch (err: any) {
      toast.error(err?.message || "Erreur lors de la suppression.");
    } finally {
      setIsDeleting(false);
      setSelectedProduct(null);
    }
  };

  const handleDuplicate = async (p: EnrichedProductItem) => {
    try {
      setIsDuplicatingId(p.id);
      toast.loading("Duplication en cours...");
      await duplicateProduct(p.id);
      toast.dismiss();
      toast.success(`Produit "${p.name}" dupliqué avec succès.`);
    } catch (err: any) {
      toast.dismiss();
      toast.error(err?.message || "Erreur lors de la duplication.");
    } finally {
      setIsDuplicatingId(null);
    }
  };

  const renderStockBadge = (p: EnrichedProductItem) => {
    if (p.stockStatus === "in_stock") {
      return (
        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-semibold text-[10px] gap-1">
          <PackageCheck className="h-3 w-3" /> {p.totalStock} en stock
        </Badge>
      );
    }
    if (p.stockStatus === "low_stock") {
      return (
        <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-semibold text-[10px] gap-1">
          <AlertTriangle className="h-3 w-3" /> {p.totalStock} faible
        </Badge>
      );
    }
    return (
      <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 font-semibold text-[10px] gap-1">
        <PackageX className="h-3 w-3" /> Rupture
      </Badge>
    );
  };

  return (
    <>
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-[70px]">Image</TableHead>
              <TableHead>Produit & SKU</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead className="text-right">Prix de vente</TableHead>
              <TableHead className="text-right">Prix d&apos;achat</TableHead>
              <TableHead className="text-center">Statut Stock</TableHead>
              <TableHead className="w-[60px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground text-sm">
                  Aucun produit trouvé dans le catalogue.
                </TableCell>
              </TableRow>
            ) : (
              products.map((p) => {
                const priceNum = parseFloat(p.price);
                const costNum = p.costPrice ? parseFloat(p.costPrice) : null;

                return (
                  <TableRow key={p.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="h-10 w-10 rounded-lg overflow-hidden border border-border/40 bg-muted shrink-0">
                        <img
                          src={p.mainImageUrl}
                          alt={p.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60";
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <Link
                          href={`/dashboard/produits/${p.id}`}
                          className="font-bold text-xs hover:text-primary transition-colors text-foreground"
                        >
                          {p.name}
                        </Link>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          SKU: {p.sku}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground font-medium">
                        {p.category?.name || "Non catégorisé"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-extrabold text-xs">
                      {priceNum.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} TND
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground font-medium">
                      {costNum !== null
                        ? `${costNum.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} TND`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-center">{renderStockBadge(p)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="p-0">
                            <Link href={`/dashboard/produits/${p.id}`} className="flex items-center gap-2 w-full px-2 py-1.5 text-xs">
                              <Eye className="h-4 w-4 text-muted-foreground" /> Voir
                            </Link>
                          </DropdownMenuItem>
                          {onEdit && (
                            <DropdownMenuItem onClick={() => onEdit(p)} className="gap-2">
                              <Edit className="h-4 w-4 text-muted-foreground" /> Modifier
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleDuplicate(p)}
                            disabled={isDuplicatingId === p.id}
                            className="gap-2"
                          >
                            <Copy className="h-4 w-4 text-muted-foreground" /> Dupliquer
                          </DropdownMenuItem>
                          {onPrintQr && (
                            <DropdownMenuItem onClick={() => onPrintQr(p)} className="gap-2">
                              <QrCode className="h-4 w-4 text-muted-foreground" /> Imprimer QR
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setSelectedProduct(p)}
                            className="gap-2 text-rose-600 focus:text-rose-600 dark:text-rose-400"
                          >
                            <Trash2 className="h-4 w-4" /> Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-rose-600">Supprimer le produit ?</AlertDialogTitle>
            <AlertDialogDescription>
              Voulez-vous vraiment supprimer le produit <strong>{selectedProduct?.name}</strong> ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
