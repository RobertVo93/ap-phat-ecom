import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getCollections } from "@/lib/httpclient/collection.client"
import { getProducts } from "@/lib/httpclient/product.client"
import { parsePriceRange, useDebounceSearchTerm } from "@/lib/utils"
import { ICollection, IProduct, ProductSortBy, ViewMode } from "@/types"
import { useEffect, useState } from "react"
import { DEFAULT_PRICE_RANGE } from '@/constants';

const DEFAULT_SORT_BY = ProductSortBy.nameHigh

const parseSortBy = (value: string | null): ProductSortBy => {
    return Object.values(ProductSortBy).includes(value as ProductSortBy)
        ? value as ProductSortBy
        : DEFAULT_SORT_BY
}

export const useProducts = () => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState<boolean>(false)
    const [searchQuery, setSearchQueryState] = useState(searchParams.get('search') ?? '');
    const [categories, setCategories] = useState<ICollection[]>([])
    const [priceRange, setPriceRangeState] = useState<[number, number]>(() => parsePriceRange(searchParams));
    const [sortBy, setSortByState] = useState<ProductSortBy>(() => parseSortBy(searchParams.get('sortBy')));
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.grid);
    const [showFilters, setShowFilters] = useState(false);
    const [products, setProducts] = useState<IProduct[]>([])
    const debouncedSearchTerm = useDebounceSearchTerm(searchQuery, 1000)

    const replaceSearchParams = (params: URLSearchParams) => {
        const queryString = params.toString()
        router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
    }

    const setSearchQuery = (value: string) => {
        setSearchQueryState(value)
    }

    const setPriceRange = (value: [number, number]) => {
        const params = new URLSearchParams(searchParams.toString())

        if (value[0] === DEFAULT_PRICE_RANGE[0] && value[1] === DEFAULT_PRICE_RANGE[1]) {
            params.delete('priceMin')
            params.delete('priceMax')
        } else {
            params.set('priceMin', value[0].toString())
            params.set('priceMax', value[1].toString())
        }

        replaceSearchParams(params)
    }

    const setSortBy = (value: ProductSortBy) => {
        const params = new URLSearchParams(searchParams.toString())

        if (value === DEFAULT_SORT_BY) {
            params.delete('sortBy')
        } else {
            params.set('sortBy', value)
        }

        replaceSearchParams(params)
    }

    const onGetCollections = async () => {
        try {
            const res: ICollection[] = await getCollections()
            setCategories(res)
            return res
        } catch (e) {
            console.error(e)
            return []
        }
    }

    const onGetProducts = async (
        collectionNumber: string | null,
        search: string,
        selectedPriceRange: [number, number],
        selectedSortBy: ProductSortBy
    ) => {
        try {
            setLoading(true)
            let collectionId: string | undefined = undefined
            if (collectionNumber) {
                const currentCategories = categories.length > 0 ? categories : await onGetCollections()
                collectionId = currentCategories.find(c => c.number === collectionNumber)?.id;
            }
            const res = await getProducts({
                sortBy: selectedSortBy,
                collectionId: collectionId,
                search: search,
                priceRange: {
                    min: selectedPriceRange[0],
                    max: selectedPriceRange[1]
                },
            })
            setProducts(res.data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        onGetCollections()
    }, [])

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString())

        if (debouncedSearchTerm) {
            params.set('search', debouncedSearchTerm)
        } else {
            params.delete('search')
        }

        if (params.toString() !== searchParams.toString()) {
            replaceSearchParams(params)
        }
    }, [debouncedSearchTerm])

    useEffect(() => {
        const nextSearchQuery = searchParams.get('search') ?? ''
        const nextPriceRange = parsePriceRange(searchParams)
        const nextSortBy = parseSortBy(searchParams.get('sortBy'))

        setSearchQueryState(nextSearchQuery)
        setPriceRangeState(nextPriceRange)
        setSortByState(nextSortBy)

        onGetProducts(
            searchParams.get('collection'),
            nextSearchQuery,
            nextPriceRange,
            nextSortBy
        )
    }, [searchParams])

    return {
        loading,
        searchQuery,
        categories,
        priceRange,
        sortBy,
        viewMode,
        showFilters,
        products,

        setSearchQuery,
        setSortBy,
        setShowFilters,
        setPriceRange,
        setViewMode,
    }
}
