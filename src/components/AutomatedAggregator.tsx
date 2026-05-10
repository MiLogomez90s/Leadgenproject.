import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Settings2, 
  Play, 
  Pause, 
  Plus, 
  Trash2, 
  Globe, 
  Target,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { storage } from '../lib/storage';
import { AggregatorTask } from '../types';

export default function AutomatedAggregator() {
  const [tasks, setTasks] = useState<AggregatorTask[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [newTask, setNewTask] = useState<Partial<AggregatorTask>>({
    name: '',
    niche: '',
    industry: 'Technology',
    country: 'US',
    city: '',
    frequency: 'daily',
    active: true
  });

  useEffect(() => {
    setTasks(storage.getTasks());
  }, []);

  const handleToggleTask = (id: string) => {
    const updated = tasks.map(t => t.id === id ? { ...t, active: !t.active } : t);
    setTasks(updated);
    storage.saveTasks(updated);
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    storage.saveTasks(updated);
  };

  const handleAddTask = () => {
    if (!newTask.name || !newTask.niche || !newTask.city) return;
    
    const task: AggregatorTask = {
      id: `task-${Math.random().toString(36).substr(2, 9)}`,
      name: newTask.name!,
      niche: newTask.niche!,
      industry: newTask.industry || 'Technology',
      country: newTask.country as 'US' | 'LATAM',
      city: newTask.city!,
      frequency: newTask.frequency as 'daily' | 'weekly',
      lastRun: null,
      active: true
    };

    const updated = [...tasks, task];
    setTasks(updated);
    storage.saveTasks(updated);
    setIsAdding(false);
    setNewTask({
      name: '',
      niche: '',
      industry: 'Technology',
      country: 'US',
      city: '',
      frequency: 'daily',
      active: true
    });
  };

  const runTaskManually = async (id: string) => {
    setIsLoading(true);
    // Simulate aggregation
    await new Promise(r => setTimeout(r, 2000));
    
    const updated = tasks.map(t => {
      if (t.id === id) {
        return { ...t, lastRun: new Date().toISOString() };
      }
      return t;
    });
    
    setTasks(updated);
    storage.saveTasks(updated);
    setIsLoading(false);
    alert('Automation run completed. Check Lead Manager for new results.');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-serif italic text-white tracking-tight flex items-center gap-3">
            Recursive Lead Hub
            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] uppercase font-bold border border-blue-500/20">Auto-Pilot</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1">Configure recursive scraping engines for autonomous lead generation.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-6 py-2.5 bg-white text-black rounded-full font-bold hover:bg-slate-200 transition-all shadow-lg flex items-center gap-2"
        >
          <Plus size={18} />
          New Engine Configuration
        </button>
      </div>

      {isAdding && (
        <div className="bg-[#0f1115] border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden group animate-in fade-in slide-in-from-top-4 duration-300">
           <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
           
           <h3 className="text-lg font-serif italic text-white mb-6">Create Scraping Routine</h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <div className="space-y-2">
               <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Configuration Name</label>
               <input 
                 value={newTask.name}
                 onChange={e => setNewTask({...newTask, name: e.target.value})}
                 className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500/50 transition-all text-sm"
                 placeholder="e.g. Miami HVAC Weekly"
               />
             </div>
             
             <div className="space-y-2">
               <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Niche / Keywords</label>
               <input 
                 value={newTask.niche}
                 onChange={e => setNewTask({...newTask, niche: e.target.value})}
                 className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500/50 transition-all text-sm"
                 placeholder="e.g. Roofers, Solar, MedSpas"
               />
             </div>

             <div className="space-y-2">
               <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Target Region</label>
               <div className="flex gap-2">
                 <select 
                   value={newTask.country}
                   onChange={e => setNewTask({...newTask, country: e.target.value as any})}
                   className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none"
                 >
                   <option value="US">US</option>
                   <option value="LATAM">LATAM</option>
                 </select>
                 <input 
                   value={newTask.city}
                   onChange={e => setNewTask({...newTask, city: e.target.value})}
                   className="flex-1 bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500/50 transition-all text-sm"
                   placeholder="Enter City"
                 />
               </div>
             </div>

             <div className="space-y-2">
               <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Frequency</label>
               <select 
                 value={newTask.frequency}
                 onChange={e => setNewTask({...newTask, frequency: e.target.value as any})}
                 className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none"
               >
                 <option value="daily">Every 24 Hours</option>
                 <option value="weekly">Every 7 Days</option>
               </select>
             </div>

             <div className="space-y-2">
               <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Industry Cluster</label>
               <select 
                 value={newTask.industry}
                 onChange={e => setNewTask({...newTask, industry: e.target.value})}
                 className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none"
               >
                 <option value="Technology">Technology</option>
                 <option value="Real Estate">Real Estate</option>
                 <option value="Healthcare">Healthcare</option>
                 <option value="Construction">Construction</option>
                 <option value="Solar">Solar / Energy</option>
               </select>
             </div>
           </div>

           <div className="mt-8 flex items-center justify-end gap-3 pt-6 border-t border-slate-800/50">
             <button 
               onClick={() => setIsAdding(false)}
               className="px-6 py-2 text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase"
             >
               Discard
             </button>
             <button 
               onClick={handleAddTask}
               className="px-8 py-2.5 bg-amber-500 text-black font-bold rounded-full hover:bg-amber-600 transition-all shadow-lg"
             >
               Initialize Routine
             </button>
           </div>
        </div>
      )}

      {/* Routine Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tasks.map(task => (
          <div key={task.id} className={`bg-[#0d0d0f] border rounded-2xl p-6 transition-all relative overflow-hidden group ${
            task.active ? 'border-slate-800' : 'border-slate-900 opacity-60'
          }`}>
            <div className={`absolute top-0 right-0 w-1 pt-12 pb-12 ${task.active ? 'bg-amber-500/50' : 'bg-slate-800'}`}></div>
            
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl border ${
                   task.active ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-slate-900 border-slate-800 text-slate-600'
                }`}>
                  <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
                </div>
                <div>
                  <h3 className="text-white font-bold">{task.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                      <Clock size={10} /> {task.frequency === 'daily' ? '24h' : 'Weekly'}
                    </span>
                    <span className="text-[10px] text-slate-700">•</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                      {task.industry}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <button 
                   onClick={() => handleToggleTask(task.id)}
                   className={`p-2 rounded-lg transition-all border ${
                     task.active ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-slate-900 border-slate-800 text-slate-500'
                   }`}
                 >
                   {task.active ? <Pause size={16} /> : <Play size={16} />}
                 </button>
                 <button 
                   onClick={() => handleDeleteTask(task.id)}
                   className="p-2 bg-slate-900 border border-slate-800 text-slate-600 hover:text-rose-500 transition-all rounded-lg"
                 >
                   <Trash2 size={16} />
                 </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
               <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/50">
                  <p className="text-[8px] uppercase font-bold text-slate-500 mb-1 flex items-center gap-1">
                    <Globe size={10} /> Location
                  </p>
                  <p className="text-xs text-white font-serif italic truncate">{task.city}, {task.country}</p>
               </div>
               <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/50">
                  <p className="text-[8px] uppercase font-bold text-slate-500 mb-1 flex items-center gap-1">
                    <Target size={10} /> Niche
                  </p>
                  <p className="text-xs text-white font-serif italic truncate">{task.niche}</p>
               </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-900">
               <div className="flex items-center gap-2">
                 {task.active ? (
                   <div className="flex items-center gap-1.5">
                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                     <span className="text-[10px] text-emerald-500/80 font-bold uppercase tracking-widest">Active Routine</span>
                   </div>
                 ) : (
                   <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Hibernating</span>
                 )}
               </div>
               <div className="flex items-center gap-2">
                 <p className="text-[10px] text-slate-500 font-mono">
                   {task.lastRun ? `Last Pulled: ${new Date(task.lastRun).toLocaleDateString()}` : 'Never Executed'}
                 </p>
                 {task.active && (
                   <button 
                    disabled={isLoading}
                    onClick={() => runTaskManually(task.id)}
                    className="p-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all text-[9px] font-bold uppercase"
                   >
                     Force Exec
                   </button>
                 )}
               </div>
            </div>
          </div>
        ))}

        {tasks.length === 0 && !isAdding && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center opacity-40">
             <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-slate-800">
                <Settings2 size={32} className="text-slate-500" />
             </div>
             <h4 className="text-xl font-serif italic text-white mb-2">Autonomous Hub Static</h4>
             <p className="text-sm text-slate-500 max-w-sm">You haven't configured any autonomous scraping routines yet. New leads will only appear via manual input.</p>
          </div>
        )}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
         <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-transparent"></div>
         </div>
         <div className="flex items-center gap-4 relative z-10">
            <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 border border-amber-500/20">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-white font-bold text-sm">System Scheduler Pulse</p>
              <p className="text-xs text-slate-500">Aggregate engine runs synchronized at 04:00 AM server time.</p>
            </div>
         </div>
         <div className="flex items-center gap-6 relative z-10">
            <div className="text-center">
               <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Active Engines</p>
               <p className="text-lg text-white font-mono">{tasks.filter(t => t.active).length}</p>
            </div>
            <div className="h-8 w-px bg-slate-800"></div>
            <div className="text-center">
               <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Avg Pulse Output</p>
               <p className="text-lg text-white font-mono">124 <span className="text-[10px] text-slate-600">Leads/Day</span></p>
            </div>
         </div>
      </div>
    </div>
  );
}
