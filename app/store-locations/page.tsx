'use client';

import React, { useState } from 'react';
import { Bus, Car, Train } from 'lucide-react';
import {
  ComingSoonStores,
  StoreFeaturesCard,
  StoreLocationDetails,
  StoreLocationList,
  StoreLocationsHero,
  StoreOffersCard,
  StoreServicesCard,
} from '@/components/store-locations';
import { useLanguage } from '@/lib/contexts/language-context';
import { useBrand } from '@/lib/contexts/setting-context';
import { StoreLocation } from '@/lib/types';

const MAIN_STORE_ID = 'main-store';

export default function StoreLocationsPage() {
  const { t } = useLanguage();
  const brand = useBrand();

  const storeLocations: StoreLocation[] = [
    {
      id: MAIN_STORE_ID,
      name: t('store.locations.mainStoreName'),
      nameEn: t('store.locations.mainStoreName'),
      address: brand.address,
      addressEn: t('store.locations.mainStoreAddress'),
      phone: brand.phone,
      email: brand.email,
      hours: t('store.locations.mainStoreHours'),
      hoursEn: t('store.locations.mainStoreHours'),
      coordinates: {
        lat: 14.190373918981283,
        lng: 109.01627452738636,
      },
    },
  ];

  const [selectedStoreId, setSelectedStoreId] = useState(MAIN_STORE_ID);
  const selectedStore = storeLocations.find((store) => store.id === selectedStoreId) || storeLocations[0];

  const storeFeatures = [
    {
      icon: Car,
      title: t('store.locations.features.parking.title'),
      description: t('store.locations.features.parking.description'),
    },
    {
      icon: Bus,
      title: t('store.locations.features.publicTransport.title'),
      description: t('store.locations.features.publicTransport.description'),
    },
    {
      icon: Train,
      title: t('store.locations.features.metro.title'),
      description: t('store.locations.features.metro.description'),
    },
  ];

  const storeServices = [
    t('store.locations.services.consulting'),
    t('store.locations.services.delivery'),
    t('store.locations.services.wholesale'),
    t('store.locations.services.returns'),
    t('store.locations.services.payments'),
    t('store.locations.services.giftWrap'),
  ];

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      <StoreLocationsHero
        brandName={brand.name}
        storeCount={storeLocations.length}
        t={t}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <StoreLocationList
            selectedStoreId={selectedStoreId}
            stores={storeLocations}
            t={t}
            setSelectedStoreId={setSelectedStoreId}
          />

          <div className="lg:col-span-2 space-y-6">
            <StoreLocationDetails
              mapUrl={brand.maps[0]}
              selectedStore={selectedStore}
              t={t}
            />
            <StoreFeaturesCard features={storeFeatures} t={t} />
            <StoreServicesCard services={storeServices} t={t} />
            <StoreOffersCard t={t} />
          </div>
        </div>

        <ComingSoonStores t={t} />
      </div>
    </div>
  );
}
