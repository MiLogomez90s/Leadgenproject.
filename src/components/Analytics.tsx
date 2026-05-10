import { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { Lead, SalesRep } from '../types';
import { TrendingUp, Users, Target, Rocket, Zap, ShieldCheck, UserCheck, Send } from 'lucide-react';
import { storage } from '../lib/storage';

interface AnalyticsProps {
  leads: Lead[];
}

export default function Analytics({ leads }: AnalyticsProps) {
  const reps = useMemo(() => storage.getSalesReps(), []);

  const approvedLeadsCount = useMemo(() => 
    leads.filter(l => l.email && l.phone).length, 
  [leads]);

  const dispatcherLeadsCount = useMemo(() => 
    leads.filter(l => l.assignedToDispatcher).length, 
  [leads]);

  const salesLeadsCount = useMemo(() => 
    leads.filter(l => l.assignedTo).length, 
  [leads]);

  const repDistributionData = useMemo(() => {
    return reps.map(rep => ({
      name: rep.name.split(' ')[0],
      count: leads.filter(l => l.assignedTo === rep.id).length
    }));
  }, [leads, reps]);

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach(l => {
      counts[l.status] = (counts[l.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [leads]);

  const industryData = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach(l => {
      counts[l.industry] = (counts[l.industry] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [leads]);

  const COLORS = ['#f59e0b', '#10b981', '#6366f1', '#f43f5e', '#8b5cf6', '#ec4899'];

  if (leads.length === 0) {
    return (
      <div className="bg-[#0d0d0f] p-20 rounded-3xl border border-slate-800 text-center">
        <h3 className="text-xl font-serif italic text-white">No data extracted yet.</h3>
        <p className="text-slate-500 mt-2">Initialize a scan to populate your analytics dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Value Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Scrapped" value={leads.length} trend="+Active" icon={Rocket} />
        <StatCard title="Auto-Approved" value={approvedLeadsCount} trend="Verified" icon={ShieldCheck} />
        <StatCard title="Dispatcher Sync" value={dispatcherLeadsCount} trend="Top 60%" icon={Send} />
        <StatCard title="Sales Portfolio" value={salesLeadsCount} trend="Allocated" icon={UserCheck} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Rep Distribution */}
        <div className="bg-[#0d0d0f] p-8 rounded-2xl border border-slate-800 shadow-xl">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
            <UserCheck size={16} className="text-blue-500" />
            Lead Distribution per Rep
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={repDistributionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#0d0d0f', border: '1px solid #1e293b', borderRadius: '12px' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Status Distribution */}
        <div className="bg-[#0d0d0f] p-8 rounded-2xl border border-slate-800 shadow-xl">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
            <Users size={16} className="text-amber-500" />
            Lead Status Distribution
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0d0d0f', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Industry Focus */}
        <div className="bg-[#0d0d0f] p-8 rounded-2xl border border-slate-800 shadow-xl lg:col-span-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
            <Target size={16} className="text-indigo-500" />
            Strategic Industry Focus
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={industryData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0d0d0f', border: '1px solid #1e293b', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="value" stroke="#f59e0b" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, icon: Icon }: { title: string, value: string | number, trend: string, icon: any }) {
  return (
    <div className="bg-[#0d0d0f] p-6 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-slate-900 rounded-lg text-slate-500 group-hover:text-amber-500 transition-colors">
          <Icon size={18} />
        </div>
        <span className={`text-[10px] font-bold tracking-wider ${trend.startsWith('+') || ['Active', 'Verified', 'Top 60%', 'Allocated'].includes(trend) ? 'text-emerald-500' : 'text-slate-500'}`}>
          {trend}
        </span>
      </div>
      <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">{title}</p>
      <p className="text-2xl font-serif italic text-white mt-1">{value}</p>
      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-12 -mt-12 blur-2xl"></div>
    </div>
  );
}

function BarChart3({ size, className }: { size?: number, className?: string }) {
  return <div className={className} style={{ width: size, height: size }}>📊</div>;
}
