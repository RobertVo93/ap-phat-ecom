'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ProductImagePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: string[];
  selectedImage?: string;
  selectedIndex: number;
  productName?: string;
  hasMultipleImages: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSelectImage: (index: number) => void;
}

export function ProductImagePreviewDialog({
  open,
  onOpenChange,
  images,
  selectedImage,
  selectedIndex,
  productName,
  hasMultipleImages,
  onPrevious,
  onNext,
  onSelectImage,
}: ProductImagePreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-6xl max-h-[90vh] overflow-hidden bg-white p-0">
        <div className="grid max-h-[90vh] grid-cols-1 overflow-hidden lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="relative flex min-h-0 items-center justify-center overflow-hidden bg-[#f8f5f0] p-4 lg:h-[85vh]">
            {hasMultipleImages && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onPrevious}
                className="absolute left-4 top-1/2 z-10 h-12 w-12 -translate-y-1/2 rounded-full bg-black/45 text-white hover:bg-black/60 hover:text-white"
                aria-label="Previous preview image"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
            )}

            {selectedImage && (
              <div className="relative aspect-square w-full max-w-[min(100%,calc(85vh-2rem))] overflow-hidden">
                <img
                  src={selectedImage}
                  alt={productName || 'Product image preview'}
                  className="h-full w-full object-contain"
                />
              </div>
            )}

            {hasMultipleImages && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onNext}
                className="absolute right-4 top-1/2 z-10 h-12 w-12 -translate-y-1/2 rounded-full bg-black/45 text-white hover:bg-black/60 hover:text-white"
                aria-label="Next preview image"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            )}
          </div>

          <aside className="hidden overflow-y-auto border-l border-[#efe1c1] bg-white p-6 lg:block">
            <h3 className="mb-4 line-clamp-2 text-xl font-semibold text-[#573e1c]">
              {productName}
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {images.map((item, index) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => onSelectImage(index)}
                  className={cn(
                    'aspect-square overflow-hidden rounded-lg border-2 bg-white transition',
                    selectedIndex === index
                      ? 'border-[#573e1c]'
                      : 'border-transparent hover:border-[#d4c5a0]',
                  )}
                  aria-label={`Preview product image ${index + 1}`}
                >
                  <img
                    src={item}
                    alt={`${productName || 'Product preview'} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}
