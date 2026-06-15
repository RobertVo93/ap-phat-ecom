'use client';

import { useEffect, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { DEFAULT_PRICE_RANGE } from '@/constants';
import { ProductsFilterPanel } from '@/components/product/products-filter-panel';
import { ProductsPageHeader } from '@/components/product/products-page-header';
import { ProductsResults } from '@/components/product/products-results';
import { ProductsSearchControls } from '@/components/product/products-search-controls';
import { useDebounceSearchTerm } from '@/lib/utils.client';
import { ICollection, IProduct, ProductSortBy, ViewMode } from '@/types';

interface ProductsPageClientProps {
  collections: ICollection[];
  products: IProduct[];
  total: number;
  selectedCollection: string;
  searchQuery: string;
  priceRange: [number, number];
  sortBy: ProductSortBy;
}

export function ProductsPageClient({
  collections,
  products,
  total,
  selectedCollection,
  searchQuery,
  priceRange,
  sortBy,
}: ProductsPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.grid);
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const debouncedSearchTerm = useDebounceSearchTerm(searchInput, 600);

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  const replaceSearchParams = (params: URLSearchParams) => {
    const queryString = params.toString();

    startTransition(() => {
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    });
  };

  const updateSearchParams = (updater: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    updater(params);
    replaceSearchParams(params);
  };

  useEffect(() => {
    const currentSearch = searchParams.get('search') ?? '';

    if (debouncedSearchTerm !== searchInput) {
      return;
    }

    if (debouncedSearchTerm === currentSearch) {
      return;
    }

    updateSearchParams((params) => {
      if (debouncedSearchTerm) {
        params.set('search', debouncedSearchTerm);
      } else {
        params.delete('search');
      }
    });
  }, [debouncedSearchTerm, searchInput, searchParams]);

  const handleCollectionChange = (collectionNumber: string) => {
    updateSearchParams((params) => {
      if (collectionNumber) {
        params.set('collection', collectionNumber);
      } else {
        params.delete('collection');
      }
    });
  };

  const handlePriceRangeChange = (nextPriceRange: [number, number]) => {
    updateSearchParams((params) => {
      if (
        nextPriceRange[0] === DEFAULT_PRICE_RANGE[0]
        && nextPriceRange[1] === DEFAULT_PRICE_RANGE[1]
      ) {
        params.delete('priceMin');
        params.delete('priceMax');
      } else {
        params.set('priceMin', nextPriceRange[0].toString());
        params.set('priceMax', nextPriceRange[1].toString());
      }
    });
  };

  const handleSortByChange = (nextSortBy: ProductSortBy) => {
    updateSearchParams((params) => {
      if (nextSortBy === ProductSortBy.nameHigh) {
        params.delete('sortBy');
      } else {
        params.set('sortBy', nextSortBy);
      }
    });
  };

  const handleClearFilters = () => {
    setSearchInput('');
    replaceSearchParams(new URLSearchParams());
  };

  const filterProps = {
    collections,
    selectedCollection,
    priceRange,
    onCollectionChange: handleCollectionChange,
    onPriceRangeChange: handlePriceRangeChange,
    onClearFilters: handleClearFilters,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProductsPageHeader />
      <ProductsSearchControls
        {...filterProps}
        searchInput={searchInput}
        sortBy={sortBy}
        viewMode={viewMode}
        showFilters={showFilters}
        onSearchInputChange={setSearchInput}
        onSortByChange={handleSortByChange}
        onViewModeChange={setViewMode}
        onShowFiltersChange={setShowFilters}
      />

      <div className="flex gap-8">
        <ProductsFilterPanel {...filterProps} />
        <ProductsResults
          products={products}
          total={total}
          viewMode={viewMode}
          isPending={isPending}
        />
      </div>
    </div>
  );
}
