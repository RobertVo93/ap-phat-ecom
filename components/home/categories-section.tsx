'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/contexts/language-context';
import { Card, CardContent } from '@/components/ui/card';

const categories = [
  {
    id: 'rice-paper',
    nameVi: 'Bánh Tráng',
    nameEn: 'Rice Paper',
    image: 'https://images.pexels.com/photos/4331440/pexels-photo-4331440.jpeg',
    count: 25
  },
  {
    id: 'pho-noodles',
    nameVi: 'Bánh Phở',
    nameEn: 'Pho Noodles',
    image: 'https://images.pexels.com/photos/4331521/pexels-photo-4331521.jpeg',
    count: 18
  },
  {
    id: 'vermicelli',
    nameVi: 'Bún',
    nameEn: 'Vermicelli',
    image: 'https://images.pexels.com/photos/4331491/pexels-photo-4331491.jpeg',
    count: 12
  },
  {
    id: 'spring-rolls',
    nameVi: 'Nem Cuốn',
    nameEn: 'Spring Rolls',
    image: 'https://images.pexels.com/photos/4331440/pexels-photo-4331440.jpeg',
    count: 8
  }
];

export function CategoriesSection() {
  const { language, t } = useLanguage();

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#573e1c] mb-4">
            {t('home.categories.title')}
          </h2>
          <p className="text-[#8b6a42] text-lg max-w-2xl mx-auto">
            {t('home.categories.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/products?category=${category.id}`}>
              <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-[#d4c5a0]">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={category.image}
                    alt={language === 'vi' ? category.nameVi : category.nameEn}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-bold text-lg mb-1">
                      {language === 'vi' ? category.nameVi : category.nameEn}
                    </h3>
                    <p className="text-sm opacity-90">
                      {category.count} {t('home.categories.products')}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}