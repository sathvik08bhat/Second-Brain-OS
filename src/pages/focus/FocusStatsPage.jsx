import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart as LineChartIcon, PieChart as PieChartIcon, 
  GripHorizontal, RotateCcw, Target, Zap, Clock, TrendingUp
} from 'lucide-react';
import { ResponsiveGridLayout } from 'react-grid-layout';
import { 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import PageWrapper from '../../components/layout/PageWrapper';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const DEFAULT_LAYOUT = [
  { i: 'hours', x: 0, y: 0, w: 12, h: 5, minW: 6, minH: 4 },
  { i: 'success', x: 0, y: 5, w: 4, h: 5, minW: 3, minH: 4 },
  { i: 'ratio', x: 4, y: 5, w: 4, h: 5, minW: 3, minH: 4 },
  { i: 'peak', x: 8, y: 5, w: 4, h: 5, minW: 3, minH: 4 }
];

const COLORS = ['var(--accent-primary)', '#ef4444'];

export default function FocusStatsPage() {
  const [layout, setLayout] = useState([]);

  useEffect(() => {
    // Initial load from localStorage
    const saved = localStorage.getItem('focus_stats_layout');
    if (saved) setLayout(JSON.parse(saved));
    else setLayout(DEFAULT_LAYOUT);
  }, []);

  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
    localStorage.setItem('focus_stats_layout', JSON.stringify(newLayout));
  };

  const resetLayout = () => {
    setLayout(DEFAULT_LAYOUT);
    localStorage.removeItem('focus_stats_layout');
  };

  // ─── Mock Data ────────────────────────────────────────────────────────────

  const hoursData = useMemo(() => {
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'];
    return weeks.map(w => ({
      name: w,
      hours: Math.floor(Math.random() * 40) + 10
    }));
  }, []);

  const successData = [
    { name: 'Completed', value: 85 },
    { name: 'Abandoned', value: 15 },
  ];

  const ratioData = [
    { name: 'Focus', value: 50 },
    { name: 'Break', value: 10 },
  ];

  const peakData = [
    { subject: 'Morning', A: 90, fullMark: 100 },
    { subject: 'Noon', A: 60, fullMark: 100 },
    { subject: 'Afternoon', A: 75, fullMark: 100 },
    { subject: 'Evening', A: 95, fullMark: 100 },
    { subject: 'Night', A: 85, fullMark: 100 },
  ];

  return (
    <PageWrapper>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1><span className="gradient-text">⚡ Focus Stats</span></h1>
          <p>Deep dive into your deep work metrics and session success</p>
        </div>
        <div className="header-actions">
          <button 
            onClick={resetLayout} 
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 bg-transparent border-none cursor-pointer"
          >
            <RotateCcw className="w-3 h-3"/> Reset Layout
          </button>
        </div>
      </div>

      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout, md: layout, sm: layout, xs: layout, xxs: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={60}
        draggableHandle=".drag-handle"
        isResizable={true}
        resizeHandles={['se', 'e', 's']}
        onLayoutChange={handleLayoutChange}
      >
        {/* Widget 1: Deep Work Hours */}
        <div key="hours" data-grid={{ x: 0, y: 0, w: 12, h: 6, minW: 6, minH: 4 }}>
          <div className="bg-card border border-border/50 rounded-2xl shadow-sm flex flex-col w-full h-full overflow-hidden hover:shadow-md transition-shadow group">
            <div className="drag-handle absolute top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
              <GripHorizontal size={16} className="text-muted-foreground/30" />
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Clock size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Deep Work Hours</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Weekly Trends</p>
              </div>
            </div>

            <div className="w-full h-[250px] min-h-[200px] flex-1 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hoursData}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-purple)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--accent-purple)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)', borderRadius: '12px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="hours" stroke="var(--accent-purple)" fillOpacity={1} fill="url(#colorHours)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Widget 2: Session Success Rate */}
        <div key="success" data-grid={{ x: 0, y: 6, w: 4, h: 6, minW: 3, minH: 4 }}>
          <div className="bg-card border border-border/50 rounded-2xl shadow-sm flex flex-col w-full h-full overflow-hidden hover:shadow-md transition-shadow group">
            <div className="drag-handle absolute top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
              <GripHorizontal size={16} className="text-muted-foreground/30" />
            </div>

            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                <Target size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Success Rate</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Completed vs Abandoned</p>
              </div>
            </div>

            <div className="w-full h-[250px] min-h-[200px] flex-1 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={successData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {successData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)', borderRadius: '12px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Widget 3: Focus vs. Break Ratio */}
        <div key="ratio" data-grid={{ x: 4, y: 6, w: 8, h: 6, minW: 4, minH: 4 }}>
          <div className="bg-card border border-border/50 rounded-2xl shadow-sm flex flex-col w-full h-full overflow-hidden hover:shadow-md transition-shadow group">
            <div className="drag-handle absolute top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
              <GripHorizontal size={16} className="text-muted-foreground/30" />
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <Zap size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Focus Ratio</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Work vs Rest</p>
              </div>
            </div>

            <div className="w-full h-[250px] min-h-[200px] flex-1 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ratioData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)', borderRadius: '12px', fontSize: '12px' }} />
                  <Bar dataKey="value" fill="var(--accent-blue)" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Widget 4: Productivity Peak */}
        <div key="peak">
          <div className="bg-card border border-border/50 rounded-2xl shadow-sm flex flex-col w-full h-full overflow-hidden hover:shadow-md transition-shadow group">
            <div className="drag-handle absolute top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
              <GripHorizontal size={16} className="text-muted-foreground/30" />
            </div>

            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                <TrendingUp size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Peak Performance</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Hour Efficiency</p>
              </div>
            </div>

            <div className="w-full h-[250px] min-h-[200px] flex-1 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={peakData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} hide />
                  <Radar name="Focus" dataKey="A" stroke="var(--accent-orange)" fill="var(--accent-orange)" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </ResponsiveGridLayout>
    </PageWrapper>
  );
}
