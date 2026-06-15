'use client';

import { Filter } from 'lucide-react';
import { ProductCard } from '@/components/product/product-card';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/lib/contexts/language-context';
import { IProduct, ViewMode } from '@/types';

interface ProductsResultsProps {
  products: IProduct[];
  total: number;
  viewMode: ViewMode;
  isPending: boolean;
}

export function ProductsResults({ products, total, viewMode, isPending }: ProductsResultsProps) {
  const { t } = useLanguage();

  return (
    <main className="flex-1 min-w-0">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-[#8b6a42] font-medium">
          {t('product.results.count').replace('{count}', total.toString())}
        </p>
      </div>

      {products.length === 0 ? (
        <Card className="bg-white border-[#d4c5a0]">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-[#efe1c1] rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-[#8b6a42]" />
            </div>
            <h3 className="text-xl font-semibold text-[#573e1c] mb-2">
              {t('product.noResults.title')}
            </h3>
            <p className="text-[#8b6a42] mb-6">
              {t('product.noResults.message')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className={`grid gap-6 transition-opacity ${isPending ? 'opacity-60' : 'opacity-100'} ${viewMode === ViewMode.grid
          ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
          : 'grid-cols-1'
          }`}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
