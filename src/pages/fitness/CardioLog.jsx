import { useState } from 'react';
import { motion } from 'framer-motion';
import { HeartPulse, Plus, Trash2, Edit3, Check } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useFitnessStore } from '../../store/fitnessStore';
import { formatDateShort } from '../../utils/helpers';

export default function CardioLog() {
  const { cardioLogs, addCardioLog, updateCardioLog, deleteCardioLog } = useFitnessStore();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], type: 'running', distance: '', duration: '', calories: '' });

  const handleSubmit = (e) => { e.preventDefault(); if (editId) updateCardioLog(editId, { ...form, distance: Number(form.distance), duration: Number(form.duration), calories: Number(form.calories) }); else addCardioLog({ ...form, distance: Number(form.distance), duration: Number(form.duration), calories: Number(form.calories) }); resetForm(); };
  const resetForm = () => { setForm({ date: new Date().toISOString().split('T')[0], type: 'running', distance: '', duration: '', calories: '' }); setEditId(null); setShowModal(false); };
  const startEdit = (c) => { setForm({ date: c.date, type: c.type, distance: c.distance, duration: c.duration, calories: c.calories || '' }); setEditId(c.id); setShowModal(true); };

  const typeColors = { running: '#ef4444', walking: '#10b981', cycling: '#f59e0b', swimming: '#3b82f6', sports: 'var(--accent-primary)' };

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">🏃🏻‍♂️ Cardio Log</span></h1>
        <p>Track distance, duration, and calories burned</p>
        <div className="header-actions"><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Log Cardio</button></div>
      </div>

      {cardioLogs.length === 0 ? (
        <div className="empty-state"><HeartPulse size={48} /><h3>No Cardio Logged</h3><p>Record your running, cycling, or other cardio sessions.</p><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Log Session</button></div>
      ) : (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead><tr><th>Date</th><th>Type</th><th>Distance (km)</th><th>Duration (min)</th><th>Calories</th><th>Pace</th><th>Actions</th></tr></thead>
            <tbody>
              {cardioLogs.sort((a,b) => new Date(b.date) - new Date(a.date)).map((c, i) => {
                const pace = c.distance > 0 ? (c.duration / c.distance).toFixed(2) : '—';
                return (
                  <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                    <td>{formatDateShort(c.date)}</td>
                    <td><span className="badge" style={{ background: `${typeColors[c.type]}15`, color: typeColors[c.type] }}>{c.type.toUpperCase()}</span></td>
                    <td style={{ fontWeight: 600 }}>{c.distance}</td>
                    <td>{c.duration}</td>
                    <td style={{ color: 'var(--accent-red)' }}>{c.calories || '—'}</td>
                    <td>{pace === '—' ? '—' : `${pace} min/km`}</td>
                    <td><div style={{ display: 'flex', gap: '0.25rem' }}><button className="btn-icon" onClick={() => startEdit(c)}><Edit3 size={15} /></button><button className="btn-icon" onClick={() => deleteCardioLog(c.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={15} /></button></div></td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showModal} onClose={resetForm} title={editId ? 'Edit Cardio' : 'Log Cardio'}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid cols-1">
            <div className="form-group"><label>Date *</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></div>
            <div className="form-group"><label>Type</label><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="running">Running</option><option value="walking">Walking</option><option value="cycling">Cycling</option><option value="swimming">Swimming</option><option value="sports">Sports / Other</option></select></div>
            <div className="form-group"><label>Distance (km) *</label><input type="number" step="0.1" value={form.distance} onChange={(e) => setForm({ ...form, distance: e.target.value })} required /></div>
            <div className="form-group"><label>Duration (mins) *</label><input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} required /></div>
            <div className="form-group"><label>Calories Burned (kcal)</label><input type="number" value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} /></div>
          </div>
          <div className="modal-actions"><button type="submit" className="btn-primary"><Check size={16} /> Save</button></div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
