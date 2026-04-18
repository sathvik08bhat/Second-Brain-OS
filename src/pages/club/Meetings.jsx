import { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Plus, Trash2, Edit3, Check } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useClubStore } from '../../store/clubStore';
import { formatDate } from '../../utils/helpers';

export default function Meetings() {
  const { meetings, addMeeting, updateMeeting, deleteMeeting } = useClubStore();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ date: '', type: 'general', agenda: '', notes: '', actionItems: '' });

  const handleSubmit = (e) => { e.preventDefault(); if (editId) updateMeeting(editId, form); else addMeeting(form); resetForm(); };
  const resetForm = () => { setForm({ date: '', type: 'general', agenda: '', notes: '', actionItems: '' }); setEditId(null); setShowModal(false); };
  const startEdit = (m) => { setForm({ date: m.date, type: m.type, agenda: m.agenda, notes: m.notes || '', actionItems: m.actionItems || '' }); setEditId(m.id); setShowModal(true); };

  const typeColors = { general: 'badge-blue', core: 'badge-purple', team: 'badge-green', emergency: 'badge-red' };

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">📝 Meeting Notes</span></h1>
        <p>Log society meetings, agendas, and action items</p>
        <div className="header-actions"><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Log Meeting</button></div>
      </div>

      {meetings.length === 0 ? (
        <div className="empty-state"><Video size={48} /><h3>No Meetings Logged</h3><p>Keep track of what was discussed.</p><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Log Meeting</button></div>
      ) : (
        <div className="grid-auto">
          {meetings.sort((a,b) => new Date(b.date) - new Date(a.date)).map((m, i) => (
            <motion.div key={m.id} className="glass-card" style={{ padding: '1.25rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--font-md)' }}>{formatDate(m.date)}</div>
                  <span className={`badge ${typeColors[m.type]}`}>{m.type.toUpperCase()}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.2rem' }}>
                  <button className="btn-icon" onClick={() => startEdit(m)}><Edit3 size={14} /></button>
                  <button className="btn-icon" onClick={() => deleteMeeting(m.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={14} /></button>
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Agenda</strong>
                <p style={{ fontSize: 'var(--font-sm)' }}>{m.agenda}</p>
              </div>
              {m.actionItems && (
                <div>
                  <strong style={{ fontSize: 'var(--font-xs)', color: 'var(--accent-purple-light)', textTransform: 'uppercase' }}>Action Items</strong>
                  <p style={{ fontSize: 'var(--font-sm)', whiteSpace: 'pre-wrap' }}>{m.actionItems}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={resetForm} title={editId ? 'Edit Meeting' : 'Log Meeting'} size="lg">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group"><label>Date *</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></div>
            <div className="form-group"><label>Type</label><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="general">General Meeting</option><option value="core">Core Team</option><option value="team">Sub-Team</option><option value="emergency">Emergency</option></select></div>
            <div className="form-group full-width"><label>Agenda *</label><input value={form.agenda} onChange={(e) => setForm({ ...form, agenda: e.target.value })} required placeholder="Main discussion topics" /></div>
            <div className="form-group full-width"><label>Detailed Notes</label><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={4} placeholder="Minutes of the meeting..." /></div>
            <div className="form-group full-width"><label>Action Items</label><textarea value={form.actionItems} onChange={(e) => setForm({ ...form, actionItems: e.target.value })} rows={3} placeholder="What needs to be done? Who will do it?" /></div>
          </div>
          <div className="modal-actions"><button type="submit" className="btn-primary"><Check size={16} /> Save</button></div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
