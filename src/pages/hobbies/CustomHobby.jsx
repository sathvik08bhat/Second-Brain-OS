import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Plus, Trash2, Calendar } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useHobbiesStore } from '../../store/hobbiesStore';

export default function CustomHobby() {
  const { hobbyId } = useParams();
  const { customHobbies, addHobbyActivity, deleteHobbyActivity } = useHobbiesStore();
  const hobby = customHobbies.find(h => h.id === hobbyId);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', notes: '', duration: '' });

  if (!hobby) {
    return (
      <PageWrapper>
        <div className="empty-state"><Star size={48} /><h3>Hobby not found</h3><p>This hobby may have been deleted.</p></div>
      </PageWrapper>
    );
  }

  const handleAdd = () => {
    if (!form.title.trim()) return;
    addHobbyActivity(hobbyId, form);
    setForm({ title: '', notes: '', duration: '' });
    setShowAdd(false);
  };

  const activities = (hobby.activities || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">{hobby.name}</span></h1>
        <p>{hobby.description || 'Your custom hobby tracker'}</p>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={16} /> Log Activity</button>
        </div>
      </div>

      {/* Stats */}
      <motion.div className="glass-card" style={{ padding: '1.5rem', marginBottom: 'var(--space-xl)', display: 'flex', justifyContent: 'space-around', textAlign: 'center' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Total Activities</div>
          <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: hobby.color || 'var(--accent-purple)' }}>{activities.length}</div>
        </div>
        <div>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>This Week</div>
          <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: hobby.color || 'var(--accent-purple)' }}>
            {activities.filter(a => {
              const d = new Date(a.createdAt);
              const now = new Date();
              const weekAgo = new Date(now.setDate(now.getDate() - 7));
              return d >= weekAgo;
            }).length}
          </div>
        </div>
      </motion.div>

      {/* Activity Log */}
      <div className="section-title"><Calendar size={18} /> Activity Log</div>
      {activities.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {activities.map((act, i) => (
            <motion.div key={act.id} className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 'var(--font-sm)' }}>{act.title}</div>
                {act.notes && <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>{act.notes}</div>}
                {act.duration && <span className="badge badge-cyan" style={{ fontSize: '9px', marginTop: '0.25rem' }}>{act.duration} min</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{new Date(act.createdAt).toLocaleDateString('en-IN')}</span>
                <button className="btn-icon" onClick={() => deleteHobbyActivity(hobbyId, act.id)}><Trash2 size={14} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="empty-state"><Star size={48} /><h3>No Activities Yet</h3><p>Log your first {hobby.name} activity!</p></div>
      )}

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title={`Log ${hobby.name} Activity`}>
        <div className="form-grid">
          <div className="form-group full-width"><label>Activity</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="What did you do?" /></div>
          <div className="form-group full-width"><label>Notes (optional)</label><textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Details..." rows={2} /></div>
          <div className="form-group"><label>Duration (minutes)</label><input type="number" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} placeholder="30" /></div>
          <div className="form-group full-width"><button className="btn-primary" onClick={handleAdd} style={{ width: '100%', justifyContent: 'center' }}>Log Activity</button></div>
        </div>
      </Modal>
    </PageWrapper>
  );
}
