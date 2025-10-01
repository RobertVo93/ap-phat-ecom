'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/contexts/language-context';
import { Card } from '@/components/ui/card';
import { ICollection } from '@/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"


interface Props {
  categories: ICollection[]
}

export function CategoriesSection({
  categories
}: Props) {
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

        <div className='w-full px-[5%]'>
          <Carousel className="w-full" opts={{ loop: categories.length > 4 }}>
            <CarouselContent>
              {categories.map((category, index) => (
                <CarouselItem
                  key={index}
                  className="basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <Link key={category.id} href={`/products?category=${category.id}`}>
                    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-[#d4c5a0]">
                      <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity duration-300"></div>
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <h3 className="font-bold text-lg mb-1">
                            {category.name}
                          </h3>
                          <p className="text-sm opacity-90">
                            {category.products?.length || 0} sản phẩm
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            {categories.length > 4 && (
              <>
                <CarouselPrevious />
                <CarouselNext />
              </>
            )}
          </Carousel>
        </div>
      </div>
    </section>
  );
}