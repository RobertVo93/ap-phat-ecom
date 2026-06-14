'use client';

import { useLanguage } from '@/lib/contexts/language-context';

export function ProductsPageHeader() {
  const { t } = useLanguage();

  return (
    <div className="mb-8">
      <h1 className="text-3xl lg:text-4xl font-bold text-[#573e1c] mb-4">
        {t('nav.products')}
      </h1>
      <p className="text-[#8b6a42] text-lg">
        {t('product.collection.explore')}
      </p>
    </div>
  );
}
