import { useState } from 'react';
import { 
  Zap, 
  Search, 
  Globe, 
  Database, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Target
} from 'lucide-react';
import { apiAggregator } from '../services/apiAggregator';
import { storage } from '../lib/storage';
import { Lead } from '../types';

interface ExternalEnginesProps {
  onLeadFound: () => void;
}

export default function ExternalEngines({ onLeadFound }: ExternalEnginesProps) {
  const [query, setQuery] = useState('');
  const [industry, setIndustry] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Lead[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const handleSearch = async () => {
    if (!query) return;
    setIsSearching(true);
    try {
      const leads = await apiAggregator.aggregateLeads({ query, industry });
      setResults(leads);
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      setIsSearching(false);
    }
  };

  const saveLead = (lead: Lead) => {
    storage.autoApproveAndAssign({
      ...lead,
      assignedToDispatcher: false, // will be overwritten by logic
      assignedTo: null
    });
    setSavedIds(prev => new Set(prev).add(lead.id));
    onLeadFound();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Search Console */}
      <div className="bg-gradient-to-br from-[#161618] to-[#0d0d0f] rounded-3xl p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-amber-500/10 p-2 rounded-lg backdrop-blur-md border border-amber-500/20">
              <Database size={20} className="text-amber-500" />
            </div>
            <h2 className="text-2xl font-serif italic text-white tracking-tight">External Data Engines</h2>
          </div>
          <p className="text-slate-400 mb-10 leading-relaxed text-sm max-w-xl">
            Power your pipeline by pulling high-intent prospects directly from 
            <span className="text-white mx-1 italic">Apollo.io</span> and 
            <span className="text-white mx-1 italic">Instantly.ai</span> via semantic aggregation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Search Keywords</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="text" 
                  className="w-full bg-black/40 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-slate-200 placeholder:text-slate-700 focus:ring-1 focus:ring-amber-500/40 focus:outline-none transition-all"
                  placeholder="e.g. Sales Directors, Founders..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Industry Filter</label>
              <input 
                type="text" 
                className="w-full bg-black/40 border border-slate-800 rounded-xl py-3 px-4 text-slate-200 placeholder:text-slate-700 focus:ring-1 focus:ring-amber-500/40 focus:outline-none transition-all"
                placeholder="e.g. SaaS, Fintech, Solar..."
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
            </div>
          </div>

          <button 
            onClick={handleSearch}
            disabled={isSearching || !query}
            className="px-10 py-4 bg-amber-500 text-black rounded-full font-bold hover:bg-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl shadow-amber-900/10"
          >
            {isSearching ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Aggregating Cloud Data...
              </>
            ) : (
              <>
                <Zap size={18} fill="currentColor" />
                Trigger Global Search
              </>
            )}
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Results Stream */}
        <div className="bg-[#0d0d0f] rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/30">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Aggregated Prospects
            </h3>
            <span className="text-[10px] font-mono text-slate-500">{results.length} PULLED</span>
          </div>
          
          <div className="flex-1 overflow-auto divide-y divide-slate-800/50 max-h-[600px] custom-scrollbar">
            {results.length === 0 ? (
              <div className="p-20 text-center text-slate-600">
                <Globe size={40} className="mx-auto mb-4 opacity-10" />
                <p className="text-xs font-serif italic">Launch a global search to populate stream.</p>
              </div>
            ) : (
              results.map(lead => (
                <div key={lead.id} className="p-6 hover:bg-slate-800/20 transition-colors group">
                  <div className="flex justify-between items-center">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-serif italic text-white truncate">{lead.company}</h4>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold border ${
                          lead.source === 'apollo' 
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                            : lead.source === 'instantly'
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                            : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        }`}>
                          {lead.source}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium">{lead.name} • {lead.industry}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter">Reliability</span>
                          <span className="text-[11px] font-mono text-blue-500">{lead.reliabilityScore}%</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter">Conversion</span>
                          <span className="text-[11px] font-mono text-emerald-500">{lead.conversionScore}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => saveLead(lead)}
                      disabled={savedIds.has(lead.id)}
                      className={`p-3 rounded-xl transition-all ${
                        savedIds.has(lead.id) 
                          ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20 cursor-default' 
                          : 'text-slate-500 bg-slate-900 border border-slate-800 hover:text-amber-500 hover:border-amber-500/30'
                      }`}
                    >
                      {savedIds.has(lead.id) ? <CheckCircle2 size={18} /> : <ChevronRight size={18} />}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Integration Status & Tips */}
        <div className="space-y-6">
          <div className="bg-[#0d0d0f] p-8 rounded-2xl border border-slate-800 shadow-xl">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-8">Cloud Connectors</h3>
            <div className="space-y-8">
              <IntegrationStatus 
                name="Apollo.io" 
                desc="Deep person-level data and verified work emails." 
                isConnected={!!process.env.APOLLO_API_KEY} 
                icon="https://www.apollo.io/favicon.ico"
              />
              <IntegrationStatus 
                name="Instantly.ai" 
                desc="Campaign-ready leads with warm-up verification." 
                isConnected={!!process.env.INSTANTLY_API_KEY} 
                icon="https://instantly.ai/favicon.ico"
              />
              <IntegrationStatus 
                name="BuiltWith" 
                desc="Technology stack identification and contact discovery." 
                isConnected={true} 
                icon="https://builtwith.com/favicon.ico"
              />
            </div>
          </div>

          <div className="bg-amber-500/5 rounded-2xl p-8 border border-amber-500/10">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                <AlertCircle size={18} />
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Semantic Sourcing</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-serif italic text-pretty">
                  Our aggregator doesn't just search fields; it correlates your "Target Industry" 
                  across multiple databases to find prospects that fit your ideal persona profile.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800">
            <button className="w-full py-3 bg-slate-800 text-slate-300 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
              <ExternalLink size={14} /> View Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function IntegrationStatus({ name, desc, isConnected, icon }: { name: string, desc: string, isConnected: boolean, icon: string }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0">
        <img src={icon} alt={name} className="w-6 h-6 grayscale opacity-50" onError={(e) => (e.currentTarget.style.display = 'none')} />
        <Globe size={20} className="text-slate-700" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-white">{name}</p>
          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${
            isConnected ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 'text-slate-500 border-slate-800 bg-slate-900'
          }`}>
            {isConnected ? 'ACTIVE' : 'DECOUPLED'}
          </span>
        </div>
        <p className="text-[10px] text-slate-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
