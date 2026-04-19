import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlaySquare, Plus, Trash2, ExternalLink, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageWrapper from '../../components/layout/PageWrapper';
import { useDsaStore } from '../../store/dsaStore';

export default function DsaVideos() {
// ... omitting unchanged lines for brevity

  const { videos, addVideo, updateVideo, deleteVideo } = useDsaStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', url: '', channel: '', notes: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    addVideo(formData);
    setFormData({ title: '', url: '', channel: '', notes: '' });
    setShowForm(false);
  };

  const getEmbedUrl = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^#&?]*).*/);
    return match && match[1].length === 11 ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  return (
    <PageWrapper>
      <div className="page-header" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <Link to="/dsa" className="btn-icon" style={{ marginTop: 4 }}><ArrowLeft size={20} /></Link>
        <div style={{ flex: 1 }}>
          <h1><span className="gradient-text">📺 Tutorial Videos</span></h1>
          <p>Track YouTube lectures, playlists, and conceptual videos</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={16} /> Add Video
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            className="glass-card" 
            style={{ padding: '1.5rem', marginBottom: 'var(--space-xl)' }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <form onSubmit={handleSubmit} className="form-grid cols-2">
              <div className="form-group">
                <label>Video Title</label>
                <input required className="input-primary" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Dynamic Programming (Neetcode)" />
              </div>
              <div className="form-group">
                <label>Channel Name</label>
                <input className="input-primary" value={formData.channel} onChange={e => setFormData({...formData, channel: e.target.value})} placeholder="e.g. NeetCode" />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>YouTube URL</label>
                <input required type="url" className="input-primary" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} placeholder="https://youtube.com/watch?v=..." />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Quick Notes</label>
                <input className="input-primary" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Optional notes about this video" />
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn-primary">Save Video</button>
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid-2">
        {videos.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', gridColumn: '1 / -1' }}>
            <PlaySquare size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
            <h3 style={{ color: 'var(--text-secondary)' }}>No Videos Tracked</h3>
            <p style={{ color: 'var(--text-tertiary)' }}>Save tutorials here to keep your learning organized.</p>
          </div>
        ) : (
          videos.map((vid) => {
            const embed = getEmbedUrl(vid.url);
            return (
              <motion.div key={vid.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                {embed ? (
                  <div style={{ width: '100%', aspectRatio: '16/9', background: '#000' }}>
                    <iframe width="100%" height="100%" src={embed} title={vid.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                  </div>
                ) : (
                  <div style={{ width: '100%', aspectRatio: '16/9', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-primary)' }}>
                    Invalid YouTube URL
                  </div>
                )}
                
                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{vid.title}</h3>
                    <button className="btn-icon-danger" onClick={() => deleteVideo(vid.id)}><Trash2 size={16} /></button>
                  </div>
                  
                  {vid.channel && <div style={{ fontSize: 'var(--font-sm)', color: '#ec4899', fontWeight: 600, marginBottom: '0.5rem' }}>{vid.channel}</div>}
                  {vid.notes && <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)', marginBottom: '1rem', lineHeight: 1.4 }}>{vid.notes}</div>}
                  
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-primary)' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 'var(--font-sm)', fontWeight: 600, color: vid.completed ? '#10b981' : 'var(--text-secondary)' }}>
                      <input type="checkbox" checked={vid.completed} onChange={(e) => updateVideo(vid.id, { completed: e.target.checked })} style={{ width: 16, height: 16, accentColor: '#10b981' }} />
                      {vid.completed ? 'Finished' : 'Mark Complete'}
                    </label>
                    <a href={vid.url} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '10px' }}>
                      <ExternalLink size={12} /> Watch on YT
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </PageWrapper>
  );
}
