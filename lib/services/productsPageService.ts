import 'server-only';

import { unstable_cache } from 'next/cache';
import { DEFAULT_PRICE_RANGE } from '@/constants';
import { ensureDataSource } from '@/lib/database/ensureDataSource';
import { getSaleableCollectionsForFilter } from '@/lib/services/collectionService';
import { getAllProducts } from '@/lib/services/productService';
import { ICollection, IProduct, ProductSortBy, ProductStatus } from '@/types';

export const DEFAULT_PRODUCT_SORT_BY = ProductSortBy.nameHigh;

const COLLECTIONS_CACHE_REVALIDATE_SECONDS = 300;
const PRODUCTS_CACHE_REVALIDATE_SECONDS = 60;

type SearchParamValue = string | string[] | undefined;

export interface ProductsPageSearchParams {
  collection?: SearchParamValue;
  search?: SearchParamValue;
  priceMin?: SearchParamValue;
  priceMax?: SearchParamValue;
  sortBy?: SearchParamValue;
}

export interface ProductsPageFilters {
  selectedCollection: string;
  searchQuery: string;
  priceRange: [number, number];
  sortBy: ProductSortBy;
}

export interface ProductsPageData extends ProductsPageFilters {
  collections: ICollection[];
  products: IProduct[];
  total: number;
}

interface ProductsQueryResult {
  data: IProduct[];
  total: number;
}

interface ProductsQueryInput {
  collectionId?: string;
  search?: string;
  priceMin: number;
  priceMax: number;
  sortBy: ProductSortBy;
}

const getSingleParam = (value: SearchParamValue): string | undefined => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

const parseNumberParam = (value: SearchParamValue, fallback: number): number => {
  const rawValue = getSingleParam(value);
  const parsedValue = rawValue !== undefined ? Number(rawValue) : Number.NaN;

  return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

const parseSortBy = (value: SearchParamValue): ProductSortBy => {
  const rawValue = getSingleParam(value);

  return Object.values(ProductSortBy).includes(rawValue as ProductSortBy)
    ? rawValue as ProductSortBy
    : DEFAULT_PRODUCT_SORT_BY;
};

const parseProductsFilters = (searchParams: ProductsPageSearchParams): ProductsPageFilters => ({
  selectedCollection: getSingleParam(searchParams.collection) ?? '',
  searchQuery: getSingleParam(searchParams.search) ?? '',
  priceRange: [
    parseNumberParam(searchParams.priceMin, DEFAULT_PRICE_RANGE[0]),
    parseNumberParam(searchParams.priceMax, DEFAULT_PRICE_RANGE[1]),
  ],
  sortBy: parseSortBy(searchParams.sortBy),
});

const mapCollectionForClient = (collection: ICollection): ICollection => ({
  id: collection.id,
  number: collection.number,
  name: collection.name,
  description: collection.description,
  status: collection.status,
  image: collection.image,
  saleable: collection.saleable,
});

const mapProductForClient = (product: IProduct): IProduct => ({
  id: product.id,
  name: product.name,
  unit: product.unit,
  description: product.description,
  price: product.price,
  cost: product.cost,
  stock: product.stock,
  minStock: product.minStock,
  sku: product.sku,
  barcode: product.barcode,
  status: product.status,
  supplier: product.supplier,
  image: product.image,
});

const getCachedSaleableCollections = unstable_cache(
  async (): Promise<ICollection[]> => {
    await ensureDataSource();
    const collections = await getSaleableCollectionsForFilter();

    return collections.map(mapCollectionForClient);
  },
  ['products-page-saleable-collections'],
  {
    revalidate: COLLECTIONS_CACHE_REVALIDATE_SECONDS,
    tags: ['products-page', 'collections'],
  },
);

const getCachedProducts = unstable_cache(
  async ({ collectionId, search, priceMin, priceMax, sortBy }: ProductsQueryInput): Promise<ProductsQueryResult> => {
    await ensureDataSource();

    const result = await getAllProducts({
      sortBy,
      filters: {
        status: ProductStatus.active,
        collectionId,
        search,
        priceRange: {
          min: priceMin,
          max: priceMax,
        },
      },
    }) as ProductsQueryResult;

    return {
      ...result,
      data: result.data.map(mapProductForClient),
    };
  },
  ['products-page-products'],
  {
    revalidate: PRODUCTS_CACHE_REVALIDATE_SECONDS,
    tags: ['products-page', 'products'],
  },
);

export async function getProductsPageData(
  searchParams: ProductsPageSearchParams = {},
): Promise<ProductsPageData> {
  const filters = parseProductsFilters(searchParams);

  console.log('[ProductsPageService.getProductsPageData]-start', {
    selectedCollection: filters.selectedCollection,
    searchQuery: filters.searchQuery,
    priceRange: filters.priceRange,
    sortBy: filters.sortBy,
  });

  try {
    const collections = await getCachedSaleableCollections();
    const collectionId = filters.selectedCollection
      ? collections.find((collection) => collection.number === filters.selectedCollection)?.id
      : undefined;

    const result = await getCachedProducts({
      collectionId,
      search: filters.searchQuery || undefined,
      priceMin: filters.priceRange[0],
      priceMax: filters.priceRange[1],
      sortBy: filters.sortBy,
    });

    console.log('[ProductsPageService.getProductsPageData]-success', {
      selectedCollection: filters.selectedCollection,
      collectionId,
      total: result.total,
      productCount: result.data.length,
      collectionCount: collections.length,
    });

    return {
      ...filters,
      collections,
      products: result.data,
      total: result.total,
    };
  } catch (error) {
    console.error('[ProductsPageService.getProductsPageData]-failed', {
      selectedCollection: filters.selectedCollection,
      searchQuery: filters.searchQuery,
      priceRange: filters.priceRange,
      sortBy: filters.sortBy,
      error: error instanceof Error ? error.message : String(error),
    });

    throw error;
  }
}
