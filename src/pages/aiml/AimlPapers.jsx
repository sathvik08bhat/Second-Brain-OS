import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Trash2, Edit3, Check, ExternalLink } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useAimlStore } from '../../store/aimlStore';

const statusColors = { 'to-read': '#64748b', reading: '#f59e0b', read: '#10b981' };
const statusLabels = { 'to-read': '📖 To Read', reading: '📗 Reading', read: '✅ Read' };

export default function AimlPapers() {
  const { papers, addPaper, updatePaper, deletePaper } = useAimlStore();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ title: '', authors: '', url: '', readStatus: 'to-read', notes: '', tags: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
    if (editId) updatePaper(editId, data);
    else addPaper(data);
    resetForm();
  };

  const resetForm = () => { setForm({ title: '', authors: '', url: '', readStatus: 'to-read', notes: '', tags: '' }); setEditId(null); setShowModal(false); };

  const startEdit = (p) => {
    setForm({ title: p.title, authors: p.authors || '', url: p.url || '', readStatus: p.readStatus, notes: p.notes || '', tags: (p.tags || []).join(', ') });
    setEditId(p.id);
    setShowModal(true);
  };

  const filtered = papers.filter(p => filter === 'all' || p.readStatus === filter);

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">📄 Research Papers</span></h1>
        <p>Track papers you've read and want to read</p>
        <div className="header-actions">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ width: 130 }}>
            <option value="all">All Papers</option>
            {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Paper</button>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}>
        {Object.entries(statusLabels).map(([key, label]) => {
          const count = papers.filter(p => p.readStatus === key).length;
          return (
            <div key={key} style={{
              flex: '1 1 100px', padding: '0.6rem', textAlign: 'center',
              background: `${statusColors[key]}10`, border: `2px solid ${statusColors[key]}30`,
              borderRadius: 'var(--radius-md)',
            }}>
              <div style={{ fontSize: 'var(--font-lg)', fontWeight: 800, color: statusColors[key] }}>{count}</div>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>{label}</div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><FileText size={48} /><h3>No Papers</h3><p>Start building your reading list.</p><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Paper</button></div>
      ) : (
        <motion.div className="glass-card" style={{ overflow: 'hidden' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {filtered.map((paper) => (
            <div key={paper.id} style={{ borderBottom: '1px solid var(--border-primary)', padding: '1rem 1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 'var(--font-sm)', marginBottom: '0.2rem', color: 'var(--text-primary)' }}>{paper.title}</div>
                  {paper.authors && <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginBottom: '0.4rem' }}>{paper.authors}</div>}
                  <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span className="badge" style={{ background: `${statusColors[paper.readStatus]}15`, color: statusColors[paper.readStatus] }}>{statusLabels[paper.readStatus]}</span>
                    {(paper.tags || []).map((tag, idx) => <span key={idx} className="chip">{tag}</span>)}
                  </div>
                  {paper.notes && <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginTop: '0.4rem', lineHeight: 1.5 }}>{paper.notes}</div>}
                </div>
                <div style={{ display: 'flex', gap: '0.2rem', flexShrink: 0 }}>
                  <select
                    value={paper.readStatus}
                    onChange={(e) => updatePaper(paper.id, { readStatus: e.target.value })}
                    style={{ width: 110, fontSize: 'var(--font-xs)', padding: '0.2rem', boxShadow: 'none' }}
                  >
                    {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                  {paper.url && <a href={paper.url} target="_blank" rel="noreferrer" className="btn-icon"><ExternalLink size={14} /></a>}
                  <button className="btn-icon" onClick={() => startEdit(paper)}><Edit3 size={14} /></button>
                  <button className="btn-icon" onClick={() => deletePaper(paper.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      <Modal isOpen={showModal} onClose={resetForm} title={editId ? 'Edit Paper' : 'Add Paper'}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full-width"><label>Paper Title *</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="e.g. Attention Is All You Need" /></div>
            <div className="form-group"><label>Authors</label><input value={form.authors} onChange={(e) => setForm({ ...form, authors: e.target.value })} placeholder="Vaswani et al." /></div>
            <div className="form-group"><label>URL (arXiv, etc.)</label><input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://arxiv.org/..." /></div>
            <div className="form-group"><label>Read Status</label>
              <select value={form.readStatus} onChange={(e) => setForm({ ...form, readStatus: e.target.value })}>
                {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Tags (comma separated)</label><input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="NLP, Transformer, Attention" /></div>
            <div className="form-group full-width"><label>Notes / Summary</label><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} placeholder="Key insights, questions, takeaways..." /></div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>
            <button type="submit" className="btn-primary"><Check size={16} /> {editId ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
