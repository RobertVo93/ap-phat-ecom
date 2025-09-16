import React from 'react';
import { notFound } from 'next/navigation';
import { mockProducts } from '@/lib/mock-data/products';
import { ProductDetailClient } from '@/components/product/product-detail-client';

export async function generateStaticParams() {
  return mockProducts.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = mockProducts.find(p => p.id === id);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}