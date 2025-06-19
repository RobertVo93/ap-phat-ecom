export interface IBatchDetail {
  id?: string;
  batchNumber?: string;
  productionDate?: string;
  expiryDate?: string;
  packageNumber?: string;
  totalPackages?: number;
  status?: 'in_stock' | 'in_transit' | 'sold';
  qrCode?: string;
}

export interface IIngredient {
  id?: string;
  name?: string;
  nameEn?: string;
  weight?: number;
  unit?: string;
  percentage?: number;
  origin?: IOrigin;
}

export interface IOrigin {
  supplier?: string;
  supplierEn?: string;
  region?: string;
  regionEn?: string;
  description?: string;
  descriptionEn?: string;
  certifications?: string[];
  certificationsEn?: string[];
}

export interface IProductionStep {
  id?: string;
  step?: number;
  title?: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  duration?: string;
  temperature?: string;
  timestamp?: string;
  status?: 'completed' | 'in_progress' | 'pending';
  equipment?: string;
  equipmentEn?: string;
  qualityCheck?: IQualityCheck;
}

export interface IQualityCheck {
  passed?: boolean;
  inspector?: string;
  notes?: string;
  notesEn?: string;
  timestamp?: string;
}

export interface ITransportationRecord {
  id?: string;
  status?: 'picked_up' | 'in_transit' | 'delivered' | 'stored';
  location?: string;
  locationEn?: string;
  distributor?: IDistributor;
  timestamp?: string;
  notes?: string;
  notesEn?: string;
  temperature?: string;
  humidity?: string;
}

export interface IDistributor {
  name?: string;
  nameEn?: string;
  address?: string;
  addressEn?: string;
  phone?: string;
  email?: string;
  type?: 'warehouse' | 'retailer' | 'distributor';
}

export interface IBatchDetailComplete extends IBatchDetail {
  ingredients?: IIngredient[];
  productionSteps?: IProductionStep[];
  transportationHistory?: ITransportationRecord[];
  qualityAssurance?: {
    certifications?: string[];
    certificationsEn?: string[];
    testResults?: ITestResult[];
  };
  nutritionalInfo?: INutritionalInfo;
}

export interface ITestResult {
  testType?: string;
  testTypeEn?: string;
  result?: string;
  resultEn?: string;
  standard?: string;
  passed?: boolean;
  timestamp?: string;
}

export interface INutritionalInfo {
  servingSize?: string;
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  fiber?: number;
  sodium?: number;
  unit?: string;
}