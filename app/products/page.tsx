import type { Metadata } from 'next';
import { ProductsPageClient } from '@/components/product/products-page-client';
import { env, PRODUCTS_PAGE_CONTENT, SITE_CONTENT } from '@/constants';
import { getProductsPageData, ProductsPageSearchParams } from '@/lib/services/productsPageService';

type ProductsPageProps = {
  searchParams?: Promise<ProductsPageSearchParams>;
};

const siteUrl = env.BASE_ZONE || SITE_CONTENT.defaultUrl;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${PRODUCTS_PAGE_CONTENT.title} | ${SITE_CONTENT.name}`,
  description: PRODUCTS_PAGE_CONTENT.description,
  alternates: {
    canonical: '/products',
  },
  openGraph: {
    title: `${PRODUCTS_PAGE_CONTENT.title} | ${SITE_CONTENT.name}`,
    description: PRODUCTS_PAGE_CONTENT.description,
    url: '/products',
    siteName: SITE_CONTENT.name,
    images: [
      {
        url: SITE_CONTENT.defaultOgImage,
        width: SITE_CONTENT.defaultOgImageWidth,
        height: SITE_CONTENT.defaultOgImageHeight,
        alt: SITE_CONTENT.name,
      },
    ],
    locale: SITE_CONTENT.locale,
    type: 'website',
  },
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const productsPageData = await getProductsPageData(resolvedSearchParams);

  return (
    <main className="min-h-screen bg-[#f8f5f0]">
      <ProductsPageClient
        collections={productsPageData.collections}
        priceRange={productsPageData.priceRange}
        products={productsPageData.products}
        searchQuery={productsPageData.searchQuery}
        selectedCollection={productsPageData.selectedCollection}
        sortBy={productsPageData.sortBy}
        total={productsPageData.total}
      />
    </main>
  );
}
