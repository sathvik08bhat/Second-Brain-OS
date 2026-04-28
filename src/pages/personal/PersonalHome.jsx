import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, CheckSquare, Target, ArrowRight } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import StatsCard from '../../components/shared/StatsCard';
import { usePersonalStore } from '../../store/personalStore';

export default function PersonalHome() {
  const { journalEntries, habits, goals } = usePersonalStore();
  const activeHabits = habits.length;
  const pendingGoals = goals.filter(g => g.status !== 'completed').length;

  const subPages = [
    { path: '/personal/journal', icon: BookOpen, title: 'Daily Journal', desc: 'Reflections and thoughts', color: 'var(--accent-primary)' },
    { path: '/personal/habits', icon: CheckSquare, title: 'Habit Tracker', desc: 'Build consistency', color: '#10b981' },
    { path: '/personal/goals', icon: Target, title: 'Life Goals', desc: 'Long-term aspirations', color: '#f59e0b' },
  ];

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">🌱 Personal Dev</span></h1>
        <p>Your space for reflection, growth, and habit building</p>
      </div>

      <div className="grid-3" style={{ marginBottom: 'var(--space-xl)' }}>
        <StatsCard icon={BookOpen} label="Journal Entries" value={journalEntries.length} subtitle="Total reflections" color="var(--accent-primary)" />
        <StatsCard icon={CheckSquare} label="Tracked Habits" value={activeHabits} subtitle="Daily consistency" color="#10b981" delay={0.1} />
        <StatsCard icon={Target} label="Active Goals" value={pendingGoals} subtitle={`Out of ${goals.length} total`} color="#f59e0b" delay={0.2} />
      </div>

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
