import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Plus, Trash2, Edit3, Check, ExternalLink } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useGsocStore } from '../../store/gsocStore';

export default function GsocOrganizations() {
  const { organizations, addOrganization, updateOrganization, deleteOrganization } = useGsocStore();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', techStack: '', projectIdea: '', url: '', interest: 'medium', notes: '' });

  const handleSubmit = (e) => { e.preventDefault(); if (editId) updateOrganization(editId, form); else addOrganization(form); resetForm(); };
  const resetForm = () => { setForm({ name: '', techStack: '', projectIdea: '', url: '', interest: 'medium', notes: '' }); setEditId(null); setShowModal(false); };
  const startEdit = (o) => { setForm({ name: o.name, techStack: o.techStack || '', projectIdea: o.projectIdea || '', url: o.url || '', interest: o.interest || 'medium', notes: o.notes || '' }); setEditId(o.id); setShowModal(true); };

  const interestColors = { high: '#10b981', medium: '#f59e0b', low: '#6b6b80' };

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">🏢 Organizations</span></h1>
        <p>Research potential GSoC organizations and project ideas</p>
        <div className="header-actions"><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Organization</button></div>
      </div>

      {organizations.length === 0 ? (
        <div className="empty-state"><Building2 size={48} /><h3>No Organizations</h3><p>Add GSoC organizations you're interested in.</p><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Org</button></div>
      ) : (
        <div className="grid-auto">
          {organizations.map((org, i) => (
            <motion.div key={org.id} className="glass-card" style={{ padding: '1.25rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: 700, fontSize: 'var(--font-md)' }}>{org.name}</div>
                <div style={{ display: 'flex', gap: '0.2rem' }}>
                  {org.url && <a href={org.url} target="_blank" rel="noreferrer" className="btn-icon"><ExternalLink size={14} /></a>}
                  <button className="btn-icon" onClick={() => startEdit(org)}><Edit3 size={14} /></button>
                  <button className="btn-icon" onClick={() => deleteOrganization(org.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={14} /></button>
                </div>
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <span className="badge" style={{ background: `${interestColors[org.interest]}15`, color: interestColors[org.interest] }}>{org.interest} interest</span>
              </div>
              {org.techStack && <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginBottom: '0.3rem' }}>Tech: {org.techStack}</div>}
              {org.projectIdea && <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>💡 {org.projectIdea}</div>}
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={resetForm} title={editId ? 'Edit Organization' : 'Add Organization'}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group"><label>Organization Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Mozilla, Apache" /></div>
            <div className="form-group"><label>Interest Level</label><select value={form.interest} onChange={(e) => setForm({ ...form, interest: e.target.value })}><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></div>
            <div className="form-group full-width"><label>Tech Stack</label><input value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })} placeholder="Python, React, Rust..." /></div>
            <div className="form-group full-width"><label>Project Idea</label><textarea value={form.projectIdea} onChange={(e) => setForm({ ...form, projectIdea: e.target.value })} rows={2} placeholder="Potential project idea" /></div>
            <div className="form-group"><label>Website</label><input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." /></div>
          </div>
          <div className="modal-actions"><button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button><button type="submit" className="btn-primary"><Check size={16} /> {editId ? 'Update' : 'Add'}</button></div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
