"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { Brand as defaultBrand } from "@/lib/brand"
import { getSettingsByConfigTypeClient } from "@/lib/httpclient/setting.client"
import { normalizeBrandSettings } from "@/lib/utils.setting"
import { SettingConfig, type BrandSettings } from "@/types"

const BrandContext = createContext<BrandSettings>(defaultBrand)

type SettingProviderProps = {
  children: React.ReactNode
}

export function SettingProvider({ children }: SettingProviderProps) {
  const [brand, setBrand] = useState<BrandSettings>(defaultBrand)

  useEffect(() => {
    let isMounted = true

    async function loadBrandSettings() {
      try {
        const res = await getSettingsByConfigTypeClient(SettingConfig.Brand)
        if (!isMounted) return

        setBrand((currentBrand) => ({
          ...currentBrand,
          ...normalizeBrandSettings(res.values),
        }))
      } catch (error) {
        console.error(error)
      }
    }

    loadBrandSettings()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <BrandContext.Provider value={brand}>
      {children}
    </BrandContext.Provider>
  )
}

export function useBrand() {
  return useContext(BrandContext)
}
