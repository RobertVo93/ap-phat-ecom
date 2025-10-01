"use client"

import React from 'react';
import { HeroSection } from '@/components/home/hero-section';
import { CategoriesSection } from '@/components/home/categories-section';
import { FeaturedProducts } from '@/components/home/featured-products';
import { useHomePage } from '@/hooks/use-home-page';
import { LoadingOverlay } from '@/components/common/LoadOverlay';

export default function HomePage() {
  const {
    loading,
    categories,
    featuredProducts
  } = useHomePage()

  return (
    <main className="min-h-screen">
      <LoadingOverlay loading={loading} />
      <HeroSection />
      <CategoriesSection 
        categories={categories}
      />
      <FeaturedProducts 
        featuredProducts={featuredProducts}
      />
    </main>
  );
}