'use client';

import { Filter } from 'lucide-react';
import FilterContent from '@/components/product/product-filter-content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/lib/contexts/language-context';
import { ICollection } from '@/types';

export interface ProductFiltersProps {
  collections: ICollection[];
  selectedCollection: string;
  priceRange: [number, number];
  onCollectionChange: (collectionNumber: string) => void;
  onPriceRangeChange: (value: [number, number]) => void;
  onClearFilters: () => void;
}

export function ProductsFilterPanel(props: ProductFiltersProps) {
  const { t } = useLanguage();

  return (
    <aside className="hidden lg:block w-80 flex-shrink-0">
      <Card className="bg-white border-[#d4c5a0] shadow-sm sticky top-24">
        <CardHeader className="pb-4">
          <CardTitle className="text-[#573e1c] flex items-center text-xl">
            <Filter className="w-5 h-5 mr-2" />
            {t('product.filter.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FilterContent {...props} />
        </CardContent>
      </Card>
    </aside>
  );
}
