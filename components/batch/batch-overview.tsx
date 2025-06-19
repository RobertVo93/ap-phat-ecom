'use client';

import React from 'react';
import { Package, Calendar, Clock, MapPin } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { IBatchDetailComplete } from '@/types/batch.interface';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BatchOverviewProps {
  batchDetail: IBatchDetailComplete;
  formatDateShort: (date: string) => string;
  getDaysFromProduction: (date: string) => number;
  getDaysUntilExpiry: (date: string) => number;
  getStatusColor: (status: string) => string;
}

export function BatchOverview({
  batchDetail,
  formatDateShort,
  getDaysFromProduction,
  getDaysUntilExpiry,
  getStatusColor
}: BatchOverviewProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card className="bg-white border-[#d4c5a0]">
        <CardHeader>
          <CardTitle className="text-[#573e1c] flex items-center">
            <Package className="w-5 h-5 mr-2" />
            {t('batch.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <span className="text-sm text-[#8b6a42] font-medium">{t('batch.batchNumber')}</span>
                <p className="font-mono font-bold text-[#573e1c] text-lg">{batchDetail.batchNumber}</p>
              </div>
              <div>
                <span className="text-sm text-[#8b6a42] font-medium">{t('batch.packageNumber')}</span>
                <p className="font-bold text-[#573e1c]">
                  {batchDetail.packageNumber} / {batchDetail.totalPackages}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-[#8b6a42] font-medium">{t('batch.status')}</span>
                <div className="mt-1">
                  <Badge className={getStatusColor(batchDetail.status || '')}>
                    {t(`batch.status.${batchDetail.status}`)}
                  </Badge>
                </div>
              </div>
              <div>
                <span className="text-sm text-[#8b6a42] font-medium">{t('batch.totalPackages')}</span>
                <p className="font-bold text-[#573e1c]">{batchDetail.totalPackages}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Freshness Information */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            {t('batch.freshness.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-700 font-medium">{t('batch.freshness.produced')}</p>
                <p className="font-bold text-green-800">
                  {batchDetail.productionDate && getDaysFromProduction(batchDetail.productionDate)} {t('batch.freshness.daysAgo')}
                </p>
                <p className="text-xs text-green-600">
                  {batchDetail.productionDate && formatDateShort(batchDetail.productionDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">{t('batch.freshness.bestBefore')}</p>
                <p className="font-bold text-blue-800">
                  {batchDetail.expiryDate && getDaysUntilExpiry(batchDetail.expiryDate)} {t('batch.freshness.daysLeft')}
                </p>
                <p className="text-xs text-blue-600">
                  {batchDetail.expiryDate && formatDateShort(batchDetail.expiryDate)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nutritional Information */}
      {batchDetail.nutritionalInfo && (
        <Card className="bg-white border-[#d4c5a0]">
          <CardHeader>
            <CardTitle className="text-[#573e1c]">{t('batch.nutrition.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-[#f8f5f0] rounded-lg">
                <p className="text-2xl font-bold text-[#573e1c]">{batchDetail.nutritionalInfo.calories}</p>
                <p className="text-sm text-[#8b6a42]">{t('batch.nutrition.calories')}</p>
              </div>
              <div className="text-center p-3 bg-[#f8f5f0] rounded-lg">
                <p className="text-2xl font-bold text-[#573e1c]">{batchDetail.nutritionalInfo.protein}g</p>
                <p className="text-sm text-[#8b6a42]">{t('batch.nutrition.protein')}</p>
              </div>
              <div className="text-center p-3 bg-[#f8f5f0] rounded-lg">
                <p className="text-2xl font-bold text-[#573e1c]">{batchDetail.nutritionalInfo.carbohydrates}g</p>
                <p className="text-sm text-[#8b6a42]">{t('batch.nutrition.carbohydrates')}</p>
              </div>
              <div className="text-center p-3 bg-[#f8f5f0] rounded-lg">
                <p className="text-2xl font-bold text-[#573e1c]">{batchDetail.nutritionalInfo.fat}g</p>
                <p className="text-sm text-[#8b6a42]">{t('batch.nutrition.fat')}</p>
              </div>
            </div>
            <p className="text-xs text-[#8b6a42] mt-3 text-center">
              {t('batch.nutrition.servingSize')}: {batchDetail.nutritionalInfo.servingSize}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Contact Information */}
      <Card className="bg-gradient-to-r from-[#efe1c1] to-[#d4c5a0] border-[#8b6a42]">
        <CardContent className="p-6 text-center">
          <h3 className="font-bold text-[#573e1c] text-lg mb-2">
            {t('batch.contact.title')}
          </h3>
          <p className="text-[#8b6a42] text-sm mb-4">
            {t('batch.contact.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:02838234567"
              className="inline-flex items-center justify-center px-4 py-2 bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1] rounded-lg transition-colors"
            >
              <MapPin className="w-4 h-4 mr-2" />
              {t('batch.contact.phone')}
            </a>
            <a
              href="mailto:contact@ricepaperstore.vn"
              className="inline-flex items-center justify-center px-4 py-2 border-2 border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1] rounded-lg transition-colors"
            >
              {t('batch.contact.email')}
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}