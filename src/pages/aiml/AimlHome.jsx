import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, BookOpen, Layers, FlaskConical, FileText, ArrowRight, Zap, TrendingUp } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import StatsCard from '../../components/shared/StatsCard';
import { useAimlStore } from '../../store/aimlStore';

const subPages = [
  { path: '/aiml/roadmap', icon: Layers, title: 'Learning Roadmap', desc: 'Topic-by-topic mastery tracker', color: '#8b5cf6' },
  { path: '/aiml/courses', icon: BookOpen, title: 'Courses', desc: 'Online courses & certifications', color: '#3b82f6' },
  { path: '/aiml/projects', icon: FlaskConical, title: 'Projects', desc: 'Hands-on ML/AI projects', color: '#f59e0b' },
  { path: '/aiml/papers', icon: FileText, title: 'Research Papers', desc: 'Papers read & notes', color: '#10b981' },
];

export default function AimlHome() {
  const { courses, projects, papers, getRoadmapProgress } = useAimlStore();
  const progress = getRoadmapProgress();

  const completedCourses = courses.filter(c => c.status === 'completed').length;
  const activeProjects = projects.filter(p => p.status === 'building' || p.status === 'testing').length;
  const papersRead = papers.filter(p => p.readStatus === 'read').length;

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">🤖 AI/ML Learning Hub</span></h1>
        <p>Your comprehensive AI & Machine Learning journey tracker</p>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-xl)' }}>
        <StatsCard icon={TrendingUp} label="Roadmap Progress" value={`${progress.progressPercent}%`} subtitle={`${progress.mastered} topics mastered`} color="#8b5cf6" />
        <StatsCard icon={BookOpen} label="Courses" value={completedCourses} subtitle={`of ${courses.length} total`} color="#3b82f6" delay={0.1} />
        <StatsCard icon={FlaskConical} label="Active Projects" value={activeProjects} subtitle={`${projects.length} total`} color="#f59e0b" delay={0.2} />
        <StatsCard icon={FileText} label="Papers Read" value={papersRead} subtitle={`of ${papers.length} saved`} color="#10b981" delay={0.3} />
      </div>

      {/* Roadmap Summary */}
      <div className="section-title" style={{ marginBottom: 'var(--space-md)' }}>
        <Zap size={18} /> Roadmap Overview
      </div>
      <motion.div
        className="glass-card"
        style={{ padding: '1.5rem', marginBottom: 'var(--space-xl)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {[
            { label: 'Mastered', value: progress.mastered, color: '#10b981' },
            { label: 'Confident', value: progress.confident, color: '#3b82f6' },
            { label: 'Learning', value: progress.learning, color: '#f59e0b' },
            { label: 'Not Started', value: progress.notStarted, color: '#64748b' },
          ].map(s => (
            <div key={s.label} style={{ flex: '1 1 120px', textAlign: 'center', padding: '0.75rem', background: `${s.color}10`, border: `2px solid ${s.color}30`, borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div className="progress-bar-container" style={{ height: 10 }}>
          <motion.div
            className="progress-bar-fill"
            style={{ background: 'linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6)' }}
            initial={{ width: 0 }}
            animate={{ width: `${progress.progressPercent}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </div>
        <div style={{ textAlign: 'right', fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: '0.4rem' }}>
          {progress.total} total topics
        </div>
      </motion.div>

      {/* Sub-pages */}
      <div className="section-title" style={{ marginBottom: 'var(--space-md)' }}>
        <Brain size={18} /> Explore
      </div>
      <div className="grid-2">
        {subPages.map((page, i) => (
          <motion.div key={page.path} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Link to={page.path} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', textDecoration: 'none', color: 'var(--text-primary)' }}>
              <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: `${page.color}15`, color: page.color, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${page.color}30` }}>
                <page.icon size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 'var(--font-md)' }}>{page.title}</div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>{page.desc}</div>
              </div>
              <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
            </Link>
          </motion.div>
        ))}
      </div>
    </PageWrapper>
  );
}
