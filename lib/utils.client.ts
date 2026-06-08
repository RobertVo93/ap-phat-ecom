"use client"

import { DEFAULT_PRICE_RANGE } from "@/constants"
import { useEffect, useState } from "react"

export function useDebounceSearchTerm<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value)
    useEffect(() => {
        const handler = setTimeout(() => setDebounced(value), delay)
        return () => clearTimeout(handler)
    }, [value, delay])
    return debounced
}

export const parsePriceRange = (searchParams: URLSearchParams): [number, number] => {
    const priceMin = searchParams.get('priceMin')
    const priceMax = searchParams.get('priceMax')
    const min = priceMin !== null ? Number(priceMin) : Number.NaN
    const max = priceMax !== null ? Number(priceMax) : Number.NaN

    return [
        Number.isFinite(min) ? min : DEFAULT_PRICE_RANGE[0],
        Number.isFinite(max) ? max : DEFAULT_PRICE_RANGE[1],
    ]
}