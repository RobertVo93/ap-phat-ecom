'use client';

import React, { useState } from 'react';
import { Package, Leaf, Settings, Truck, Award, Loader2 } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { useBatchDetail } from '@/hooks/useBatchDetail';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { BatchOverview } from './batch-overview';
import { BatchIngredients } from './batch-ingredients';
import { BatchProduction } from './batch-production';
import { BatchTransportation } from './batch-transportation';
import { BatchQuality } from './batch-quality';

interface BatchDetailClientProps {
  batchId: string;
}

export function BatchDetailClient({ batchId }: BatchDetailClientProps) {
  const { t } = useLanguage();
  const {
    batchDetail,
    loading,
    error,
    formatDate,
    formatDateShort,
    getDaysFromProduction,
    getDaysUntilExpiry,
    getStatusColor,
    getTransportationStatusColor,
    getProductionStepIcon
  } = useBatchDetail(batchId);

  const [activeTab, setActiveTab] = useState('overview');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f5f0] flex items-center justify-center">
        <Card className="bg-white border-[#d4c5a0] p-8">
          <CardContent className="flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 text-[#573e1c] animate-spin" />
            <p className="text-[#8b6a42]">Loading batch details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !batchDetail) {
    return (
      <div className="min-h-screen bg-[#f8f5f0] flex items-center justify-center">
        <Card className="bg-white border-red-200 p-8">
          <CardContent className="text-center">
            <p className="text-red-600 mb-4">
              {error || 'Batch not found'}
            </p>
            <p className="text-[#8b6a42]">
              Please check the batch ID and try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#573e1c] mb-4">
            {t('batch.title')}
          </h1>
          <p className="text-[#8b6a42] text-lg max-w-3xl mx-auto">
            {t('batch.subtitle')}
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-[#efe1c1] mb-8">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-[#573e1c] data-[state=active]:text-[#efe1c1] flex items-center space-x-2"
            >
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">{t('batch.tabs.overview')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="ingredients" 
              className="data-[state=active]:bg-[#573e1c] data-[state=active]:text-[#efe1c1] flex items-center space-x-2"
            >
              <Leaf className="w-4 h-4" />
              <span className="hidden sm:inline">{t('batch.tabs.ingredients')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="production" 
              className="data-[state=active]:bg-[#573e1c] data-[state=active]:text-[#efe1c1] flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">{t('batch.tabs.production')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="transportation" 
              className="data-[state=active]:bg-[#573e1c] data-[state=active]:text-[#efe1c1] flex items-center space-x-2"
            >
              <Truck className="w-4 h-4" />
              <span className="hidden sm:inline">{t('batch.tabs.transportation')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="quality" 
              className="data-[state=active]:bg-[#573e1c] data-[state=active]:text-[#efe1c1] flex items-center space-x-2"
            >
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">{t('batch.tabs.quality')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <BatchOverview
              batchDetail={batchDetail}
              formatDateShort={formatDateShort}
              getDaysFromProduction={getDaysFromProduction}
              getDaysUntilExpiry={getDaysUntilExpiry}
              getStatusColor={getStatusColor}
            />
          </TabsContent>

          <TabsContent value="ingredients" className="mt-6">
            {batchDetail.ingredients && (
              <BatchIngredients ingredients={batchDetail.ingredients} />
            )}
          </TabsContent>

          <TabsContent value="production" className="mt-6">
            {batchDetail.productionSteps && (
              <BatchProduction
                productionSteps={batchDetail.productionSteps}
                formatDate={formatDate}
                getProductionStepIcon={getProductionStepIcon}
              />
            )}
          </TabsContent>

          <TabsContent value="transportation" className="mt-6">
            {batchDetail.transportationHistory && (
              <BatchTransportation
                transportationHistory={batchDetail.transportationHistory}
                formatDate={formatDate}
                getTransportationStatusColor={getTransportationStatusColor}
              />
            )}
          </TabsContent>

          <TabsContent value="quality" className="mt-6">
            <BatchQuality
              qualityAssurance={batchDetail.qualityAssurance}
              formatDate={formatDate}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}