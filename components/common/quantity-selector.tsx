'use client';

import { useEffect, useMemo, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormattedNumber } from '@/components/ui/formatted-number';
import { MAX_CART_ITEM_QUANTITY } from '@/constants';
import { cn } from '@/lib/utils';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  id?: string;
  className?: string;
}

const DEBOUNCE_DELAY_MS = 500;
type QuantityChangeSource = 'button' | 'input' | null;

const clampQuantity = (value: number, min: number, max: number): number => {
  if (!Number.isFinite(value)) return min;
  if (value < min) return min;
  if (value > max) return max;

  return value;
};

export function QuantitySelector({
  quantity,
  onQuantityChange,
  min = 0,
  max = MAX_CART_ITEM_QUANTITY,
  disabled = false,
  id,
  className,
}: QuantitySelectorProps) {
  const sanitizedQuantity = useMemo(
    () => clampQuantity(quantity, min, max),
    [max, min, quantity]
  );
  const [localQuantity, setLocalQuantity] = useState<number | ''>(sanitizedQuantity);
  const [changeSource, setChangeSource] = useState<QuantityChangeSource>(null);

  useEffect(() => {
    setLocalQuantity(sanitizedQuantity);
    setChangeSource(null);
  }, [sanitizedQuantity]);

  useEffect(() => {
    if (changeSource !== 'button') return;
    if (localQuantity === '') return;
    if (localQuantity === sanitizedQuantity) return;

    const timeoutId = window.setTimeout(() => {
      onQuantityChange(localQuantity);
      setChangeSource(null);
    }, DEBOUNCE_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [changeSource, localQuantity, onQuantityChange, sanitizedQuantity]);

  const updateLocalQuantity = (value: number, source: QuantityChangeSource) => {
    setChangeSource(source);
    setLocalQuantity(clampQuantity(value, min, max));
  };

  const commitQuantity = (value: number) => {
    const nextQuantity = clampQuantity(value, min, max);

    setLocalQuantity(nextQuantity);
    setChangeSource(null);

    if (sanitizedQuantity !== nextQuantity) {
      onQuantityChange(nextQuantity);
    }
  };

  return (
    <div className={cn('flex items-center border border-[#8b6a42] rounded-lg max-h-[40px]', className)}>
      <Button
        variant="ghost"
        size="sm"
        disabled={disabled || localQuantity === '' || localQuantity <= min}
        onClick={() => updateLocalQuantity(localQuantity === '' ? min : localQuantity - 1, 'button')}
        className="text-[#573e1c] hover:bg-[#efe1c1]"
      >
        <Minus className="w-4 h-4" />
      </Button>
      <FormattedNumber
        as="input"
        id={id}
        value={localQuantity}
        min={min}
        max={max}
        onValueChange={(value) => updateLocalQuantity(value, 'input')}
        onEmptyValue={() => {
          setChangeSource('input');
          setLocalQuantity('');
        }}
        onBlur={() => {
          if (localQuantity === '') {
            commitQuantity(min);
            return;
          }

          if (changeSource === 'input') {
            commitQuantity(localQuantity);
          }
        }}
        allowEmpty
        disabled={disabled}
        className="max-h-[38px] text-center border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
      />
      <Button
        variant="ghost"
        size="sm"
        disabled={disabled || localQuantity === '' || localQuantity >= max}
        onClick={() => updateLocalQuantity(localQuantity === '' ? min : localQuantity + 1, 'button')}
        className="text-[#573e1c] hover:bg-[#efe1c1]"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
}
