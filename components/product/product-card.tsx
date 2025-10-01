'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { useCart } from '@/lib/contexts/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { IProduct } from '@/types';

interface ProductCardProps {
  product: IProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  if(!product) return null

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 bg-white border-[#d4c5a0] overflow-hidden">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image!}
            alt={product.name!}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {!product.stock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold bg-gray-800 px-3 py-1 rounded">
                {t('product.outOfStock')}
              </span>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-4 space-y-3">
        <div className="space-y-1">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold text-[#573e1c] group-hover:text-[#8b6a42] transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-[#573e1c] text-lg">
              {formatPrice(product.price!)}
            </span>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={!product.stock}
            className="w-full bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1] disabled:bg-gray-300 disabled:text-gray-500"
            size="sm"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.stock ? t('product.addToCart') : t('product.outOfStock')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}