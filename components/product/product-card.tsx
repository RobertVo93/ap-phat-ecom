'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '@/lib/types';
import { useLanguage } from '@/lib/contexts/language-context';
import { useCart } from '@/lib/contexts/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ProductCardProps {
  product: Product;
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

  const productName = language === 'vi' ? product.name : product.nameEn;
  const productCategory = language === 'vi' ? product.category : product.categoryEn;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 bg-white border-[#d4c5a0] overflow-hidden">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.images[0]}
            alt={productName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.discount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              -{product.discount}%
            </div>
          )}
          {!product.inStock && (
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
          <p className="text-xs text-[#8b6a42] font-medium uppercase tracking-wide">
            {productCategory}
          </p>
          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold text-[#573e1c] group-hover:text-[#8b6a42] transition-colors line-clamp-2">
              {productName}
            </h3>
          </Link>
        </div>

        <div className="flex items-center space-x-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-[#8b6a42]">
            ({product.reviewCount})
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-[#573e1c] text-lg">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1] disabled:bg-gray-300 disabled:text-gray-500"
            size="sm"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.inStock ? t('product.addToCart') : t('product.outOfStock')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}