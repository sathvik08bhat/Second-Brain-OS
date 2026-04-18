import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Trash2, Edit3, Check, ExternalLink } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useCatStore } from '../../store/catStore';

export default function CatResources() {
  const { resources, addResource, updateResource, deleteResource } = useCatStore();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', type: 'book', link: '', status: 'todo' });

  const handleSubmit = (e) => { e.preventDefault(); if (editId) updateResource(editId, form); else addResource(form); resetForm(); };
  const resetForm = () => { setForm({ title: '', type: 'book', link: '', status: 'todo' }); setEditId(null); setShowModal(false); };
  const startEdit = (r) => { setForm({ title: r.title, type: r.type, link: r.link || '', status: r.status }); setEditId(r.id); setShowModal(true); };

  const typeColors = { book: '#8b5cf6', course: '#06b6d4', youtube: '#ef4444', website: '#10b981' };
  const statusColors = { todo: 'badge-red', inProgress: 'badge-yellow', done: 'badge-green' };

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">📚 Study Resources</span></h1>
        <p>Books, courses, and materials for your CAT preparation</p>
        <div className="header-actions"><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Resource</button></div>
      </div>

      {resources.length === 0 ? (
        <div className="empty-state"><BookOpen size={48} /><h3>No Resources</h3><p>Build your library of CAT preparation materials.</p><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Material</button></div>
      ) : (
        <div className="grid-auto">
          {resources.map((res, i) => (
            <motion.div key={res.id} className="glass-card" style={{ padding: '1.25rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: 700, fontSize: 'var(--font-md)' }}>{res.title}</div>
                <div style={{ display: 'flex', gap: '0.2rem' }}>
                  {res.link && <a href={res.link} target="_blank" rel="noreferrer" className="btn-icon"><ExternalLink size={14} /></a>}
                  <button className="btn-icon" onClick={() => startEdit(res)}><Edit3 size={14} /></button>
                  <button className="btn-icon" onClick={() => deleteResource(res.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={14} /></button>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge" style={{ background: `${typeColors[res.type]}15`, color: typeColors[res.type] }}>{res.type.toUpperCase()}</span>
                <span className={`badge ${statusColors[res.status]}`}>{res.status.replace(/([A-Z])/g, ' $1').trim()}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={resetForm} title={editId ? 'Edit Resource' : 'Add Resource'}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full-width"><label>Title *</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="e.g. Arun Sharma QA" /></div>
            <div className="form-group"><label>Type</label><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="book">Book</option><option value="course">Course</option><option value="youtube">YouTube</option><option value="website">Website</option></select></div>
            <div className="form-group"><label>Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="todo">To Do</option><option value="inProgress">In Progress</option><option value="done">Done</option></select></div>
            <div className="form-group full-width"><label>URL Link</label><input type="url" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://..." /></div>
          </div>
          <div className="modal-actions"><button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button><button type="submit" className="btn-primary"><Check size={16} /> {editId ? 'Update' : 'Add'}</button></div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
