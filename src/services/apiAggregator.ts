import { Lead } from '../types';

export interface ExternalSearchParams {
  query: string;
  location?: string;
  industry?: string;
  limit?: number;
}

export const apiAggregator = {
  searchApollo: async (params: ExternalSearchParams): Promise<Lead[]> => {
    // Simulate API call to Apollo.io
    const apiKey = process.env.APOLLO_API_KEY;
    if (!apiKey) {
      console.warn('Apollo API Key missing');
    }

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, this would use fetch('https://api.apollo.io/v1/...')
    return [
      {
        id: `apollo-${Math.random().toString(36).substr(2, 9)}`,
        name: 'James',
        company: `${params.query} Dynamics`,
        industry: params.industry || 'Technology',
        email: 'james@example.com',
        phone: '+1 555-010-888',
        website: 'https://example.com',
        address: params.location || 'San Francisco, CA',
        location: { lat: 37.7749, lng: -122.4194 },
        rating: 4.5,
        userRatingsTotal: 45,
        ownerTitle: 'Director of Growth',
        reliabilityScore: 88,
        conversionScore: 72,
        score: 80,
        priority: 'high',
        status: 'new',
        assignedTo: null,
        assignedToDispatcher: false,
        createdAt: new Date().toISOString(),
        notes: 'Found via Apollo semantic search.',
        source: 'apollo'
      }
    ];
  },

  searchInstantly: async (params: ExternalSearchParams): Promise<Lead[]> => {
    // Simulate API call to Instantly.ai
    const apiKey = process.env.INSTANTLY_API_KEY;
    if (!apiKey) {
      console.warn('Instantly API Key missing');
    }

    await new Promise(resolve => setTimeout(resolve, 1200));

    // In a real app, this would use fetch('https://api.instantly.ai/v1/...')
    return [
      {
        id: `instantly-${Math.random().toString(36).substr(2, 9)}`,
        name: 'Sarah',
        company: `${params.query} Systems`,
        industry: params.industry || 'Manufacturing',
        email: 'sarah.l@example.com',
        phone: '+1 555-020-999',
        website: 'https://example.com',
        address: params.location || 'Austin, TX',
        location: { lat: 30.2672, lng: -97.7431 },
        rating: 4.2,
        userRatingsTotal: 89,
        ownerTitle: 'Ops Manager',
        reliabilityScore: 92,
        conversionScore: 75,
        score: 83,
        priority: 'high',
        status: 'new',
        assignedTo: null,
        assignedToDispatcher: false,
        createdAt: new Date().toISOString(),
        notes: 'Captured via Instantly lead finder.',
        source: 'instantly'
      }
    ];
  },

  aggregateLeads: async (params: ExternalSearchParams): Promise<Lead[]> => {
    const [apolloLeads, instantlyLeads, builtWithLeads] = await Promise.all([
      apiAggregator.searchApollo(params),
      apiAggregator.searchInstantly(params),
      apiAggregator.searchBuiltWith(params)
    ]);
    return [...apolloLeads, ...instantlyLeads, ...builtWithLeads];
  },

  searchBuiltWith: async (params: ExternalSearchParams): Promise<Lead[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
      {
        id: `bw-${Math.random().toString(36).substr(2, 9)}`,
        name: 'Tech Lead',
        company: `${params.query} Labs`,
        industry: params.industry || 'Software',
        email: 'tech@example.com',
        phone: null,
        website: 'https://example.com',
        address: 'San Jose, CA',
        location: { lat: 37.3382, lng: -121.8863 },
        rating: 4.9,
        userRatingsTotal: 12,
        ownerTitle: 'CTO',
        reliabilityScore: 98,
        conversionScore: 85,
        score: 91,
        priority: 'high',
        status: 'new',
        assignedTo: null,
        assignedToDispatcher: false,
        createdAt: new Date().toISOString(),
        notes: 'Identified via BuiltWith technology stack analysis.',
        source: 'built_with' 
      }
    ];
  }
};
