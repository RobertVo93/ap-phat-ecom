'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Facebook, Youtube } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { useBrand } from '@/lib/contexts/setting-context';

export function Footer() {
  const { t } = useLanguage();
  const brand = useBrand();

  return (
    <footer className="bg-[#573e1c] text-[#efe1c1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#efe1c1] rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-[#573e1c] rounded-full flex items-center justify-center">
                  <Image
                    alt='an phat food'
                    src='/AP-logo-nobg.png'
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
              </div>
              <span className="font-bold text-xl">{brand.name}</span>
            </div>
            <p className="text-[#d4c5a0] text-sm leading-relaxed">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex space-x-4">
              <Link href={brand.facebook} target="_blank" className="text-[#efe1c1] hover:text-[#d4c5a0] transition-colors">
                <Facebook target="_blank" className="w-5 h-5" />
              </Link>
              <Link href={brand.youtube} target="_blank" className="text-[#efe1c1] hover:text-[#d4c5a0] transition-colors">
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t('store.contact')}</h3>
            <div className="space-y-3">
              <a href={`tel:${brand.phone?.replace(/\s+/g, '')}`} className="flex items-center space-x-3 text-[#d4c5a0] text-sm hover:text-[#efe1c1] transition-colors">
                <Phone className="w-4 h-4" />
                <span>{brand.phone}</span>
              </a>
              <a href={`mailto:${brand.email}`} className="flex items-center space-x-3 text-[#d4c5a0] text-sm hover:text-[#efe1c1] transition-colors">
                <Mail className="w-4 h-4" />
                <span>{brand.email}</span>
              </a>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-[#d4c5a0] mt-0.5" />
                <Link href={brand.maps[0]} target="_blank" className="text-[#d4c5a0] text-sm hover:text-[#efe1c1] leading-relaxed whitespace-pre-line">
                  {brand.address}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#8b6a42] mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-[#d4c5a0] text-sm">
              {t('footer.copyright')}
            </p>
            <div className="flex space-x-6">
              <Link href="/" className="text-[#d4c5a0] hover:text-[#efe1c1] transition-colors text-sm">
                {t('footer.privacyPolicy')}
              </Link>
              <Link href="/" className="text-[#d4c5a0] hover:text-[#efe1c1] transition-colors text-sm">
                {t('footer.termsOfService')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
