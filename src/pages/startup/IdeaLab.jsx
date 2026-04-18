import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Plus, Trash2, Edit3, Check } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useStartupStore } from '../../store/startupStore';

export default function IdeaLab() {
  const { ideas, addIdea, updateIdea, deleteIdea } = useStartupStore();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', validationScore: 0, status: 'brainstorm' });

  const handleSubmit = (e) => { e.preventDefault(); if (editId) updateIdea(editId, { ...form, validationScore: Number(form.validationScore) }); else addIdea({ ...form, validationScore: Number(form.validationScore) }); resetForm(); };
  const resetForm = () => { setForm({ title: '', description: '', validationScore: 0, status: 'brainstorm' }); setEditId(null); setShowModal(false); };
  const startEdit = (i) => { setForm({ title: i.title, description: i.description, validationScore: i.validationScore, status: i.status }); setEditId(i.id); setShowModal(true); };

  const statusColors = { brainstorm: 'badge-purple', validating: 'badge-yellow', building: 'badge-blue', launched: 'badge-green', discarded: 'badge-red' };

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">💡 Idea Lab</span></h1>
        <p>Brainstorm, validate, and track startup ideas</p>
        <div className="header-actions"><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> New Idea</button></div>
      </div>

      {ideas.length === 0 ? (
        <div className="empty-state"><Lightbulb size={48} /><h3>No Ideas</h3><p>Start brainstorming and tracking potential startup ideas.</p><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Idea</button></div>
      ) : (
        <div className="grid-auto">
          {ideas.map((idea, i) => (
            <motion.div key={idea.id} className="glass-card" style={{ padding: '1.25rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: 700, fontSize: 'var(--font-md)' }}>{idea.title}</div>
                <div style={{ display: 'flex', gap: '0.2rem' }}>
                  <button className="btn-icon" onClick={() => startEdit(idea)}><Edit3 size={14} /></button>
                  <button className="btn-icon" onClick={() => deleteIdea(idea.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={14} /></button>
                </div>
              </div>
              <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: '1rem', minHeight: '3rem' }}>{idea.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`badge ${statusColors[idea.status]}`}>{idea.status.toUpperCase()}</span>
                <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Val: {idea.validationScore}/10</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={resetForm} title={editId ? 'Edit Idea' : 'Add Idea'}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full-width"><label>Idea Title *</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="e.g. AI Content Generator" /></div>
            <div className="form-group full-width"><label>Description *</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} placeholder="What problem does it solve?" /></div>
            <div className="form-group"><label>Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="brainstorm">Brainstorming</option><option value="validating">Validating</option><option value="building">Building</option><option value="launched">Launched</option><option value="discarded">Discarded</option></select></div>
            <div className="form-group"><label>Validation Score (0-10)</label><input type="number" min="0" max="10" value={form.validationScore} onChange={(e) => setForm({ ...form, validationScore: e.target.value })} /></div>
          </div>
          <div className="modal-actions"><button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button><button type="submit" className="btn-primary"><Check size={16} /> {editId ? 'Update' : 'Add'}</button></div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
