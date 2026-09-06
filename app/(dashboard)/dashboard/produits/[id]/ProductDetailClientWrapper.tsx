"use client";

import * as React from "react";
import { Edit, QrCode, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductQrPrintModal } from "@/components/produits/ProductQrPrintModal";
import { ProductFormDialog } from "@/components/produits/ProductFormDialog";
import { EnrichedProductItem } from "@/components/produits/ProductCard";
import { deleteProduct } from "@/actions/produits";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function ProductDetailClientWrapper({ product }: { product: EnrichedProductItem }) {
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isPrintOpen, setIsPrintOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Voulez-vous vraiment supprimer le produit "${product.name}" ?`)) return;

    try {
      setIsDeleting(true);
      await deleteProduct(product.id);
      toast.success("Produit supprimé avec succès.");
      router.push("/dashboard/produits");
    } catch (err: any) {
      toast.error(err?.message || "Erreur lors de la suppression.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsPrintOpen(true)}
          className="h-9 text-xs gap-1.5"
        >
          <QrCode className="h-4 w-4" /> Imprimer QR
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditOpen(true)}
          className="h-9 text-xs gap-1.5"
        >
          <Edit className="h-4 w-4" /> Modifier
        </Button>

        <Button
          variant="destructive"
          size="sm"
          disabled={isDeleting}
          onClick={handleDelete}
          className="h-9 text-xs gap-1.5"
        >
          <Trash2 className="h-4 w-4" /> Supprimer
        </Button>
      </div>

      <ProductFormDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        productToEdit={product}
        categories={[]}
        suppliers={[]}
      />

      <ProductQrPrintModal
        product={product}
        open={isPrintOpen}
        onOpenChange={setIsPrintOpen}
      />
    </>
  );
}
