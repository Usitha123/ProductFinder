export type LocationOption = 'Sri Lanka' | 'International' | 'Worldwide';

export type PriceVerificationStatus =
  | 'verified'
  | 'not_found'
  | 'confirmation_required'
  | 'cached_or_outdated';

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  price: string;
  numericPrice: number | null;
  currency: string;
  priceUnit: string;
  availableQuantity: string;
  minOrderQuantity: string;
  brand: string;
  material: string;
  capacityOrSize: string;
  supplierName: string;
  supplierCountry: string;
  specifications: Record<string, string>;
  sourceWebsite: string;
  sourceUrl: string;
  imageUrl: string | null;
  lastCheckedDate: string;
  priceStatus: PriceVerificationStatus;
  accessNotes?: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface SearchResponse {
  success: boolean;
  query: string;
  location: LocationOption;
  summary: string;
  products: ProductItem[];
  groundingSources: GroundingSource[];
  webSearchQueries?: string[];
  error?: string;
}

export interface UrlInspectionResult {
  accessStatus: 'accessible' | 'restricted_or_login_required' | 'unavailable';
  pageTitle: string;
  verifiedPrice: string;
  stockStatus: string;
  minOrderQuantity: string;
  specifications: Record<string, string>;
  supplierNotes: string;
  inspectionDate: string;
}

export interface RecentSearch {
  query: string;
  location: LocationOption;
  timestamp: number;
}
