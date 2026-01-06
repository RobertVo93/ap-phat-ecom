'use client';

import React, { useState } from 'react';
import { ShoppingCart, Copy, Minus, Plus, Truck, Shield, RotateCcw, ZoomIn } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { useCart } from '@/lib/contexts/cart-context';
import { IProduct, ProductStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { formatCurrencyVND } from '@/lib/utils.currency';
import { ProductDetailTable } from './product-detail-table';
import { toast } from "sonner"

interface ProductDetailClientProps {
  product: IProduct;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const handleCopy = async () => {
    const url = window.location.href
    await navigator.clipboard.writeText(url)
    toast.success(t("product.copied"))
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const nextImage = () => {
    setSelectedImageIndex(0);
  };

  const prevImage = () => {
    setSelectedImageIndex(0);
  };

  const currentPrice = product.price;

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
    <div className="min-h-screen bg-[#f8f5f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images with Zoom */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-lg group">
              <div
                className="relative w-full h-full cursor-zoom-in"
                onMouseMove={handleImageMouseMove}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'
                    }`}
                  style={
                    isZoomed
                      ? {
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      }
                      : {}
                  }
                />

                {/* Zoom Icon */}
                <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>
              {/* Full Screen Zoom Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70">
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
                  <div className="relative w-full h-full">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Thumbnail Images */}
            {/* {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImageIndex === index 
                        ? 'border-[#573e1c] ring-2 ring-[#573e1c] ring-opacity-50' 
                        : 'border-transparent hover:border-[#8b6a42]'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${productName} ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </button>
                ))}
              </div>
            )} */}

            {/* Image Counter */}
            {/* {product.images.length > 1 && (
              <div className="text-center text-sm text-[#8b6a42]">
                {selectedImageIndex + 1} / {product.images.length}
              </div>
            )} */}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-[#8b6a42] font-medium uppercase tracking-wide mb-2">
                {product.sku}
              </p>
              <h1 className="text-3xl lg:text-4xl font-bold text-[#573e1c] mb-4">
                {product.name}
              </h1>


              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-[#573e1c]">
                  {formatCurrencyVND(product.price!)}
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
              <div className="flex items-center space-x-4">
                <span className="font-semibold text-[#573e1c]">{t('cart.quantity')}:</span>
                <div className="flex items-center border border-[#8b6a42] rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-[#573e1c] hover:bg-[#efe1c1]"
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
                    className="text-[#573e1c] hover:bg-[#efe1c1]"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={isAddToCartDisabled}
                  className="flex-1 bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1] h-12 text-lg font-semibold disabled:bg-gray-300 disabled:text-gray-500"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {getAddToCartButtonText()}
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1] h-12 w-12"
                    onClick={handleCopy}
                  >
                    <Copy className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-[#d4c5a0]">
                <Truck className="w-6 h-6 text-[#573e1c]" />
                <div>
                  <p className="font-semibold text-[#573e1c] text-sm">{t('product.fastShipping')}</p>
                  <p className="text-xs text-[#8b6a42]">{t('product.sameDayDelivery')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-[#d4c5a0]">
                <Shield className="w-6 h-6 text-[#573e1c]" />
                <div>
                  <p className="font-semibold text-[#573e1c] text-sm">{t('product.qualityGuarantee')}</p>
                  <p className="text-xs text-[#8b6a42]">{t('product.authenticProducts')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-[#d4c5a0]">
                <RotateCcw className="w-6 h-6 text-[#573e1c]" />
                <div>
                  <p className="font-semibold text-[#573e1c] text-sm">{t('product.easyReturns')}</p>
                  <p className="text-xs text-[#8b6a42]">{t('product.returnPolicy')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Table */}
        <ProductDetailTable product={product} />
      </div>
    </div>
  );
}