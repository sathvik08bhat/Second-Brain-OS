import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Plus, Trophy, Activity } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import StatsCard from '../../components/shared/StatsCard';
import Modal from '../../components/shared/Modal';
import { useLeadershipStore, LEADERSHIP_ASPECTS } from '../../store/leadershipStore';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function LeadershipHome() {
  const { assessments, addAssessment, getLatestRatings, getOverallScore, activities, goals } = useLeadershipStore();
  const [showAssess, setShowAssess] = useState(false);
  const [ratings, setRatings] = useState(() => {
    const r = {};
    LEADERSHIP_ASPECTS.forEach(a => { r[a.key] = 5; });
    return r;
  });
  const [assessNotes, setAssessNotes] = useState('');

  const latestRatings = getLatestRatings();
  const overallScore = getOverallScore();
  const radarData = LEADERSHIP_ASPECTS.map(a => ({
    aspect: a.label,
    value: latestRatings ? (latestRatings[a.key] || 0) : 0,
    fullMark: 10
  }));

  const handleAssess = () => {
    addAssessment({ ratings, notes: assessNotes });
    setShowAssess(false);
    setAssessNotes('');
  };

  const subPages = [
    { path: '/leadership/skills', icon: Trophy, title: 'Skill Deep Dive', desc: 'Practice logs & progress per skill', color: '#f59e0b' },
    { path: '/leadership/resources', icon: Shield, title: 'Learning Resources', desc: 'Frameworks & techniques per skill', color: '#06b6d4' },
  ];

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">🎖️ Leadership Skills</span></h1>
        <p>Assess, track, and grow your leadership capabilities</p>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setShowAssess(true)}><Plus size={16} /> Self-Assessment</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-xl)' }}>
        <StatsCard icon={Shield} label="Overall Score" value={overallScore || '—'} subtitle="Latest assessment" color="#8b5cf6" />
        <StatsCard icon={Activity} label="Assessments" value={assessments.length} subtitle="Self-evaluations" color="#06b6d4" delay={0.1} />
        <StatsCard icon={Trophy} label="Activities" value={activities.length} subtitle="Practice logged" color="#f59e0b" delay={0.2} />
        <StatsCard icon={Shield} label="Active Goals" value={goals.filter(g => g.status === 'active').length} subtitle="In progress" color="#10b981" delay={0.3} />
      </div>

      {/* Radar & Aspect Cards */}
      <div className="grid-2" style={{ marginBottom: 'var(--space-xl)' }}>
        <motion.div className="glass-card" style={{ padding: '1.5rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, marginBottom: '1rem' }}>Leadership Radar</h3>
          {latestRatings ? (
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="aspect" tick={{ fill: 'var(--text-secondary)', fontSize: 9 }} />
                <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: '#6b6b80', fontSize: 10 }} />
                <Radar name="Score" dataKey="value" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} strokeWidth={2} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '2px solid var(--border-primary)', borderRadius: 8, color: 'var(--text-primary)' }} />
              </RadarChart>
            </ResponsiveContainer>
          ) : <div className="empty-state" style={{ padding: '2rem' }}><p>Complete your first self-assessment</p></div>}
        </motion.div>

        <motion.div className="glass-card" style={{ padding: '1.5rem', maxHeight: 380, overflowY: 'auto' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, marginBottom: '1rem' }}>Skills Overview</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {LEADERSHIP_ASPECTS.map(aspect => {
              const score = latestRatings ? (latestRatings[aspect.key] || 0) : 0;
              const scoreColor = score >= 7 ? '#10b981' : score >= 4 ? '#f59e0b' : '#ef4444';
              return (
                <div key={aspect.key} style={{ padding: '0.6rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: 'var(--font-sm)', fontWeight: 600 }}>{aspect.emoji} {aspect.label}</span>
                    <span style={{ fontWeight: 700, color: scoreColor }}>{score}/10</span>
                  </div>
                  <div className="progress-bar-container" style={{ height: 4 }}>
                    <div className="progress-bar-fill" style={{ width: `${score * 10}%`, background: scoreColor }} />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Sub-pages */}
      <div className="grid-auto">
        {subPages.map((page, i) => (
          <motion.div key={page.path} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }}>
            <Link to={page.path} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', textDecoration: 'none', color: 'var(--text-primary)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: `${page.color}15`, color: page.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><page.icon size={22} /></div>
              <div style={{ flex: 1 }}><div style={{ fontWeight: 700 }}>{page.title}</div><div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>{page.desc}</div></div>
              <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Assessment Modal */}
      <Modal isOpen={showAssess} onClose={() => setShowAssess(false)} title="Leadership Self-Assessment" size="lg">
        <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Rate your current ability in each area (1 = beginner, 10 = mastery)</p>
          {LEADERSHIP_ASPECTS.map(aspect => (
            <div key={aspect.key} style={{ marginBottom: '0.75rem', padding: '0.6rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                <span style={{ fontWeight: 600, fontSize: 'var(--font-sm)' }}>{aspect.emoji} {aspect.label}</span>
                <span style={{ fontWeight: 700, color: aspect.color }}>{ratings[aspect.key]}</span>
              </div>
              <input type="range" min="1" max="10" value={ratings[aspect.key]} onChange={e => setRatings({...ratings, [aspect.key]: Number(e.target.value)})} style={{ width: '100%', accentColor: aspect.color, boxShadow: 'none', border: 'none', padding: 0 }} />
            </div>
          ))}
          <textarea value={assessNotes} onChange={e => setAssessNotes(e.target.value)} placeholder="Reflections on your leadership growth..." rows={2} style={{ marginBottom: '0.75rem' }} />
          <button className="btn-primary" onClick={handleAssess} style={{ width: '100%', justifyContent: 'center' }}>Submit Assessment</button>
        </div>
      </Modal>
    </PageWrapper>
  );
}
