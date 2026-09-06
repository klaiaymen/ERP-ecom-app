"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import {
  products,
  productVariants,
  stocks,
  stockMovements,
  productImages,
  categories,
  suppliers,
  type Product,
  type ProductVariant,
  type ProductImage,
} from "@/db/schema";
import { requireRole } from "@/lib/auth";
import { generateProductQRCode } from "@/lib/qrcode";
import { eq, and, isNull, like, ilike, or, gte, lte, desc, asc, sql } from "drizzle-orm";
import {
  createProductSchema,
  updateProductSchema,
  getProductsParamsSchema,
  type GetProductsParams,
  type CreateProductInput,
  type UpdateProductInput,
} from "@/lib/schemas/produits";

// Re-export type definitions for server actions consumers
export type { GetProductsParams, CreateProductInput, UpdateProductInput };

// ==========================================
// SERVER ACTIONS
// ==========================================

/**
 * Fetch products with pagination, filtering, search, and stock calculations.
 */
export async function getProducts(params?: Partial<GetProductsParams>) {
  await requireRole(["admin", "commercial"]);

  const parsed = getProductsParamsSchema.parse(params ?? {});
  const { page, limit, search, categoryId, supplierId, stockStatus, minPrice, maxPrice, sortBy, sortOrder } = parsed;

  const offset = (page - 1) * limit;

  // Build where conditions
  const conditions = [isNull(products.deletedAt)];

  if (search && search.trim() !== "") {
    const term = `%${search.trim()}%`;
    conditions.push(
      or(
        ilike(products.name, term),
        ilike(products.sku, term),
        ilike(products.description, term)
      )!
    );
  }

  if (categoryId && categoryId !== "all") {
    conditions.push(eq(products.categoryId, categoryId));
  }

  if (supplierId && supplierId !== "all") {
    conditions.push(eq(products.supplierId, supplierId));
  }

  if (minPrice !== undefined && !isNaN(minPrice)) {
    conditions.push(gte(products.price, minPrice.toString()));
  }

  if (maxPrice !== undefined && !isNaN(maxPrice)) {
    conditions.push(lte(products.price, maxPrice.toString()));
  }

  // Determine sort column
  let orderByClause = desc(products.createdAt);
  if (sortBy === "name") {
    orderByClause = sortOrder === "asc" ? asc(products.name) : desc(products.name);
  } else if (sortBy === "price") {
    orderByClause = sortOrder === "asc" ? asc(products.price) : desc(products.price);
  } else if (sortBy === "sku") {
    orderByClause = sortOrder === "asc" ? asc(products.sku) : desc(products.sku);
  } else {
    orderByClause = sortOrder === "asc" ? asc(products.createdAt) : desc(products.createdAt);
  }

  // Execute query with relational fetches
  const resultProducts = await db.query.products.findMany({
    where: and(...conditions),
    with: {
      category: true,
      subCategory: true,
      supplier: true,
      images: {
        orderBy: (images, { asc }) => [asc(images.position)],
      },
      variants: {
        where: isNull(productVariants.deletedAt),
        with: {
          stock: true,
        },
      },
    },
    orderBy: orderByClause,
  });

  // Compute stock levels and calculate aggregate status
  const enrichedProducts = resultProducts.map((p) => {
    let totalStock = 0;
    let minThreshold = 5;

    if (p.variants && p.variants.length > 0) {
      p.variants.forEach((v) => {
        if (v.stock) {
          totalStock += v.stock.quantity ?? 0;
          if (v.stock.minThreshold) {
            minThreshold = v.stock.minThreshold;
          }
        }
      });
    }

    let status: "in_stock" | "low_stock" | "out_of_stock" = "in_stock";
    if (totalStock === 0) {
      status = "out_of_stock";
    } else if (totalStock <= minThreshold) {
      status = "low_stock";
    }

    const mainImage =
      p.images.find((img) => img.isPrimary)?.url ||
      p.images[0]?.url ||
      p.imageUrl ||
      "/placeholder-product.png";

    return {
      ...p,
      totalStock,
      minThreshold,
      stockStatus: status,
      mainImageUrl: mainImage,
    };
  });

  // Filter by calculated stockStatus if specified
  let filteredProducts = enrichedProducts;
  if (stockStatus !== "all") {
    filteredProducts = enrichedProducts.filter((p) => p.stockStatus === stockStatus);
  }

  const totalCount = filteredProducts.length;
  const totalPages = Math.ceil(totalCount / limit) || 1;
  const paginatedData = filteredProducts.slice(offset, offset + limit);

  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages,
    },
  };
}

