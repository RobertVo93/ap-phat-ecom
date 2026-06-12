'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, User, Menu, X, Globe, Gift, ClipboardList, Bell } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { useCart } from '@/lib/contexts/cart-context';
import { useAuth } from '@/lib/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useBrand } from "@/lib/contexts/setting-context"
import Image from 'next/image';
import { Badge } from '../ui/badge';
import { useNotification } from '@/lib/contexts/notification-context';
import { formatDate } from '@/lib/utils.date';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const brand = useBrand();
  const { getCartItemsCount } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { notifications, unreadNumber, onMarkAsRead, } = useNotification();
  const cartItemsCount = getCartItemsCount();

  const navigation = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.products'), href: '/products' },
    // { name: t('nav.about'), href: '/about' },
    // { name: t('nav.contact'), href: '/contact' },
  ];

  const handleLogout = () => {
    logout();
  };

  const onSearchKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  }

  return (
    <header className="bg-[#efe1c1] shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className='flex items-center space-x-2'>
              <div className="w-8 h-8 bg-[#573e1c] rounded-full flex items-center justify-center">
                <Image
                  alt='an phat food'
                  src='/AP-logo-nobg.png'
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
              <span className="text-[#573e1c] font-bold text-xl hidden sm:block">
                {brand.name}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 ml-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-[#573e1c] hover:text-[#8b6a42] transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b6a42] w-4 h-4" />
              <Input
                type="text"
                placeholder={t('home.search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={onSearchKeyDownHandler}
                className="pl-10 bg-white border-[#8b6a42] focus:border-[#573e1c] text-[#573e1c]"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-[#573e1c] hover:bg-[#d4c5a0]">
                  <Globe className="w-4 h-4 mr-1" />
                  {language.toUpperCase()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setLanguage('vi')}>
                  Tiếng Việt
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                  English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-[#573e1c] hover:text-[#8b6a42] transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {cartItemsCount > 9 ? '9+' : cartItemsCount}
                </span>
              )}
            </Link>

            {/* Notifications */}
            <HoverCard openDelay={100} closeDelay={100}>
              <HoverCardTrigger asChild>
                <Link
                  className="p-2 text-[#573e1c] hover:bg-[#d4c5a0] transition-colors relative"
                  href='/notifications'
                >
                  <Bell className="w-6 h-6" />
                  {unreadNumber > 0 && (
                    <Badge className="absolute -top-1 -right-0 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                      {unreadNumber > 5 ? '5+' : unreadNumber}
                    </Badge>
                  )}
                </Link>
              </HoverCardTrigger>

              <HoverCardContent
                align="end"
                className="w-80 p-0"
              >
                {notifications.length > 0 ? (
                  <div>
                    {notifications.slice(0, 5).map(noti => (
                      <Link
                        href={noti.url || ''}
                        key={noti.id}
                        className="block"
                        onClick={() => {
                          if (!noti.isRead) onMarkAsRead(noti.id!)
                        }}
                      >
                        <div className={`flex flex-col items-start p-2 border-b hover:bg-gray-200 ${!noti.isRead ? 'bg-[#E6F2FF]' : ''}`} >
                          <p className="font-semibold">{t(`noti.order.${noti.title}`)}</p>
                          <p className="text-sm">
                            {t(`noti.order.${noti.content}`).replace(
                              "{orderNumber}",
                              noti.data?.orderNumber
                            )}
                          </p>
                          <p className="w-full text-end text-xs text-gray-500">
                            {formatDate(noti.createdAt!)}
                          </p>
                        </div>
                      </Link>
                    ))}

                    <Link
                      href="/notifications"
                      className="p-2 flex justify-center font-semibold hover:bg-gray-100"
                    >
                      {t('nav.seeAll')}
                    </Link>
                  </div>
                ) : (
                  <div className="p-2 flex justify-center font-semibold">
                    {t('nav.noNotifications')}
                  </div>
                )}
              </HoverCardContent>
            </HoverCard>

            {/* User Account */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-[#573e1c] hover:bg-[#d4c5a0]">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {user ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/account">{t('nav.account')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account/orders">
                        <ClipboardList className="w-4 h-4 mr-2" />
                        {t('nav.orders')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className='hidden'>
                      <Link href="/account/rewards">
                        <Gift className="w-4 h-4 mr-2" />
                        {t('rewards.title')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      {t('nav.logout')}
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login">{t('nav.login')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/register">{t('nav.register')}</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-[#573e1c]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b6a42] w-4 h-4" />
            <Input
              type="text"
              placeholder={t('home.search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={onSearchKeyDownHandler}
              className="pl-10 bg-white border-[#8b6a42] focus:border-[#573e1c] text-[#573e1c]"
            />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#efe1c1] border-t border-[#d4c5a0]">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-[#573e1c] hover:text-[#8b6a42] hover:bg-[#d4c5a0] rounded-md font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {user && (
              <Link
                href="/account/rewards"
                className="hidden block px-3 py-2 text-[#573e1c] hover:text-[#8b6a42] hover:bg-[#d4c5a0] rounded-md font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <Gift className="w-4 h-4 mr-2 inline" />
                {t('rewards.title')}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
