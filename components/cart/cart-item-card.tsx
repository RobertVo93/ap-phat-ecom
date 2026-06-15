"use client"

import { useState } from 'react';
import { ImageIcon, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ICartItem } from '@/types';
import { formatCurrency, formatNumberWithCommas } from '@/lib/utils';
import { QuantitySelector } from '@/components/common/quantity-selector';

interface CartItemCardProps {
  item: ICartItem;
  onQuantityChange: (cartItemId: string, quantity: number) => Promise<void>;
}

export function CartItemCard({
  item,
  onQuantityChange,
}: CartItemCardProps) {
  const cartItemId = item.id ?? '';
  const quantity = item.quantity ?? 0;
  const itemPrice = item.product?.price ?? 0;
  const productName = item.product?.name ?? '';
  const isActionDisabled = cartItemId.length === 0;
  const [isUpdating, setIsUpdating] = useState(false);

  const runCartAction = async (action: () => Promise<void>) => {
    if (isActionDisabled || isUpdating) return;

    try {
      setIsUpdating(true);
      await action();
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="relative overflow-hidden bg-white border-[#d4c5a0]">
      {isUpdating && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
          <Loader2 className="h-8 w-8 animate-spin text-[#573e1c]" />
        </div>
      )}
      <CardContent className={`p-6 transition duration-200 ${isUpdating ? 'blur-sm pointer-events-none select-none' : ''}`}>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            {item.product?.image ? (
              <img
                src={item.product.image}
                alt={productName}
                className="w-32 h-32 object-cover rounded-lg"
              />
            ) : (
              <ImageIcon className="w-32 h-32 text-gray-400" />
            )}
          </div>

          <div className="flex flex-col min-w-0 w-full">
            <div className="flex flex-row justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold text-[#573e1c] text-lg">
                  {productName}
                </h3>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-center mt-2 lg:mt-0">
              <QuantitySelector
                quantity={quantity}
                onQuantityChange={(newValue) => runCartAction(() => onQuantityChange(cartItemId, newValue))}
                disabled={isActionDisabled || isUpdating}
                showDelete
              />
              <div className="w-full text-right mt-2">
                <div className="text-sm text-[#8b6a42]">
                  {formatCurrency(itemPrice)} x {formatNumberWithCommas(quantity)}
                </div>
                <div className="font-bold text-[#573e1c] text-lg">
                  {formatCurrency(itemPrice * quantity)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
