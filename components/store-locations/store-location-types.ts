import { Dispatch, SetStateAction } from 'react';
import { LucideIcon } from 'lucide-react';
import { StoreLocation } from '@/lib/types';

export type StoreLocationsTranslator = (key: string) => string;

export interface StoreFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface StoreLocationsHeroProps {
  brandName: string;
  storeCount: number;
  t: StoreLocationsTranslator;
}

export interface StoreLocationListProps {
  selectedStoreId: string;
  stores: StoreLocation[];
  t: StoreLocationsTranslator;
  setSelectedStoreId: Dispatch<SetStateAction<string>>;
}

export interface StoreLocationDetailsProps {
  mapUrl: string;
  selectedStore: StoreLocation;
  t: StoreLocationsTranslator;
}

export interface StoreFeaturesCardProps {
  features: StoreFeature[];
  t: StoreLocationsTranslator;
}

export interface StoreServicesCardProps {
  services: string[];
  t: StoreLocationsTranslator;
}

export interface StoreOffersCardProps {
  t: StoreLocationsTranslator;
}

export interface ComingSoonStoresProps {
  t: StoreLocationsTranslator;
}
