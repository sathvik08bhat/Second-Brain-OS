import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, Lightbulb, Kanban, DollarSign, ArrowRight } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import StatsCard from '../../components/shared/StatsCard';
import { useStartupStore } from '../../store/startupStore';

export default function StartupHome() {
  const { ideas, tasks, finances } = useStartupStore();

  const totalIncome = finances.filter(f => f.type === 'income').reduce((s, f) => s + (f.amount || 0), 0);
  const totalExpense = finances.filter(f => f.type === 'expense').reduce((s, f) => s + (f.amount || 0), 0);

  const subPages = [
    { path: '/startup/ideas', icon: Lightbulb, title: 'Idea Lab', desc: 'Brainstorm and validate', color: '#f59e0b' },
    { path: '/startup/tasks', icon: Kanban, title: 'Sprint Board', desc: 'Manage development tasks', color: '#8b5cf6' },
    { path: '/startup/finance', icon: DollarSign, title: 'Finance Tracker', desc: 'Income, expenses, runway', color: '#10b981' },
  ];

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">🚀 Startup OS</span></h1>
        <p>From ideas to execution — track your venture development</p>
      </div>

      <div className="grid-3" style={{ marginBottom: 'var(--space-xl)' }}>
        <StatsCard icon={Lightbulb} label="Ideas" value={ideas.length} subtitle="In the lab" color="#f59e0b" />
        <StatsCard icon={Kanban} label="Tasks" value={tasks.filter(t => t.status !== 'done').length} subtitle="Pending tasks" color="#8b5cf6" delay={0.1} />
        <StatsCard icon={DollarSign} label="Net Cashflow" value={`₹${totalIncome - totalExpense}`} subtitle={totalIncome >= totalExpense ? 'Positive' : 'Burn rate active'} color={totalIncome >= totalExpense ? '#10b981' : '#ef4444'} delay={0.2} />
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
