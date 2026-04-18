import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, Trash2, Edit3, Check } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useCatStore } from '../../store/catStore';

export default function CatSections() {
  const { sections, addSection, updateSection, deleteSection } = useCatStore();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', category: 'VARC', topicsDone: 0, totalTopics: 0, accuracy: 0 });

  const handleSubmit = (e) => { e.preventDefault(); const data = { ...form, topicsDone: Number(form.topicsDone), totalTopics: Number(form.totalTopics), accuracy: Number(form.accuracy) }; if (editId) updateSection(editId, data); else addSection(data); resetForm(); };
  const resetForm = () => { setForm({ name: '', category: 'VARC', topicsDone: 0, totalTopics: 0, accuracy: 0 }); setEditId(null); setShowModal(false); };
  const startEdit = (s) => { setForm({ name: s.name, category: s.category || 'VARC', topicsDone: s.topicsDone, totalTopics: s.totalTopics, accuracy: s.accuracy }); setEditId(s.id); setShowModal(true); };

  const categoryColors = { VARC: '#ef4444', DILR: '#f59e0b', QA: '#10b981' };

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">🎯 CAT Sections</span></h1>
        <p>Track your completion and accuracy across VARC, DILR, and QA</p>
        <div className="header-actions"><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Topic</button></div>
      </div>

      {sections.length === 0 ? (
        <div className="empty-state"><Target size={48} /><h3>No Topics Yet</h3><p>Add syllabus topics to track your CAT preparation.</p><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Topic</button></div>
      ) : (
        <div className="grid-auto">
          {sections.map((section, i) => {
            const progress = section.totalTopics > 0 ? Math.round((section.topicsDone / section.totalTopics) * 100) : 0;
            return (
              <motion.div key={section.id} className="glass-card" style={{ padding: '1.25rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 'var(--font-md)' }}>{section.name}</div>
                    <span className="badge" style={{ background: `${categoryColors[section.category]}15`, color: categoryColors[section.category] }}>{section.category}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.2rem' }}>
                    <button className="btn-icon" onClick={() => startEdit(section)}><Edit3 size={14} /></button>
                    <button className="btn-icon" onClick={() => deleteSection(section.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={14} /></button>
                  </div>
                </div>
                <div className="progress-bar-container">
                  <motion.div className="progress-bar-fill" style={{ background: categoryColors[section.category] }} initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, delay: i * 0.1 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem', fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
                  <span>{section.topicsDone}/{section.totalTopics} done</span>
                  <span style={{ fontWeight: 600 }}>{section.accuracy}% Accuracy</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <Modal isOpen={showModal} onClose={resetForm} title={editId ? 'Edit Topic' : 'Add Topic'}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group"><label>Topic Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Reading Comprehension" /></div>
            <div className="form-group"><label>Category</label><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option value="VARC">VARC</option><option value="DILR">DILR</option><option value="QA">QA</option></select></div>
            <div className="form-group"><label>Sub-topics Done</label><input type="number" value={form.topicsDone} onChange={(e) => setForm({ ...form, topicsDone: e.target.value })} min="0" /></div>
            <div className="form-group"><label>Total Sub-topics</label><input type="number" value={form.totalTopics} onChange={(e) => setForm({ ...form, totalTopics: e.target.value })} min="1" /></div>
            <div className="form-group full-width"><label>Accuracy (%)</label><input type="range" min="0" max="100" value={form.accuracy} onChange={(e) => setForm({ ...form, accuracy: e.target.value })} style={{ border: 'none', padding: 0 }} /><div style={{ textAlign: 'right', fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>{form.accuracy}%</div></div>
          </div>
          <div className="modal-actions"><button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button><button type="submit" className="btn-primary"><Check size={16} /> {editId ? 'Update' : 'Add'}</button></div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