/**
 * Fetch a single product by ID with full relations & stock movements.
 */
export async function getProductById(productId: string) {
  await requireRole(["admin", "commercial"]);

  const product = await db.query.products.findFirst({
    where: and(eq(products.id, productId), isNull(products.deletedAt)),
    with: {
      category: true,
      subCategory: true,
      supplier: true,
      images: {
        orderBy: (images, { asc }) => [asc(images.position)],
      },
      variants: {
        where: isNull(productVariants.deletedAt),
        with: {
          stock: true,
          movements: {
            orderBy: (movements, { desc }) => [desc(movements.createdAt)],
            limit: 10,
            with: {
              performedBy: true,
            },
          },
        },
      },
    },
  });

  if (!product) {
    throw new Error("Produit introuvable");
  }

  let totalStock = 0;
  product.variants.forEach((v) => {
    if (v.stock) {
      totalStock += v.stock.quantity ?? 0;
    }
  });

  const mainImage =
    product.images.find((img) => img.isPrimary)?.url ||
    product.images[0]?.url ||
    product.imageUrl ||
    "/placeholder-product.png";

  return {
    ...product,
    totalStock,
    mainImageUrl: mainImage,
  };
}

/**
 * Create a new product with automatic QR Code generation, variants, images, and initial stock.
 */
