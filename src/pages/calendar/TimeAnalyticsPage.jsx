import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, PieChart as PieChartIcon, 
  GripHorizontal, RotateCcw, Calendar, Clock, Activity
} from 'lucide-react';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import { 
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import PageWrapper from '../../components/layout/PageWrapper';
import { WidgetCard } from '../../components/ui/WidgetCard';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const DEFAULT_LAYOUT = [
  { i: 'heatmap', x: 0, y: 0, w: 8, h: 6, minW: 5, minH: 4 },
  { i: 'distribution', x: 8, y: 0, w: 4, h: 6, minW: 3, minH: 4 },
  { i: 'attendance', x: 0, y: 6, w: 12, h: 4, minW: 6, minH: 3 }
];

const COLORS = ['var(--accent-primary)', '#06b6d4', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function TimeAnalyticsPage() {
  const [layout, setLayout] = useState(() => {
    const saved = localStorage.getItem('calendar_stats_layout');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_LAYOUT;
      }
    }
    return DEFAULT_LAYOUT;
  });

  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
    localStorage.setItem('calendar_stats_layout', JSON.stringify(newLayout));
  };

  const resetLayout = () => {
    setLayout(DEFAULT_LAYOUT);
    localStorage.removeItem('calendar_stats_layout');
  };

  // ─── Mock Data ────────────────────────────────────────────────────────────

  const heatmapData = useMemo(() => {
    const hours = ['8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm', '10pm'];
    return hours.map(h => ({
      name: h,
      load: Math.floor(Math.random() * 100),
      capacity: 100
    }));
  }, []);

  const distributionData = [
    { name: 'Academics', value: 40 },
    { name: 'Personal', value: 25 },
    { name: 'Meetings', value: 20 },
    { name: 'Focus', value: 15 },
  ];

  const attendanceData = [
    { subject: 'Maths', percentage: 85 },
    { subject: 'Physics', percentage: 78 },
    { subject: 'CS', percentage: 92 },
    { subject: 'Electronics', percentage: 65 },
    { subject: 'Economics', percentage: 88 },
  ];

  return (
    <PageWrapper>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1><span className="gradient-text">⏳ Time Analytics</span></h1>
          <p>Visualize your schedule density and time distribution</p>
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
        {/* Widget 1: Weekly Load Heatmap */}
        <WidgetCard key="heatmap" title="Schedule Density" icon={Clock}>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-4">Weekly Load Heatmap</p>
            <div className="w-full h-[250px] min-h-[200px] flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={heatmapData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)', borderRadius: '12px', fontSize: '12px' }} />
                  <Bar dataKey="load" fill="var(--accent-purple)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
        </WidgetCard>

        {/* Widget 2: Event Distribution */}
        <WidgetCard key="distribution" title="Time Allocation" icon={PieChartIcon}>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-4">By Category</p>
            <div className="w-full h-[250px] min-h-[200px] flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)', borderRadius: '12px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
        </WidgetCard>

        {/* Widget 3: Attendance Tracker */}
        <WidgetCard key="attendance" title="Attendance Tracker" icon={Activity}>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-4">Percentage Per Subject</p>
            <div className="w-full h-[250px] min-h-[200px] flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis dataKey="subject" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} width={80} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)', borderRadius: '12px', fontSize: '12px' }} />
                  <Bar dataKey="percentage" fill="var(--accent-green)" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
        </WidgetCard>
      </ResponsiveGridLayout>
    </PageWrapper>
  );
}
