import React from 'react';
import { notFound } from 'next/navigation';
import { mockProducts } from '@/lib/mock-data/products';
import { ProductDetailClient } from '@/components/product/product-detail-client';

export async function generateStaticParams() {
  return mockProducts.map((product) => ({
    id: product.id,
  }));
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = mockProducts.find(p => p.id === params.id);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}