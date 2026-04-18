import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Plus, Trash2, Edit3, Check } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useFitnessStore } from '../../store/fitnessStore';
import { formatDateShort } from '../../utils/helpers';

export default function Workouts() {
  const { workouts, addWorkout, updateWorkout, deleteWorkout } = useFitnessStore();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], type: 'push', duration: '', exercises: '', notes: '' });

  const handleSubmit = (e) => { e.preventDefault(); if (editId) updateWorkout(editId, { ...form, duration: Number(form.duration) }); else addWorkout({ ...form, duration: Number(form.duration) }); resetForm(); };
  const resetForm = () => { setForm({ date: new Date().toISOString().split('T')[0], type: 'push', duration: '', exercises: '', notes: '' }); setEditId(null); setShowModal(false); };
  const startEdit = (w) => { setForm({ date: w.date, type: w.type, duration: w.duration, exercises: w.exercises || '', notes: w.notes || '' }); setEditId(w.id); setShowModal(true); };

  const typeColors = { push: '#ef4444', pull: '#3b82f6', legs: '#10b981', fullbody: '#f59e0b', back: '#8b5cf6', chest: '#ec4899' };

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">💪 Gym Workouts</span></h1>
        <p>Log your strength training sessions and progressive overload</p>
        <div className="header-actions"><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Log Workout</button></div>
      </div>

      {workouts.length === 0 ? (
        <div className="empty-state"><Dumbbell size={48} /><h3>No Workouts Logged</h3><p>Record your strength training sessions.</p><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Log Session</button></div>
      ) : (
        <div className="grid-auto">
          {workouts.sort((a,b) => new Date(b.date) - new Date(a.date)).map((w, i) => (
            <motion.div key={w.id} className="glass-card" style={{ padding: '1.25rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="badge" style={{ background: `${typeColors[w.type] || '#6b6b80'}15`, color: typeColors[w.type] || '#6b6b80', fontSize: 'var(--font-sm)' }}>
                  {w.type.toUpperCase()}
                </span>
                <div style={{ display: 'flex', gap: '0.2rem' }}>
                  <button className="btn-icon" onClick={() => startEdit(w)}><Edit3 size={14} /></button>
                  <button className="btn-icon" onClick={() => deleteWorkout(w.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={14} /></button>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                <div style={{ fontWeight: 600 }}>{formatDateShort(w.date)}</div>
                <div>{w.duration} mins</div>
              </div>
              <div style={{ marginBottom: '1rem', flex: 1 }}>
                <strong style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Exercises</strong>
                <p style={{ fontSize: 'var(--font-sm)', whiteSpace: 'pre-wrap', marginTop: '0.2rem' }}>{w.exercises}</p>
              </div>
              {w.notes && <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>"{w.notes}"</p>}
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={resetForm} title={editId ? 'Edit Workout' : 'Log Workout'}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group"><label>Date *</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></div>
            <div className="form-group"><label>Split / Type</label><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="push">Push</option><option value="pull">Pull</option><option value="legs">Legs</option><option value="fullbody">Full Body</option><option value="chest">Chest</option><option value="back">Back</option></select></div>
            <div className="form-group"><label>Duration (mins) *</label><input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} required min="1" /></div>
            <div className="form-group full-width"><label>Exercises (Sets x Reps x Weight)</label><textarea value={form.exercises} onChange={(e) => setForm({ ...form, exercises: e.target.value })} rows={4} placeholder="Bench Press: 3x10x60kg&#10;Incline DB Press: 3x12x20kg" required /></div>
            <div className="form-group full-width"><label>Notes</label><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Felt strong today..." /></div>
          </div>
          <div className="modal-actions"><button type="submit" className="btn-primary"><Check size={16} /> Save</button></div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
