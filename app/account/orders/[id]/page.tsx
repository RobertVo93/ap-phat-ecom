import React from 'react';
import { notFound } from 'next/navigation';
import { OrderDetailClient } from '@/components/order/order-detail-client';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  return <OrderDetailClient id={id} />;
}