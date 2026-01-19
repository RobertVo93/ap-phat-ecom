'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import { IProduct } from '@/types';

interface Props {
  featuredProducts: IProduct[]
}

export function FeaturedProducts({featuredProducts}: Props) {
  const { t } = useLanguage();

  return (
    <section className="py-16 lg:py-24 bg-[#f8f5f0] relative overflow-hidden">
      {/* Background decorative element */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#d4c5a0]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#573e1c] mb-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {t('home.featured.title')}
              </h2>
              <p className="text-[#8b6a42] text-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                {t('home.featured.subtitle')}
              </p>
            </div>
          </div>

          <Button
            asChild
            variant="outline"
            className="border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1] shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group hidden sm:flex"
          >
            <Link href="/products">
              {t('common.viewAll')}
              <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-in fade-in slide-in-from-bottom-8 duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="text-center sm:hidden">
          <Button
            asChild
            variant="outline"
            className="border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1] shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
          >
            <Link href="/products">
              {t('common.viewAll')}
              <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}