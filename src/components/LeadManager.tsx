import { useState, useMemo } from 'react';
import { 
  Filter, 
  Search, 
  Mail, 
  Phone, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Trash2,
  Shield,
  Zap,
  User,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import { Lead } from '../types';
import { storage } from '../lib/storage';

interface LeadManagerProps {
  leads: Lead[];
  onRefresh: () => void;
}

export default function LeadManager({ leads, onRefresh }: LeadManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'email' | 'phone' | 'both'>('all');
  const [industryFilter, setIndustryFilter] = useState('All Industries');
  const [showRejected, setShowRejected] = useState(false);

  const industries = useMemo(() => {
    const unique = new Set(leads.map(l => l.industry));
    return ['All Industries', ...Array.from(unique)];
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.industry.toLowerCase().includes(searchQuery.toLowerCase());

      const hasEmail = !!lead.email;
      const hasPhone = !!lead.phone;

      const matchesFilter = 
        filterType === 'all' ||
        (filterType === 'email' && hasEmail) ||
        (filterType === 'phone' && hasPhone) ||
        (filterType === 'both' && hasEmail && hasPhone);

      const matchesIndustry = industryFilter === 'All Industries' || lead.industry === industryFilter;
      
      const matchesStatus = showRejected ? lead.status === 'rejected' : lead.status !== 'rejected';

      return matchesSearch && matchesFilter && matchesIndustry && matchesStatus;
    });
  }, [leads, searchQuery, filterType, industryFilter, showRejected]);

  const stats = {
    total: leads.filter(l => l.status !== 'rejected').length,
    withEmail: leads.filter(l => l.email && l.status !== 'rejected').length,
    withPhone: leads.filter(l => l.phone && l.status !== 'rejected').length,
    rejected: leads.filter(l => l.status === 'rejected').length
  };

  const handleReject = (id: string) => {
    const updatedLeads = leads.map(l => 
      l.id === id ? { ...l, status: 'rejected' as const, assignedTo: null, assignedToDispatcher: false } : l
    );
    storage.saveLeads(updatedLeads);
    onRefresh();
  };

  const handleRestore = (id: string) => {
    const updatedLeads = leads.map(l => 
      l.id === id ? { ...l, status: 'new' as const } : l
    );
    storage.saveLeads(updatedLeads);
    onRefresh();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      storage.deleteLead(id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Quick Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Leads', value: stats.total, color: 'text-amber-500' },
          { label: 'With Emails', value: stats.withEmail, color: 'text-emerald-500' },
          { label: 'Rejected', value: stats.rejected, color: 'text-rose-500' },
        ].map((item) => (
          <div key={item.label} className="bg-[#0d0d0f] p-6 rounded-xl border border-slate-800 shadow-sm">
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">{item.label}</p>
            <p className={`text-3xl font-serif italic ${item.color} mt-2`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
        <span className="text-xs font-serif italic text-slate-500 mr-2">Filter by:</span>
        {(['all', 'email', 'phone', 'both'] as const).map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border transition-all whitespace-nowrap ${
              filterType === type 
                ? 'bg-amber-500 border-amber-500 text-black' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'
            }`}
          >
            {type === 'all' && 'All Leads'}
            {type === 'email' && 'With Email'}
            {type === 'phone' && 'With Phone'}
            {type === 'both' && 'Complete Profile'}
          </button>
        ))}
        <div className="h-4 w-[1px] bg-slate-800 mx-2 flex-shrink-0"></div>
        <select 
          className="bg-transparent text-xs text-slate-400 outline-none cursor-pointer hover:text-white transition-colors"
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
        >
          {industries.map(ind => <option key={ind} value={ind} className="bg-[#0d0d0f]">{ind}</option>)}
        </select>
        <div className="flex-1"></div>
        <button 
          onClick={() => setShowRejected(!showRejected)}
          className={`px-4 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border transition-all whitespace-nowrap ${
            showRejected 
              ? 'bg-rose-500/10 border-rose-500/50 text-rose-500' 
              : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
          }`}
        >
          {showRejected ? 'Viewing Rejected' : 'View Rejected'}
        </button>
      </div>

      {/* Leads Table */}
      <div className="bg-[#0d0d0f] rounded-xl border border-slate-800 overflow-hidden flex flex-col shadow-xl">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-slate-800 bg-slate-900/30">
          <div className="col-span-4 text-[10px] uppercase tracking-wider font-bold text-slate-500">Identity & Stakeholder</div>
          <div className="col-span-3 text-[10px] uppercase tracking-wider font-bold text-slate-500">Industry & Contact</div>
          <div className="col-span-3 text-[10px] uppercase tracking-wider font-bold text-slate-500">Sourcing Details</div>
          <div className="col-span-2 text-[10px] uppercase tracking-wider font-bold text-slate-500 text-right">Predictive Analytics</div>
        </div>
        
        <div className="divide-y divide-slate-800/50">
          {filteredLeads.map((lead) => (
            <div key={lead.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-slate-800/10 transition-colors group">
              <div className="col-span-4 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-serif italic text-white group-hover:text-amber-400 transition-colors truncate">{lead.company}</h4>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded-full uppercase font-bold tracking-tighter border ${
                    lead.source === 'apollo' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                    lead.source === 'instantly' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                    'bg-slate-800 text-slate-500 border-slate-700'
                  }`}>
                    {lead.source}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                   <p className="text-[11px] text-slate-300 flex items-center gap-1">
                     <User size={10} className="text-slate-500" /> {lead.name}
                   </p>
                   {lead.ownerTitle && (
                     <span className="text-[9px] text-slate-600 font-mono">[{lead.ownerTitle.toUpperCase()}]</span>
                   )}
                </div>
              </div>
              
              <div className="col-span-3 flex flex-col justify-center space-y-1">
                <span className="text-[10px] text-slate-500 truncate max-w-full">
                  {lead.industry}
                </span>
                <div className="flex items-center gap-3">
                  <div title={lead.email || 'No Email'} className={`flex items-center gap-1 text-[9px] font-bold ${lead.email ? 'text-emerald-500' : 'text-slate-700'}`}>
                    <Mail size={10} /> {lead.email ? 'VAL' : 'MISSING'}
                  </div>
                  <div title={lead.phone || 'No Phone'} className={`flex items-center gap-1 text-[9px] font-bold ${lead.phone ? 'text-emerald-500' : 'text-slate-700'}`}>
                    <Phone size={10} /> {lead.phone ? 'VAL' : 'MISSING'}
                  </div>
                </div>
              </div>

              <div className="col-span-3 flex items-center gap-2">
                <div className="flex flex-col gap-1 w-full max-w-[120px]">
                  <div className="flex items-center justify-between text-[8px] font-bold text-slate-600">
                    <span>RELIABILITY</span>
                    <span className="text-slate-400">{lead.reliabilityScore}%</span>
                  </div>
                  <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${lead.reliabilityScore}%` }}></div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-auto">
                   {lead.website && (
                    <a href={lead.website} target="_blank" rel="noreferrer" className="w-7 h-7 rounded bg-slate-900 text-slate-500 flex items-center justify-center hover:bg-slate-800 hover:text-white transition-all border border-slate-800">
                      <ExternalLink size={12} />
                    </a>
                  )}
                  {lead.assignedToDispatcher && (
                    <div className="w-7 h-7 rounded bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20" title="Sent to Dispatcher">
                      <Zap size={12} fill="currentColor" />
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-2 flex items-center justify-end gap-4">
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 mb-0.5">
                    <span className={`text-[9px] font-bold ${lead.status === 'rejected' ? 'text-slate-700' : 'text-emerald-500 uppercase tracking-tighter'}`}>
                      {lead.status === 'rejected' ? 'REJECTED' : 'CONVERSION'}
                    </span>
                  </div>
                  <span className={`text-xl font-mono leading-none ${lead.status === 'rejected' ? 'text-slate-700' : lead.conversionScore > 70 ? 'text-emerald-500' : lead.conversionScore > 40 ? 'text-amber-500' : 'text-rose-500'}`}>
                    {lead.conversionScore}%
                  </span>
                </div>

                <div className="flex flex-col">
                  {lead.status === 'rejected' ? (
                    <button 
                      onClick={() => handleRestore(lead.id)}
                      className="p-1 text-slate-600 hover:text-emerald-500 transition-colors"
                      title="Restore Lead"
                    >
                      <RefreshCw size={14} />
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleReject(lead.id)}
                      className="p-1 text-slate-800 hover:text-rose-500 transition-colors"
                      title="Reject Lead"
                    >
                      <XCircle size={14} />
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(lead.id)}
                    className="p-1 text-slate-900 hover:text-rose-500 transition-colors"
                    title="Delete Permanently"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredLeads.length === 0 && (
            <div className="p-20 text-center">
              <p className="text-sm font-serif italic text-slate-500">No leads match your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Placeholder for Users icon if not imported from Lucide
function Users({ size, className }: { size?: number, className?: string }) {
  return <div className={className} style={{ width: size, height: size }}>👤</div>;
}
