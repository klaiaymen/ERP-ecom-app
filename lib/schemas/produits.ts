import { z } from "zod";

// ==========================================
// ZOD VALIDATION SCHEMAS FOR PRODUCTS
// ==========================================

export const variantInputSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Le nom de la variante est requis"),
  sku: z.string().min(1, "Le SKU de la variante est requis"),
  price: z.coerce.number().min(0, "Le prix doit être positif").optional(),
  costPrice: z.coerce.number().min(0, "Le prix d'achat doit être positif").optional(),
  barcode: z.string().optional(),
  attributes: z.record(z.string(), z.any()).optional(),
  initialStock: z.coerce.number().min(0, "Le stock ne peut être négatif").default(0),
  minThreshold: z.coerce.number().min(0).default(5),
  warehouseLocation: z.string().optional(),
});

export const imageInputSchema = z.object({
  id: z.string().optional(),
  url: z.string().url("URL d'image invalide"),
  key: z.string().optional(),
  isPrimary: z.boolean().default(false),
  position: z.number().default(0),
});

export const createProductSchema = z.object({
  name: z.string().min(2, "Le nom du produit doit contenir au moins 2 caractères"),
  slug: z.string().optional(),
  sku: z.string().min(2, "Le SKU doit contenir au moins 2 caractères"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "La catégorie principale est requise"),
  subCategoryId: z.string().optional().nullable(),
  supplierId: z.string().optional().nullable(),
  price: z.coerce.number().min(0, "Le prix de vente doit être supérieur ou égal à 0"),
  costPrice: z.coerce.number().min(0, "Le prix d'achat doit être supérieur ou égal à 0").optional(),
  vatRate: z.coerce.number().min(0, "Taux de TVA invalide").default(20),
  weight: z.coerce.number().min(0).optional(),
  dimensions: z
    .object({
      length: z.coerce.number().optional(),
      width: z.coerce.number().optional(),
      height: z.coerce.number().optional(),
    })
    .optional(),
  images: z.array(imageInputSchema).default([]),
  variants: z.array(variantInputSchema).default([]),
  initialStock: z.coerce.number().min(0).default(0),
  minThreshold: z.coerce.number().min(0).default(5),
  warehouseLocation: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial().extend({
  id: z.string().min(1, "ID Produit requis"),
});

export const getProductsParamsSchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(12),
  search: z.string().optional(),
  categoryId: z.string().optional(),
  supplierId: z.string().optional(),
  stockStatus: z.enum(["all", "in_stock", "low_stock", "out_of_stock"]).default("all"),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  sortBy: z.enum(["name", "price", "createdAt", "sku"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type GetProductsParams = z.infer<typeof getProductsParamsSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
