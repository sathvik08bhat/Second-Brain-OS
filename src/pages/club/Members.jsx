import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Trash2, Edit3, Check } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useClubStore } from '../../store/clubStore';

export default function Members() {
  const { members, addMember, updateMember, deleteMember } = useClubStore();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', role: 'Member', team: 'Technical', contact: '', status: 'active' });

  const handleSubmit = (e) => { e.preventDefault(); if (editId) updateMember(editId, form); else addMember(form); resetForm(); };
  const resetForm = () => { setForm({ name: '', role: 'Member', team: 'Technical', contact: '', status: 'active' }); setEditId(null); setShowModal(false); };
  const startEdit = (m) => { setForm({ name: m.name, role: m.role || 'Member', team: m.team || 'None', contact: m.contact || '', status: m.status }); setEditId(m.id); setShowModal(true); };

  const teamColors = { Technical: '#3b82f6', Design: '#ec4899', Management: '#f59e0b', PR: '#10b981', Overall: '#8b5cf6' };

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">👥 Member Directory</span></h1>
        <p>Manage tech society members, roles, and contacts</p>
        <div className="header-actions"><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Member</button></div>
      </div>

      {members.length === 0 ? (
        <div className="empty-state"><Users size={48} /><h3>No Members</h3><p>Build your society roster.</p><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add First Member</button></div>
      ) : (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead><tr><th>Name</th><th>Role</th><th>Team</th><th>Contact</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {members.map((m, i) => (
                <motion.tr key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{m.name}</td>
                  <td>{m.role}</td>
                  <td><span className="badge" style={{ background: `${teamColors[m.team] || '#6b6b80'}15`, color: teamColors[m.team] || '#6b6b80' }}>{m.team}</span></td>
                  <td>{m.contact || '—'}</td>
                  <td><span className={`badge ${m.status === 'active' ? 'badge-green' : 'badge-red'}`}>{m.status}</span></td>
                  <td><div style={{ display: 'flex', gap: '0.25rem' }}><button className="btn-icon" onClick={() => startEdit(m)}><Edit3 size={15} /></button><button className="btn-icon" onClick={() => deleteMember(m.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={15} /></button></div></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showModal} onClose={resetForm} title={editId ? 'Edit Member' : 'Add Member'}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full-width"><label>Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div className="form-group"><label>Role</label><input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Lead, Coordinator" /></div>
            <div className="form-group"><label>Team</label><select value={form.team} onChange={(e) => setForm({ ...form, team: e.target.value })}><option value="Technical">Technical</option><option value="Design">Design</option><option value="Management">Management</option><option value="PR">PR/Outreach</option><option value="Overall">Overall</option></select></div>
            <div className="form-group"><label>Contact</label><input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="Phone/Email" /></div>
            <div className="form-group"><label>Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
          </div>
          <div className="modal-actions"><button type="submit" className="btn-primary"><Check size={16} /> Save</button></div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
