import { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Plus, Trash2, Edit3, Check, ExternalLink } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { usePlacementStore } from '../../store/placementStore';

export default function DsaTracker() {
  const { dsaProblems, addDsaProblem, updateDsaProblem, deleteDsaProblem } = usePlacementStore();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', link: '', difficulty: 'medium', topic: 'Arrays', status: 'unsolved', pattern: '' });

  const handleSubmit = (e) => { e.preventDefault(); if (editId) updateDsaProblem(editId, form); else addDsaProblem(form); resetForm(); };
  const resetForm = () => { setForm({ title: '', link: '', difficulty: 'medium', topic: 'Arrays', status: 'unsolved', pattern: '' }); setEditId(null); setShowModal(false); };
  const startEdit = (p) => { setForm({ title: p.title, link: p.link || '', difficulty: p.difficulty, topic: p.topic, status: p.status, pattern: p.pattern || '' }); setEditId(p.id); setShowModal(true); };

  const diffColors = { easy: '#10b981', medium: '#f59e0b', hard: '#ef4444' };
  const statusColors = { unsolved: 'badge-red', attempting: 'badge-yellow', solved: 'badge-green', needsRevision: 'badge-blue' };

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">💻 DSA Tracker</span></h1>
        <p>Track LeetCode problems, patterns, and topics</p>
        <div className="header-actions"><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Problem</button></div>
      </div>

      {dsaProblems.length === 0 ? (
        <div className="empty-state"><Code2 size={48} /><h3>No Problems</h3><p>Start logging your DSA practice.</p><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add First Problem</button></div>
      ) : (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead><tr><th>Problem</th><th>Topic</th><th>Pattern</th><th>Difficulty</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {dsaProblems.map((p, i) => (
                <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.title} {p.link && <a href={p.link} target="_blank" rel="noreferrer"><ExternalLink size={12} /></a>}</td>
                  <td>{p.topic}</td>
                  <td>{p.pattern || '—'}</td>
                  <td><span className="badge" style={{ background: `${diffColors[p.difficulty]}15`, color: diffColors[p.difficulty] }}>{p.difficulty.toUpperCase()}</span></td>
                  <td>
                    <select value={p.status} onChange={(e) => updateDsaProblem(p.id, { status: e.target.value })} style={{ width: 'auto', padding: '0.2rem 0.5rem', fontSize: 'var(--font-xs)' }}>
                      <option value="unsolved">Unsolved</option>
                      <option value="attempting">Attempting</option>
                      <option value="solved">Solved</option>
                      <option value="needsRevision">Needs Revision</option>
                    </select>
                  </td>
                  <td><div style={{ display: 'flex', gap: '0.25rem' }}><button className="btn-icon" onClick={() => startEdit(p)}><Edit3 size={15} /></button><button className="btn-icon" onClick={() => deleteDsaProblem(p.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={15} /></button></div></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showModal} onClose={resetForm} title={editId ? 'Edit Problem' : 'Add Problem'}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full-width"><label>Problem Title *</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="e.g. Two Sum" /></div>
            <div className="form-group"><label>Topic</label><input value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} placeholder="e.g. Arrays, Trees" /></div>
            <div className="form-group"><label>Pattern</label><input value={form.pattern} onChange={(e) => setForm({ ...form, pattern: e.target.value })} placeholder="e.g. Sliding Window" /></div>
            <div className="form-group"><label>Difficulty</label><select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></div>
            <div className="form-group"><label>Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="unsolved">Unsolved</option><option value="attempting">Attempting</option><option value="solved">Solved</option><option value="needsRevision">Needs Revision</option></select></div>
            <div className="form-group full-width"><label>URL</label><input type="url" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="Link to problem" /></div>
          </div>
          <div className="modal-actions"><button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button><button type="submit" className="btn-primary"><Check size={16} /> {editId ? 'Update' : 'Add'}</button></div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
