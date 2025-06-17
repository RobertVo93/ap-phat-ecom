'use client';

import React, { useState, useMemo } from 'react';
import { Filter, Grid, List, SlidersHorizontal, X } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { mockProducts } from '@/lib/mock-data/products';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export default function ProductsPage() {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: 'all', nameVi: 'Tất cả', nameEn: 'All Categories' },
    { id: 'rice-paper', nameVi: 'Bánh Tráng', nameEn: 'Rice Paper' },
    { id: 'pho-noodles', nameVi: 'Bánh Phở', nameEn: 'Pho Noodles' },
    { id: 'vermicelli', nameVi: 'Bún', nameEn: 'Vermicelli' }
  ];

  const filteredProducts = useMemo(() => {
    let filtered = mockProducts;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product => {
        const name = language === 'vi' ? product.name : product.nameEn;
        const description = language === 'vi' ? product.description : product.descriptionEn;
        return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               description.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => {
        const categoryId = product.category.toLowerCase().replace(' ', '-');
        return categoryId.includes(selectedCategory) || selectedCategory.includes(categoryId);
      });
    }

    // Price filter
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          const aName = language === 'vi' ? a.name : a.nameEn;
          const bName = language === 'vi' ? b.name : b.nameEn;
          return aName.localeCompare(bName);
      }
    });

    return filtered;
  }, [mockProducts, searchQuery, selectedCategory, priceRange, sortBy, language]);

  // Filter Component
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h3 className="font-semibold text-[#573e1c] mb-4 text-lg">{t('product.filter.categories')}</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-3">
              <Checkbox
                id={category.id}
                checked={selectedCategory === category.id}
                onCheckedChange={(checked) => {
                  if (checked) setSelectedCategory(category.id);
                }}
                className="border-[#8b6a42] data-[state=checked]:bg-[#573e1c] data-[state=checked]:border-[#573e1c]"
              />
              <label 
                htmlFor={category.id} 
                className="text-[#8b6a42] cursor-pointer hover:text-[#573e1c] transition-colors"
              >
                {language === 'vi' ? category.nameVi : category.nameEn}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-[#d4c5a0]" />

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-[#573e1c] mb-4 text-lg">{t('product.filter.priceRange')}</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="price-under-20k"
              checked={priceRange[1] <= 20000}
              onCheckedChange={(checked) => {
                if (checked) setPriceRange([0, 20000]);
              }}
              className="border-[#8b6a42] data-[state=checked]:bg-[#573e1c] data-[state=checked]:border-[#573e1c]"
            />
            <label 
              htmlFor="price-under-20k" 
              className="text-[#8b6a42] cursor-pointer hover:text-[#573e1c] transition-colors"
            >
              {t('product.filter.priceUnder')}
            </label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox
              id="price-20k-50k"
              checked={priceRange[0] >= 20000 && priceRange[1] <= 50000}
              onCheckedChange={(checked) => {
                if (checked) setPriceRange([20000, 50000]);
              }}
              className="border-[#8b6a42] data-[state=checked]:bg-[#573e1c] data-[state=checked]:border-[#573e1c]"
            />
            <label 
              htmlFor="price-20k-50k" 
              className="text-[#8b6a42] cursor-pointer hover:text-[#573e1c] transition-colors"
            >
              {t('product.filter.priceBetween')}
            </label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox
              id="price-above-50k"
              checked={priceRange[0] >= 50000}
              onCheckedChange={(checked) => {
                if (checked) setPriceRange([50000, 100000]);
              }}
              className="border-[#8b6a42] data-[state=checked]:bg-[#573e1c] data-[state=checked]:border-[#573e1c]"
            />
            <label 
              htmlFor="price-above-50k" 
              className="text-[#8b6a42] cursor-pointer hover:text-[#573e1c] transition-colors"
            >
              {t('product.filter.priceAbove')}
            </label>
          </div>
        </div>
      </div>

      <Separator className="bg-[#d4c5a0]" />

      {/* Clear Filters */}
      <Button
        variant="outline"
        onClick={() => {
          setSelectedCategory('all');
          setPriceRange([0, 100000]);
          setSearchQuery('');
        }}
        className="w-full border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1]"
      >
        {t('product.filter.clear')}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
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
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48 border-[#8b6a42] h-10">
                      <SelectValue placeholder={t('product.sort.title')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">{t('product.sort.name')}</SelectItem>
                      <SelectItem value="price-low">{t('product.sort.priceLow')}</SelectItem>
                      <SelectItem value="price-high">{t('product.sort.priceHigh')}</SelectItem>
                      <SelectItem value="rating">{t('product.sort.rating')}</SelectItem>
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
                        <FilterContent />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-[#efe1c1] rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={`h-8 w-8 p-0 ${
                      viewMode === 'grid' 
                        ? 'bg-[#573e1c] text-[#efe1c1] hover:bg-[#8b6a42]' 
                        : 'text-[#573e1c] hover:bg-[#d4c5a0]'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={`h-8 w-8 p-0 ${
                      viewMode === 'list' 
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
                <FilterContent />
              </CardContent>
            </Card>
          </aside>

          {/* Products Grid */}
          <main className="flex-1 min-w-0">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-[#8b6a42] font-medium">
                {t('product.results.count').replace('{count}', filteredProducts.length.toString())}
              </p>
              
              {/* Active Filters Display */}
              {(selectedCategory !== 'all' || searchQuery) && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-[#8b6a42]">{t('product.filter.active')}</span>
                  {selectedCategory !== 'all' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedCategory('all')}
                      className="h-7 text-xs bg-[#efe1c1] text-[#573e1c] hover:bg-[#d4c5a0]"
                    >
                      {categories.find(c => c.id === selectedCategory)?.nameVi}
                      <X className="w-3 h-3 ml-1" />
                    </Button>
                  )}
                  {searchQuery && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSearchQuery('')}
                      className="h-7 text-xs bg-[#efe1c1] text-[#573e1c] hover:bg-[#d4c5a0]"
                    >
                      {searchQuery}
                      <X className="w-3 h-3 ml-1" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            {filteredProducts.length === 0 ? (
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
                  <Button
                    onClick={() => {
                      setSelectedCategory('all');
                      setPriceRange([0, 100000]);
                      setSearchQuery('');
                    }}
                    className="bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1]"
                  >
                    {t('product.noResults.clear')}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product) => (
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