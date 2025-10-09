import { getCollections } from "@/lib/httpclient/collection.client"
import { getProducts } from "@/lib/httpclient/product.client"
import { useDebounceSearchTerm } from "@/lib/utils.client"
import { ICollection, IProduct, ProductSortBy, ViewMode } from "@/types"
import { useEffect, useState } from "react"

export const useProducts = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState<ICollection[]>([])
    const [selectedCategory, setSelectedCategory] = useState<'all' | ICollection>('all');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100_000]);
    const [sortBy, setSortBy] = useState<ProductSortBy>(ProductSortBy.nameHigh);
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.grid);
    const [showFilters, setShowFilters] = useState(false);
    const [products, setProducts] = useState<IProduct[]>([])
    const debouncedSearchTerm = useDebounceSearchTerm(searchQuery, 1000)

    const onGetProducts = async () => {
        try {
            setLoading(true)
            const res = await getProducts({
                sortBy: sortBy,
                collectionId: selectedCategory !== "all" ? selectedCategory.id : undefined,
                search: searchQuery,
                priceRange: {
                    min: priceRange[0],
                    max: priceRange[1]
                },
            })
            setProducts(res.data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const onInit = async () => {
        const response = await Promise.all([
            getCollections(),
            onGetProducts()
        ])
        setCategories(response[0])
    }

    useEffect(() => {
        onInit()
    }, [])

    useEffect(() => {
        onGetProducts()
    }, [debouncedSearchTerm, selectedCategory, priceRange, sortBy])

    return {
        loading,
        searchQuery,
        selectedCategory,
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
        setSelectedCategory,
        setViewMode,
    }
}