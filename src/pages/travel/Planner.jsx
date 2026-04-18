import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, Plus, Trash2, Edit3, Check } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useTravelStore } from '../../store/travelStore';
import { formatDateShort } from '../../utils/helpers';

export default function Planner() {
  const { trips, addTrip, updateTrip, deleteTrip } = useTravelStore();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ destination: '', startDate: '', endDate: '', budget: '', status: 'planning', notes: '', members: '' });

  const activeTrips = trips.filter(t => t.status !== 'completed');

  const handleSubmit = (e) => { e.preventDefault(); if (editId) updateTrip(editId, { ...form, budget: Number(form.budget) }); else addTrip({ ...form, budget: Number(form.budget) }); resetForm(); };
  const resetForm = () => { setForm({ destination: '', startDate: '', endDate: '', budget: '', status: 'planning', notes: '', members: '' }); setEditId(null); setShowModal(false); };
  const startEdit = (t) => { setForm({ destination: t.destination, startDate: t.startDate, endDate: t.endDate, budget: t.budget || '', status: t.status, notes: t.notes || '', members: t.members || '' }); setEditId(t.id); setShowModal(true); };

  const statusColors = { planning: 'badge-yellow', booked: 'badge-blue', ongoing: 'badge-purple' };

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">🗺️ Trip Planner</span></h1>
        <p>Organize upcoming travels and itineraries</p>
        <div className="header-actions"><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Plan Trip</button></div>
      </div>

      {activeTrips.length === 0 ? (
        <div className="empty-state"><Plane size={48} /><h3>No Trips Planned</h3><p>Where to next?</p><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Plan Journey</button></div>
      ) : (
        <div className="grid-auto">
          {activeTrips.map((t, i) => (
            <motion.div key={t.id} className="glass-card" style={{ padding: '1.25rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ fontWeight: 700, fontSize: 'var(--font-lg)' }}>{t.destination}</div>
                <div style={{ display: 'flex', gap: '0.2rem' }}>
                  <button className="btn-icon" onClick={() => startEdit(t)}><Edit3 size={14} /></button>
                  <button className="btn-icon" onClick={() => deleteTrip(t.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={14} /></button>
                </div>
              </div>
              <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{formatDateShort(t.startDate)} — {formatDateShort(t.endDate)}</div>
              {t.members && <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>With: {t.members}</div>}
              <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: '1rem', flex: 1 }}>{t.notes}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`badge ${statusColors[t.status]}`}>{t.status.toUpperCase()}</span>
                {t.budget > 0 && <span style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>Est. ₹{t.budget}</span>}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={resetForm} title={editId ? 'Edit Trip' : 'Plan Trip'}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid cols-1">
            <div className="form-group"><label>Destination *</label><input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} required /></div>
            <div style={{ display: 'flex', gap: '1rem' }}><div className="form-group" style={{ flex: 1 }}><label>Start Date *</label><input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required /></div><div className="form-group" style={{ flex: 1 }}><label>End Date *</label><input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required /></div></div>
            <div className="form-group"><label>Companions</label><input value={form.members} onChange={(e) => setForm({ ...form, members: e.target.value })} placeholder="e.g. Friends, Family" /></div>
            <div className="form-group"><label>Budget (₹)</label><input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} /></div>
            <div className="form-group"><label>Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="planning">Planning</option><option value="booked">Booked</option><option value="ongoing">Ongoing</option><option value="completed">Completed (Move to History)</option></select></div>
            <div className="form-group"><label>Itinerary / Notes</label><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} /></div>
          </div>
          <div className="modal-actions"><button type="submit" className="btn-primary"><Check size={16} /> Save</button></div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
