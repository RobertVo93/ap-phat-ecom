import { ImageIcon, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ICartItem } from '@/types';
import { formatCurrency, formatNumberWithCommas } from '@/lib/utils';
import { CartQuantityControl } from '@/components/cart/cart-quantity-control';

interface CartItemCardProps {
  item: ICartItem;
  onQuantityChange: (cartItemId: string, quantity: number) => void;
  onRemove: (cartItemId: string) => void;
}

export function CartItemCard({
  item,
  onQuantityChange,
  onRemove,
}: CartItemCardProps) {
  const cartItemId = item.id ?? '';
  const quantity = item.quantity ?? 0;
  const itemPrice = item.product?.price ?? 0;
  const productName = item.product?.name ?? '';
  const isActionDisabled = cartItemId.length === 0;

  return (
    <Card className="bg-white border-[#d4c5a0]">
      <CardContent className="p-6">
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

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(cartItemId)}
                disabled={isActionDisabled}
                className="hidden lg:block text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-center mt-2 lg:mt-0">
              <CartQuantityControl
                cartItemId={cartItemId}
                quantity={quantity}
                onQuantityChange={onQuantityChange}
                disabled={isActionDisabled}
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
