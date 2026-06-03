'use client';

import React from 'react';
import { Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import FilterContent from '@/components/product/product-filter-content';
import { useProducts } from '@/hooks/use-products';
import { ProductSortBy, ViewMode } from '@/types';
import { LoadingOverlay } from '@/components/common/LoadOverlay';

export default function ProductsPage() {
  const { t } = useLanguage();
  const {
    loading,
    searchQuery,
    categories,
    priceRange,
    sortBy,
    viewMode,
    showFilters,
    products,

    setSearchQuery,
    setSortBy,
    setShowFilters,
    setPriceRange,
    setViewMode,
  } = useProducts()

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      <LoadingOverlay loading={loading} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#573e1c] mb-4">
            {t('nav.products')}
          </h1>
          <p className="text-[#8b6a42] text-lg">
            {t('product.collection.explore')}
          </p>
        </div>

        {/* Search and Controls */}
        <Card className="bg-white border-[#d4c5a0] mb-8 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              {/* Search Bar */}
              <div className="w-full">
                <Input
                  type="text"
                  placeholder={t('home.search.placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-[#8b6a42] focus:border-[#573e1c] h-12"
                />
              </div>

              {/* Controls Row */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4 flex-wrap">
                  {/* Sort Dropdown */}
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as ProductSortBy)}>
                    <SelectTrigger className="w-48 border-[#8b6a42] h-10">
                      <SelectValue defaultValue={sortBy} placeholder={t('product.sort.title')} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(ProductSortBy).map((sortBy, index) => (
                        <SelectItem key={index} value={sortBy}>{t(`product.sort.${sortBy}`)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Mobile Filter Button */}
                  <Sheet open={showFilters} onOpenChange={setShowFilters}>
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
                        <FilterContent
                          collections={categories}
                          priceRange={priceRange}
                          setPriceRange={setPriceRange}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                {/* View Mode Toggle */}
                <div className="hidden lg:block flex items-center bg-[#efe1c1] rounded-lg p-1">
                  <Button
                    variant={viewMode === ViewMode.grid ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode(ViewMode.grid)}
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
                    onClick={() => setViewMode(ViewMode.list)}
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

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <Card className="bg-white border-[#d4c5a0] shadow-sm sticky top-8">
              <CardHeader className="pb-4">
                <CardTitle className="text-[#573e1c] flex items-center text-xl">
                  <Filter className="w-5 h-5 mr-2" />
                  {t('product.filter.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FilterContent
                  collections={categories}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                />
              </CardContent>
            </Card>
          </aside>

          {/* Products Grid */}
          <main className="flex-1 min-w-0">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-[#8b6a42] font-medium">
                {t('product.results.count').replace('{count}', products.length.toString())}
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
              <div className={`grid gap-6 ${viewMode === ViewMode.grid
                ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                : 'grid-cols-1'
                }`}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
