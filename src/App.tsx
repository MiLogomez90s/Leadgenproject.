import { useState, useEffect } from 'react';
import { 
  Users, 
  Map as MapIcon, 
  BarChart3, 
  Zap, 
  Settings, 
  Search,
  LogOut,
  Briefcase,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ViewType, Lead } from './types';
import { storage } from './lib/storage';

// Component Imports (To be created)
import LeadManager from './components/LeadManager';
import NicheScanner from './components/NicheScanner';
import Analytics from './components/Analytics';
import LeadScoring from './components/LeadScoring';
import GHLIntegration from './components/GHLIntegration';
import SalesTeam from './components/SalesTeam';
import ExternalEngines from './components/ExternalEngines';
import AutomatedAggregator from './components/AutomatedAggregator';

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('leads');
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    setLeads(storage.getLeads());
  }, []);

  const refreshLeads = () => {
    setLeads(storage.getLeads());
  };

  const menuItems = [
    { id: 'leads', label: 'Lead Manager', icon: Users },
    { id: 'scanner', label: 'Niche Scanner', icon: MapIcon },
    { id: 'external', label: 'Cloud Aggregator', icon: Zap },
    { id: 'aggregator', label: 'Recursive Hub', icon: RefreshCw },
    { id: 'sales', label: 'Sales Team', icon: Briefcase },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'scoring', label: 'AI Scoring', icon: Sparkles },
    { id: 'ghl', label: 'GHL & Sync', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#09090b] text-slate-200 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-60 bg-[#0d0d0f] border-r border-slate-800/50 flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-black font-bold">L</div>
            <h1 className="text-lg font-serif italic text-white tracking-tight">LeadPulse Pro</h1>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as ViewType)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  activeView === item.id
                    ? 'bg-slate-800/50 text-amber-500 border-l-2 border-amber-500'
                    : 'text-slate-400 hover:bg-slate-800/30'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-800/50">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/50">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-slate-300">JD</div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">Julian Draxler</p>
              <p className="text-[10px] text-slate-500 truncate">Premium Account</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-16 border-b border-slate-800/50 flex items-center justify-between px-8 bg-[#09090b]/80 backdrop-blur-md">
          <div className="flex items-center gap-4 w-1/2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search leads by company, niche, or name..." 
                className="w-full bg-slate-900/50 border border-slate-800 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black px-4 py-1.5 rounded-full text-xs font-bold transition-colors">
              <Zap size={14} fill="currentColor" />
              Power Actions
            </button>
            <button className="p-2 text-slate-500 hover:text-white transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeView === 'leads' && <LeadManager leads={leads} onRefresh={refreshLeads} />}
              {activeView === 'scanner' && <NicheScanner onLeadFound={refreshLeads} />}
              {activeView === 'external' && <ExternalEngines onLeadFound={refreshLeads} />}
              {activeView === 'aggregator' && <AutomatedAggregator />}
              {activeView === 'sales' && <SalesTeam />}
              {activeView === 'analytics' && <Analytics leads={leads} />}
              {activeView === 'scoring' && <LeadScoring leads={leads} onScored={refreshLeads} />}
              {activeView === 'ghl' && <GHLIntegration leads={leads} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
