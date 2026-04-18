import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Plus, Trash2 } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useLeadershipStore, LEADERSHIP_ASPECTS } from '../../store/leadershipStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function LeadershipSkills() {
  const { activities, addActivity, deleteActivity, getAspectTrend, goals, addGoal, updateGoal, deleteGoal } = useLeadershipStore();
  const [showActivity, setShowActivity] = useState(false);
  const [showGoal, setShowGoal] = useState(false);
  const [selectedAspect, setSelectedAspect] = useState('communication');
  const [actForm, setActForm] = useState({ aspect: 'communication', title: '', description: '', reflection: '', impact: 5 });
  const [goalForm, setGoalForm] = useState({ aspect: 'communication', title: '', targetDate: '' });

  const trendData = getAspectTrend(selectedAspect, 20);
  const aspectActivities = activities.filter(a => a.aspect === selectedAspect).sort((a, b) => new Date(b.date) - new Date(a.date));
  const aspectGoals = goals.filter(g => g.aspect === selectedAspect);
  const selectedInfo = LEADERSHIP_ASPECTS.find(a => a.key === selectedAspect);

  const handleAddActivity = () => {
    if (!actForm.title) return;
    addActivity(actForm);
    setActForm({ aspect: selectedAspect, title: '', description: '', reflection: '', impact: 5 });
    setShowActivity(false);
  };

  const handleAddGoal = () => {
    if (!goalForm.title) return;
    addGoal(goalForm);
    setGoalForm({ aspect: selectedAspect, title: '', targetDate: '' });
    setShowGoal(false);
  };

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">🏆 Skill Deep Dive</span></h1>
        <p>Track practice, log activities, and set goals per leadership skill</p>
        <div className="header-actions">
          <select value={selectedAspect} onChange={e => setSelectedAspect(e.target.value)} style={{ width: 200 }}>
            {LEADERSHIP_ASPECTS.map(a => <option key={a.key} value={a.key}>{a.emoji} {a.label}</option>)}
          </select>
        </div>
      </div>

      {/* Selected Aspect Header */}
      <motion.div className="glass-card" style={{ padding: '1.5rem', marginBottom: 'var(--space-xl)', borderLeft: `4px solid ${selectedInfo?.color}` }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 800 }}>{selectedInfo?.emoji} {selectedInfo?.label}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>{selectedInfo?.description}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn-primary" onClick={() => { setActForm({...actForm, aspect: selectedAspect}); setShowActivity(true); }}><Plus size={14} /> Log Activity</button>
            <button className="btn-secondary" onClick={() => { setGoalForm({...goalForm, aspect: selectedAspect}); setShowGoal(true); }}>🎯 Set Goal</button>
          </div>
        </div>
      </motion.div>

      {/* Progress Trend */}
      <motion.div className="glass-card" style={{ padding: '1.5rem', marginBottom: 'var(--space-xl)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, marginBottom: '1rem' }}>Assessment Trend</h3>
        {trendData.length > 1 ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: '#6b6b80', fontSize: 10 }} />
              <YAxis domain={[0, 10]} tick={{ fill: '#6b6b80', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '2px solid var(--border-primary)', borderRadius: 8, color: 'var(--text-primary)' }} />
              <Line type="monotone" dataKey="value" stroke={selectedInfo?.color || '#f59e0b'} strokeWidth={3} dot={{ fill: selectedInfo?.color || '#f59e0b', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : <div className="empty-state" style={{ padding: '1.5rem' }}><p>Complete 2+ assessments to see this skill's progress</p></div>}
      </motion.div>

      <div className="grid-2">
        {/* Activities */}
        <motion.div className="glass-card" style={{ padding: '1.5rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, marginBottom: '1rem' }}>📝 Activity Log ({aspectActivities.length})</h3>
          {aspectActivities.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 350, overflowY: 'auto' }}>
              {aspectActivities.map(act => (
                <div key={act.id} style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: 700, fontSize: 'var(--font-sm)' }}>{act.title}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span className="badge badge-yellow" style={{ fontSize: '9px' }}>Impact: {act.impact}/10</span>
                      <button className="btn-icon" onClick={() => deleteActivity(act.id)}><Trash2 size={12} /></button>
                    </div>
                  </div>
                  {act.description && <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>{act.description}</p>}
                  {act.reflection && <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', fontStyle: 'italic', marginTop: '0.25rem' }}>💡 {act.reflection}</p>}
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{act.date}</div>
                </div>
              ))}
            </div>
          ) : <div style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: '1rem' }}>No activities logged for this skill yet</div>}
        </motion.div>

        {/* Goals */}
        <motion.div className="glass-card" style={{ padding: '1.5rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, marginBottom: '1rem' }}>🎯 Goals</h3>
          {aspectGoals.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {aspectGoals.map(goal => (
                <div key={goal.id} style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, fontSize: 'var(--font-sm)' }}>{goal.title}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <button className="btn-icon" onClick={() => updateGoal(goal.id, { status: goal.status === 'active' ? 'done' : 'active' })} style={{ color: goal.status === 'done' ? 'var(--accent-green)' : 'var(--text-tertiary)' }}>
                        {goal.status === 'done' ? '✅' : '⏳'}
                      </button>
                      <button className="btn-icon" onClick={() => deleteGoal(goal.id)}><Trash2 size={12} /></button>
                    </div>
                  </div>
                  {goal.targetDate && <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Target: {goal.targetDate}</div>}
                </div>
              ))}
            </div>
          ) : <div style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: '1rem' }}>Set goals to track your growth</div>}
        </motion.div>
      </div>

      {/* Activity Modal */}
      <Modal isOpen={showActivity} onClose={() => setShowActivity(false)} title="Log Leadership Activity">
        <div className="form-grid">
          <div className="form-group full-width"><label>What did you do?</label><input value={actForm.title} onChange={e => setActForm({...actForm, title: e.target.value})} placeholder="e.g. Led a team meeting" /></div>
          <div className="form-group full-width"><label>Description</label><textarea value={actForm.description} onChange={e => setActForm({...actForm, description: e.target.value})} placeholder="Details about the activity" rows={2} /></div>
          <div className="form-group full-width"><label>Reflection</label><textarea value={actForm.reflection} onChange={e => setActForm({...actForm, reflection: e.target.value})} placeholder="What did you learn?" rows={2} /></div>
          <div className="form-group"><label>Impact (1-10)</label><input type="number" min="1" max="10" value={actForm.impact} onChange={e => setActForm({...actForm, impact: Number(e.target.value)})} /></div>
          <div className="form-group full-width"><button className="btn-primary" onClick={handleAddActivity} style={{ width: '100%', justifyContent: 'center' }}>Log Activity</button></div>
        </div>
      </Modal>

      {/* Goal Modal */}
      <Modal isOpen={showGoal} onClose={() => setShowGoal(false)} title="Set Leadership Goal">
        <div className="form-grid">
          <div className="form-group full-width"><label>Goal</label><input value={goalForm.title} onChange={e => setGoalForm({...goalForm, title: e.target.value})} placeholder="e.g. Give a public presentation" /></div>
          <div className="form-group"><label>Target Date</label><input type="date" value={goalForm.targetDate} onChange={e => setGoalForm({...goalForm, targetDate: e.target.value})} /></div>
          <div className="form-group full-width"><button className="btn-primary" onClick={handleAddGoal} style={{ width: '100%', justifyContent: 'center' }}>Create Goal</button></div>
        </div>
      </Modal>
    </PageWrapper>
  );
}
