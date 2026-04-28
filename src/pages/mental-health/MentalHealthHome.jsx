import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowRight, Plus, Smile, Frown, Meh, Sun, Moon, Zap, Brain, Shield, Activity } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import StatsCard from '../../components/shared/StatsCard';
import Modal from '../../components/shared/Modal';
import { useMentalHealthStore, MENTAL_HEALTH_ASPECTS } from '../../store/mentalHealthStore';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function MentalHealthHome() {
  const { checkins, addCheckin, getAverageRatings, gratitudeEntries, moodLogs, meditationSessions } = useMentalHealthStore();
  const [showCheckin, setShowCheckin] = useState(false);
  const [ratings, setRatings] = useState(() => {
    const r = {};
    MENTAL_HEALTH_ASPECTS.forEach(a => { r[a.key] = 5; });
    return r;
  });
  const [checkinNotes, setCheckinNotes] = useState('');

  const averages = getAverageRatings(30);
  const radarData = MENTAL_HEALTH_ASPECTS.map(a => ({
    aspect: a.label,
    value: averages ? (averages[a.key] || 0) : 0,
    fullMark: 10
  }));

  const todayStr = new Date().toISOString().split('T')[0];
  const todayCheckin = checkins.find(c => c.date === todayStr);

  const handleCheckin = () => {
    addCheckin({ ratings, notes: checkinNotes });
    setShowCheckin(false);
    setCheckinNotes('');
  };

  const overallScore = averages ? Math.round(Object.values(averages).reduce((s, v) => s + v, 0) / Object.values(averages).length * 10) / 10 : 0;

  const subPages = [
    { path: '/mental-health/mood', icon: Smile, title: 'Mood Tracker', desc: 'Daily mood logging & trends', color: '#f59e0b' },
    { path: '/mental-health/checkin', icon: Activity, title: 'Wellness Check-in', desc: 'Rate all mental health aspects', color: 'var(--accent-primary)' },
    { path: '/mental-health/resources', icon: Brain, title: 'Improvement Resources', desc: 'Techniques to improve every aspect', color: '#06b6d4' },
  ];

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">🧠 Mental Health & Wellbeing</span></h1>
        <p>Track, understand, and improve all aspects of your mental health</p>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setShowCheckin(true)}>
            {todayCheckin ? '✅ Checked In Today' : <><Plus size={16} /> Daily Check-in</>}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-xl)' }}>
        <StatsCard icon={Heart} label="Overall Score" value={overallScore || '—'} subtitle="30-day average" color="#ec4899" />
        <StatsCard icon={Activity} label="Check-ins" value={checkins.length} subtitle="Total entries" color="var(--accent-primary)" delay={0.1} />
        <StatsCard icon={Sun} label="Gratitude" value={gratitudeEntries.length} subtitle="Journal entries" color="#f59e0b" delay={0.2} />
        <StatsCard icon={Brain} label="Meditation" value={meditationSessions.length} subtitle="Sessions logged" color="#06b6d4" delay={0.3} />
      </div>

      {/* Radar Chart */}
      <div className="grid-2" style={{ marginBottom: 'var(--space-xl)' }}>
        <motion.div className="glass-card" style={{ padding: '1.5rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, marginBottom: '1rem' }}>Mental Health Radar</h3>
          {averages ? (
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="aspect" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: '#6b6b80', fontSize: 10 }} />
                <Radar name="Score" dataKey="value" stroke="var(--accent-primary)" fill="var(--accent-primary)" fillOpacity={0.3} strokeWidth={2} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '2px solid var(--border-primary)', borderRadius: 8, color: 'var(--text-primary)' }} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: '2rem' }}><p>Complete your first daily check-in to see your radar</p></div>
          )}
        </motion.div>

        {/* Aspect Cards */}
        <motion.div className="glass-card" style={{ padding: '1.5rem', maxHeight: '380px', overflowY: 'auto' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, marginBottom: '1rem' }}>Aspect Scores (30-day avg)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {MENTAL_HEALTH_ASPECTS.map(aspect => {
              const score = averages ? (averages[aspect.key] || 0) : 0;
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

      {/* Check-in Modal */}
      <Modal isOpen={showCheckin} onClose={() => setShowCheckin(false)} title="Daily Wellness Check-in" size="lg">
        <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Rate each aspect from 1 (poor) to 10 (excellent)</p>
          {MENTAL_HEALTH_ASPECTS.map(aspect => (
            <div key={aspect.key} style={{ marginBottom: '1rem', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span style={{ fontWeight: 600, fontSize: 'var(--font-sm)' }}>{aspect.emoji} {aspect.label}</span>
                <span style={{ fontWeight: 700, color: aspect.color }}>{ratings[aspect.key]}</span>
              </div>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginBottom: '0.4rem' }}>{aspect.description}</div>
              <input type="range" min="1" max="10" value={ratings[aspect.key]} onChange={e => setRatings({...ratings, [aspect.key]: Number(e.target.value)})} style={{ width: '100%', accentColor: aspect.color, boxShadow: 'none', border: 'none', padding: 0 }} />
            </div>
          ))}
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Notes (optional)</label>
            <textarea value={checkinNotes} onChange={e => setCheckinNotes(e.target.value)} placeholder="How are you feeling today?" rows={3} />
          </div>
          <button className="btn-primary" onClick={handleCheckin} style={{ width: '100%', justifyContent: 'center' }}>Submit Check-in</button>
        </div>
      </Modal>
    </PageWrapper>
  );
}
