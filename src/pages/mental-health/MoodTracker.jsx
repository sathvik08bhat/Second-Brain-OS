import { useState } from 'react';
import { motion } from 'framer-motion';
import { Smile, Plus, Trash2 } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useMentalHealthStore } from '../../store/mentalHealthStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MOODS = [
  { emoji: '😄', label: 'Great', value: 'great', color: '#10b981' },
  { emoji: '🙂', label: 'Good', value: 'good', color: '#06b6d4' },
  { emoji: '😐', label: 'Okay', value: 'okay', color: '#f59e0b' },
  { emoji: '😔', label: 'Low', value: 'low', color: '#f97316' },
  { emoji: '😢', label: 'Bad', value: 'bad', color: '#ef4444' },
  { emoji: '😰', label: 'Anxious', value: 'anxious', color: 'var(--accent-primary)' },
  { emoji: '😤', label: 'Stressed', value: 'stressed', color: '#ec4899' },
  { emoji: '😴', label: 'Tired', value: 'tired', color: '#6366f1' },
];

const moodToNumber = { great: 10, good: 8, okay: 6, low: 4, bad: 2, anxious: 3, stressed: 3, tired: 4 };

export default function MoodTracker() {
  const { moodLogs, addMoodLog, deleteMoodLog, gratitudeEntries, addGratitude, deleteGratitude } = useMentalHealthStore();
  const [showMood, setShowMood] = useState(false);
  const [showGratitude, setShowGratitude] = useState(false);
  const [moodForm, setMoodForm] = useState({ mood: 'good', note: '', intensity: 7 });
  const [gratForm, setGratForm] = useState({ entries: ['', '', ''] });

  const handleAddMood = () => {
    addMoodLog(moodForm);
    setMoodForm({ mood: 'good', note: '', intensity: 7 });
    setShowMood(false);
  };

  const handleAddGratitude = () => {
    const filled = gratForm.entries.filter(e => e.trim());
    if (filled.length === 0) return;
    addGratitude({ entries: filled });
    setGratForm({ entries: ['', '', ''] });
    setShowGratitude(false);
  };

  const moodTrend = [...moodLogs].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-30).map(m => ({
    date: m.date,
    score: moodToNumber[m.mood] || m.intensity || 5,
  }));

  const recentMoods = [...moodLogs].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 15);
  const recentGratitude = [...gratitudeEntries].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">😊 Mood Tracker</span></h1>
        <p>Log your daily mood and practice gratitude</p>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setShowMood(true)}><Plus size={16} /> Log Mood</button>
          <button className="btn-secondary" onClick={() => setShowGratitude(true)}>🙏 Gratitude</button>
        </div>
      </div>

      {/* Mood Trend */}
      <motion.div className="glass-card" style={{ padding: '1.5rem', marginBottom: 'var(--space-xl)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, marginBottom: '1rem' }}>Mood Trend (Last 30 entries)</h3>
        {moodTrend.length > 1 ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={moodTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: '#6b6b80', fontSize: 10 }} />
              <YAxis domain={[0, 10]} tick={{ fill: '#6b6b80', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '2px solid var(--border-primary)', borderRadius: 8, color: 'var(--text-primary)' }} />
              <Line type="monotone" dataKey="score" stroke="#ec4899" strokeWidth={3} dot={{ fill: '#ec4899', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : <div className="empty-state" style={{ padding: '1.5rem' }}><p>Log at least 2 moods to see trends</p></div>}
      </motion.div>

      <div className="grid-2">
        {/* Mood Log */}
        <motion.div className="glass-card" style={{ padding: '1.5rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, marginBottom: '1rem' }}>Recent Moods</h3>
          {recentMoods.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: 300, overflowY: 'auto' }}>
              {recentMoods.map(m => {
                const moodInfo = MOODS.find(x => x.value === m.mood) || MOODS[1];
                return (
                  <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.3rem' }}>{moodInfo.emoji}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 'var(--font-sm)', color: moodInfo.color }}>{moodInfo.label}</div>
                        {m.note && <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>{m.note}</div>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{m.date}</span>
                      <button className="btn-icon" onClick={() => deleteMoodLog(m.id)}><Trash2 size={12} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : <div style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: '1rem' }}>No mood entries yet</div>}
        </motion.div>

        {/* Gratitude Journal */}
        <motion.div className="glass-card" style={{ padding: '1.5rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, marginBottom: '1rem' }}>🙏 Gratitude Journal</h3>
          {recentGratitude.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 300, overflowY: 'auto' }}>
              {recentGratitude.map(g => (
                <div key={g.id} style={{ padding: '0.6rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{g.date}</span>
                    <button className="btn-icon" onClick={() => deleteGratitude(g.id)}><Trash2 size={12} /></button>
                  </div>
                  <ul style={{ paddingLeft: '1rem', margin: 0 }}>
                    {g.entries.map((e, i) => <li key={i} style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>{e}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          ) : <div style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: '1rem' }}>Start your gratitude practice!</div>}
        </motion.div>
      </div>

      {/* Mood Modal */}
      <Modal isOpen={showMood} onClose={() => setShowMood(false)} title="Log Your Mood">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          {MOODS.map(m => (
            <button key={m.value} onClick={() => setMoodForm({...moodForm, mood: m.value})} style={{ padding: '0.6rem 1rem', borderRadius: 'var(--radius-md)', background: moodForm.mood === m.value ? `${m.color}20` : 'var(--bg-glass)', border: `2px solid ${moodForm.mood === m.value ? m.color : 'var(--border-primary)'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: 'var(--font-sm)', color: moodForm.mood === m.value ? m.color : 'var(--text-secondary)', fontWeight: moodForm.mood === m.value ? 700 : 400, boxShadow: moodForm.mood === m.value ? `2px 2px 0px ${m.color}` : 'none' }}>
              <span>{m.emoji}</span> {m.label}
            </button>
          ))}
        </div>
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label>Note (optional)</label>
          <textarea value={moodForm.note} onChange={e => setMoodForm({...moodForm, note: e.target.value})} placeholder="What's on your mind?" rows={3} />
        </div>
        <button className="btn-primary" onClick={handleAddMood} style={{ width: '100%', justifyContent: 'center' }}>Log Mood</button>
      </Modal>

      {/* Gratitude Modal */}
      <Modal isOpen={showGratitude} onClose={() => setShowGratitude(false)} title="Gratitude Journal">
        <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: '1rem' }}>What are 3 things you're grateful for today?</p>
        {gratForm.entries.map((e, i) => (
          <div className="form-group" key={i} style={{ marginBottom: '0.75rem' }}>
            <label>{i + 1}.</label>
            <input value={e} onChange={ev => { const ne = [...gratForm.entries]; ne[i] = ev.target.value; setGratForm({entries: ne}); }} placeholder={`I'm grateful for...`} />
          </div>
        ))}
        <button className="btn-primary" onClick={handleAddGratitude} style={{ width: '100%', justifyContent: 'center' }}>Save Gratitude</button>
      </Modal>
    </PageWrapper>
  );
}
