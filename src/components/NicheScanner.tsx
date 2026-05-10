import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  APIProvider, 
  Map, 
  useMapsLibrary, 
  useMap,
  AdvancedMarker,
  InfoWindow,
  Pin
} from '@vis.gl/react-google-maps';
import { 
  Search as SearchIcon, 
  MapPin, 
  Navigation, 
  Save, 
  CheckCircle2, 
  Info,
  Facebook,
  Phone,
  ArrowRight,
  Target
} from 'lucide-react';
import { ScannerResult, Lead } from '../types';
import { storage } from '../lib/storage';

const GOOGLE_MAPS_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';

interface NicheScannerProps {
  onLeadFound: () => void;
}

export default function NicheScanner({ onLeadFound }: NicheScannerProps) {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('New York, NY');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<ScannerResult[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);

  const selectedPlace = useMemo(() => 
    results.find(r => r.placeId === selectedPlaceId), 
    [results, selectedPlaceId]
  );

  if (!GOOGLE_MAPS_KEY) {
    return (
      <div className="bg-[#0d0d0f] p-12 rounded-3xl border border-slate-800 text-center max-w-2xl mx-auto shadow-2xl">
        <div className="w-20 h-20 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 mx-auto mb-6 border border-amber-500/20">
          <Info size={40} />
        </div>
        <h2 className="text-3xl font-serif italic text-white mb-4">Google Maps Key Required</h2>
        <p className="text-slate-400 mb-8 leading-relaxed">To use the Niche Scanner business discovery engine, you need to provide a Google Maps Platform API key.</p>
        
        <div className="bg-black/40 p-6 rounded-2xl text-left space-y-4 mb-8 border border-white/5">
          <p className="text-sm font-bold text-white uppercase tracking-widest">Setup Instructions:</p>
          <ol className="text-sm text-slate-400 space-y-2 list-decimal list-inside">
            <li>Go to <a href="https://console.cloud.google.com/google/maps-apis/start" target="_blank" rel="noreferrer" className="text-amber-500 underline">Google Maps Console</a></li>
            <li>Get your API key and enable <strong>Maps JavaScript API</strong> and <strong>Places API</strong></li>
            <li>In this app, go to <strong>Settings {'->'} Secrets</strong></li>
            <li>Add <code>GOOGLE_MAPS_PLATFORM_KEY</code> and paste your key</li>
          </ol>
        </div>
        
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-amber-500 text-black rounded-full font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-900/20"
        >
          Check Again & Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-160px)]">
      {/* Search Header */}
      <div className="bg-[#0d0d0f] p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px] space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Target Industry</label>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="e.g. Roofers, Bakeries, Tech startups..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-800 rounded-lg text-sm focus:ring-1 focus:ring-amber-500/50 transition-all text-white placeholder:text-slate-600 outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setIsSearching(true)}
            />
          </div>
        </div>

        <div className="flex-1 min-w-[200px] space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Location Focus</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="e.g. Brooklyn, NY" 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-800 rounded-lg text-sm focus:ring-1 focus:ring-amber-500/50 transition-all text-white placeholder:text-slate-600 outline-none"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setIsSearching(true)}
            />
          </div>
        </div>

        <button 
          onClick={() => setIsSearching(true)}
          disabled={!query || !location || isSearching}
          className="px-8 py-2.5 bg-amber-500 text-black rounded-full font-bold hover:bg-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 h-[42px] whitespace-nowrap"
        >
          {isSearching ? 'Scraping Leads...' : 'Initiate Scan'}
          <Navigation size={14} />
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        <div className="flex flex-col gap-4 overflow-hidden">
          <div className="bg-[#0d0d0f] border border-slate-800 rounded-2xl flex-1 overflow-hidden flex flex-col shadow-xl">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/30">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span> Scanned Prospects
              </h3>
              <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-1 rounded font-mono border border-slate-700">
                {results.length} FOUND
              </span>
            </div>
            
            <div className="flex-1 overflow-auto divide-y divide-slate-800/50 p-2 custom-scrollbar">
              {results.length === 0 && !isSearching && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <p className="text-sm font-serif italic text-slate-600">Enter parameters to begin extraction.</p>
                </div>
              )}
              
              {results.map(place => (
                <div 
                  key={place.placeId} 
                  className={`p-4 hover:bg-slate-800/20 transition-all cursor-pointer rounded-xl mb-1 border ${selectedPlaceId === place.placeId ? 'bg-slate-800/30 border-slate-700' : 'border-transparent'}`}
                  onClick={() => setSelectedPlaceId(place.placeId)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-serif italic text-white truncate">{place.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded font-mono uppercase truncate">
                          {place.industry}
                        </span>
                        <span className="flex items-center gap-1 text-[9px] font-bold text-amber-500">
                           {place.rating} ★
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 ml-4">
                      <SaveButton place={place} onSaved={onLeadFound} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#09090b] border border-slate-800 rounded-2xl overflow-hidden relative shadow-inner h-full">
          <APIProvider apiKey={GOOGLE_MAPS_KEY} version="weekly">
            <MapSearchComponent 
              query={`${query} in ${location}`} 
              isSearching={isSearching} 
              onResults={(res) => {
                setResults(res);
                setIsSearching(false);
              }}
              selectedPlaceId={selectedPlaceId}
              onSelect={setSelectedPlaceId}
            />
          </APIProvider>

          {/* Map Overlay info */}
          <div className="absolute top-4 left-4 right-4 z-10 flex gap-2 pointer-events-none">
            {query && (
              <a 
                href={`https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&q=${encodeURIComponent(query)}&search_type=keyword_unordered`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#0d0d0f]/90 backdrop-blur-md border border-slate-800 px-4 py-2 rounded-full text-[10px] font-bold text-white flex items-center gap-2 hover:bg-[#0d0d0f] transition-all shadow-xl pointer-events-auto"
              >
                <Facebook size={12} className="text-[#1877F2]" />
                Explore Ads for "{query}"
                <ArrowRight size={10} className="text-slate-500" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MapSearchComponent({ query, isSearching, onResults, selectedPlaceId, onSelect }: { 
  query: string; 
  isSearching: boolean; 
  onResults: (res: ScannerResult[]) => void;
  selectedPlaceId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const map = useMap();
  const placesLib = useMapsLibrary('places');
  const [markers, setMarkers] = useState<ScannerResult[]>([]);

  useEffect(() => {
    if (!placesLib || !query || !isSearching || !map) return;

    placesLib.Place.searchByText({
      textQuery: query,
      fields: ['id', 'displayName', 'formattedAddress', 'location', 'rating', 'userRatingCount', 'nationalPhoneNumber', 'websiteURI', 'types'],
      maxResultCount: 20
    }).then(({ places }) => {
      const results: ScannerResult[] = places.map(p => ({
        placeId: p.id,
        name: p.displayName || '',
        company: p.displayName || '',
        industry: p.types?.[0]?.replace(/_/g, ' ') || 'Unknown',
        address: p.formattedAddress || '',
        location: { lat: p.location?.lat() || 0, lng: p.location?.lng() || 0 },
        rating: p.rating || 0,
        userRatingsTotal: (p as any).userRatingCount || 0,
        phone: p.nationalPhoneNumber || null,
        website: (p as any).websiteURI || null
      }));
      onResults(results);
      setMarkers(results);

      if (places.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        places.forEach(p => p.location && bounds.extend(p.location));
        map.fitBounds(bounds);
      }
    });
  }, [placesLib, query, isSearching, map]);

  return (
    <Map
      defaultCenter={{ lat: 40.7128, lng: -74.0060 }}
      defaultZoom={11}
      mapId="NICHE_SCANNER_MAP"
      style={{ width: '100%', height: '100%' }}
      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
      disableDefaultUI={true}
    >
      {markers.map(marker => (
        <AdvancedMarker 
          key={marker.placeId} 
          position={marker.location}
          onClick={() => onSelect(marker.placeId)}
        >
          <Pin 
            background={selectedPlaceId === marker.placeId ? '#EF4444' : '#2563EB'} 
            borderColor="white" 
            glyphColor="white"
            scale={selectedPlaceId === marker.placeId ? 1.2 : 1}
          />
        </AdvancedMarker>
      ))}

      {selectedPlaceId && markers.find(m => m.placeId === selectedPlaceId) && (
        <InfoWindow 
          position={markers.find(m => m.placeId === selectedPlaceId)!.location}
          onCloseClick={() => onSelect(null)}
        >
          <div className="p-1 max-w-[150px]">
            <p className="font-bold text-[11px] mb-0.5">{markers.find(m => m.placeId === selectedPlaceId)?.name}</p>
            <p className="text-[9px] text-gray-500 truncate">{markers.find(m => m.placeId === selectedPlaceId)?.address}</p>
          </div>
        </InfoWindow>
      )}
    </Map>
  );
}

function SaveButton({ place, onSaved }: { place: ScannerResult, onSaved: () => void }) {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    const newLead: Lead = {
      id: place.placeId,
      name: place.name.split(' ')[0],
      company: place.name,
      industry: place.industry,
      email: null,
      phone: place.phone,
      website: place.website,
      address: place.address,
      location: place.location,
      rating: place.rating,
      userRatingsTotal: place.userRatingsTotal,
      ownerTitle: 'Business Owner',
      reliabilityScore: 70, // Base score for Maps leads
      conversionScore: 65,
      score: 68,
      priority: 'medium',
      status: 'new',
      assignedTo: null,
      assignedToDispatcher: false,
      createdAt: new Date().toISOString(),
      notes: '',
      source: 'google_maps'
    };
    storage.autoApproveAndAssign(newLead);
    setIsSaved(true);
    onSaved();
  };

  return (
    <button 
      onClick={handleSave}
      disabled={isSaved}
      className={`p-2.5 rounded-xl transition-all ${isSaved ? 'text-emerald-500 bg-emerald-50' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100'}`}
    >
      {isSaved ? <CheckCircle2 size={18} /> : <Save size={18} />}
    </button>
  );
}
