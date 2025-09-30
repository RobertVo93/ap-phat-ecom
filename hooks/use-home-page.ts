"use client"

import { getCollections } from "@/lib/httpclient/collection.client"
import { getFeaturedProducts } from "@/lib/httpclient/product.client"
import { ICollection, IProduct } from "@/types"
import { useEffect, useState } from "react"

export const useHomePage = () => {
    const [categories, setCategories] = useState<ICollection[]>([])
    const [featuredProducts, setFeatureProducts] = useState<IProduct[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const onInit = async () => {
        try {
            setLoading(true)
            const response = await Promise.all([
                getCollections(),
                getFeaturedProducts()
            ])
            setCategories(response[0])
            setFeatureProducts(response[1])
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        onInit()
    }, [])

    return {
        loading,
        categories,
        featuredProducts,
    }
}