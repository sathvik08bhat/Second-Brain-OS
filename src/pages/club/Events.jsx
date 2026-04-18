import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Trash2, Edit3, Check } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useClubStore } from '../../store/clubStore';
import { formatDate } from '../../utils/helpers';

export default function Events() {
  const { events, addEvent, updateEvent, deleteEvent } = useClubStore();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', date: '', venue: '', budget: '', status: 'planned', description: '' });

  const handleSubmit = (e) => { e.preventDefault(); if (editId) updateEvent(editId, { ...form, budget: Number(form.budget) }); else addEvent({ ...form, budget: Number(form.budget) }); resetForm(); };
  const resetForm = () => { setForm({ title: '', date: '', venue: '', budget: '', status: 'planned', description: '' }); setEditId(null); setShowModal(false); };
  const startEdit = (ev) => { setForm({ title: ev.title, date: ev.date, venue: ev.venue || '', budget: ev.budget || '', status: ev.status, description: ev.description || '' }); setEditId(ev.id); setShowModal(true); };

  const statusColors = { planned: 'badge-yellow', ongoing: 'badge-blue', completed: 'badge-green', cancelled: 'badge-red' };

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">📅 Event Planner</span></h1>
        <p>Manage tech society workshops, fests, and hackathons</p>
        <div className="header-actions"><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Plan Event</button></div>
      </div>

      {events.length === 0 ? (
        <div className="empty-state"><Calendar size={48} /><h3>No Events Planned</h3><p>Start planning your society events.</p><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Event</button></div>
      ) : (
        <div className="grid-auto">
          {events.sort((a,b) => new Date(a.date) - new Date(b.date)).map((ev, i) => (
            <motion.div key={ev.id} className="glass-card" style={{ padding: '1.25rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: 700, fontSize: 'var(--font-md)' }}>{ev.title}</div>
                <div style={{ display: 'flex', gap: '0.2rem' }}>
                  <button className="btn-icon" onClick={() => startEdit(ev)}><Edit3 size={14} /></button>
                  <button className="btn-icon" onClick={() => deleteEvent(ev.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={14} /></button>
                </div>
              </div>
              <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{formatDate(ev.date)} • {ev.venue || 'TBA'}</div>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginBottom: '1rem', minHeight: '2rem' }}>{ev.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`badge ${statusColors[ev.status]}`}>{ev.status.toUpperCase()}</span>
                {ev.budget > 0 && <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--accent-purple-light)' }}>₹{ev.budget}</span>}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={resetForm} title={editId ? 'Edit Event' : 'Plan Event'}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full-width"><label>Event Title *</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
            <div className="form-group"><label>Date *</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></div>
            <div className="form-group"><label>Venue</label><input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} /></div>
            <div className="form-group"><label>Estimated Budget (₹)</label><input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} min="0" /></div>
            <div className="form-group"><label>Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="planned">Planned</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></div>
            <div className="form-group full-width"><label>Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
          </div>
          <div className="modal-actions"><button type="submit" className="btn-primary"><Check size={16} /> Save</button></div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
