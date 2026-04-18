import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code2, Target, GitPullRequest, Building2, BookOpen, ArrowRight, Plus, Trash2, Edit3, Check } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import StatsCard from '../../components/shared/StatsCard';
import { useGsocStore } from '../../store/gsocStore';

const subPages = [
  { path: '/gsoc/skills', icon: Target, title: 'Skills Roadmap', desc: 'Languages, frameworks, tools to learn', color: '#06b6d4' },
  { path: '/gsoc/contributions', icon: GitPullRequest, title: 'Contributions', desc: 'Open source PRs, issues, repos', color: '#10b981' },
  { path: '/gsoc/organizations', icon: Building2, title: 'Organizations', desc: 'Potential GSoC orgs to apply', color: '#f59e0b' },
];

export default function GsocHome() {
  const { skills, contributions, organizations } = useGsocStore();
  const avgProgress = skills.length ? Math.round(skills.reduce((sum, s) => sum + (s.progress || 0), 0) / skills.length) : 0;

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">💻 GSoC 2027</span></h1>
        <p>Google Summer of Code preparation — skills, contributions, and organizations</p>
      </div>

      <div className="grid-3" style={{ marginBottom: 'var(--space-xl)' }}>
        <StatsCard icon={Target} label="Skills" value={skills.length} subtitle={`${avgProgress}% avg progress`} color="#06b6d4" />
        <StatsCard icon={GitPullRequest} label="Contributions" value={contributions.length} subtitle="Open source" color="#10b981" delay={0.1} />
        <StatsCard icon={Building2} label="Organizations" value={organizations.length} subtitle="Watchlist" color="#f59e0b" delay={0.2} />
      </div>

      <motion.div className="grid-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {subPages.map((page, i) => (
          <motion.div key={page.path} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Link to={page.path} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', textDecoration: 'none', color: 'var(--text-primary)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: `${page.color}15`, color: page.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <page.icon size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{page.title}</div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>{page.desc}</div>
              </div>
              <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </PageWrapper>
  );
}
