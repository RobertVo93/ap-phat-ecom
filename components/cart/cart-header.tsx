import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/contexts/language-context';
import { formatNumberWithCommas } from '@/lib/utils';

interface CartHeaderProps {
  itemsCount: number;
}

export function CartHeader({ itemsCount }: CartHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="mb-4">
      <div className="flex items-center space-x-4 mb-4">
        <Button
          asChild
          variant="ghost"
          className="text-[#573e1c] hover:bg-[#efe1c1]"
        >
          <Link href="/products">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('cart.continue.shopping')}
          </Link>
        </Button>
      </div>
      <h1 className="hidden lg:block text-3xl lg:text-4xl font-bold text-[#573e1c]">
        {t('cart.title')} ({formatNumberWithCommas(itemsCount)} {t('cart.items.count')})
      </h1>
    </div>
  );
}
