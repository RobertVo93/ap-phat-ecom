import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AccountSettingsHeaderProps } from './settings-types';

export function AccountSettingsHeader({ t }: AccountSettingsHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center space-x-4 mb-4">
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
      </div>
      <h1 className="text-3xl lg:text-4xl font-bold text-[#573e1c]">
        {t('account.accountSettings')}
      </h1>
      <p className="text-[#8b6a42] mt-2">
        {t('account.manageSecurity')}
      </p>
    </div>
  );
}
