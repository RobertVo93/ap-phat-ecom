'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, ShoppingCart, Heart, Share2, Minus, Plus, Truck, Shield, RotateCcw, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { useCart } from '@/lib/contexts/cart-context';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleAddToCart = () => {
    const variant = product.variants.find(v => v.id === selectedVariant);
    addToCart(product, quantity, variant);
  };

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const productName = language === 'vi' ? product.name : product.nameEn;
  const productDescription = language === 'vi' ? product.description : product.descriptionEn;
  const productFeatures = language === 'vi' ? product.features : product.featuresEn;

  const currentPrice = selectedVariant 
    ? product.variants.find(v => v.id === selectedVariant)?.price || product.price
    : product.price;

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
                  src={product.images[selectedImageIndex]}
                  alt={productName}
                  className={`w-full h-full object-cover transition-transform duration-300 ${
                    isZoomed ? 'scale-150' : 'scale-100'
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

                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Discount Badge */}
              {product.discount && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  -{product.discount}%
                </div>
              )}

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
                      src={product.images[selectedImageIndex]}
                      alt={productName}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Thumbnail Images */}
            {product.images.length > 1 && (
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
            )}

            {/* Image Counter */}
            {product.images.length > 1 && (
              <div className="text-center text-sm text-[#8b6a42]">
                {selectedImageIndex + 1} / {product.images.length}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-[#8b6a42] font-medium uppercase tracking-wide mb-2">
                {language === 'vi' ? product.category : product.categoryEn}
              </p>
              <h1 className="text-3xl lg:text-4xl font-bold text-[#573e1c] mb-4">
                {productName}
              </h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-[#8b6a42] font-medium">
                    {product.rating} ({product.reviewCount} đánh giá)
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-[#573e1c]">
                  {formatPrice(currentPrice)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.discount && (
                  <Badge variant="destructive" className="bg-red-500">
                    -{product.discount}%
                  </Badge>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.inStock ? (
                  <div className="flex items-center text-green-600">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                    <span className="font-medium">Còn hàng</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                    <span className="font-medium">Hết hàng</span>
                  </div>
                )}
              </div>
            </div>

            {/* Variants */}
            {product.variants.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-[#573e1c]">{t('product.variants')}</h3>
                <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                  <SelectTrigger className="border-[#8b6a42]">
                    <SelectValue placeholder="Chọn loại sản phẩm" />
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
            )}

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
                  disabled={!product.inStock}
                  className="flex-1 bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1] h-12 text-lg font-semibold disabled:bg-gray-300 disabled:text-gray-500"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.inStock ? t('product.addToCart') : t('product.outOfStock')}
                </Button>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1] h-12 w-12"
                  >
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1] h-12 w-12"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-[#d4c5a0]">
                <Truck className="w-6 h-6 text-[#573e1c]" />
                <div>
                  <p className="font-semibold text-[#573e1c] text-sm">Giao hàng nhanh</p>
                  <p className="text-xs text-[#8b6a42]">Trong ngày tại TP.HCM</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-[#d4c5a0]">
                <Shield className="w-6 h-6 text-[#573e1c]" />
                <div>
                  <p className="font-semibold text-[#573e1c] text-sm">Chất lượng đảm bảo</p>
                  <p className="text-xs text-[#8b6a42]">Sản phẩm chính hãng</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-[#d4c5a0]">
                <RotateCcw className="w-6 h-6 text-[#573e1c]" />
                <div>
                  <p className="font-semibold text-[#573e1c] text-sm">Đổi trả dễ dàng</p>
                  <p className="text-xs text-[#8b6a42]">Trong vòng 7 ngày</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-[#efe1c1]">
              <TabsTrigger value="description" className="data-[state=active]:bg-[#573e1c] data-[state=active]:text-[#efe1c1]">
                {t('product.description')}
              </TabsTrigger>
              <TabsTrigger value="features" className="data-[state=active]:bg-[#573e1c] data-[state=active]:text-[#efe1c1]">
                {t('product.features')}
              </TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-[#573e1c] data-[state=active]:text-[#efe1c1]">
                Đánh giá ({product.reviewCount})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card className="border-[#d4c5a0]">
                <CardContent className="p-6">
                  <p className="text-[#8b6a42] leading-relaxed text-lg">
                    {productDescription}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="features" className="mt-6">
              <Card className="border-[#d4c5a0]">
                <CardContent className="p-6">
                  <ul className="space-y-3">
                    {productFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-[#573e1c] rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-[#8b6a42]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {/* Review Summary */}
                <Card className="border-[#d4c5a0]">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-[#573e1c] mb-2">
                          {product.rating}
                        </div>
                        <div className="flex items-center justify-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < Math.floor(product.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-[#8b6a42]">
                          Dựa trên {product.reviewCount} đánh giá
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((stars) => {
                          const count = Math.floor(Math.random() * 50) + 10; // Mock data
                          const percentage = (count / product.reviewCount) * 100;
                          
                          return (
                            <div key={stars} className="flex items-center space-x-2">
                              <span className="text-sm text-[#8b6a42] w-8">
                                {stars}★
                              </span>
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-yellow-400 h-2 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-[#8b6a42] w-8">
                                {count}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Individual Reviews */}
                {product.reviews.map((review) => (
                  <Card key={review.id} className="border-[#d4c5a0]">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-[#573e1c]">{review.customerName}</h4>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-[#8b6a42]">{review.date}</span>
                          {review.verified && (
                            <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                              Đã xác minh
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-[#8b6a42] leading-relaxed">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}

                {/* Write Review Button */}
                <div className="text-center">
                  <Button
                    variant="outline"
                    className="border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1]"
                  >
                    Viết đánh giá
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}