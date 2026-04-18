import { useState } from 'react';
import { motion } from 'framer-motion';
import { Film, Plus, Trash2, Edit3, Check, ExternalLink } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useHobbiesStore } from '../../store/hobbiesStore';

export default function VideoEditing() {
  const { videos, addVideo, updateVideo, deleteVideo } = useHobbiesStore();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', software: 'premiere', status: 'concept', link: '', notes: '' });

  const handleSubmit = (e) => { e.preventDefault(); if (editId) updateVideo(editId, form); else addVideo(form); resetForm(); };
  const resetForm = () => { setForm({ title: '', software: 'premiere', status: 'concept', link: '', notes: '' }); setEditId(null); setShowModal(false); };
  const startEdit = (v) => { setForm({ title: v.title, software: v.software, status: v.status, link: v.link || '', notes: v.notes || '' }); setEditId(v.id); setShowModal(true); };

  const statusColors = { concept: 'badge-purple', editing: 'badge-yellow', rending: 'badge-blue', completed: 'badge-green', published: 'badge-red' };

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">🎬 Video Editing</span></h1>
        <p>Track your video projects and editing pipeline</p>
        <div className="header-actions"><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Project</button></div>
      </div>

      {videos.length === 0 ? (
        <div className="empty-state"><Film size={48} /><h3>No Projects</h3><p>Keep track of your edits, from concept to published.</p></div>
      ) : (
        <div className="grid-auto">
          {videos.map((v, i) => (
            <motion.div key={v.id} className="glass-card" style={{ padding: '1.25rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ fontWeight: 700, fontSize: 'var(--font-md)' }}>{v.title}</div>
                <div style={{ display: 'flex', gap: '0.2rem' }}>
                  {v.link && <a href={v.link} target="_blank" rel="noreferrer" className="btn-icon"><ExternalLink size={14} /></a>}
                  <button className="btn-icon" onClick={() => startEdit(v)}><Edit3 size={14} /></button>
                  <button className="btn-icon" onClick={() => deleteVideo(v.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={14} /></button>
                </div>
              </div>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginBottom: '1rem', minHeight: '2rem' }}>{v.notes}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>{v.software.toUpperCase()}</span>
                <span className={`badge ${statusColors[v.status]}`}>{v.status.toUpperCase()}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={resetForm} title={editId ? 'Edit Project' : 'New Project'}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full-width"><label>Project Title *</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
            <div className="form-group"><label>Software</label><select value={form.software} onChange={(e) => setForm({ ...form, software: e.target.value })}><option value="premiere">Premiere Pro</option><option value="davinci">DaVinci Resolve</option><option value="aftereffects">After Effects</option><option value="finalcut">Final Cut Pro</option></select></div>
            <div className="form-group"><label>Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="concept">Concept</option><option value="editing">Editing</option><option value="rending">Rendering</option><option value="completed">Completed</option><option value="published">Published</option></select></div>
            <div className="form-group full-width"><label>YouTube / Drive Link</label><input type="url" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} /></div>
            <div className="form-group full-width"><label>Notes & Ideas</label><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} /></div>
          </div>
          <div className="modal-actions"><button type="submit" className="btn-primary"><Check size={16} /> Save</button></div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
