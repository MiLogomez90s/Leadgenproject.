import { useState } from 'react';
import { 
  Zap, 
  Target, 
  Brain, 
  Info, 
  CheckCircle2, 
  Loader2,
  Sparkles,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Lead } from '../types';
import { geminiService } from '../services/gemini';
import { storage } from '../lib/storage';

interface LeadScoringProps {
  leads: Lead[];
  onScored: () => void;
}

export default function LeadScoring({ leads, onScored }: LeadScoringProps) {
  const [context, setContext] = useState('');
  const [isScoring, setIsScoring] = useState(false);
  const [lastScoredCount, setLastScoredCount] = useState(0);

  const handleScore = async () => {
    if (!context || leads.length === 0) return;
    
    setIsScoring(true);
    try {
      const results = await geminiService.scoreLeads(leads, context);
      
      const updatedLeads = leads.map(lead => {
        const scoreData = results.find(r => r.id === lead.id);
        if (scoreData) {
          return {
            ...lead,
            score: scoreData.score,
            priority: scoreData.priority,
            notes: scoreData.reasoning
          };
        }
        return lead;
      });

      storage.saveLeads(updatedLeads);
      setLastScoredCount(results.length);
      onScored();
    } catch (error) {
      console.error(error);
      alert('Error scoring leads. Please check your Gemini API key.');
    } finally {
      setIsScoring(false);
    }
  };

  const highPriorityLeads = leads
    .filter(l => l.priority === 'high')
    .sort((a, b) => b.score - a.score);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* AI Config Section - Dark Gradient */}
      <div className="bg-gradient-to-br from-[#161618] to-[#0d0d0f] rounded-3xl p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-amber-500/10 p-2 rounded-lg backdrop-blur-md border border-amber-500/20">
              <Sparkles size={20} className="text-amber-500" />
            </div>
            <h2 className="text-2xl font-serif italic text-white tracking-tight">AI Scoring Intelligence</h2>
          </div>
          <p className="text-slate-400 mb-10 leading-relaxed text-sm max-w-xl">
            Define your value proposition. Our neural network will analyze every prospect to calculate conversion propensity based on market signals and reviews.
          </p>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Target Persona & Objective</label>
              <textarea 
                className="w-full bg-black/40 border border-slate-800 rounded-xl p-5 text-slate-200 placeholder:text-slate-700 focus:ring-1 focus:ring-amber-500/40 focus:outline-none min-h-[140px] transition-all"
                placeholder="e.g. Identifying expansion-ready roofing contractors in Miami who prioritize customer satisfaction..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </div>
            <button 
              onClick={handleScore}
              disabled={isScoring || !context || leads.length === 0}
              className="px-10 py-4 bg-amber-500 text-black rounded-full font-bold hover:bg-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl shadow-amber-900/10"
            >
              {isScoring ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Calculating Scores...
                </>
              ) : (
                <>
                  <Brain size={18} />
                  Initiate Scoring Model
                </>
              )}
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
      </div>

      {lastScoredCount > 0 && (
        <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl flex items-center gap-3 text-emerald-400 text-sm">
          <CheckCircle2 size={24} />
          <span className="font-medium tracking-tight">Neural analysis complete. {lastScoredCount} leads successfully prioritized.</span>
        </div>
      )}

      {/* Results Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* High Priority List */}
        <div className="bg-[#0d0d0f] rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/30">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> High Propensity Matches
            </h3>
            <span className="text-[10px] font-mono text-slate-500">{highPriorityLeads.length} TARGETS</span>
          </div>
          
          <div className="flex-1 overflow-auto divide-y divide-slate-800/50 max-h-[500px] custom-scrollbar">
            {highPriorityLeads.length === 0 ? (
              <div className="p-16 text-center text-slate-600">
                <Target size={32} className="mx-auto mb-4 opacity-20" />
                <p className="text-xs font-serif italic">Awaiting AI analysis results...</p>
              </div>
            ) : (
              highPriorityLeads.map(lead => (
                <div key={lead.id} className="p-5 hover:bg-slate-800/20 transition-colors group">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-serif italic text-white truncate group-hover:text-amber-400 transition-colors">{lead.company}</h4>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full ${lead.score > 90 ? 'bg-amber-500' : 'bg-slate-600'}`} style={{ width: `${lead.score}%` }} />
                        </div>
                        <span className="text-[9px] font-bold text-amber-500 font-mono">{lead.score}%</span>
                      </div>
                      {lead.notes && (
                        <p className="text-[10px] text-slate-500 mt-2 italic line-clamp-2 leading-relaxed">
                          "{lead.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Insight Section */}
        <div className="space-y-6">
          <div className="bg-[#0d0d0f] p-8 rounded-2xl border border-slate-800 shadow-xl">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-8">Propensity Engines</h3>
            <div className="space-y-8">
              <InsightItem 
                icon={Search} 
                title="Semantic Analysis" 
                desc="Deep scan of business reviews and service descriptions to verify persona fit."
              />
              <InsightItem 
                icon={Mail} 
                title="Integrity Verification" 
                desc="Weights leads higher if they have active social signals and verified endpoints."
              />
              <InsightItem 
                icon={Brain} 
                title="Neural Correlation" 
                desc="Maps your objective against 12 key attributes found in the extraction data."
              />
            </div>
          </div>

          <div className="bg-amber-500/5 rounded-2xl p-8 border border-amber-500/10">
            <h4 className="text-xs font-bold text-amber-500 mb-3 uppercase tracking-wider flex items-center gap-2">
              <Zap size={14} fill="currentColor" /> Efficiency Tip
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-serif italic">
              Prospects with scores over 85% show a 3x higher response rate when personalized context is used in the initial outreach.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightItem({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="p-2.5 bg-slate-900 rounded-xl text-slate-400 flex-shrink-0 self-start border border-slate-800">
        <Icon size={16} />
      </div>
      <div className="space-y-1">
        <p className="text-xs font-bold text-white tracking-tight">{title}</p>
        <p className="text-[11px] text-slate-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function Search({ size, className }: { size?: number, className?: string }) {
  return <div className={className} style={{ width: size, height: size }}>🔍</div>;
}

function Mail({ size, className }: { size?: number, className?: string }) {
  return <div className={className} style={{ width: size, height: size }}>📧</div>;
}
