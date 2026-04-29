import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendingUp } from 'lucide-react';

const trendData = [
  { sem: 'S1', val: 7.5 },
  { sem: 'S2', val: 8.0 },
  { sem: 'S3', val: 8.24 },
  { sem: 'S4', val: null },
  { sem: 'S5', val: null },
  { sem: 'S6', val: null },
  { sem: 'S7', val: null },
  { sem: 'S8', val: null },
];

export default function GradePointAnalyzer({ gpa = 8.0 }) {
  const pieData = [
    { value: gpa },
    { value: 10 - gpa }
  ];

  return (
    <div className="flex flex-col md:flex-row items-center gap-8 h-full">
      {/* Donut Section */}
      <div className="relative w-48 h-48 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              innerRadius={60}
              outerRadius={80}
              startAngle={90}
              endAngle={450}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              <Cell fill="url(#purpleGradient)" />
              <Cell fill="var(--bg-secondary)" />
            </Pie>
            <defs>
              <linearGradient id="purpleGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
            </defs>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-foreground tracking-tighter">{gpa.toFixed(1)}</span>
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Grade Point</span>
        </div>
      </div>

      {/* Info & Trend Section */}
      <div className="flex-1 flex flex-col gap-6 w-full">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Current Grade Point</span>
            <span className="text-xl font-black text-foreground">{gpa.toFixed(1)} / 10</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Percentage</span>
            <span className="text-xl font-black text-foreground">{Math.round(gpa * 9.5)}%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Class Standing</span>
            <span className="text-sm font-black text-emerald-500 uppercase tracking-widest">Top 25%</span>
          </div>
        </div>

        <div className="flex-1 min-h-[120px] bg-black/10 rounded-[24px] p-4 border border-border/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-primary" />
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Grade Point Trend</span>
            </div>
            <select className="bg-transparent text-[10px] font-black text-muted-foreground uppercase tracking-widest outline-none cursor-pointer">
               <option>This Semester</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <XAxis dataKey="sem" axisLine={false} tickLine={false} tick={{ fontSize: 8, fontWeight: 900, fill: 'var(--text-muted)' }} />
              <YAxis hide domain={[0, 10]} />
              <Tooltip 
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '12px', fontSize: '10px' }}
                itemStyle={{ color: 'var(--accent-primary)', fontWeight: 900 }}
              />
              <Line 
                type="monotone" 
                dataKey="val" 
                stroke="url(#purpleGradient)" 
                strokeWidth={3} 
                dot={{ r: 4, fill: 'white', stroke: '#818cf8', strokeWidth: 2 }} 
                activeDot={{ r: 6, fill: 'white', stroke: '#818cf8', strokeWidth: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
