'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { mockProducts } from '@/lib/mock-data/products';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';

export function FeaturedProducts() {
  const { t } = useLanguage();
  
  // Get first 4 products as featured
  const featuredProducts = mockProducts.slice(0, 4);

  return (
    <section className="py-16 bg-[#f8f5f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#573e1c] mb-4">
              {t('home.featured.title')}
            </h2>
            <p className="text-[#8b6a42] text-lg">
              {t('home.featured.subtitle')}
            </p>
          </div>
          
          <Button
            asChild
            variant="outline"
            className="border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1] hidden sm:flex"
          >
            <Link href="/products">
              {t('common.viewAll')}
              <ChevronRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center sm:hidden">
          <Button
            asChild
            variant="outline"
            className="border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1]"
          >
            <Link href="/products">
              {t('common.viewAll')}
              <ChevronRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}