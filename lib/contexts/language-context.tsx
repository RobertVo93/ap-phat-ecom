"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { navTranslations } from "@/locales/nav"
import { commonTranslations } from "@/locales/common"
import { homeTranslations } from "@/locales/home"
import { accountTranslations } from "@/locales/account"
import { productTranslations } from "@/locales/products"
import { cartTranslations } from "@/locales/cart"
import { checkoutTranslations } from "@/locales/checkout"
import { storeTranslations } from "@/locales/store"
import { footerTranslations } from "@/locales/footer"
import { aboutTranslations } from '@/locales/about'
import { authTranslations } from '@/locales/auth'
import { orderTranslations } from '@/locales/order'

type Language = "en" | "vi"

export interface Translations {
  [key: string]: {
    en: string
    vi: string
  }
}

const translations: Translations = {
  ...navTranslations,
  ...commonTranslations,
  ...homeTranslations,
  ...accountTranslations,
  ...productTranslations,
  ...cartTranslations,
  ...checkoutTranslations,
  ...storeTranslations,
  ...footerTranslations,
  ...aboutTranslations,
  ...authTranslations,
  ...orderTranslations,
}

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("vi")

  // Load language preference from localStorage on client side
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language]
    }
    return key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}