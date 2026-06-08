import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/contexts/language-context';

export function CartEmptyState() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <ShoppingBag className="w-24 h-24 text-[#8b6a42] mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-[#573e1c] mb-4">
            {t('cart.empty')}
          </h2>
          <p className="text-[#8b6a42] mb-8">
            {t('cart.empty.message')}
          </p>
          <Button
            asChild
            className="bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1]"
          >
            <Link href="/products">
              {t('cart.continue.shopping')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
