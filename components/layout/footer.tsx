'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#573e1c] text-[#efe1c1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#efe1c1] rounded-full flex items-center justify-center">
                <span className="text-[#573e1c] font-bold text-sm">RT</span>
              </div>
              <span className="font-bold text-xl">Rice & Noodles</span>
            </div>
            <p className="text-[#d4c5a0] text-sm leading-relaxed">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-[#efe1c1] hover:text-[#d4c5a0] transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-[#efe1c1] hover:text-[#d4c5a0] transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-[#efe1c1] hover:text-[#d4c5a0] transition-colors">
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t('nav.products')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=rice-paper" className="text-[#d4c5a0] hover:text-[#efe1c1] transition-colors text-sm">
                  Bánh Tráng
                </Link>
              </li>
              <li>
                <Link href="/products?category=pho-noodles" className="text-[#d4c5a0] hover:text-[#efe1c1] transition-colors text-sm">
                  Bánh Phở
                </Link>
              </li>
              <li>
                <Link href="/products?category=vermicelli" className="text-[#d4c5a0] hover:text-[#efe1c1] transition-colors text-sm">
                  Bún
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-[#d4c5a0] hover:text-[#efe1c1] transition-colors text-sm">
                  {t('common.viewAll')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t('nav.account')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/account/orders" className="text-[#d4c5a0] hover:text-[#efe1c1] transition-colors text-sm">
                  {t('account.orders')}
                </Link>
              </li>
              <li>
                <Link href="/account/profile" className="text-[#d4c5a0] hover:text-[#efe1c1] transition-colors text-sm">
                  {t('account.profile')}
                </Link>
              </li>
              <li>
                <Link href="/store-locations" className="text-[#d4c5a0] hover:text-[#efe1c1] transition-colors text-sm">
                  {t('store.locations')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#d4c5a0] hover:text-[#efe1c1] transition-colors text-sm">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t('store.contact')}</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#d4c5a0]" />
                <span className="text-[#d4c5a0] text-sm">028 3823 4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#d4c5a0]" />
                <span className="text-[#d4c5a0] text-sm">contact@ricepaperstore.vn</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-[#d4c5a0] mt-0.5" />
                <span className="text-[#d4c5a0] text-sm leading-relaxed">
                  123 Đường Lê Lợi, Phường Bến Nghé<br />
                  Quận 1, TP.HCM
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#8b6a42] mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-[#d4c5a0] text-sm">
              © 2024 Rice & Noodles. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-[#d4c5a0] hover:text-[#efe1c1] transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-[#d4c5a0] hover:text-[#efe1c1] transition-colors text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}