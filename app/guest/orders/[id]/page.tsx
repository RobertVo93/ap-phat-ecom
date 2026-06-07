import React from 'react';
import { notFound } from 'next/navigation';
import { OrderDetailClient } from '@/components/order/order-detail-client';

type GuestOrderPageProps = {
  params: Promise<{ id: string }>;
};

export default async function GuestOrderPage({ params }: GuestOrderPageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  return <OrderDetailClient id={id} isGuestView={true}/>;
}
