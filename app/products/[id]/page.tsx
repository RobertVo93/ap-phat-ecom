import React from 'react';
import { notFound } from 'next/navigation';
import { ProductDetailClient } from '@/components/product/product-detail-client';
import { IProduct } from '@/types';

export async function generateStaticParams() {
  const products: IProduct[] = []
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const products: IProduct[] = []
  const product = products.find(p => p.id === id);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}