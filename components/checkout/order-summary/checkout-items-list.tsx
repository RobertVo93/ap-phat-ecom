import { ICartItem } from '@/types';
import { CheckoutItemRow } from '@/components/checkout/order-summary/checkout-item-row';

interface CheckoutItemsListProps {
  items: ICartItem[];
}

export function CheckoutItemsList({ items }: CheckoutItemsListProps) {
  return (
    <div className="space-y-3 max-h-60 overflow-y-auto">
      {items.map((item) => (
        <CheckoutItemRow key={item.id} item={item} />
      ))}
    </div>
  );
}
