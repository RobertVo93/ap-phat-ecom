'use client';

import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { useCart } from '@/lib/contexts/cart-context';
import { IProduct, ProductStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils.currency';
import { ProductDetailTable } from './product-detail-table';
import { Card, CardContent } from '@/components/ui/card';
import { QuantitySelector } from '@/components/common/quantity-selector';
import { ProductImageGallery } from '@/components/product/product-image-gallery';

interface ProductDetailClientProps {
  product: IProduct;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  // Determine if Add to Cart button should be disabled
  const isAddToCartDisabled = product.stock! < product.minStock!

  // Get button text based on state
  const getAddToCartButtonText = () => {
    if (product.status === ProductStatus.outOfStock) {
      return t('product.outOfStock');
    }
    return t('product.addToCart');
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0] text-[#8b6a42]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ProductImageGallery
            image={product.image}
            subImages={product.subImages}
            productName={product.name}
          />

          {/* Product Info */}
          <Card className="space-y-6">
            <CardContent className="space-y-6 pt-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-[#573e1c] mb-4">
                  {product.name}
                </h1>


                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-3xl font-bold text-[#573e1c]">
                    {formatCurrency(product.price!)}
                  </span>
                </div>

                {/* Stock Status */}
                <div className="mb-6">
                  {product.status !== ProductStatus.outOfStock ? (
                    <div className="flex items-center text-green-600">
                      <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                      <span className="font-medium">{t('product.inStock')}</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                      <span className="font-medium">{t('product.outOfStock')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className='flex items-center justify-between lg:space-x-4 lg:justify-normal'>
                  <span className="font-semibold text-[#573e1c]">{t('cart.quantity')}:</span>
                  <QuantitySelector
                    quantity={quantity}
                    onQuantityChange={(newValue) => setQuantity(newValue)}
                    min={1}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={isAddToCartDisabled}
                    className="flex-1 bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1] text-lg font-semibold disabled:bg-gray-300 disabled:text-gray-500"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {getAddToCartButtonText()}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Details Table */}
        <ProductDetailTable product={product} />
      </div>
    </div>
  );
}
