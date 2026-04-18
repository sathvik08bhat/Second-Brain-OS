import { useState } from 'react';
import { motion } from 'framer-motion';
import { GitPullRequest, Plus, Trash2, Edit3, Check, ExternalLink } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useGsocStore } from '../../store/gsocStore';
import { formatDate } from '../../utils/helpers';

export default function GsocContributions() {
  const { contributions, addContribution, updateContribution, deleteContribution } = useGsocStore();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ repo: '', type: 'pr', title: '', url: '', status: 'open', date: '', notes: '' });

  const handleSubmit = (e) => { e.preventDefault(); if (editId) updateContribution(editId, form); else addContribution(form); resetForm(); };
  const resetForm = () => { setForm({ repo: '', type: 'pr', title: '', url: '', status: 'open', date: '', notes: '' }); setEditId(null); setShowModal(false); };
  const startEdit = (c) => { setForm({ repo: c.repo, type: c.type, title: c.title, url: c.url || '', status: c.status, date: c.date || '', notes: c.notes || '' }); setEditId(c.id); setShowModal(true); };

  const typeColors = { pr: '#10b981', issue: '#f59e0b', commit: '#3b82f6', review: '#8b5cf6' };
  const statusColors = { open: 'badge-yellow', merged: 'badge-green', closed: 'badge-red' };

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">🔀 Contributions</span></h1>
        <p>Track your open source contributions — PRs, issues, commits</p>
        <div className="header-actions"><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Contribution</button></div>
      </div>

      {contributions.length === 0 ? (
        <div className="empty-state"><GitPullRequest size={48} /><h3>No Contributions Yet</h3><p>Start contributing to open source repos and track them here.</p><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add First</button></div>
      ) : (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead><tr><th>Repository</th><th>Type</th><th>Title</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {contributions.map((c, i) => (
                <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.repo}</td>
                  <td><span className="badge" style={{ background: `${typeColors[c.type]}15`, color: typeColors[c.type] }}>{c.type.toUpperCase()}</span></td>
                  <td>{c.title} {c.url && <a href={c.url} target="_blank" rel="noreferrer"><ExternalLink size={12} /></a>}</td>
                  <td><span className={`badge ${statusColors[c.status]}`}>{c.status}</span></td>
                  <td>{formatDate(c.date)}</td>
                  <td><div style={{ display: 'flex', gap: '0.25rem' }}><button className="btn-icon" onClick={() => startEdit(c)}><Edit3 size={15} /></button><button className="btn-icon" onClick={() => deleteContribution(c.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={15} /></button></div></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showModal} onClose={resetForm} title={editId ? 'Edit Contribution' : 'Add Contribution'}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group"><label>Repository *</label><input value={form.repo} onChange={(e) => setForm({ ...form, repo: e.target.value })} required placeholder="e.g. org/repo" /></div>
            <div className="form-group"><label>Type</label><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="pr">Pull Request</option><option value="issue">Issue</option><option value="commit">Commit</option><option value="review">Review</option></select></div>
            <div className="form-group full-width"><label>Title *</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="What did you contribute?" /></div>
            <div className="form-group"><label>URL</label><input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="Link to PR/issue" /></div>
            <div className="form-group"><label>Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="open">Open</option><option value="merged">Merged</option><option value="closed">Closed</option></select></div>
            <div className="form-group"><label>Date</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
          </div>
          <div className="modal-actions"><button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button><button type="submit" className="btn-primary"><Check size={16} /> {editId ? 'Update' : 'Add'}</button></div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
