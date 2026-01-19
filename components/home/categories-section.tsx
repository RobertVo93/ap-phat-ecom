'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/contexts/language-context';
import { Card } from '@/components/ui/card';
import { ICollection } from '@/types';
import { Badge } from '@/components/ui/badge';
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

  // Add badges to first 3 categories for demo
  const getBadge = (index: number) => {
    if (index === 0) return { text: 'Popular', variant: 'default' as const };
    if (index === 1) return { text: 'New', variant: 'secondary' as const };
    if (index === 2) return { text: 'Hot', variant: 'destructive' as const };
    return null;
  };

  return (
    <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
      {/* Background decorative element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#efe1c1]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#573e1c] mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {t('home.categories.title')}
          </h2>
          <p className="text-[#8b6a42] text-lg max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
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
                  <Link
                    key={category.id}
                    href={`/products?category=${category.id}`}
                    className="group block"
                  >
                    <Card className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-[#d4c5a0] hover:border-[#573e1c] cursor-pointer relative">
                      {/* Badge */}
                      {getBadge(index) && (
                        <div className="absolute top-3 right-3 z-20">
                          <Badge
                            variant={getBadge(index)!.variant}
                            className="shadow-md animate-in fade-in zoom-in duration-300"
                          >
                            {getBadge(index)!.text}
                          </Badge>
                        </div>
                      )}

                      <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden bg-gradient-to-br from-[#efe1c1] to-[#d4c5a0]">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                        {/* Hover overlay effect */}
                        <div className="absolute inset-0 bg-[#573e1c]/0 group-hover:bg-[#573e1c]/10 transition-colors duration-300"></div>

                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="font-bold text-lg mb-1 group-hover:text-[#efe1c1] transition-colors">
                            {category.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm opacity-90 group-hover:opacity-100 transition-opacity">
                            <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                              {category.products?.length || 0} sản phẩm
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Shine effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"></div>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            {categories.length > 4 && (
              <>
                <CarouselPrevious className="bg-[#573e1c] hover:bg-[#8b6a42] border-[#573e1c] text-white" />
                <CarouselNext className="bg-[#573e1c] hover:bg-[#8b6a42] border-[#573e1c] text-white" />
              </>
            )}
          </Carousel>
        </div>
      </div>
    </section>
  );
}