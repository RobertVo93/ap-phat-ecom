import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/contexts/language-context';

export function CheckoutHeader() {
  const { t } = useLanguage();

  return (
    <div className="mb-4 lg:mb-8">
      <div className="flex items-center space-x-4 mb-4">
        <Button
          type="button"
          asChild
          variant="ghost"
          className="text-[#573e1c] hover:bg-[#efe1c1]"
        >
          <Link href="/cart">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('checkout.backToCart')}
          </Link>
        </Button>
      </div>
      <h1 className="text-3xl lg:text-4xl font-bold text-[#573e1c]">
        {t('checkout.title')}
      </h1>
    </div>
  );
}