export async function createProduct(input: CreateProductInput) {
  const { userId } = await requireRole(["admin", "commercial"]);

  const validated = createProductSchema.parse(input);

  // Check SKU uniqueness
  const existingSku = await db.query.products.findFirst({
    where: and(eq(products.sku, validated.sku), isNull(products.deletedAt)),
  });

  if (existingSku) {
    throw new Error(`Un produit avec le SKU "${validated.sku}" existe déjà.`);
  }

  // Generate slug if absent
  const generatedSlug =
    validated.slug ||
    validated.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-") +
      "-" +
      Math.random().toString(36).substring(2, 7);

  // Generate temporary random ID for QR code pre-generation or generate post-insert
  const tempProductId = crypto.randomUUID();

  // Generate QR Code Data URL
  const qrCodeUrl = await generateProductQRCode(tempProductId, validated.sku);

  // Main image fallback
  const mainImageInput =
    validated.images.find((img) => img.isPrimary)?.url || validated.images[0]?.url || null;

  // Insert Product
  const [newProduct] = await db
    .insert(products)
    .values({
      id: tempProductId,
      name: validated.name,
      slug: generatedSlug,
      sku: validated.sku,
      description: validated.description || null,
      categoryId: validated.categoryId,
      subCategoryId: validated.subCategoryId || null,
      supplierId: validated.supplierId || null,
      price: validated.price.toString(),
      costPrice: validated.costPrice ? validated.costPrice.toString() : null,
      vatRate: validated.vatRate.toString(),
      weight: validated.weight ? validated.weight.toString() : null,
      dimensions: validated.dimensions || null,
      qrCodeUrl: qrCodeUrl,
      imageUrl: mainImageInput,
      isActive: true,
    })
    .returning();

  // Insert Images
  if (validated.images && validated.images.length > 0) {
    await db.insert(productImages).values(
      validated.images.map((img, index) => ({
        productId: newProduct.id,
        url: img.url,
        key: img.key || null,
        isPrimary: img.isPrimary || index === 0,
        position: index,
      }))
    );
  }

  // Handle Variants & Initial Stock
  if (validated.variants && validated.variants.length > 0) {
    for (const v of validated.variants) {
      const [variant] = await db
        .insert(productVariants)
        .values({
          productId: newProduct.id,
          name: v.name,
          sku: v.sku,
          price: v.price !== undefined ? v.price.toString() : validated.price.toString(),
          costPrice:
            v.costPrice !== undefined
              ? v.costPrice.toString()
              : validated.costPrice
              ? validated.costPrice.toString()
              : null,
          barcode: v.barcode || null,
          attributes: v.attributes || null,
        })
        .returning();

      // Create stock
      const [stockRec] = await db
        .insert(stocks)
        .values({
          variantId: variant.id,
          quantity: v.initialStock ?? 0,
          minThreshold: v.minThreshold ?? 5,
          warehouseLocation: v.warehouseLocation || null,
        })
        .returning();

      // Log movement if initial stock > 0
      if ((v.initialStock ?? 0) > 0) {
        await db.insert(stockMovements).values({
          variantId: variant.id,
          type: "in",
          quantity: v.initialStock,
          previousQuantity: 0,
          newQuantity: v.initialStock,
          reason: "Stock initial à la création du produit",
          performedByUserId: null,
        });
      }
    }
  } else {
    // Create default variant for simple products
    const [defaultVariant] = await db
      .insert(productVariants)
      .values({
        productId: newProduct.id,
        name: "Standard",
        sku: newProduct.sku,
        price: newProduct.price,
        costPrice: newProduct.costPrice,
      })
      .returning();

    await db.insert(stocks).values({
      variantId: defaultVariant.id,
      quantity: validated.initialStock,
      minThreshold: validated.minThreshold,
      warehouseLocation: validated.warehouseLocation || null,
    });

    if (validated.initialStock > 0) {
      await db.insert(stockMovements).values({
        variantId: defaultVariant.id,
        type: "in",
        quantity: validated.initialStock,
        previousQuantity: 0,
        newQuantity: validated.initialStock,
        reason: "Stock initial à la création du produit",
      });
    }
  }

  revalidatePath("/dashboard/produits");
  return { success: true, product: newProduct };
}

/**
 * Update an existing product, updating fields, images, variants and stock.
 */
export async function updateProduct(input: UpdateProductInput) {
  await requireRole(["admin", "commercial"]);

  const validated = updateProductSchema.parse(input);

  const existingProduct = await db.query.products.findFirst({
    where: and(eq(products.id, validated.id), isNull(products.deletedAt)),
  });

  if (!existingProduct) {
    throw new Error("Produit introuvable");
  }

  // Update main product record
  const updatePayload: Record<string, any> = {
    updatedAt: new Date(),
  };

  if (validated.name !== undefined) updatePayload.name = validated.name;
  if (validated.description !== undefined) updatePayload.description = validated.description;
  if (validated.categoryId !== undefined) updatePayload.categoryId = validated.categoryId;
  if (validated.subCategoryId !== undefined) updatePayload.subCategoryId = validated.subCategoryId;
  if (validated.supplierId !== undefined) updatePayload.supplierId = validated.supplierId;
  if (validated.price !== undefined) updatePayload.price = validated.price.toString();
  if (validated.costPrice !== undefined) updatePayload.costPrice = validated.costPrice ? validated.costPrice.toString() : null;
  if (validated.vatRate !== undefined) updatePayload.vatRate = validated.vatRate.toString();
  if (validated.weight !== undefined) updatePayload.weight = validated.weight ? validated.weight.toString() : null;
  if (validated.dimensions !== undefined) updatePayload.dimensions = validated.dimensions;

  // Handle images if provided
  if (validated.images !== undefined) {
    // Delete existing images for this product
    await db.delete(productImages).where(eq(productImages.productId, validated.id));

    if (validated.images.length > 0) {
      await db.insert(productImages).values(
        validated.images.map((img, index) => ({
          productId: validated.id,
          url: img.url,
          key: img.key || null,
          isPrimary: img.isPrimary || index === 0,
          position: index,
        }))
      );

      const mainImg = validated.images.find((img) => img.isPrimary)?.url || validated.images[0].url;
      updatePayload.imageUrl = mainImg;
    } else {
      updatePayload.imageUrl = null;
    }
  }

  await db.update(products).set(updatePayload).where(eq(products.id, validated.id));

  revalidatePath("/dashboard/produits");
  revalidatePath(`/dashboard/produits/${validated.id}`);

  return { success: true };
}

