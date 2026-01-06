"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from "next/navigation"
import { notFound } from 'next/navigation';
import { ProductDetailClient } from '@/components/product/product-detail-client';
import { IProduct } from '@/types';
import { getProductById } from '@/lib/httpclient/product.client';
import { LoadingOverlay } from '@/components/common/LoadOverlay';

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string

  const [loading, setLoading] = useState<boolean>(true)
  const [product, setProduct] = useState<IProduct>()

  const onGetProduct = async (id: string) => {
    try {
      setLoading(true)
      const res = await getProductById(id) as IProduct
      setProduct(res)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (productId) {
      onGetProduct(params.id as string)
    }
  }, [productId])


  if (loading) {
    return <LoadingOverlay loading={loading} />
  }

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}