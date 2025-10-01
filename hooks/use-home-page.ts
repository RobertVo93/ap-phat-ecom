"use client"

import { getCollections } from "@/lib/httpclient/collection.client"
import { getProducts } from "@/lib/httpclient/product.client"
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
                getProducts({ limit: 5 }) // for getting 5 featured products
            ])
            setCategories(response[0])
            setFeatureProducts(response[1].data)
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