import { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  ChevronRight,
  UserCheck,
  LayoutGrid,
  Filter
} from 'lucide-react';
import { storage } from '../lib/storage';
import { Lead, SalesRep } from '../types';

export default function SalesTeam() {
  const [reps, setReps] = useState<SalesRep[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedRepId, setSelectedRepId] = useState<string | null>(null);

  useEffect(() => {
    setReps(storage.getSalesReps());
    setLeads(storage.getLeads());
  }, []);

  const selectedRep = reps.find(r => r.id === selectedRepId);
  const repLeads = leads.filter(l => l.assignedTo === selectedRepId);

  const stats = {
    totalReps: reps.length,
    assignedLeads: leads.filter(l => l.assignedTo).length,
    unassignedLeads: leads.filter(l => !l.assignedTo && !l.assignedToDispatcher).length
  };

  const handleAutoAssign = () => {
    const unassignedIds = leads
      .filter(l => !l.assignedTo && !l.assignedToDispatcher)
      .map(l => l.id);
    
    if (unassignedIds.length > 0) {
      storage.distributeLeads(unassignedIds);
      setReps(storage.getSalesReps());
      setLeads(storage.getLeads());
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Sales Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-serif italic text-white tracking-tight">Sales Force Management</h2>
          <p className="text-slate-500 text-sm mt-1">Monitor and distribute lead portfolios across your accounts team.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right">
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Backlog</p>
             <p className="text-white font-mono">{stats.unassignedLeads} Unassigned</p>
           </div>
           <button 
             onClick={handleAutoAssign}
             disabled={stats.unassignedLeads === 0}
             className="px-6 py-2.5 bg-amber-500 text-black rounded-full font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-900/20 flex items-center gap-2 disabled:opacity-50"
           >
             <UserCheck size={18} />
             Auto-Assign
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Reps List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#0d0d0f] rounded-2xl border border-slate-800 p-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Users size={14} className="text-amber-500" />
              Active Representatives
            </h3>
            <div className="space-y-2">
              {reps.map(rep => (
                <button
                  key={rep.id}
                  onClick={() => setSelectedRepId(rep.id)}
                  className={`w-full p-4 rounded-xl text-left transition-all border ${
                    selectedRepId === rep.id 
                    ? 'bg-amber-500/10 border-amber-500/30 ring-1 ring-amber-500/20' 
                    : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">{rep.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-1">{rep.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-amber-500">{rep.assignedLeads.length}</p>
                      <p className="text-[8px] text-slate-600 uppercase font-bold">Leads</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <button className="w-full mt-6 py-3 border border-dashed border-slate-800 rounded-xl text-slate-600 flex items-center justify-center gap-2 hover:border-slate-600 hover:text-slate-400 transition-all text-xs font-bold uppercase tracking-widest">
              <UserPlus size={14} /> Add Representative
            </button>
          </div>

          <div className="bg-[#0d0d0f] p-6 rounded-2xl border border-slate-800">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-slate-900 rounded-lg text-amber-500 border border-slate-800">
                <LayoutGrid size={16} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Distribution Policy</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed font-serif italic italic text-pretty">
                  Remaining 40% of leads are automatically distributed via round-robin to active reps if not assigned to the Dispatcher.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Portfolio View */}
        <div className="lg:col-span-2">
          <div className="bg-[#0d0d0f] rounded-2xl border border-slate-800 shadow-xl min-h-[500px] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-800 bg-slate-900/30 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {selectedRep ? `${selectedRep.name}'s Portfolio` : 'Select a Representative'}
                </h3>
                {selectedRep && (
                  <p className="text-[10px] text-amber-500 font-mono mt-1">Managing {repLeads.length} prospects</p>
                )}
              </div>
              {selectedRep && (
                <div className="flex items-center gap-2">
                   <Filter size={14} className="text-slate-600" />
                   <span className="text-[10px] text-slate-600 font-bold uppercase">All Sectors</span>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-auto p-2 custom-scrollbar">
              {!selectedRepId ? (
                <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                  <Users size={48} className="text-slate-800 mb-4" />
                  <h4 className="text-sm font-serif italic text-slate-600">Select a representative to view and manage their lead portfolio.</h4>
                </div>
              ) : repLeads.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                  <Briefcase size={40} className="text-slate-800 mb-4" />
                  <p className="text-xs font-serif italic text-slate-600">No leads currently assigned to this representative.</p>
                  <button 
                    onClick={handleAutoAssign}
                    className="mt-4 text-[10px] font-bold text-amber-500 uppercase tracking-widest hover:underline"
                  >
                    Trigger round-robin allocation
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-800/50">
                  {repLeads.map(lead => (
                    <div key={lead.id} className="p-6 hover:bg-slate-800/20 transition-all rounded-xl group flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-serif italic text-white group-hover:text-amber-500 transition-colors truncate">{lead.company}</h4>
                          <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase ${
                            lead.score > 70 ? 'text-emerald-500' : 'text-slate-600'
                          }`}>
                            Score: {lead.score}%
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                           <span className="text-[10px] text-slate-500 flex items-center gap-1">
                             <Mail size={10} /> {lead.email || 'No Email'}
                           </span>
                           <span className="text-[10px] text-slate-500 flex items-center gap-1">
                             <Phone size={10} /> {lead.phone || 'No Phone'}
                           </span>
                        </div>
                      </div>
                      <button className="p-2 text-slate-600 hover:text-white transition-all">
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
