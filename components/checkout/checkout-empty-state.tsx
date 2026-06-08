import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/contexts/language-context';

export function CheckoutEmptyState() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#f8f5f0] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#573e1c] mb-4">
          {t('checkout.empty.title')}
        </h2>
        <p className="text-[#8b6a42] mb-8">
          {t('checkout.empty.message')}
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
  );
}
