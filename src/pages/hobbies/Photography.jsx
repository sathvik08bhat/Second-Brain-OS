import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Plus, Trash2, Edit3, Check, ExternalLink } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useHobbiesStore } from '../../store/hobbiesStore';

export default function Photography() {
  const { photos, addPhoto, updatePhoto, deletePhoto } = useHobbiesStore();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', folderUrl: '', camera: 'dslr', date: '', tags: '' });

  const handleSubmit = (e) => { e.preventDefault(); if (editId) updatePhoto(editId, form); else addPhoto(form); resetForm(); };
  const resetForm = () => { setForm({ title: '', folderUrl: '', camera: 'dslr', date: '', tags: '' }); setEditId(null); setShowModal(false); };
  const startEdit = (p) => { setForm({ title: p.title, folderUrl: p.folderUrl || '', camera: p.camera || 'dslr', date: p.date, tags: p.tags || '' }); setEditId(p.id); setShowModal(true); };

  const cameraColors = { dslr: 'badge-purple', phone: 'badge-blue', film: 'badge-yellow', drone: 'badge-green' };

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">📸 Photography Log</span></h1>
        <p>Track your photoshoots, locations, and portfolios</p>
        <div className="header-actions"><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Shoot</button></div>
      </div>

      {photos.length === 0 ? (
        <div className="empty-state"><Camera size={48} /><h3>No Shoots Logged</h3><p>Keep track of your photography sessions.</p></div>
      ) : (
        <div className="grid-auto">
          {photos.map((p, i) => (
            <motion.div key={p.id} className="glass-card" style={{ padding: '1.25rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--font-md)' }}>{p.title}</div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>{p.date}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.2rem' }}>
                  {p.folderUrl && <a href={p.folderUrl} target="_blank" rel="noreferrer" className="btn-icon"><ExternalLink size={14} /></a>}
                  <button className="btn-icon" onClick={() => startEdit(p)}><Edit3 size={14} /></button>
                  <button className="btn-icon" onClick={() => deletePhoto(p.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={14} /></button>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`badge ${cameraColors[p.camera] || 'badge-blue'}`}>{p.camera.toUpperCase()}</span>
                {p.tags && <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>{p.tags}</span>}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={resetForm} title={editId ? 'Edit Shoot' : 'Add Shoot'}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full-width"><label>Shoot Title / Location *</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
            <div className="form-group"><label>Date</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
            <div className="form-group"><label>Camera Used</label><select value={form.camera} onChange={(e) => setForm({ ...form, camera: e.target.value })}><option value="dslr">DSLR / Mirrorless</option><option value="phone">Smartphone</option><option value="film">Film</option><option value="drone">Drone</option></select></div>
            <div className="form-group full-width"><label>Folder URL (Google Drive/Lightroom)</label><input type="url" value={form.folderUrl} onChange={(e) => setForm({ ...form, folderUrl: e.target.value })} placeholder="https://..." /></div>
            <div className="form-group full-width"><label>Tags (comma separated)</label><input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="portrait, landscape, street..." /></div>
          </div>
          <div className="modal-actions"><button type="submit" className="btn-primary"><Check size={16} /> Save</button></div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
