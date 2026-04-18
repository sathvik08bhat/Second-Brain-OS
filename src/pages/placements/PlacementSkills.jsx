import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, Trash2, Edit3, Check } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { usePlacementStore } from '../../store/placementStore';

export default function PlacementSkills() {
  const { skills, addSkill, updateSkill, deleteSkill } = usePlacementStore();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', category: 'framework', proficiency: 0, notes: '' });

  const handleSubmit = (e) => { e.preventDefault(); if (editId) updateSkill(editId, { ...form, proficiency: Number(form.proficiency) }); else addSkill({ ...form, proficiency: Number(form.proficiency) }); resetForm(); };
  const resetForm = () => { setForm({ name: '', category: 'framework', proficiency: 0, notes: '' }); setEditId(null); setShowModal(false); };
  const startEdit = (s) => { setForm({ name: s.name, category: s.category || 'framework', proficiency: s.proficiency, notes: s.notes || '' }); setEditId(s.id); setShowModal(true); };

  const categoryColors = { language: '#3b82f6', framework: '#8b5cf6', tool: '#f59e0b', concept: '#10b981' };

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">🎯 Skills</span></h1>
        <p>Track your technical skills and proficiency</p>
        <div className="header-actions"><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Skill</button></div>
      </div>

      {skills.length === 0 ? (
        <div className="empty-state"><Target size={48} /><h3>No Skills Tracked</h3><p>Start logging your tech stack.</p><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add First Skill</button></div>
      ) : (
        <div className="grid-auto">
          {skills.map((skill, i) => (
            <motion.div key={skill.id} className="glass-card" style={{ padding: '1.25rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--font-md)' }}>{skill.name}</div>
                  <span className="badge" style={{ background: `${categoryColors[skill.category]}15`, color: categoryColors[skill.category] }}>{skill.category}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.2rem' }}>
                  <button className="btn-icon" onClick={() => startEdit(skill)}><Edit3 size={14} /></button>
                  <button className="btn-icon" onClick={() => deleteSkill(skill.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="progress-bar-container">
                <motion.div className="progress-bar-fill" style={{ background: categoryColors[skill.category] }} initial={{ width: 0 }} animate={{ width: `${skill.proficiency}%` }} transition={{ duration: 1, delay: i * 0.1 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.4rem', fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
                <span style={{ fontWeight: 600 }}>{skill.proficiency}% Proficiency</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={resetForm} title={editId ? 'Edit Skill' : 'Add Skill'}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group"><label>Skill Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. PyTorch, Pandas" /></div>
            <div className="form-group"><label>Category</label><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option value="language">Language</option><option value="framework">Framework</option><option value="tool">Tool</option><option value="concept">Concept</option></select></div>
            <div className="form-group full-width"><label>Proficiency ({form.proficiency}%)</label><input type="range" min="0" max="100" value={form.proficiency} onChange={(e) => setForm({ ...form, proficiency: e.target.value })} style={{ border: 'none', padding: 0 }} /></div>
            <div className="form-group full-width"><label>Notes</label><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Experience, projects used in..." /></div>
          </div>
          <div className="modal-actions"><button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button><button type="submit" className="btn-primary"><Check size={16} /> {editId ? 'Update' : 'Add'}</button></div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
