import { ImageIcon } from 'lucide-react';
import { IOrderItem } from '@/types';
import { formatCurrency, formatNumberWithCommas } from '@/lib/utils';

interface OrderItemRowProps {
  item: IOrderItem;
}

export function OrderItemRow({ item }: OrderItemRowProps) {
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
