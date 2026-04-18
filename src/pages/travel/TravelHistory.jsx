import { useState } from 'react';
import { motion } from 'framer-motion';
import { History, Plus, Trash2, Edit3, Check } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useTravelStore } from '../../store/travelStore';
import { formatDateShort } from '../../utils/helpers';

export default function TravelHistory() {
  const { log, addTravelLog, updateTravelLog, deleteTravelLog } = useTravelStore();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ location: '', date: '', rating: 5, highlight: '', memories: '' });

  const handleSubmit = (e) => { e.preventDefault(); if (editId) updateTravelLog(editId, { ...form, rating: Number(form.rating) }); else addTravelLog({ ...form, rating: Number(form.rating) }); resetForm(); };
  const resetForm = () => { setForm({ location: '', date: '', rating: 5, highlight: '', memories: '' }); setEditId(null); setShowModal(false); };
  const startEdit = (l) => { setForm({ location: l.location, date: l.date, rating: l.rating || 5, highlight: l.highlight || '', memories: l.memories || '' }); setEditId(l.id); setShowModal(true); };

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">📸 Travel Log</span></h1>
        <p>Record your past travels, memories, and ratings</p>
        <div className="header-actions"><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Log Trip</button></div>
      </div>

      {log.length === 0 ? (
        <div className="empty-state"><History size={48} /><h3>No Travels Logged</h3><p>Record the places you've been to.</p><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Log Past Trip</button></div>
      ) : (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead><tr><th>Date</th><th>Location</th><th>Highlight</th><th>Rating</th><th>Actions</th></tr></thead>
            <tbody>
              {log.sort((a,b) => new Date(b.date) - new Date(a.date)).map((t, i) => (
                <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                  <td>{formatDateShort(t.date)}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.location}</td>
                  <td>{t.highlight || '—'}</td>
                  <td style={{ color: 'var(--accent-yellow)', fontSize: '1.2rem' }}>{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</td>
                  <td><div style={{ display: 'flex', gap: '0.25rem' }}><button className="btn-icon" onClick={() => startEdit(t)}><Edit3 size={15} /></button><button className="btn-icon" onClick={() => deleteTravelLog(t.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={15} /></button></div></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showModal} onClose={resetForm} title={editId ? 'Edit Travel Log' : 'Log Past Travel'}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid cols-1">
            <div className="form-group"><label>Location *</label><input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required /></div>
            <div className="form-group"><label>Date (Approximate)</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
            <div className="form-group"><label>Rating (1-5)</label><input type="range" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} style={{ padding: 0, border: 'none' }} /> <div style={{ textAlign: 'center', marginTop: '0.5rem', color: 'var(--accent-yellow)', fontSize: '1.5rem' }}>{'★'.repeat(form.rating)}{'☆'.repeat(5 - form.rating)}</div></div>
            <div className="form-group"><label>Highlight / Best Moment</label><input value={form.highlight} onChange={(e) => setForm({ ...form, highlight: e.target.value })} /></div>
            <div className="form-group"><label>Memories & Notes</label><textarea value={form.memories} onChange={(e) => setForm({ ...form, memories: e.target.value })} rows={3} /></div>
          </div>
          <div className="modal-actions"><button type="submit" className="btn-primary"><Check size={16} /> Save</button></div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
