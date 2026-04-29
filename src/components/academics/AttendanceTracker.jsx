import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Feb', 'Mar', 'Apr', 'May'];

export default function AttendanceTracker({ attendance }) {
  const percent = 78;
  const attended = 39;
  const total = 50;

  return (
    <div className="flex flex-col lg:flex-row gap-12 w-full h-full">
      {/* Heatmap Grid */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex items-center gap-12">
           <h3 className="text-sm font-black text-foreground uppercase tracking-widest pt-1">Attendance Ledger</h3>
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Present
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-sm bg-red-500" /> Absent
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-sm bg-secondary" /> Clear
              </div>
           </div>
        </div>

        <div className="flex-1 relative">
           <div className="flex gap-4 h-full">
             {/* Day Labels */}
             <div className="flex flex-col justify-between py-8 text-[9px] font-black text-muted-foreground uppercase opacity-40 pr-2">
               {DAYS.map(d => <span key={d}>{d}</span>)}
             </div>
             
             {/* The Grid */}
             <div className="flex-1 flex flex-col gap-4">
                <div className="flex items-center justify-between px-4">
                   {MONTHS.map(m => <span key={m} className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">{m}</span>)}
                </div>
                <div className="flex-1 grid grid-flow-col grid-rows-6 gap-1.5 p-4 bg-black/10 rounded-[32px] border border-border/20 shadow-inner overflow-hidden">
                   {Array.from({ length: 300 }).map((_, i) => {
                     const status = Math.random() > 0.8 ? 'absent' : Math.random() > 0.2 ? 'present' : 'clear';
                     return (
                        <div 
                          key={i} 
                          className={`aspect-square min-w-[10px] rounded-[3px] transition-all hover:scale-125 hover:z-10 cursor-pointer ${
                            status === 'present' ? 'bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.2)]' :
                            status === 'absent' ? 'bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.2)]' :
                            'bg-secondary/40'
                          }`}
                        />
                     );
                   })}
                </div>
             </div>
           </div>
        </div>
      </div>

      {/* Analyzer Side */}
      <div className="w-full lg:w-80 flex flex-col gap-6 h-full justify-center">
        <div className="flex items-center justify-between gap-12 bg-card/40 p-8 rounded-[40px] border border-border/20 shadow-xl relative overflow-hidden group">
           <div className="flex flex-col gap-1 z-10">
              <span className="text-4xl font-black text-foreground tabular-nums tracking-tighter">{percent}%</span>
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Attendance</span>
           </div>
           
           <div className="relative w-24 h-24 z-10">
             <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-secondary" />
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={2 * Math.PI * 40} strokeDashoffset={2 * Math.PI * 40 * (1 - percent/100)} className="text-emerald-500" strokeLinecap="round" />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 blur-xl absolute" />
             </div>
           </div>

           <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>

        <div className="flex-1 bg-card/40 p-8 rounded-[40px] border border-border/20 shadow-xl flex flex-col justify-center gap-6">
           <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-40">Bunk Analyzer</h4>
           
           <div className="flex items-start gap-5 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform shadow-inner">
                 <TrendingUp size={24} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col gap-1">
                 <p className="text-xs font-black text-foreground tracking-tight">You can bunk <span className="text-emerald-500">5</span> more classes</p>
                 <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60">To maintain 75% baseline</span>
              </div>
           </div>

           <div className="w-full h-px bg-border/20" />

           <div className="flex items-start gap-5 group">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-inner">
                 <TrendingDown size={24} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col gap-1">
                 <p className="text-xs font-black text-foreground tracking-tight">Attend <span className="text-primary">3</span> more classes</p>
                 <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60">To enter safe zone (80%)</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
