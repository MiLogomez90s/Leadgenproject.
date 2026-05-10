import { useState } from 'react';
import { 
  Cloud, 
  RefreshCw, 
  Key, 
  ExternalLink, 
  CheckCircle2, 
  Copy, 
  AlertCircle,
  Layout,
  ArrowRight,
  UserPlus
} from 'lucide-react';
import { Lead } from '../types';

interface GHLIntegrationProps {
  leads: Lead[];
}

export default function GHLIntegration({ leads }: GHLIntegrationProps) {
  const [apiKey, setApiKey] = useState('');
  const [locationId, setLocationId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulate API connection
    await new Promise(r => setTimeout(r, 1500));
    setIsConnecting(false);
    setIsConnected(true);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    // Simulate lead push
    await new Promise(r => setTimeout(r, 2000));
    setIsSyncing(false);
    alert(`Successfully synced ${leads.length} leads to GHL CRM.`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Integration Header */}
      <div className="bg-[#0d0d0f] p-8 rounded-3xl border border-slate-800 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-[#18C3F8]/10 rounded-2xl flex items-center justify-center text-[#18C3F8] border border-[#18C3F8]/20">
            <Cloud size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-serif italic text-white tracking-tight">GoHighLevel Integration</h2>
            <p className="text-slate-500 text-sm mt-1">Bi-directional synchronization with your GHL ecosystem.</p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-full text-[10px] font-bold tracking-widest flex items-center gap-2 border ${isConnected ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-900 text-slate-500 border-slate-800'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`} />
          {isConnected ? 'LIVE SYNC ACTIVE' : 'DISCONNECTED'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Connection Setup */}
        <div className="bg-[#0d0d0f] p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Key size={14} className="text-amber-500" />
            API Credentials
          </h3>
          
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider pl-1">V2 API Key</label>
              <input 
                type="password" 
                placeholder="••••••••••••••••" 
                className="w-full px-4 py-3 bg-black/40 border border-slate-800 rounded-xl text-sm focus:ring-1 focus:ring-amber-500/40 transition-all font-mono text-white outline-none"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider pl-1">Location ID</label>
              <input 
                type="text" 
                placeholder="Enter Location ID" 
                className="w-full px-4 py-3 bg-black/40 border border-slate-800 rounded-xl text-sm focus:ring-1 focus:ring-amber-500/40 transition-all font-mono text-white outline-none"
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
              />
            </div>

            <button 
              onClick={handleConnect}
              disabled={isConnecting || !apiKey || !locationId}
              className="w-full py-4 bg-white text-black rounded-full font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm shadow-xl"
            >
              {isConnecting ? <RefreshCw className="animate-spin" size={18} /> : 'Authorize Connection'}
            </button>
          </div>

          <div className="pt-6 border-t border-slate-800/50">
            <a href="https://app.gohighlevel.com" target="_blank" rel="noreferrer" className="text-[10px] text-amber-500 font-bold uppercase tracking-widest flex items-center gap-1 hover:text-amber-400 transition-colors">
              GHL KNOWLEDGE BASE <ArrowRight size={12} />
            </a>
          </div>
        </div>

        {/* Sync Controls */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-[#161618] to-[#0d0d0f] text-white p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 relative z-10">
              <RefreshCw size={14} className="text-amber-500" />
              Extraction Payload
            </h3>
            
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Prospects pending:</span>
                <span className="font-mono font-bold text-amber-500">{leads.length}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Cloud Integrity:</span>
                <span className="text-emerald-500 font-bold uppercase tracking-widest">Verified</span>
              </div>
            </div>

            <button 
              onClick={handleSync}
              disabled={!isConnected || isSyncing || leads.length === 0}
              className="w-full py-4 bg-amber-500 text-black rounded-full font-bold hover:bg-amber-600 transition-all shadow-xl shadow-amber-900/10 flex items-center justify-center gap-2 disabled:opacity-50 text-sm relative z-10"
            >
              {isSyncing ? <RefreshCw className="animate-spin" size={18} /> : 'Push Leads to Pipeline'}
            </button>
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          </div>

          {/* Mapping Info */}
          <div className="bg-[#0d0d0f] p-8 rounded-3xl border border-slate-800 shadow-xl">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Field Mapping Architecture</h4>
            <div className="space-y-4">
              <MappingRow from="Company Name" to="Organization" />
              <MappingRow from="Lead Email" to="Primary Email" />
              <MappingRow from="AI Score" to="CF: Propensity" />
              <MappingRow from="Industry" to="Contact Tag" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MappingRow({ from, to }: { from: string, to: string }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">{from}</div>
      <ArrowRight size={14} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
      <div className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">{to}</div>
    </div>
  );
}
