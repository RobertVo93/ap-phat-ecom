import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormattedNumber } from '@/components/ui/formatted-number';
import { MAX_CART_ITEM_QUANTITY } from '@/constants';

interface CartQuantityControlProps {
  cartItemId: string;
  quantity: number;
  disabled?: boolean;
  onQuantityChange: (cartItemId: string, quantity: number) => void;
}

export function CartQuantityControl({
  cartItemId,
  quantity,
  disabled = false,
  onQuantityChange,
}: CartQuantityControlProps) {
  return (
    <div className="flex items-center border border-[#8b6a42] rounded-lg max-h-[40px] max-w-[200px]">
      <Button
        variant="ghost"
        size="sm"
        disabled={disabled}
        onClick={() => onQuantityChange(cartItemId, quantity - 1)}
        className="text-[#573e1c] hover:bg-[#efe1c1]"
      >
        <Minus className="w-4 h-4" />
      </Button>
      <FormattedNumber
        as="input"
        id={`quantity-${cartItemId}`}
        value={quantity}
        min={0}
        max={MAX_CART_ITEM_QUANTITY}
        onValueChange={(value) => onQuantityChange(cartItemId, value)}
        disabled={disabled}
        className="max-h-[38px] text-center border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
      />
      <Button
        variant="ghost"
        size="sm"
        disabled={disabled || quantity === MAX_CART_ITEM_QUANTITY}
        onClick={() => onQuantityChange(cartItemId, quantity + 1)}
        className="text-[#573e1c] hover:bg-[#efe1c1]"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
}
