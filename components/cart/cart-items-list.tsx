import { ICartItem } from '@/types';
import { CartItemCard } from '@/components/cart/cart-item-card';

interface CartItemsListProps {
  items: ICartItem[];
  onQuantityChange: (cartItemId: string, quantity: number) => void;
  onRemove: (cartItemId: string) => void;
}

export function CartItemsList({
  items,
  onQuantityChange,
  onRemove,
}: CartItemsListProps) {
  return (
    <div className="lg:col-span-2 space-y-4">
      {items.map((item) => (
        <CartItemCard
          key={item.id}
          item={item}
          onQuantityChange={onQuantityChange}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
