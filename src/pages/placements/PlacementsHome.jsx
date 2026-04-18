import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Briefcase, Building, Target, ArrowRight } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import StatsCard from '../../components/shared/StatsCard';
import { usePlacementStore } from '../../store/placementStore';

export default function PlacementsHome() {
  const { dsaProblems, skills, companies } = usePlacementStore();

  const solvedDsa = dsaProblems.filter((p) => p.status === 'solved').length;
  const avgSkill = skills.length ? Math.round(skills.reduce((s, sk) => s + (sk.proficiency || 0), 0) / skills.length) : 0;

  const subPages = [
    { path: '/placements/dsa', icon: Code2, title: 'DSA Tracker', desc: 'Topics, problems, and patterns', color: '#06b6d4' },
    { path: '/placements/skills', icon: Target, title: 'AI/ML Skills', desc: 'Tech stack proficiency', color: '#8b5cf6' },
    { path: '/placements/companies', icon: Building, title: 'Companies Database', desc: 'Target companies and applications', color: '#f59e0b' },
  ];

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">💼 Placements (AI/ML)</span></h1>
        <p>Preparation hub for Aug-Dec 2027 placements</p>
      </div>

      <div className="grid-3" style={{ marginBottom: 'var(--space-xl)' }}>
        <StatsCard icon={Code2} label="DSA Solved" value={solvedDsa} subtitle={`of ${dsaProblems.length} tracked`} color="#06b6d4" />
        <StatsCard icon={Target} label="AI/ML Skills" value={skills.length} subtitle={`${avgSkill}% avg proficiency`} color="#8b5cf6" delay={0.1} />
        <StatsCard icon={Building} label="Target Companies" value={companies.length} subtitle="Watchlist" color="#f59e0b" delay={0.2} />
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
