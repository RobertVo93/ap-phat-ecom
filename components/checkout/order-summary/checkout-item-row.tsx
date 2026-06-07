import { ImageIcon } from 'lucide-react';
import { ICartItem } from '@/types';
import { formatCurrency, formatNumberWithCommas } from '@/lib/utils';

interface CheckoutItemRowProps {
  item: ICartItem;
}

export function CheckoutItemRow({ item }: CheckoutItemRowProps) {
  const itemPrice = item.product?.price || 0;
  const quantity = item.quantity ?? 0;

  return (
    <div className="flex items-center space-x-3">
      {item.product?.image ? (
        <img
          src={item.product.image}
          alt={item.product?.name}
          className="w-12 h-12 object-cover rounded"
        />
      ) : (
        <ImageIcon className="w-12 h-12 text-gray-400" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#573e1c] truncate">
          {item.product?.name}
        </p>
        <p className="text-xs text-[#8b6a42]">
          {formatCurrency(itemPrice)} x {formatNumberWithCommas(quantity)}
        </p>
      </div>
      <div className="text-sm font-semibold text-[#573e1c]">
        {formatCurrency(itemPrice * quantity)}
      </div>
    </div>
  );
}
