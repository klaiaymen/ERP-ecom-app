import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Package,
  QrCode,
  DollarSign,
  Tag,
  Building2,
  Calendar,
  Layers,
  History,
  TrendingUp,
  Box,
  Scale,
  Printer,
  PackageCheck,
  AlertTriangle,
  PackageX,
} from "lucide-react";
import { getProductById } from "@/actions/produits";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductDetailClientWrapper } from "./ProductDetailClientWrapper";

export const dynamic = "force-dynamic";

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;

  let product;
  try {
    product = await getProductById(id);
  } catch (error) {
    notFound();
  }

  if (!product) {
    notFound();
  }

  const priceNum = parseFloat(product.price);
  const costNum = product.costPrice ? parseFloat(product.costPrice) : null;
  const margin = costNum && priceNum > 0 ? ((priceNum - costNum) / priceNum) * 100 : null;
  const stockValue = product.totalStock * priceNum;

  const renderStockBadge = () => {
    if (product.totalStock === 0) {
      return (
        <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 font-bold text-xs gap-1">
          <PackageX className="h-3.5 w-3.5" /> Rupture de Stock
        </Badge>
      );
    }
    if (product.totalStock <= 5) {
      return (
        <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-bold text-xs gap-1">
          <AlertTriangle className="h-3.5 w-3.5" /> Stock Faible ({product.totalStock})
        </Badge>
      );
    }
    return (
      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-bold text-xs gap-1">
        <PackageCheck className="h-3.5 w-3.5" /> En Stock ({product.totalStock})
      </Badge>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/produits"
            className="h-9 w-9 rounded-xl border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
                {product.name}
              </h1>
              {renderStockBadge()}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2 font-mono">
              <span>SKU: {product.sku}</span> •{" "}
              <span>Catégorie: {product.category?.name || "Non définie"}</span>
            </p>
          </div>
        </div>

        {/* Client Wrapper for print/actions */}
        <ProductDetailClientWrapper product={product as any} />
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/60 bg-card/60 backdrop-blur-md">
          <CardHeader className="p-4 pb-2">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-primary" /> Prix de Vente TTC
            </span>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-black text-foreground">
              {priceNum.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} TND
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">TVA: {product.vatRate}% inclus</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-md">
          <CardHeader className="p-4 pb-2">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-emerald-500" /> Prix d&apos;Achat & Marge
            </span>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-black text-foreground">
              {costNum !== null
                ? `${costNum.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} TND`
                : "—"}
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
              {margin !== null ? `Marge brute: +${margin.toFixed(1)}%` : "Coût non spécifié"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-md">
          <CardHeader className="p-4 pb-2">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Package className="h-4 w-4 text-violet-500" /> Stock Total
            </span>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-black text-foreground">{product.totalStock} unités</div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {product.variants.length} variante(s) enregistrée(s)
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-md">
          <CardHeader className="p-4 pb-2">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Box className="h-4 w-4 text-blue-500" /> Valeur Totale Stock
            </span>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-black text-primary">
              {stockValue.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} TND
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Valeur marchande actuelle</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Gallery Left + Tabs Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-border/60 bg-card overflow-hidden">
            <div className="relative aspect-square w-full bg-muted/30 overflow-hidden">
              <img
                src={product.mainImageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {product.images && product.images.length > 1 && (
              <div className="p-4 border-t border-border/40 grid grid-cols-4 gap-2">
                {product.images.map((img, i) => (
                  <div
                    key={img.id}
                    className="aspect-square rounded-lg overflow-hidden border border-border/60 bg-muted"
                  >
                    <img src={img.url} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Information Tabs */}
        <div className="lg:col-span-7">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="w-full justify-start bg-card border border-border/60 p-1 rounded-xl h-11 gap-1">
              <TabsTrigger value="general" className="text-xs font-semibold px-3 py-1.5">
                Infos Générales
              </TabsTrigger>
              <TabsTrigger value="variants" className="text-xs font-semibold px-3 py-1.5">
                Variantes ({product.variants.length})
              </TabsTrigger>
              <TabsTrigger value="stock" className="text-xs font-semibold px-3 py-1.5">
                Stocks
              </TabsTrigger>
              <TabsTrigger value="history" className="text-xs font-semibold px-3 py-1.5">
                Historique
              </TabsTrigger>
              <TabsTrigger value="qr" className="text-xs font-semibold px-3 py-1.5">
                QR Code
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: General Info */}
            <TabsContent value="general" className="mt-4">
              <Card className="border-border/60 bg-card p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-2">Description du Produit</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                    {product.description || "Aucune description renseignée pour ce produit."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/40 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Catégorie Principale</span>
                    <span className="font-bold text-foreground">
                      {product.category?.name || "Non catégorisé"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Sous-Catégorie</span>
                    <span className="font-bold text-foreground">
                      {product.subCategory?.name || "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Fournisseur</span>
                    <span className="font-bold text-foreground">
                      {product.supplier?.name || "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Taux de TVA</span>
                    <span className="font-bold text-foreground">{product.vatRate}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Poids</span>
                    <span className="font-bold text-foreground">
                      {product.weight ? `${product.weight} kg` : "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Dimensions (L x l x h)</span>
                    <span className="font-bold text-foreground">
                      {product.dimensions
                        ? `${(product.dimensions as any).length || 0} x ${
                            (product.dimensions as any).width || 0
                          } x ${(product.dimensions as any).height || 0} cm`
                        : "—"}
                    </span>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* TAB 2: Variants */}
            <TabsContent value="variants" className="mt-4">
              <Card className="border-border/60 bg-card overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow>
                      <TableHead>Nom Variante</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead className="text-right">Prix</TableHead>
                      <TableHead className="text-center">Stock</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {product.variants.map((v) => (
                      <TableRow key={v.id}>
                        <TableCell className="font-bold text-xs">{v.name}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {v.sku}
                        </TableCell>
                        <TableCell className="text-right font-bold text-xs">
                          {v.price ? `${parseFloat(v.price).toLocaleString("fr-FR")} TND` : product.price}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="font-bold text-xs">
                            {v.stock?.quantity ?? 0}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            {/* TAB 3: Stock Details */}
            <TabsContent value="stock" className="mt-4">
              <Card className="border-border/60 bg-card overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow>
                      <TableHead>Variante</TableHead>
                      <TableHead>Emplacement Entrepôt</TableHead>
                      <TableHead className="text-center">Seuil Alerte</TableHead>
                      <TableHead className="text-right">Quantité en Stock</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {product.variants.map((v) => (
                      <TableRow key={v.id}>
                        <TableCell className="font-bold text-xs">{v.name}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {v.stock?.warehouseLocation || "Emplacement non défini"}
                        </TableCell>
                        <TableCell className="text-center text-xs text-amber-600 font-bold">
                          {v.stock?.minThreshold ?? 5} units
                        </TableCell>
                        <TableCell className="text-right font-extrabold text-xs text-primary">
                          {v.stock?.quantity ?? 0} units
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            {/* TAB 4: History */}
            <TabsContent value="history" className="mt-4">
              <Card className="border-border/60 bg-card overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Raison / Note</TableHead>
                      <TableHead className="text-center">Variation</TableHead>
                      <TableHead className="text-right">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {product.variants.flatMap((v) => v.movements || []).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center h-24 text-muted-foreground text-xs">
                          Aucun mouvement de stock enregistré.
                        </TableCell>
                      </TableRow>
                    ) : (
                      product.variants
                        .flatMap((v) => v.movements || [])
                        .map((m) => (
                          <TableRow key={m.id}>
                            <TableCell>
                              <Badge
                                className={
                                  m.type === "in"
                                    ? "bg-emerald-500/10 text-emerald-600"
                                    : "bg-rose-500/10 text-rose-600"
                                }
                              >
                                {m.type.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {m.reason || "Mouvement régulier"}
                            </TableCell>
                            <TableCell className="text-center font-bold text-xs">
                              {m.type === "in" ? `+${m.quantity}` : `-${m.quantity}`}
                            </TableCell>
                            <TableCell className="text-right text-[11px] text-muted-foreground">
                              {new Date(m.createdAt).toLocaleDateString("fr-FR")}
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            {/* TAB 5: QR Code */}
            <TabsContent value="qr" className="mt-4">
              <Card className="border-border/60 bg-card p-6 text-center space-y-4">
                <h3 className="font-bold text-sm text-foreground">QR Code d&apos;Identification</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Ce QR Code permet d&apos;identifier instantanément le produit lors du scan en entrepôt ou en magasin.
                </p>

                {product.qrCodeUrl ? (
                  <div className="inline-block p-4 border-2 border-border/80 rounded-2xl bg-white shadow-sm">
                    <img
                      src={product.qrCodeUrl}
                      alt={`QR Code ${product.sku}`}
                      className="w-48 h-48 mx-auto"
                    />
                  </div>
                ) : (
                  <div className="p-8 bg-muted rounded-xl text-xs text-muted-foreground">
                    QR Code non généré.
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