/**
 * Soft delete a product by setting deletedAt timestamp.
 */
export async function deleteProduct(productId: string) {
  await requireRole(["admin", "commercial"]);

  const existingProduct = await db.query.products.findFirst({
    where: and(eq(products.id, productId), isNull(products.deletedAt)),
  });

  if (!existingProduct) {
    throw new Error("Produit introuvable");
  }

  // Soft delete product
  await db
    .update(products)
    .set({
      deletedAt: new Date(),
      isActive: false,
    })
    .where(eq(products.id, productId));

  // Soft delete variants
  await db
    .update(productVariants)
    .set({
      deletedAt: new Date(),
    })
    .where(eq(productVariants.productId, productId));

  revalidatePath("/dashboard/produits");
  return { success: true };
}

/**
 * Duplicate a product with an incremented SKU and "(Copie)" suffix.
 */
export async function duplicateProduct(productId: string) {
  await requireRole(["admin", "commercial"]);

  const sourceProduct = await getProductById(productId);

  if (!sourceProduct) {
    throw new Error("Produit source introuvable");
  }

  const newSku = `${sourceProduct.sku}-COPY-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const newName = `${sourceProduct.name} (Copie)`;

  const duplicateData: CreateProductInput = {
    name: newName,
    sku: newSku,
    description: sourceProduct.description || undefined,
    categoryId: sourceProduct.categoryId!,
    subCategoryId: sourceProduct.subCategoryId,
    supplierId: sourceProduct.supplierId,
    price: Number(sourceProduct.price),
    costPrice: sourceProduct.costPrice ? Number(sourceProduct.costPrice) : undefined,
    vatRate: Number(sourceProduct.vatRate),
    weight: sourceProduct.weight ? Number(sourceProduct.weight) : undefined,
    dimensions: (sourceProduct.dimensions as any) || undefined,
    images: sourceProduct.images.map((img) => ({
      url: img.url,
      key: img.key || undefined,
      isPrimary: img.isPrimary,
      position: img.position,
    })),
    variants: sourceProduct.variants.map((v) => ({
      name: v.name,
      sku: `${v.sku}-COPY-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
      price: v.price ? Number(v.price) : undefined,
      costPrice: v.costPrice ? Number(v.costPrice) : undefined,
      barcode: v.barcode || undefined,
      attributes: (v.attributes as any) || undefined,
      initialStock: v.stock?.quantity ?? 0,
      minThreshold: v.stock?.minThreshold ?? 5,
      warehouseLocation: v.stock?.warehouseLocation || undefined,
    })),
    initialStock: sourceProduct.totalStock ?? 0,
    minThreshold: 5,
  };

  const result = await createProduct(duplicateData);

  revalidatePath("/dashboard/produits");
  return result;
}

/**
 * Helper to fetch category list for filter select dropdowns.
 */
export async function getCategoriesList() {
  return db.query.categories.findMany({
    orderBy: (cat, { asc }) => [asc(cat.name)],
  });
}

/**
 * Helper to fetch suppliers list for filter select dropdowns.
 */
export async function getSuppliersList() {
  return db.query.suppliers.findMany({
    orderBy: (sup, { asc }) => [asc(sup.name)],
  });
}
