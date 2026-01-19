'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Award } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative bg-gradient-to-r from-[#efe1c1] to-[#d4c5a0] py-16 lg:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#573e1c]/10 rounded-full text-[#573e1c] text-sm font-medium mb-4">
                <Award className="w-4 h-4" />
                <span>100% Natural Vietnamese Products</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-[#573e1c] leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
                {t('home.hero.title')}
              </h1>
              <p className="text-xl text-[#8b6a42] leading-relaxed max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                {t('home.hero.subtitle')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <Button
                asChild
                size="lg"
                className="bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1] px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <Link href="/products">
                  {t('home.hero.cta')}
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1] px-8 py-4 text-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <Link href="/store-locations">
                  {t('store.locations')}
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-[#8b6a42]/20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
              <div className="text-center group cursor-default">
                <div className="text-2xl font-bold text-[#573e1c] group-hover:scale-110 transition-transform duration-300">500+</div>
                <div className="text-sm text-[#8b6a42]">{t('home.stats.products')}</div>
              </div>
              <div className="text-center group cursor-default">
                <div className="text-2xl font-bold text-[#573e1c] group-hover:scale-110 transition-transform duration-300 delay-100">10k+</div>
                <div className="text-sm text-[#8b6a42]">{t('home.stats.customers')}</div>
              </div>
              <div className="text-center group cursor-default">
                <div className="text-2xl font-bold text-[#573e1c] group-hover:scale-110 transition-transform duration-300 delay-200">99%</div>
                <div className="text-sm text-[#8b6a42]">{t('home.stats.satisfaction')}</div>
              </div>
            </div>
          </div>

          <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000">
            <div className="relative z-10 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#573e1c]/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img
                src="https://images.pexels.com/photos/4331491/pexels-photo-4331491.jpeg"
                alt={t('home.hero.title')}
                className="relative rounded-2xl shadow-2xl w-full h-[500px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="absolute -top-4 -right-4 w-full h-full bg-[#573e1c] rounded-2xl -z-10 transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-2"></div>
            <div className="absolute -bottom-4 -left-4 w-full h-full bg-[#8b6a42] rounded-2xl -z-20 transition-transform duration-500 delay-100 group-hover:-translate-x-2 group-hover:translate-y-2"></div>
          </div>
        </div>
      </div>
    </section>
  );
}