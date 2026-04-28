import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart as LineChartIcon, BarChart3, 
  GripHorizontal, RotateCcw, BookOpen, Flame, Hash, Smile
} from 'lucide-react';
import { ResponsiveGridLayout } from 'react-grid-layout';
import { 
  LineChart, Line, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import PageWrapper from '../../components/layout/PageWrapper';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const DEFAULT_LAYOUT = [
  { i: 'streak', x: 0, y: 0, w: 4, h: 4, minW: 3, minH: 3 },
  { i: 'velocity', x: 4, y: 0, w: 8, h: 4, minW: 5, minH: 4 },
  { i: 'themes', x: 0, y: 4, w: 6, h: 6, minW: 4, minH: 4 },
  { i: 'mood', x: 6, y: 4, w: 6, h: 6, minW: 4, minH: 4 }
];

export default function JournalInsightsPage() {
  const [layout, setLayout] = useState([]);

  useEffect(() => {
    // Initial load from localStorage
    const saved = localStorage.getItem('journal_stats_layout');
    if (saved) setLayout(JSON.parse(saved));
    else setLayout(DEFAULT_LAYOUT);
  }, []);

  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
    localStorage.setItem('journal_stats_layout', JSON.stringify(newLayout));
  };

  const resetLayout = () => {
    setLayout(DEFAULT_LAYOUT);
    localStorage.removeItem('journal_stats_layout');
  };

  // ─── Mock Data ────────────────────────────────────────────────────────────

  const velocityData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(d => ({
      name: d,
      words: Math.floor(Math.random() * 500) + 100
    }));
  }, []);

  const themesData = [
    { name: 'Startup', count: 45 },
    { name: 'DSA', count: 32 },
    { name: 'Personal', count: 28 },
    { name: 'Finance', count: 18 },
    { name: 'Fitness', count: 12 },
  ];

  const moodData = [
    { subject: 'Productivity', A: 80, fullMark: 100 },
    { subject: 'Happiness', A: 70, fullMark: 100 },
    { subject: 'Stress', A: 40, fullMark: 100 },
    { subject: 'Focus', A: 90, fullMark: 100 },
    { subject: 'Energy', A: 60, fullMark: 100 },
  ];

  return (
    <PageWrapper>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1><span className="gradient-text">📓 Journal Insights</span></h1>
          <p>Analyze your writing habits and common themes</p>
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
        {/* Widget 1: Consistency Streak */}
        <div key="streak">
          <div className="bg-card border border-border/50 rounded-2xl shadow-sm flex flex-col w-full h-full overflow-hidden hover:shadow-md transition-shadow group">
            <div className="drag-handle absolute top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
              <GripHorizontal size={16} className="text-muted-foreground/30" />
            </div>
            
            <div className="flex flex-col items-center justify-center h-full">
              <div className="p-4 rounded-full bg-orange-500/10 text-orange-500 mb-4 animate-pulse">
                <Flame size={48} />
              </div>
              <h3 className="text-4xl font-black text-foreground">12</h3>
              <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Day Streak</p>
              <div className="mt-6 flex gap-1">
                {[1,1,1,1,1,1,0].map((v, i) => (
                  <div key={i} className={`w-3 h-3 rounded-sm ${v ? 'bg-orange-500' : 'bg-muted'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Widget 2: Word Count Velocity */}
        <div key="velocity">
          <div className="bg-card border border-border/50 rounded-2xl shadow-sm flex flex-col w-full h-full overflow-hidden hover:shadow-md transition-shadow group">
            <div className="drag-handle absolute top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
              <GripHorizontal size={16} className="text-muted-foreground/30" />
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <LineChartIcon size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Writing Velocity</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Words Per Day</p>
              </div>
            </div>

            <div className="w-full h-[250px] min-h-[200px] flex-1 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={velocityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)', borderRadius: '12px', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="words" stroke="var(--accent-blue)" strokeWidth={3} dot={{ r: 4, fill: 'var(--accent-blue)' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Widget 3: Common Themes */}
        <div key="themes">
          <div className="bg-card border border-border/50 rounded-2xl shadow-sm flex flex-col w-full h-full overflow-hidden hover:shadow-md transition-shadow group">
            <div className="drag-handle absolute top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
              <GripHorizontal size={16} className="text-muted-foreground/30" />
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-pink-500/10 text-pink-500">
                <Hash size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Common Themes</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Frequent Keywords</p>
              </div>
            </div>

            <div className="w-full h-[250px] min-h-[200px] flex-1 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={themesData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} width={80} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)', borderRadius: '12px', fontSize: '12px' }} />
                  <Bar dataKey="count" fill="var(--accent-pink)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Widget 4: Mood Tracker */}
        <div key="mood">
          <div className="bg-card border border-border/50 rounded-2xl shadow-sm flex flex-col w-full h-full overflow-hidden hover:shadow-md transition-shadow group">
            <div className="drag-handle absolute top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
              <GripHorizontal size={16} className="text-muted-foreground/30" />
            </div>

            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
                <Smile size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Sentiment Radar</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Emotional Balance</p>
              </div>
            </div>

            <div className="w-full h-[250px] min-h-[200px] flex-1 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={moodData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} hide />
                  <Radar name="Mood" dataKey="A" stroke="var(--accent-yellow)" fill="var(--accent-yellow)" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </ResponsiveGridLayout>
    </PageWrapper>
  );
}
