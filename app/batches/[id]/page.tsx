import React from 'react';
import { notFound } from 'next/navigation';
import { BatchDetailClient } from '@/components/batch/batch-detail-client';

export async function generateStaticParams() {
  // In a real application, you would fetch all batch IDs from your API
  return [
    { id: 'BT-20241215-001' },
    { id: 'BT-20241214-001' },
    { id: 'BT-20241213-001' }
  ];
}

export default function BatchDetailPage({ params }: { params: { id: string } }) {
  // In a real application, you might want to validate the batch ID format here
  if (!params.id || !params.id.match(/^BT-\d{8}-\d{3}$/)) {
    notFound();
  }

  return <BatchDetailClient batchId={params.id} />;
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  // In a real application, you would fetch batch details for metadata
  return {
    title: `Batch ${params.id} - Rice Paper Traceability`,
    description: `Complete traceability information for rice paper batch ${params.id}`,
  };
}