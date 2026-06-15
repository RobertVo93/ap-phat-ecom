'use client';

import { Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import FilterContent from '@/components/product/product-filter-content';
import { ProductFiltersProps } from '@/components/product/products-filter-panel';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useLanguage } from '@/lib/contexts/language-context';
import { ProductSortBy, ViewMode } from '@/types';

interface ProductsSearchControlsProps extends ProductFiltersProps {
  searchInput: string;
  sortBy: ProductSortBy;
  viewMode: ViewMode;
  showFilters: boolean;
  onSearchInputChange: (value: string) => void;
  onSortByChange: (value: ProductSortBy) => void;
  onViewModeChange: (value: ViewMode) => void;
  onShowFiltersChange: (value: boolean) => void;
}

export function ProductsSearchControls({
  searchInput,
  sortBy,
  viewMode,
  showFilters,
  onSearchInputChange,
  onSortByChange,
  onViewModeChange,
  onShowFiltersChange,
  ...filterProps
}: ProductsSearchControlsProps) {
  const { t } = useLanguage();

  return (
    <Card className="bg-white border-[#d4c5a0] mb-8 shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <Input
              type="text"
              placeholder={t('home.search.placeholder')}
              value={searchInput}
              onChange={(event) => onSearchInputChange(event.target.value)}
              className="border-[#8b6a42] focus:border-[#573e1c] h-12"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4 flex-wrap">
              <Select value={sortBy} onValueChange={(value) => onSortByChange(value as ProductSortBy)}>
                <SelectTrigger className="w-48 border-[#8b6a42] h-10">
                  <SelectValue placeholder={t('product.sort.title')} />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ProductSortBy).map((sortOption) => (
                    <SelectItem key={sortOption} value={sortOption}>
                      {t(`product.sort.${sortOption}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Sheet open={showFilters} onOpenChange={onShowFiltersChange}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="lg:hidden border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1] h-10"
                  >
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    {t('product.filter.button')}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 bg-white">
                  <SheetHeader>
                    <SheetTitle className="text-[#573e1c] flex items-center">
                      <Filter className="w-5 h-5 mr-2" />
                      {t('product.filter.title')}
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent {...filterProps} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="hidden lg:flex items-center bg-[#efe1c1] rounded-lg p-1">
              <Button
                variant={viewMode === ViewMode.grid ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange(ViewMode.grid)}
                className={`h-8 w-8 p-0 ${viewMode === ViewMode.grid
                  ? 'bg-[#573e1c] text-[#efe1c1] hover:bg-[#8b6a42]'
                  : 'text-[#573e1c] hover:bg-[#d4c5a0]'
                  }`}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === ViewMode.list ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange(ViewMode.list)}
                className={`h-8 w-8 p-0 ${viewMode === ViewMode.list
                  ? 'bg-[#573e1c] text-[#efe1c1] hover:bg-[#8b6a42]'
                  : 'text-[#573e1c] hover:bg-[#d4c5a0]'
                  }`}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
