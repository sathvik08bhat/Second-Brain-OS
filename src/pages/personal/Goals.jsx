import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, Trash2, Edit3, Check } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { usePersonalStore } from '../../store/personalStore';
import { formatDateShort } from '../../utils/helpers';

export default function Goals() {
  const { goals, addGoal, updateGoal, deleteGoal } = usePersonalStore();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', deadline: '', status: 'not-started', category: 'career' });

  const handleSubmit = (e) => { e.preventDefault(); if (editId) updateGoal(editId, form); else addGoal(form); resetForm(); };
  const resetForm = () => { setForm({ title: '', description: '', deadline: '', status: 'not-started', category: 'career' }); setEditId(null); setShowModal(false); };
  const startEdit = (g) => { setForm({ title: g.title, description: g.description || '', deadline: g.deadline || '', status: g.status, category: g.category }); setEditId(g.id); setShowModal(true); };

  const categoryColors = { career: '#3b82f6', health: '#10b981', financial: '#f59e0b', personal: '#8b5cf6' };
  const statusColors = { 'not-started': 'badge-red', 'in-progress': 'badge-yellow', 'completed': 'badge-green', 'paused': 'badge-purple' };

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">🎯 Life Goals</span></h1>
        <p>Set, track, and achieve your long-term aspirations</p>
        <div className="header-actions"><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Goal</button></div>
      </div>

      {goals.length === 0 ? (
        <div className="empty-state"><Target size={48} /><h3>No Goals Set</h3><p>What do you want to achieve? Track it here.</p><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Goal</button></div>
      ) : (
        <div className="grid-auto">
          {goals.map((goal, i) => (
            <motion.div key={goal.id} className="glass-card" style={{ padding: '1.25rem', borderTop: `3px solid ${categoryColors[goal.category] || 'white'}` }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: 700, fontSize: 'var(--font-lg)' }}>{goal.title}</div>
                <div style={{ display: 'flex', gap: '0.2rem' }}>
                  <button className="btn-icon" onClick={() => startEdit(goal)}><Edit3 size={14} /></button>
                  <button className="btn-icon" onClick={() => deleteGoal(goal.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={14} /></button>
                </div>
              </div>
              <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: '1rem', minHeight: '3rem' }}>{goal.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`badge ${statusColors[goal.status]}`}>{goal.status.replace('-', ' ').toUpperCase()}</span>
                <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>{goal.deadline ? `Target: ${formatDateShort(goal.deadline)}` : 'Ongoing'}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={resetForm} title={editId ? 'Edit Goal' : 'Add Goal'}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full-width"><label>Goal Title *</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
            <div className="form-group"><label>Category</label><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option value="career">Career & Education</option><option value="health">Fitness & Health</option><option value="financial">Financial</option><option value="personal">Personal Growth</option></select></div>
            <div className="form-group"><label>Target Deadline</label><input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></div>
            <div className="form-group full-width"><label>Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="not-started">Not Started</option><option value="in-progress">In Progress</option><option value="completed">Completed</option><option value="paused">Paused</option></select></div>
            <div className="form-group full-width"><label>Description & Plan</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="How will you achieve this?" /></div>
          </div>
          <div className="modal-actions"><button type="submit" className="btn-primary"><Check size={16} /> Save Goal</button></div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
