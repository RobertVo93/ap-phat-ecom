'use client';

import { useState, useEffect } from 'react';
import { IBatchDetailComplete } from '@/types/batch.interface';
import { mockBatchDetail } from '@/mock-data/batch-detail';

export function useBatchDetail(batchId: string) {
  const [batchDetail, setBatchDetail] = useState<IBatchDetailComplete | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBatchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real application, this would be an API call
        // const response = await fetch(`/api/batches/${batchId}`);
        // const data = await response.json();
        
        // For now, return mock data
        setBatchDetail(mockBatchDetail);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch batch details');
      } finally {
        setLoading(false);
      }
    };

    if (batchId) {
      fetchBatchDetail();
    }
  }, [batchId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysFromProduction = (productionDate: string) => {
    const now = new Date();
    const production = new Date(productionDate);
    const diffTime = Math.abs(now.getTime() - production.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock':
        return 'bg-blue-100 text-blue-800';
      case 'in_transit':
        return 'bg-yellow-100 text-yellow-800';
      case 'sold':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransportationStatusColor = (status: string) => {
    switch (status) {
      case 'picked_up':
        return 'bg-blue-100 text-blue-800';
      case 'in_transit':
        return 'bg-yellow-100 text-yellow-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'stored':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProductionStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'in_progress':
        return '⏳';
      case 'pending':
        return '⏸';
      default:
        return '○';
    }
  };

  return {
    batchDetail,
    loading,
    error,
    formatDate,
    formatDateShort,
    getDaysFromProduction,
    getDaysUntilExpiry,
    getStatusColor,
    getTransportationStatusColor,
    getProductionStepIcon
  };
}