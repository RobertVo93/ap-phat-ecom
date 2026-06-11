import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetailClient } from '@/components/product/product-detail-client';
import { PRODUCT_DETAIL_PAGE_CONTENT, SITE_CONTENT } from '@/constants';
import { ensureDataSource } from '@/lib/database/ensureDataSource';
import { getProductById } from '@/lib/services/productService';
import { IProduct, ProductStatus } from '@/types';

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

const siteUrl = process.env.NEXT_PUBLIC_BASE_ZONE || SITE_CONTENT.defaultUrl;

const serializeForClient = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

const getProduct = cache(async (id: string): Promise<IProduct | null> => {
  await ensureDataSource();
  const product = await getProductById(id);

  return product ? serializeForClient(product) : null;
});

const buildProductDescription = (product: IProduct): string => {
  if (product.description) {
    return product.description;
  }

  return `${product.name} tại ${SITE_CONTENT.name}. ${PRODUCT_DETAIL_PAGE_CONTENT.defaultDescriptionSuffix}`;
};

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: `${PRODUCT_DETAIL_PAGE_CONTENT.notFoundTitle} | ${SITE_CONTENT.name}`,
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${product.name} | ${SITE_CONTENT.name}`;
  const description = buildProductDescription(product);

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: `/products/${product.id}`,
    },
    openGraph: {
      title,
      description,
      url: `/products/${product.id}`,
      siteName: SITE_CONTENT.name,
      images: product.image
        ? [
            {
              url: product.image,
              alt: `${product.name}${PRODUCT_DETAIL_PAGE_CONTENT.productImageAltSeparator}${SITE_CONTENT.name}`,
            },
          ]
        : [
            {
              url: SITE_CONTENT.defaultOgImage,
              width: SITE_CONTENT.defaultOgImageWidth,
              height: SITE_CONTENT.defaultOgImageHeight,
              alt: `${PRODUCT_DETAIL_PAGE_CONTENT.fallbackImageAltPrefix} ${SITE_CONTENT.name}`,
            },
          ],
      locale: SITE_CONTENT.locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.image ? [product.image] : [SITE_CONTENT.defaultOgImage],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const productJsonLd = {
    '@context': PRODUCT_DETAIL_PAGE_CONTENT.schema.context,
    '@type': PRODUCT_DETAIL_PAGE_CONTENT.schema.productType,
    name: product.name,
    description: buildProductDescription(product),
    image: product.image ? [product.image] : [`${siteUrl}${SITE_CONTENT.defaultOgImage}`],
    sku: product.sku,
    brand: {
      '@type': PRODUCT_DETAIL_PAGE_CONTENT.schema.brandType,
      name: SITE_CONTENT.name,
    },
    offers: {
      '@type': PRODUCT_DETAIL_PAGE_CONTENT.schema.offerType,
      url: `${siteUrl}/products/${product.id}`,
      priceCurrency: PRODUCT_DETAIL_PAGE_CONTENT.currency,
      price: product.price,
      availability:
        product.status === ProductStatus.outOfStock
          ? PRODUCT_DETAIL_PAGE_CONTENT.schema.outOfStock
          : PRODUCT_DETAIL_PAGE_CONTENT.schema.inStock,
      itemCondition: PRODUCT_DETAIL_PAGE_CONTENT.schema.newCondition,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductDetailClient product={product} />
    </>
  );
}
