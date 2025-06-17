'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingCart, X, Plus, Minus } from 'lucide-react';
import { Product, ProductVariant } from '@/lib/types';
import { useLanguage } from '@/lib/contexts/language-context';
import { useCart } from '@/lib/contexts/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If product has no variants, add directly to cart
    if (product.variants.length === 0) {
      addToCart(product, 1);
      return;
    }
    
    // If product has variants, open selection modal
    setIsVariantModalOpen(true);
    setSelectedVariant('');
    setQuantity(1);
  };

  const handleConfirmAddToCart = () => {
    if (!selectedVariant) return;
    
    const variant = product.variants.find(v => v.id === selectedVariant);
    addToCart(product, quantity, variant);
    setIsVariantModalOpen(false);
    setSelectedVariant('');
    setQuantity(1);
  };

  const productName = language === 'vi' ? product.name : product.nameEn;
  const productCategory = language === 'vi' ? product.category : product.categoryEn;

  const selectedVariantData = product.variants.find(v => v.id === selectedVariant);
  const currentPrice = selectedVariantData?.price || product.price;

  return (
    <>
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

            {/* Show variant info if available */}
            {product.variants.length > 0 && (
              <p className="text-xs text-[#8b6a42]">
                {product.variants.length} lựa chọn có sẵn
              </p>
            )}

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

      {/* Variant Selection Modal */}
      <Dialog open={isVariantModalOpen} onOpenChange={setIsVariantModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#573e1c] text-xl">
              Chọn loại sản phẩm
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Product Info */}
            <div className="flex items-start space-x-4">
              <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={product.images[0]}
                  alt={productName}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[#573e1c] text-lg mb-1">
                  {productName}
                </h3>
                <p className="text-sm text-[#8b6a42] mb-2">
                  {productCategory}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-[#573e1c] text-lg">
                    {formatPrice(currentPrice)}
                  </span>
                  {product.originalPrice && selectedVariant === '' && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  {product.discount && selectedVariant === '' && (
                    <Badge variant="destructive" className="bg-red-500">
                      -{product.discount}%
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Variant Selection */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#573e1c] mb-2">
                  Chọn loại sản phẩm *
                </label>
                <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                  <SelectTrigger className="border-[#8b6a42] focus:border-[#573e1c]">
                    <SelectValue placeholder="Vui lòng chọn loại sản phẩm" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.variants.map((variant) => (
                      <SelectItem key={variant.id} value={variant.id}>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {language === 'vi' ? variant.name : variant.nameEn}
                            </span>
                            <div className="flex space-x-2 text-xs text-[#8b6a42]">
                              {variant.options.map((option, index) => (
                                <span key={index}>
                                  {language === 'vi' ? option.value : option.valueEn}
                                </span>
                              ))}
                            </div>
                          </div>
                          {variant.price && (
                            <span className="ml-4 font-semibold text-[#573e1c]">
                              {formatPrice(variant.price)}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity Selection */}
              <div>
                <label className="block text-sm font-semibold text-[#573e1c] mb-2">
                  Số lượng
                </label>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center border border-[#8b6a42] rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-[#573e1c] hover:bg-[#efe1c1] h-10 w-10"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-[#573e1c] hover:bg-[#efe1c1] h-10 w-10"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <span className="text-sm text-[#8b6a42]">
                    Tổng: {formatPrice(currentPrice * quantity)}
                  </span>
                </div>
              </div>
            </div>

            {/* Selected Variant Details */}
            {selectedVariantData && (
              <div className="p-4 bg-[#f8f5f0] rounded-lg border border-[#d4c5a0]">
                <h4 className="font-semibold text-[#573e1c] mb-2">
                  Thông tin sản phẩm đã chọn:
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#8b6a42]">Loại:</span>
                    <span className="font-medium text-[#573e1c]">
                      {language === 'vi' ? selectedVariantData.name : selectedVariantData.nameEn}
                    </span>
                  </div>
                  {selectedVariantData.options.map((option, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-[#8b6a42] capitalize">{option.type}:</span>
                      <span className="font-medium text-[#573e1c]">
                        {language === 'vi' ? option.value : option.valueEn}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between">
                    <span className="text-[#8b6a42]">Số lượng:</span>
                    <span className="font-medium text-[#573e1c]">{quantity}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#d4c5a0]">
                    <span className="text-[#8b6a42] font-semibold">Tổng tiền:</span>
                    <span className="font-bold text-[#573e1c] text-lg">
                      {formatPrice(currentPrice * quantity)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsVariantModalOpen(false)}
                className="flex-1 border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1]"
              >
                Hủy
              </Button>
              <Button
                onClick={handleConfirmAddToCart}
                disabled={!selectedVariant}
                className="flex-1 bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1] disabled:bg-gray-300 disabled:text-gray-500"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Thêm vào giỏ hàng
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}