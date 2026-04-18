import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Trash2, ExternalLink, HardDrive, Search, Link2 } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useAcademicStore } from '../../store/academicStore';

const RESOURCE_TYPES = [
  { value: 'link', label: '🔗 Web Link' },
  { value: 'pdf', label: '📄 PDF' },
  { value: 'video', label: '🎥 Video' },
  { value: 'notes', label: '📝 Notes' },
  { value: 'drive', label: '📁 Google Drive' },
  { value: 'book', label: '📚 Book' },
];

export default function Resources() {
  const { resources, addResource, deleteResource, subjects, googleDriveConnected, setGoogleDriveConnected } = useAcademicStore();
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [form, setForm] = useState({ name: '', url: '', type: 'link', subjectId: '', description: '' });

  const filtered = resources
    .filter(r => filterSubject === 'all' || r.subjectId === filterSubject)
    .filter(r => filterType === 'all' || r.type === filterType)
    .filter(r => search === '' || r.name.toLowerCase().includes(search.toLowerCase()) || (r.description || '').toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleAdd = () => {
    if (!form.name.trim()) return;
    addResource(form);
    setForm({ name: '', url: '', type: 'link', subjectId: '', description: '' });
    setShowAdd(false);
  };

  const getSubjectName = (id) => subjects.find(s => s.id === id)?.name || 'General';

  const handleDriveConnect = () => {
    // Placeholder for Google Drive OAuth flow
    alert('Google Drive integration requires a backend OAuth setup.\n\nFor now, you can manually add Google Drive links as resources with type "Google Drive".\n\nPaste your Drive sharing links directly!');
    setGoogleDriveConnected(true);
  };

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">📚 Study Resources</span></h1>
        <p>Organize study materials, notes, and learning resources</p>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={16} /> Add Resource</button>
          <button className={`btn-secondary`} onClick={handleDriveConnect} style={{ background: googleDriveConnected ? 'rgba(16,185,129,0.1)' : undefined, borderColor: googleDriveConnected ? 'var(--accent-green)' : undefined }}>
            <HardDrive size={16} /> {googleDriveConnected ? '✅ Drive Connected' : 'Connect Google Drive'}
          </button>
        </div>
      </div>

      {/* Google Drive Info */}
      {googleDriveConnected && (
        <motion.div className="glass-card" style={{ padding: '1rem 1.5rem', marginBottom: 'var(--space-lg)', borderLeft: '4px solid var(--accent-green)', display: 'flex', alignItems: 'center', gap: '0.75rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <HardDrive size={20} style={{ color: 'var(--accent-green)' }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 'var(--font-sm)' }}>Google Drive Connected</div>
            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Add Drive links as resources. Paste sharing URLs directly.</div>
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px', position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search resources..." style={{ paddingLeft: '2rem' }} />
        </div>
        <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} style={{ width: 160 }}>
          <option value="all">All Subjects</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ width: 140 }}>
          <option value="all">All Types</option>
          {RESOURCE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

      {/* Resources Grid */}
      {filtered.length > 0 ? (
        <div className="grid-auto">
          {filtered.map((res, i) => {
            const typeInfo = RESOURCE_TYPES.find(t => t.value === res.type) || RESOURCE_TYPES[0];
            return (
              <motion.div key={res.id} className="glass-card" style={{ padding: '1.25rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <h4 style={{ fontWeight: 700, fontSize: 'var(--font-sm)', marginBottom: '0.2rem' }}>{res.name}</h4>
                    {res.description && <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>{res.description}</p>}
                  </div>
                  <button className="btn-icon" onClick={() => deleteResource(res.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={14} /></button>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                  <span className="badge badge-purple" style={{ fontSize: '9px' }}>{typeInfo.label}</span>
                  {res.subjectId && <span className="badge badge-blue" style={{ fontSize: '9px' }}>{getSubjectName(res.subjectId)}</span>}
                </div>
                {res.url && (
                  <a href={res.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: 'var(--font-xs)', color: 'var(--accent-cyan)' }}>
                    <Link2 size={12} /> Open Resource <ExternalLink size={10} />
                  </a>
                )}
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state"><BookOpen size={48} /><h3>No Resources Yet</h3><p>Add study materials, Drive links, notes, and more.</p></div>
      )}

      {/* Add Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Resource">
        <div className="form-grid">
          <div className="form-group full-width"><label>Resource Name</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Linear Algebra Notes" /></div>
          <div className="form-group full-width"><label>URL / Link</label><input value={form.url} onChange={e => setForm({...form, url: e.target.value})} placeholder="https://drive.google.com/... or any URL" /></div>
          <div className="form-group">
            <label>Type</label>
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
              {RESOURCE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Subject (optional)</label>
            <select value={form.subjectId} onChange={e => setForm({...form, subjectId: e.target.value})}>
              <option value="">General</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="form-group full-width"><label>Description (optional)</label><input value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Short description" /></div>
          <div className="form-group full-width" style={{ marginTop: '0.5rem' }}><button className="btn-primary" onClick={handleAdd} style={{ width: '100%', justifyContent: 'center' }}>Add Resource</button></div>
        </div>
      </Modal>
    </PageWrapper>
  );
}
