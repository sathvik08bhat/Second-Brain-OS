import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building, Plus, Trash2, Edit3, Check, ExternalLink } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { usePlacementStore } from '../../store/placementStore';
import { formatDate, daysUntil } from '../../utils/helpers';

export default function Companies() {
  const { companies, addCompany, updateCompany, deleteCompany } = usePlacementStore();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', role: '', package: '', deadline: '', status: 'watching', url: '', notes: '' });

  const handleSubmit = (e) => { e.preventDefault(); if (editId) updateCompany(editId, form); else addCompany(form); resetForm(); };
  const resetForm = () => { setForm({ name: '', role: '', package: '', deadline: '', status: 'watching', url: '', notes: '' }); setEditId(null); setShowModal(false); };
  const startEdit = (c) => { setForm({ name: c.name, role: c.role || '', package: c.package || '', deadline: c.deadline || '', status: c.status, url: c.url || '', notes: c.notes || '' }); setEditId(c.id); setShowModal(true); };

  const statusColors = { watching: 'badge-purple', applied: 'badge-blue', interviewing: 'badge-yellow', offered: 'badge-green', rejected: 'badge-red' };

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">🏢 Target Companies</span></h1>
        <p>Track companies, roles, and application statuses</p>
        <div className="header-actions"><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Company</button></div>
      </div>

      {companies.length === 0 ? (
        <div className="empty-state"><Building size={48} /><h3>No Companies Tracker</h3><p>Add companies you want to apply for.</p><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Target</button></div>
      ) : (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead><tr><th>Company</th><th>Role</th><th>Package</th><th>Deadline</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {companies.map((c, i) => {
                const days = daysUntil(c.deadline);
                return (
                  <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.name} {c.url && <a href={c.url} target="_blank" rel="noreferrer"><ExternalLink size={12} /></a>}</td>
                    <td>{c.role || '—'}</td>
                    <td>{c.package ? `₹${c.package}` : '—'}</td>
                    <td>{c.deadline ? (days < 0 ? <span style={{ color: 'var(--accent-red)' }}>Passed</span> : `${days}d`) : '—'}</td>
                    <td>
                      <select value={c.status} onChange={(e) => updateCompany(c.id, { status: e.target.value })} style={{ width: 'auto', padding: '0.2rem 0.5rem', fontSize: 'var(--font-xs)', background: 'var(--bg-card)' }}>
                        <option value="watching">Watching</option><option value="applied">Applied</option><option value="interviewing">Interviewing</option><option value="offered">Offered</option><option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td><div style={{ display: 'flex', gap: '0.25rem' }}><button className="btn-icon" onClick={() => startEdit(c)}><Edit3 size={15} /></button><button className="btn-icon" onClick={() => deleteCompany(c.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={15} /></button></div></td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showModal} onClose={resetForm} title={editId ? 'Edit Company' : 'Add Company'}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group"><label>Company Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Google, Microsoft" /></div>
            <div className="form-group"><label>Role</label><input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. SDE, ML Engineer" /></div>
            <div className="form-group"><label>Package (LPA)</label><input type="number" step="0.1" value={form.package} onChange={(e) => setForm({ ...form, package: e.target.value })} placeholder="e.g. 25" /></div>
            <div className="form-group"><label>Deadline</label><input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></div>
            <div className="form-group"><label>Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="watching">Watching</option><option value="applied">Applied</option><option value="interviewing">Interviewing</option><option value="offered">Offered</option><option value="rejected">Rejected</option></select></div>
            <div className="form-group"><label>Careers URL</label><input type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." /></div>
            <div className="form-group full-width"><label>Notes</label><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Recruiter contacts, specific requirements..." /></div>
          </div>
          <div className="modal-actions"><button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button><button type="submit" className="btn-primary"><Check size={16} /> {editId ? 'Update' : 'Add'}</button></div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
