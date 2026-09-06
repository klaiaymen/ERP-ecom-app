import { getProducts, getCategoriesList, getSuppliersList } from "@/actions/produits";
import { ProductCatalogueClient } from "@/components/produits/ProductCatalogueClient";

export const dynamic = "force-dynamic";

interface ProduitsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    categoryId?: string;
    supplierId?: string;
    stockStatus?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export default async function ProduitsPage({ searchParams }: ProduitsPageProps) {
  const params = await searchParams;

  const parsedParams = {
    page: params.page ? parseInt(params.page, 10) : 1,
    limit: params.limit ? parseInt(params.limit, 10) : 12,
    search: params.search,
    categoryId: params.categoryId,
    supplierId: params.supplierId,
    stockStatus: (params.stockStatus as any) || "all",
    minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
    sortBy: (params.sortBy as any) || "createdAt",
    sortOrder: (params.sortOrder as any) || "desc",
  };

  const [productsData, categories, suppliers] = await Promise.all([
    getProducts(parsedParams),
    getCategoriesList(),
    getSuppliersList(),
  ]);

  return (
    <ProductCatalogueClient
      products={productsData.data as any}
      categories={categories}
      suppliers={suppliers}
      pagination={productsData.pagination}
    />
  );
}
