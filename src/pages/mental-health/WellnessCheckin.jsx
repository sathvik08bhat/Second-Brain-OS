import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Trash2 } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import { useMentalHealthStore, MENTAL_HEALTH_ASPECTS } from '../../store/mentalHealthStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function WellnessCheckin() {
  const { checkins, addCheckin, deleteCheckin, getCheckinTrend } = useMentalHealthStore();
  const [ratings, setRatings] = useState(() => {
    const r = {};
    MENTAL_HEALTH_ASPECTS.forEach(a => { r[a.key] = 5; });
    return r;
  });
  const [notes, setNotes] = useState('');
  const [selectedAspect, setSelectedAspect] = useState('mood');

  const handleSubmit = () => {
    addCheckin({ ratings, notes });
    setNotes('');
    const r = {};
    MENTAL_HEALTH_ASPECTS.forEach(a => { r[a.key] = 5; });
    setRatings(r);
  };

  const trendData = getCheckinTrend(selectedAspect, 30);
  const recentCheckins = [...checkins].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
  const selectedInfo = MENTAL_HEALTH_ASPECTS.find(a => a.key === selectedAspect);

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">📊 Wellness Check-in</span></h1>
        <p>Track your mental health aspects over time</p>
      </div>

      {/* Quick Check-in */}
      <motion.div className="glass-card" style={{ padding: '1.5rem', marginBottom: 'var(--space-xl)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, marginBottom: '1rem' }}>Today's Check-in</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
          {MENTAL_HEALTH_ASPECTS.map(aspect => (
            <div key={aspect.key} style={{ padding: '0.6rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600 }}>{aspect.emoji} {aspect.label}</span>
                <span style={{ fontWeight: 700, color: aspect.color, fontSize: 'var(--font-sm)' }}>{ratings[aspect.key]}</span>
              </div>
              <input type="range" min="1" max="10" value={ratings[aspect.key]} onChange={e => setRatings({...ratings, [aspect.key]: Number(e.target.value)})} style={{ width: '100%', accentColor: aspect.color, boxShadow: 'none', border: 'none', padding: 0 }} />
            </div>
          ))}
        </div>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="How are you feeling overall?" rows={2} style={{ marginBottom: '0.75rem' }} />
        <button className="btn-primary" onClick={handleSubmit} style={{ width: '100%', justifyContent: 'center' }}>Submit Check-in</button>
      </motion.div>

      {/* Trend Chart */}
      <div className="grid-2" style={{ marginBottom: 'var(--space-xl)' }}>
        <motion.div className="glass-card" style={{ padding: '1.5rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700 }}>Aspect Trend</h3>
            <select value={selectedAspect} onChange={e => setSelectedAspect(e.target.value)} style={{ width: 180 }}>
              {MENTAL_HEALTH_ASPECTS.map(a => <option key={a.key} value={a.key}>{a.emoji} {a.label}</option>)}
            </select>
          </div>
          {trendData.length > 1 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: '#6b6b80', fontSize: 10 }} />
                <YAxis domain={[0, 10]} tick={{ fill: '#6b6b80', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '2px solid var(--border-primary)', borderRadius: 8, color: 'var(--text-primary)' }} />
                <Line type="monotone" dataKey="value" stroke={selectedInfo?.color || 'var(--accent-primary)'} strokeWidth={3} dot={{ fill: selectedInfo?.color || 'var(--accent-primary)', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <div className="empty-state" style={{ padding: '1.5rem' }}><p>Need 2+ check-ins to show trends</p></div>}
        </motion.div>

        {/* Recent History */}
        <motion.div className="glass-card" style={{ padding: '1.5rem', maxHeight: 380, overflowY: 'auto' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, marginBottom: '1rem' }}>Check-in History</h3>
          {recentCheckins.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {recentCheckins.map(c => {
                const avg = c.ratings ? Math.round(Object.values(c.ratings).reduce((s, v) => s + v, 0) / Object.values(c.ratings).length * 10) / 10 : 0;
                return (
                  <div key={c.id} style={{ padding: '0.6rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-primary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600, fontSize: 'var(--font-sm)' }}>{c.date}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <span style={{ fontWeight: 700, color: avg >= 7 ? '#10b981' : avg >= 4 ? '#f59e0b' : '#ef4444' }}>Avg: {avg}/10</span>
                        <button className="btn-icon" onClick={() => deleteCheckin(c.id)}><Trash2 size={12} /></button>
                      </div>
                    </div>
                    {c.notes && <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>{c.notes}</div>}
                  </div>
                );
              })}
            </div>
          ) : <div style={{ color: 'var(--text-tertiary)', textAlign: 'center' }}>No check-ins yet</div>}
        </motion.div>
      </div>
    </PageWrapper>
  );
}
