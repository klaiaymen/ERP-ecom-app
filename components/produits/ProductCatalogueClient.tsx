"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Plus, LayoutGrid, List, ChevronLeft, ChevronRight, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProductCard, EnrichedProductItem } from "./ProductCard";
import { ProductTableView } from "./ProductTableView";
import { ProductFilters } from "./ProductFilters";
import { ProductCommandSearch } from "./ProductCommandSearch";
import { QrScannerModal } from "./QrScannerModal";
import { ProductQrPrintModal } from "./ProductQrPrintModal";
import { ProductFormDialog } from "./ProductFormDialog";

interface ProductCatalogueClientProps {
  products: EnrichedProductItem[];
  categories: { id: string; name: string }[];
  suppliers: { id: string; name: string }[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

export function ProductCatalogueClient({
  products,
  categories,
  suppliers,
  pagination,
}: ProductCatalogueClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [productToEdit, setProductToEdit] = React.useState<EnrichedProductItem | null>(null);
  const [productToPrintQr, setProductToPrintQr] = React.useState<EnrichedProductItem | null>(null);
  const [activeView, setActiveView] = React.useState<"grid" | "table">("grid");

  const handleEdit = (product: EnrichedProductItem) => {
    setProductToEdit(product);
  };

  const handlePrintQr = (product: EnrichedProductItem) => {
    setProductToPrintQr(product);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
            <PackageCheck className="h-7 w-7 text-primary" /> Catalogue Produits
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Gérez vos références, tarifs, déclinaisons et stocks avec génération de QR codes automatiques.
          </p>
        </div>

        {/* Header Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Command Search */}
          <ProductCommandSearch products={products} />

          {/* QR Scanner */}
          <QrScannerModal />

          {/* New Product Button */}
          <Button
            onClick={() => {
              setProductToEdit(null);
              setIsCreateOpen(true);
            }}
            className="h-9 text-xs font-bold gap-1.5 bg-primary text-primary-foreground shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="h-4 w-4" /> Nouveau Produit
          </Button>
        </div>
      </div>

      {/* Main Content Area: Filters + Grid/Table */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Filters */}
        <div className="lg:col-span-1">
          <ProductFilters categories={categories} suppliers={suppliers} />
        </div>

        {/* Right Column: Products Display */}
        <div className="lg:col-span-3 space-y-4">
          {/* View Toggle & Summary Bar */}
          <div className="flex items-center justify-between bg-card p-3 rounded-xl border border-border/60 shadow-sm">
            <div className="text-xs text-muted-foreground font-medium">
              Affichage de <span className="font-bold text-foreground">{products.length}</span> sur{" "}
              <span className="font-bold text-foreground">{pagination.totalCount}</span> produits
            </div>

            {/* View switcher */}
            <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)}>
              <TabsList className="h-8 p-1 bg-muted/60">
                <TabsTrigger value="grid" className="h-6 text-[11px] px-2 gap-1 font-semibold">
                  <LayoutGrid className="h-3.5 w-3.5" /> Grille
                </TabsTrigger>
                <TabsTrigger value="table" className="h-6 text-[11px] px-2 gap-1 font-semibold">
                  <List className="h-3.5 w-3.5" /> Tableau
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Products List / Grid */}
          {products.length === 0 ? (
            <div className="p-12 border border-dashed border-border/80 rounded-2xl bg-card text-center space-y-3">
              <PackageCheck className="h-12 w-12 text-muted-foreground/50 mx-auto" />
              <h3 className="font-bold text-base text-foreground">Aucun produit ne correspond</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Essayez de modifier vos critères de recherche ou réinitialisez les filtres pour afficher l&apos;ensemble du catalogue.
              </p>
            </div>
          ) : activeView === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onEdit={handleEdit}
                  onPrintQr={handlePrintQr}
                />
              ))}
            </div>
          ) : (
            <ProductTableView
              products={products}
              onEdit={handleEdit}
              onPrintQr={handlePrintQr}
            />
          )}

          {/* Pagination Bar */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-border/40">
              <div className="text-xs text-muted-foreground">
                Page <span className="font-bold text-foreground">{pagination.page}</span> sur{" "}
                <span className="font-bold text-foreground">{pagination.totalPages}</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  className="h-8 text-xs gap-1"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                  className="h-8 text-xs gap-1"
                >
                  Suivant <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form Dialog for Creation and Editing */}
      <ProductFormDialog
        open={isCreateOpen || !!productToEdit}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            setProductToEdit(null);
          }
        }}
        productToEdit={productToEdit}
        categories={categories}
        suppliers={suppliers}
      />

      {/* Print QR Modal */}
      <ProductQrPrintModal
        product={productToPrintQr}
        open={!!productToPrintQr}
        onOpenChange={(open) => !open && setProductToPrintQr(null)}
      />
    </div>
  );
}
