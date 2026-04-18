import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, Target, FileText, BookOpen, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PageWrapper from '../../components/layout/PageWrapper';
import StatsCard from '../../components/shared/StatsCard';
import { useCatStore } from '../../store/catStore';

export default function CatHome() {
  const { sections, mockTests, resources, dailyTasks } = useCatStore();
  const avgScore = mockTests.length ? Math.round(mockTests.reduce((s, m) => s + (m.score || 0), 0) / mockTests.length) : 0;
  const chartData = mockTests.map((m, i) => ({ test: `Test ${i + 1}`, score: m.score || 0, percentile: m.percentile || 0 }));

  const subPages = [
    { path: '/cat/sections', icon: Target, title: 'Section Tracker', desc: 'VARC, DILR, QA progress', color: '#f59e0b' },
    { path: '/cat/mocks', icon: FileText, title: 'Mock Tests', desc: 'Scores, percentiles, analysis', color: '#ef4444' },
    { path: '/cat/resources', icon: BookOpen, title: 'Resources', desc: 'Books, courses, materials', color: '#3b82f6' },
  ];

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">📊 CAT 2027</span></h1>
        <p>IIM preparation tracker — target, prepare, achieve</p>
      </div>

      <div className="grid-4" style={{ marginBottom: 'var(--space-xl)' }}>
        <StatsCard icon={Target} label="Sections" value={sections.length} subtitle="Topics tracked" color="#f59e0b" />
        <StatsCard icon={FileText} label="Mock Tests" value={mockTests.length} subtitle={`Avg: ${avgScore}`} color="#ef4444" delay={0.1} />
        <StatsCard icon={BookOpen} label="Resources" value={resources.length} subtitle="Materials" color="#3b82f6" delay={0.2} />
        <StatsCard icon={BarChart3} label="Tasks Done" value={dailyTasks.filter(t => t.completed).length} subtitle={`of ${dailyTasks.length}`} color="#10b981" delay={0.3} />
      </div>

      {chartData.length > 0 && (
        <motion.div className="glass-card" style={{ padding: '1.5rem', marginBottom: 'var(--space-xl)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>Mock Test Progression</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="test" tick={{ fill: '#6b6b80', fontSize: 12 }} />
              <YAxis tick={{ fill: '#6b6b80', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#13131d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f0f0f5' }} />
              <Line type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 4 }} />
              <Line type="monotone" dataKey="percentile" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      <div className="grid-auto">
        {subPages.map((page, i) => (
          <motion.div key={page.path} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Link to={page.path} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', textDecoration: 'none', color: 'var(--text-primary)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: `${page.color}15`, color: page.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><page.icon size={22} /></div>
              <div style={{ flex: 1 }}><div style={{ fontWeight: 700 }}>{page.title}</div><div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>{page.desc}</div></div>
              <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
            </Link>
          </motion.div>
        ))}
      </div>
    </PageWrapper>
  );
}
