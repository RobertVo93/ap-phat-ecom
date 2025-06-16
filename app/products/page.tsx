'use client';

import React, { useState, useMemo } from 'react';
import { Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { mockProducts } from '@/lib/mock-data/products';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#573e1c] mb-4">
            {t('nav.products')}
          </h1>
          <p className="text-[#8b6a42] text-lg">
            Khám phá bộ sưu tập bánh tráng và bún phở truyền thống của chúng tôi
          </p>
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-[#d4c5a0] mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 max-w-md">
              <Input
                type="text"
                placeholder={t('home.search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-[#8b6a42] focus:border-[#573e1c]"
              />
            </div>
            
            <div className="flex items-center gap-4 flex-wrap">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 border-[#8b6a42]">
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Tên A-Z</SelectItem>
                  <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                  <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                  <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center bg-[#efe1c1] rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-[#573e1c] text-[#efe1c1]' : 'text-[#573e1c]'}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-[#573e1c] text-[#efe1c1]' : 'text-[#573e1c]'}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden border-[#573e1c] text-[#573e1c]"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Bộ lọc
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className={`w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card className="bg-white border-[#d4c5a0]">
              <CardHeader>
                <CardTitle className="text-[#573e1c] flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Bộ lọc
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Category Filter */}
                <div>
                  <h3 className="font-semibold text-[#573e1c] mb-3">Danh mục</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={category.id}
                          checked={selectedCategory === category.id}
                          onCheckedChange={(checked) => {
                            if (checked) setSelectedCategory(category.id);
                          }}
                        />
                        <label htmlFor={category.id} className="text-sm text-[#8b6a42]">
                          {language === 'vi' ? category.nameVi : category.nameEn}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Price Range */}
                <div>
                  <h3 className="font-semibold text-[#573e1c] mb-3">Khoảng giá</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="price-under-20k"
                        checked={priceRange[1] <= 20000}
                        onCheckedChange={(checked) => {
                          if (checked) setPriceRange([0, 20000]);
                        }}
                      />
                      <label htmlFor="price-under-20k" className="text-sm text-[#8b6a42]">
                        Dưới 20.000đ
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="price-20k-50k"
                        checked={priceRange[0] >= 20000 && priceRange[1] <= 50000}
                        onCheckedChange={(checked) => {
                          if (checked) setPriceRange([20000, 50000]);
                        }}
                      />
                      <label htmlFor="price-20k-50k" className="text-sm text-[#8b6a42]">
                        20.000đ - 50.000đ
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="price-above-50k"
                        checked={priceRange[0] >= 50000}
                        onCheckedChange={(checked) => {
                          if (checked) setPriceRange([50000, 100000]);
                        }}
                      />
                      <label htmlFor="price-above-50k" className="text-sm text-[#8b6a42]">
                        Trên 50.000đ
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[#8b6a42]">
                Hiển thị {filteredProducts.length} sản phẩm
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#8b6a42] text-lg">Không tìm thấy sản phẩm nào.</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
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