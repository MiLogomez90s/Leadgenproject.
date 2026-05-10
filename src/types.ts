export interface SalesRep {
  id: string;
  name: string;
  email: string;
  assignedLeads: string[]; // array of lead IDs
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  industry: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  address: string;
  location: { lat: number; lng: number };
  rating: number;
  userRatingsTotal: number;
  ownerTitle: string | null;
  reliabilityScore: number; // 0-100
  conversionScore: number; // 0-100
  score: number; // 0-100 (Legacy/Weighted Total)
  priority: 'low' | 'medium' | 'high';
  status: 'new' | 'interested' | 'contacted' | 'replied' | 'converted' | 'lost' | 'rejected';
  assignedTo: string | null; // This will hold the SalesRep.id
  assignedToDispatcher: boolean;
  createdAt: string;
  notes: string;
  source: 'google_maps' | 'apollo' | 'instantly' | 'built_with' | 'manual';
}

export interface AggregatorTask {
  id: string;
  name: string;
  niche: string;
  industry: string;
  country: 'US' | 'LATAM';
  city: string;
  frequency: 'daily' | 'weekly';
  lastRun: string | null;
  active: boolean;
}

export type ViewType = 'leads' | 'scanner' | 'external' | 'analytics' | 'scoring' | 'ghl' | 'sales' | 'aggregator';

export interface ScannerResult {
  placeId: string;
  name: string;
  company: string;
  industry: string;
  address: string;
  location: { lat: number; lng: number };
  rating: number;
  userRatingsTotal: number;
  phone: string | null;
  website: string | null;
}
