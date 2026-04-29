import React from 'react';
import { Plus } from 'lucide-react';

export default function GradingDetails({ marks }) {
  const components = [
    { label: 'Mid Sem', key: 'midsem' },
    { label: 'End Sem', key: 'endsem' },
    { label: 'Quiz', key: 'quiz' },
    { label: 'Teacher\'s Assessment', key: 'ta' },
  ];

  const totalScored = Object.values(marks || {}).reduce((acc, m) => acc + (Number(m.scored) || 0), 0);
  const totalMax = Object.values(marks || {}).reduce((acc, m) => acc + (Number(m.max) || 0), 0);

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-foreground uppercase tracking-widest pt-1">Grading Components</h3>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-[10px] font-black text-white uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20">
          <Plus size={14} strokeWidth={3} /> Add Marks
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/40">
              <th className="pb-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Component</th>
              <th className="pb-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] text-center">Max Marks</th>
              <th className="pb-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] text-center">Obtained</th>
              <th className="pb-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] text-right">Percentage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {components.map((comp) => {
              const data = marks?.[comp.key] || { scored: 0, max: 0 };
              const percent = data.max > 0 ? Math.round((data.scored / data.max) * 100) : 0;
              return (
                <tr key={comp.key} className="group hover:bg-white/5 transition-colors">
                  <td className="py-4 text-sm font-bold text-foreground opacity-80">{comp.label}</td>
                  <td className="py-4 text-sm font-black text-muted-foreground text-center tabular-nums">{data.max}</td>
                  <td className="py-4 text-sm font-black text-foreground text-center tabular-nums">{data.scored}</td>
                  <td className={`py-4 text-sm font-black text-right tabular-nums ${percent >= 75 ? 'text-emerald-500' : 'text-primary'}`}>
                    {percent}%
                  </td>
                </tr>
              );
            })}
            <tr className="border-t border-border/60">
              <td className="py-6 text-sm font-black text-foreground uppercase tracking-widest">Total</td>
              <td className="py-6 text-sm font-black text-muted-foreground text-center tabular-nums">{totalMax}</td>
              <td className="py-6 text-sm font-black text-foreground text-center tabular-nums">{totalScored}</td>
              <td className="py-6 text-sm font-black text-right text-primary tabular-nums">
                {totalMax > 0 ? Math.round((totalScored / totalMax) * 100) : 0}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
