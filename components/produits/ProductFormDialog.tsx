"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Package,
  Plus,
  Trash2,
  Image as ImageIcon,
  Check,
  ChevronRight,
  ChevronLeft,
  UploadCloud,
  Star,
  Layers,
  DollarSign,
  Box,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { createProduct, updateProduct } from "@/actions/produits";
import { createProductSchema, CreateProductInput } from "@/lib/schemas/produits";
import { EnrichedProductItem } from "./ProductCard";

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productToEdit?: EnrichedProductItem | null;
  categories: { id: string; name: string }[];
  suppliers: { id: string; name: string }[];
}

export function ProductFormDialog({
  open,
  onOpenChange,
  productToEdit,
  categories,
  suppliers,
}: ProductFormDialogProps) {
  const isEditing = !!productToEdit;
  const [activeStep, setActiveStep] = React.useState<"general" | "variants" | "images">("general");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [newImageUrl, setNewImageUrl] = React.useState("");

  const form = useForm<any>({
    resolver: zodResolver(createProductSchema as any),
    defaultValues: {
      name: "",
      sku: "",
      description: "",
      categoryId: "",
      subCategoryId: null,
      supplierId: null,
      price: 0,
      costPrice: undefined,
      vatRate: 20,
      weight: undefined,
      dimensions: { length: undefined, width: undefined, height: undefined },
      images: [],
      variants: [],
      initialStock: 0,
      minThreshold: 5,
      warehouseLocation: "",
    },
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    control: form.control,
    name: "images",
  });

  // Reset or initialize form data when dialog opens / productToEdit changes
  React.useEffect(() => {
    if (open) {
      if (productToEdit) {
        form.reset({
          name: productToEdit.name,
          sku: productToEdit.sku,
          description: productToEdit.description || "",
          categoryId: productToEdit.category?.id || "",
          supplierId: productToEdit.supplier?.id || null,
          price: parseFloat(productToEdit.price),
          costPrice: productToEdit.costPrice ? parseFloat(productToEdit.costPrice) : undefined,
          vatRate: 20,
          images:
            productToEdit.variants && productToEdit.mainImageUrl
              ? [{ url: productToEdit.mainImageUrl, isPrimary: true, position: 0 }]
              : [],
          variants: [],
          initialStock: productToEdit.totalStock,
          minThreshold: productToEdit.minThreshold,
        });
      } else {
        form.reset({
          name: "",
          sku: `SKU-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
          description: "",
          categoryId: categories[0]?.id || "",
          price: 0,
          vatRate: 20,
          images: [],
          variants: [],
          initialStock: 10,
          minThreshold: 5,
        });
      }
      setActiveStep("general");
    }
  }, [open, productToEdit, form, categories]);

  const handleAddImageUrl = () => {
    if (!newImageUrl || !newImageUrl.startsWith("http")) {
      toast.error("Veuillez saisir une URL d'image valide (ex: https://...)");
      return;
    }
    const isFirst = imageFields.length === 0;
    appendImage({
      url: newImageUrl,
      isPrimary: isFirst,
      position: imageFields.length,
    });
    setNewImageUrl("");
    toast.success("Image ajoutée à la galerie");
  };

  const handleSetPrimaryImage = (index: number) => {
    const currentImages = form.getValues("images") || [];
    const updated = currentImages.map((img: any, idx: number) => ({
      ...img,
      isPrimary: idx === index,
    }));
    form.setValue("images", updated);
  };

  const onSubmit = async (data: CreateProductInput) => {
    try {
      setIsSubmitting(true);
      if (isEditing && productToEdit) {
        await updateProduct({
          id: productToEdit.id,
          ...data,
        });
        toast.success(`Le produit "${data.name}" a été mis à jour.`);
      } else {
        await createProduct(data);
        toast.success(`Le produit "${data.name}" a été créé avec succès avec son QR Code!`);
      }
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.message || "Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-border/60 bg-muted/20">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
            <Package className="h-5 w-5 text-primary" />
            {isEditing ? `Modifier le produit: ${productToEdit.name}` : "Nouveau Produit"}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {isEditing
              ? "Mettez à jour les informations du produit, ses prix et images."
              : "Remplissez les détails ci-dessous pour ajouter un produit à votre catalogue."}
          </DialogDescription>
        </DialogHeader>

        {/* Step Navigation Tabs */}
        <div className="border-b border-border/40 px-6 bg-card">
          <Tabs value={activeStep} onValueChange={(v) => setActiveStep(v as any)}>
            <TabsList className="bg-transparent h-12 gap-6 p-0">
              <TabsTrigger
                value="general"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none font-semibold text-xs gap-2 px-1"
              >
                <Box className="h-3.5 w-3.5" /> 1. Informations & Prix
              </TabsTrigger>
              <TabsTrigger
                value="variants"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none font-semibold text-xs gap-2 px-1"
              >
                <Layers className="h-3.5 w-3.5" /> 2. Variantes & Stock ({variantFields.length})
              </TabsTrigger>
              <TabsTrigger
                value="images"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none font-semibold text-xs gap-2 px-1"
              >
                <ImageIcon className="h-3.5 w-3.5" /> 3. Galerie d&apos;Images ({imageFields.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Form Body */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* STEP 1: General Info */}
          {activeStep === "general" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Nom du Produit *</Label>
                  <Input
                    placeholder="Ex: T-Shirt Coton Bio Premium"
                    {...form.register("name")}
                    className="text-xs h-9"
                  />
                  {form.formState.errors.name?.message && (
                    <p className="text-[11px] text-rose-500">{String(form.formState.errors.name.message)}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">SKU / Référence unique *</Label>
                  <Input
                    placeholder="Ex: TSH-BLK-001"
                    {...form.register("sku")}
                    className="text-xs h-9 font-mono"
                  />
                  {form.formState.errors.sku?.message && (
                    <p className="text-[11px] text-rose-500">{String(form.formState.errors.sku.message)}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Description du Produit</Label>
                <Textarea
                  placeholder="Décrivez les caractéristiques du produit..."
                  rows={3}
                  {...form.register("description")}
                  className="text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Catégorie Principale *</Label>
                  <Select
                    value={form.watch("categoryId")}
                    onValueChange={(val) => val && form.setValue("categoryId", val)}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Sélectionnez une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {suppliers && suppliers.length > 0 && (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Fournisseur (Optionnel)</Label>
                    <Select
                      value={form.watch("supplierId") || undefined}
                      onValueChange={(val) => val && form.setValue("supplierId", val)}
                    >
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Sélectionnez un fournisseur" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Pricing Section */}
              <div className="pt-2 border-t border-border/40">
                <h4 className="text-xs font-bold text-foreground mb-3 flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5 text-primary" /> Tarification & Taxes
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Prix de Vente (TND / €) *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...form.register("price")}
                      className="text-xs h-9 font-bold text-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Prix d&apos;Achat (HT)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...form.register("costPrice")}
                      className="text-xs h-9"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">TVA Applicable (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="20"
                      {...form.register("vatRate")}
                      className="text-xs h-9"
                    />
                  </div>
                </div>
              </div>

              {/* Poids / Dimensions */}
              <div className="pt-2 border-t border-border/40">
                <h4 className="text-xs font-bold text-foreground mb-3">Poids & Dimensions</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Poids (kg)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.5"
                      {...form.register("weight")}
                      className="text-xs h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Longueur (cm)</Label>
                    <Input
                      type="number"
                      placeholder="10"
                      {...form.register("dimensions.length")}
                      className="text-xs h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Largeur (cm)</Label>
                    <Input
                      type="number"
                      placeholder="10"
                      {...form.register("dimensions.width")}
                      className="text-xs h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Hauteur (cm)</Label>
                    <Input
                      type="number"
                      placeholder="10"
                      {...form.register("dimensions.height")}
                      className="text-xs h-8"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Variants & Stock */}
          {activeStep === "variants" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-foreground">Gestion des Variantes</h4>
                  <p className="text-[11px] text-muted-foreground">
                    Ajoutez des déclinaisons de taille, couleur, etc. Si aucune variante n&apos;est ajoutée, le produit sera traité comme un article unique.
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    appendVariant({
                      name: "Taille M",
                      sku: `${form.getValues("sku")}-M`,
                      price: form.getValues("price"),
                      initialStock: 10,
                      minThreshold: 5,
                    })
                  }
                  className="h-8 text-xs gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" /> Ajouter une variante
                </Button>
              </div>

              {variantFields.length === 0 ? (
                <div className="p-6 border border-dashed border-border/80 rounded-xl text-center space-y-3 bg-muted/20">
                  <Package className="h-8 w-8 text-muted-foreground mx-auto" />
                  <p className="text-xs text-muted-foreground">
                    Produit simple sans déclinaisons. Configurez le stock initial de base ci-dessous :
                  </p>
                  <div className="grid grid-cols-3 gap-3 max-w-md mx-auto text-left pt-2">
                    <div>
                      <Label className="text-[11px]">Stock Initial *</Label>
                      <Input
                        type="number"
                        {...form.register("initialStock")}
                        className="h-8 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <Label className="text-[11px]">Seuil Alerte</Label>
                      <Input
                        type="number"
                        {...form.register("minThreshold")}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-[11px]">Emplacement</Label>
                      <Input
                        placeholder="A-12"
                        {...form.register("warehouseLocation")}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {variantFields.map((field, index) => (
                    <Card key={field.id} className="p-3 border-border/60 bg-muted/10">
                      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
                        <div>
                          <Label className="text-[10px]">Nom Variante *</Label>
                          <Input
                            placeholder="Ex: Rouge / L"
                            {...form.register(`variants.${index}.name`)}
                            className="h-8 text-xs"
                          />
                        </div>
                        <div>
                          <Label className="text-[10px]">SKU Variante *</Label>
                          <Input
                            placeholder="SKU-RED-L"
                            {...form.register(`variants.${index}.sku`)}
                            className="h-8 text-xs font-mono"
                          />
                        </div>
                        <div>
                          <Label className="text-[10px]">Prix de Vente</Label>
                          <Input
                            type="number"
                            step="0.01"
                            {...form.register(`variants.${index}.price`)}
                            className="h-8 text-xs"
                          />
                        </div>
                        <div>
                          <Label className="text-[10px]">Stock Initial</Label>
                          <Input
                            type="number"
                            {...form.register(`variants.${index}.initialStock`)}
                            className="h-8 text-xs font-bold"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeVariant(index)}
                            className="h-8 w-8 text-rose-500 hover:bg-rose-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Images */}
          {activeStep === "images" && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-foreground">Galerie d&apos;Images du Produit</h4>
                <p className="text-[11px] text-muted-foreground">
                  Saisissez les URL de vos visuels produits (ou hébergés via UploadThing). L&apos;image principale est mise en évidence.
                </p>
              </div>

              {/* Input for image URL */}
              <div className="flex gap-2">
                <Input
                  placeholder="Coller l'URL d'une image (ex: https://images.unsplash.com/...)"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="text-xs h-9 flex-1"
                />
                <Button type="button" onClick={handleAddImageUrl} className="h-9 text-xs gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> Ajouter l&apos;image
                </Button>
              </div>

              {imageFields.length === 0 ? (
                <div className="p-8 border border-dashed border-border/80 rounded-xl text-center space-y-2 bg-muted/20">
                  <UploadCloud className="h-10 w-10 text-muted-foreground mx-auto" />
                  <p className="text-xs text-muted-foreground">
                    Aucune image ajoutée pour le moment.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {imageFields.map((field, index) => {
                    const isPrimary = form.watch(`images.${index}.isPrimary`);
                    return (
                      <div
                        key={field.id}
                        className="group relative aspect-square rounded-xl overflow-hidden border-2 border-border/60 bg-muted/40 shadow-sm"
                      >
                        <img
                          src={form.watch(`images.${index}.url`)}
                          alt={`Aperçu ${index}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60";
                          }}
                        />

                        {isPrimary && (
                          <Badge className="absolute top-2 left-2 bg-amber-500 text-white font-bold text-[9px] gap-1 shadow">
                            <Star className="h-3 w-3 fill-white" /> Principale
                          </Badge>
                        )}

                        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {!isPrimary && (
                            <Button
                              type="button"
                              size="icon"
                              variant="secondary"
                              onClick={() => handleSetPrimaryImage(index)}
                              className="h-8 w-8 rounded-full"
                              title="Définir comme image principale"
                            >
                              <Star className="h-4 w-4 text-amber-500" />
                            </Button>
                          )}
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            onClick={() => removeImage(index)}
                            className="h-8 w-8 rounded-full"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </form>

        {/* Dialog Footer */}
        <DialogFooter className="p-4 border-t border-border/60 bg-muted/20 flex items-center justify-between sm:justify-between">
          <div>
            {activeStep !== "general" && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setActiveStep(activeStep === "images" ? "variants" : "general")
                }
                className="h-8 text-xs gap-1"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Précédent
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 text-xs"
            >
              Annuler
            </Button>

            {activeStep !== "images" ? (
              <Button
                type="button"
                size="sm"
                onClick={() =>
                  setActiveStep(activeStep === "general" ? "variants" : "images")
                }
                className="h-8 text-xs gap-1"
              >
                Suivant <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                disabled={isSubmitting}
                onClick={form.handleSubmit(onSubmit)}
                className="h-8 text-xs bg-primary text-primary-foreground font-bold gap-1.5"
              >
                <Check className="h-4 w-4" />
                {isSubmitting
                  ? "Enregistrement..."
                  : isEditing
                  ? "Enregistrer les modifications"
                  : "Créer le produit"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
