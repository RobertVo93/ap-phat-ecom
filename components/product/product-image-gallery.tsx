'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductImagePreviewDialog } from '@/components/product/product-image-preview-dialog';
import { cn } from '@/lib/utils';

interface ProductImageGalleryProps {
  image?: string;
  subImages?: string[];
  productName?: string;
}

const buildProductImages = (image?: string, subImages: string[] = []): string[] => {
  const images = [image, ...subImages]
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0);

  return Array.from(new Set(images));
};

export function ProductImageGallery({ image, subImages, productName }: ProductImageGalleryProps) {
  const images = useMemo(() => buildProductImages(image, subImages), [image, subImages]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const selectedImage = images[selectedIndex];
  const hasMultipleImages = images.length > 1;

  const goToPrevious = () => {
    if (!hasMultipleImages) return;

    setSelectedIndex((currentIndex) => (currentIndex - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    if (!hasMultipleImages) return;

    setSelectedIndex((currentIndex) => (currentIndex + 1) % images.length);
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-[#573e1c]"
        onClick={() => selectedImage && setIsPreviewOpen(true)}
        disabled={!selectedImage}
        aria-label="Open product image preview"
      >
        {selectedImage ? (
          <img
            src={selectedImage}
            alt={productName || 'Product image'}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-[#8b6a42]">
            <ImageIcon className="mb-3 h-16 w-16" />
          </div>
        )}
      </button>

      {images.length > 0 && (
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={goToPrevious}
            disabled={!hasMultipleImages}
            className="border-[#d4c5a0] text-[#573e1c] hover:bg-[#efe1c1]"
            aria-label="Previous product image"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="flex min-w-0 flex-1 gap-3 overflow-x-auto pb-1">
            {images.map((item, index) => (
              <button
                key={item}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  'h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 bg-white transition',
                  selectedIndex === index
                    ? 'border-[#573e1c] shadow-md'
                    : 'border-[#d4c5a0] hover:border-[#8b6a42]',
                )}
                aria-label={`Select product image ${index + 1}`}
              >
                <img
                  src={item}
                  alt={`${productName || 'Product image'} ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={goToNext}
            disabled={!hasMultipleImages}
            className="border-[#d4c5a0] text-[#573e1c] hover:bg-[#efe1c1]"
            aria-label="Next product image"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}

      <ProductImagePreviewDialog
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        images={images}
        selectedImage={selectedImage}
        selectedIndex={selectedIndex}
        productName={productName}
        hasMultipleImages={hasMultipleImages}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onSelectImage={setSelectedIndex}
      />
    </div>
  );
}
