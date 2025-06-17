'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative bg-gradient-to-r from-[#efe1c1] to-[#d4c5a0] py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-[#573e1c] leading-tight">
                {t('home.hero.title')}
              </h1>
              <p className="text-xl text-[#8b6a42] leading-relaxed max-w-lg">
                {t('home.hero.subtitle')}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1] px-8 py-4 text-lg"
              >
                <Link href="/products">
                  {t('home.hero.cta')}
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1] px-8 py-4 text-lg"
              >
                <Link href="/store-locations">
                  {t('store.locations')}
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-[#8b6a42]/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#573e1c]">500+</div>
                <div className="text-sm text-[#8b6a42]">{t('home.stats.products')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#573e1c]">10k+</div>
                <div className="text-sm text-[#8b6a42]">{t('home.stats.customers')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#573e1c]">99%</div>
                <div className="text-sm text-[#8b6a42]">{t('home.stats.satisfaction')}</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10">
              <img
                src="https://images.pexels.com/photos/4331491/pexels-photo-4331491.jpeg"
                alt={t('home.hero.title')}
                className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
              />
            </div>
            <div className="absolute -top-4 -right-4 w-full h-full bg-[#573e1c] rounded-2xl -z-10"></div>
            <div className="absolute -bottom-4 -left-4 w-full h-full bg-[#8b6a42] rounded-2xl -z-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
}