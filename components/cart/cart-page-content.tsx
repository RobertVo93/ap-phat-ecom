'use client';

import { useMemo } from 'react';
import { env } from '@/constants';
import { useCart } from '@/lib/contexts/cart-context';
import { CartEmptyState } from '@/components/cart/cart-empty-state';
import { CartHeader } from '@/components/cart/cart-header';
import { CartItemsList } from '@/components/cart/cart-items-list';
import { CartOrderSummary } from '@/components/cart/cart-order-summary';

export function CartPageContent() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    getCartItemsCount,
  } = useCart();

  const subtotal = getCartTotal();
  const tax = useMemo(() => subtotal * parseFloat(env.NEXT_PUBLIC_TAX_RATE), [subtotal]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  if (items.length === 0) {
    return <CartEmptyState />;
  }

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CartHeader itemsCount={getCartItemsCount()} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <CartItemsList
            items={items}
            onQuantityChange={updateQuantity}
            onRemove={removeFromCart}
          />
          <CartOrderSummary
            subtotal={subtotal}
            tax={tax}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}
