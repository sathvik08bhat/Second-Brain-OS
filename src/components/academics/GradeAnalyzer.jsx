import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function GradeAnalyzer({ marks, onUpdate }) {
  if (!marks) return null;
  const { midsem = {scored:0}, endsem = {scored:0}, quiz = {scored:0}, ta = {scored:0} } = marks;
  const total = (midsem.scored || 0) + (endsem.scored || 0) + (quiz.scored || 0) + (ta.scored || 0);
  
  const target = 90;
  const currentAccumulated = (midsem.scored || 0) + (quiz.scored || 0) + (ta.scored || 0);
  const neededForO = Math.max(0, target - currentAccumulated);
  
  const data = [
    { name: 'Scored', value: total },
    { name: 'Remaining', value: 100 - total }
  ];

  // We use CSS variables for colors where possible, but Recharts needs HEX/HSL
  // I'll use a dynamic primary color if available, or fall back to Cyan.
  const COLORS = ['var(--accent-primary, #06b6d4)', 'var(--border-primary, #262626)'];

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="grid grid-cols-2 gap-6">
        {[
          { label: 'Midsem', key: 'midsem', max: 30 },
          { label: 'Quiz', key: 'quiz', max: 15 },
          { label: 'TA', key: 'ta', max: 5 },
          { label: 'Endsem', key: 'endsem', max: 50 },
        ].map(comp => (
          <div key={comp.key} className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">{comp.label} ({comp.max})</label>
            <input 
              type="number"
              max={comp.max}
              value={marks[comp.key]?.scored || 0}
              onChange={(e) => {
                const val = Math.min(comp.max, Number(e.target.value));
                onUpdate({
                  ...marks,
                  [comp.key]: { ...marks[comp.key], scored: val }
                });
              }}
              className="bg-secondary/40 border border-border/60 p-3 rounded-xl text-sm font-bold outline-none focus:border-primary transition-all"
            />
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius="75%"
              outerRadius="95%"
              paddingAngle={4}
              dataKey="value"
              startAngle={90}
              endAngle={450}
              stroke="none"
            >
              <Cell fill="var(--accent-primary, #06b6d4)" />
              <Cell fill="var(--secondary, #262626)" opacity={0.3} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute flex flex-col items-center">
          <span className="text-5xl font-black text-foreground tracking-tighter tabular-nums leading-none">{total}</span>
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] mt-3">Aggregate / 100</span>
        </div>
      </div>

      <div className="mt-auto p-5 rounded-2xl bg-primary/5 border border-primary/20 backdrop-blur-sm">
        <p className="text-[10px] font-black text-center text-primary leading-relaxed uppercase tracking-widest">
          🎯 Target: <span className="underline decoration-2">90% Grade</span> • Endsem Needed: <span className="text-sm font-black tracking-tighter">{neededForO > 50 ? 'SURPASSED' : `${neededForO}/50`}</span>
        </p>
      </div>
    </div>
  );
}
