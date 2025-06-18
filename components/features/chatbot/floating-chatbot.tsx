'use client';

import React, { useState } from 'react';
import { MessageCircle, Phone, MapPin, X, Facebook } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function FloatingChatbot() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const contactOptions = [
    {
      icon: MessageCircle,
      label: t('chatbot.messenger'),
      href: 'https://m.me/riceandnoodles',
      color: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-white'
    },
    {
      icon: MessageCircle,
      label: t('chatbot.zalo'),
      href: 'https://zalo.me/0901234567',
      color: 'bg-blue-500 hover:bg-blue-600',
      textColor: 'text-white'
    },
    {
      icon: Phone,
      label: t('chatbot.phone'),
      href: 'tel:02838234567',
      color: 'bg-green-600 hover:bg-green-700',
      textColor: 'text-white'
    },
    {
      icon: MapPin,
      label: t('chatbot.location'),
      href: 'https://maps.google.com/?q=123+Le+Loi+Street,+District+1,+Ho+Chi+Minh+City',
      color: 'bg-red-600 hover:bg-red-700',
      textColor: 'text-white'
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Contact Options Panel */}
      <div className={`absolute bottom-20 right-0 transition-all duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} style={{ minWidth: 280 }}>
        <Card className="bg-white border-[#d4c5a0] shadow-xl">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-[#573e1c]">
                {t('chatbot.title')}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0 text-[#8b6a42] hover:text-[#573e1c]"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-[#8b6a42] mb-4">
              {t('chatbot.subtitle')}
            </p>
            <div className="space-y-2">
              {contactOptions.map((option, index) => (
                <a
                  key={index}
                  href={option.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${option.color} ${option.textColor}`}
                >
                  <option.icon className="w-5 h-5" />
                  <span className="font-medium">{option.label}</span>
                </a>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-[#efe1c1]">
              <p className="text-xs text-[#8b6a42] text-center">
                {t('chatbot.hours')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Main Chat Button */}
      <div className="relative">
        {/* Pulse Animation */}
        {!isOpen && (
          <div className="absolute inset-0 rounded-full bg-[#fbbf24] animate-ping opacity-30"></div>
        )}
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative h-14 w-14 rounded-full shadow-lg transition-all duration-300 border-4 border-white ${
            isOpen 
              ? 'bg-[#fbbf24] hover:bg-[#f59e42]' // Highlighted gold/yellow
              : 'bg-[#fbbf24] hover:bg-[#f59e42]' // Highlighted gold/yellow
          } text-[#573e1c]`}
          style={{
            boxShadow: '0 4px 24px 0 rgba(251,191,36,0.25), 0 1.5px 6px 0 rgba(87,62,28,0.10)'
          }}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </Button>
      </div>
    </div>
  );
}