import React from 'react';
import { notFound } from 'next/navigation';
import { mockOrders } from '@/lib/mock-data/orders';
import { OrderDetailClient } from '@/components/order/order-detail-client';
import { Order } from '@/lib/types';

export async function generateStaticParams() {
  return [{
    id: "ORD-001"
  }];
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const order = mockOrders.find(p => p.id === params.id);

  if (!order) {
    notFound();
  }

  return <OrderDetailClient order={order as unknown as Order} />;
}