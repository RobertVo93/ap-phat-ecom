import { ClipboardList, Loader2 } from 'lucide-react';
import { OrdersEmptyStateProps } from './orders-page-types';

export function OrdersEmptyState({ loading, t }: OrdersEmptyStateProps) {
  return (
    <div className="w-full flex items-center justify-center">
      {loading ? (
        <Loader2 className="h-8 w-8 animate-spin" />
      ) : (
        <div className="flex flex-col items-center">
          <ClipboardList className="w-24 h-24 text-[#8b6a42] mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-[#573e1c] mb-4">
            {t('account.noOrdersFound')}
          </h2>
        </div>
      )}
    </div>
  );
}
