import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrdersPageHeaderProps } from './orders-page-types';

export function OrdersPageHeader({ t }: OrdersPageHeaderProps) {
  return (
    <div className="mb-8">
      <Button
        asChild
        variant="ghost"
        className="text-[#573e1c] hover:bg-[#efe1c1]"
      >
        <Link href="/account">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('account.backToAccount')}
        </Link>
      </Button>

      <h1 className="text-3xl font-bold text-[#573e1c] mt-4">
        {t('account.manageOrders')}
      </h1>
      <p className="text-[#8b6a42] mt-2">
        {t('account.trackAndManage')}
      </p>
    </div>
  );
}
