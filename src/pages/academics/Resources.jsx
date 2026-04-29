import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Trash2, ExternalLink, HardDrive, Search, Link2, Folder, Filter } from 'lucide-react';
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
  const { subjects, addResource, deleteResource, googleDriveConnected, setGoogleDriveConnected } = useAcademicStore();
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [form, setForm] = useState({ name: '', url: '', type: 'link', subjectId: '', description: '' });

  // Consolidate all resources from all subjects
  const allResources = useMemo(() => {
    const res = [];
    subjects.forEach(s => {
      if (s.resources) {
        s.resources.forEach(r => res.push({ ...r, subjectId: s.id, subjectName: s.name }));
      }
    });
    return res;
  }, [subjects]);

  const filtered = allResources
    .filter(r => filterType === 'all' || r.type === filterType)
    .filter(r => search === '' || r.name.toLowerCase().includes(search.toLowerCase()) || (r.description || '').toLowerCase().includes(search.toLowerCase()));

  // Group by Subject
  const groupedResources = useMemo(() => {
    const groups = {};
    
    // Initialize groups for all subjects
    subjects.forEach(s => {
      groups[s.id] = { name: s.name, resources: [] };
    });
    
    // "General" group for resources without subject (if any)
    groups['general'] = { name: 'General Resources', resources: [] };

    filtered.forEach(r => {
      const groupKey = r.subjectId || 'general';
      if (!groups[groupKey]) {
        groups[groupKey] = { name: r.subjectName || 'General Resources', resources: [] };
      }
      groups[groupKey].resources.push(r);
    });

    return groups;
  }, [filtered, subjects]);

  const handleAdd = () => {
    if (!form.name.trim() || !form.subjectId) return;
    addResource(form.subjectId, { 
      title: form.name, 
      url: form.url, 
      type: form.type, 
      description: form.description,
      createdAt: new Date().toISOString()
    });
    setForm({ name: '', url: '', type: 'link', subjectId: '', description: '' });
    setShowAdd(false);
  };

  const handleDriveConnect = () => {
    alert('Google Drive integration requires a backend OAuth setup.\n\nFor now, you can manually add Google Drive links as resources with type "Google Drive".');
    setGoogleDriveConnected(true);
  };

  const getIcon = (type) => {
    switch(type) {
      case 'video': return <Link2 size={14} className="text-red-500" />;
      case 'pdf': return <Link2 size={14} className="text-blue-500" />;
      case 'drive': return <HardDrive size={14} className="text-emerald-500" />;
      default: return <Link2 size={14} className="text-primary" />;
    }
  };

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">📚 Study Resources</span></h1>
        <p>Organize study materials, notes, and learning resources by subject.</p>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={16} /> Add Resource</button>
          <button className={`btn-secondary`} onClick={handleDriveConnect} style={{ background: googleDriveConnected ? 'rgba(16,185,129,0.1)' : undefined, borderColor: googleDriveConnected ? 'var(--accent-green)' : undefined }}>
            <HardDrive size={16} /> {googleDriveConnected ? '✅ Drive Connected' : 'Connect Google Drive'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 250px', position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search resources..." style={{ paddingLeft: '2rem' }} />
        </div>
        <div className="flex items-center gap-2 bg-secondary/50 px-3 rounded-md border border-border">
          <Filter size={14} className="text-muted-foreground" />
          <select 
            value={filterType} 
            onChange={e => setFilterType(e.target.value)} 
            style={{ border: 'none', background: 'transparent', width: 120, padding: '0.4rem 0' }}
          >
            <option value="all">All Types</option>
            {RESOURCE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
      </div>

      {/* Grouped Resources Grid */}
      <div className="flex flex-col gap-10">
        {Object.entries(groupedResources).map(([subjectId, group], groupIdx) => {
          if (group.resources.length === 0 && subjectId === 'general') return null;
          
          return (
            <motion.div 
              key={subjectId} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIdx * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Folder size={18} className="text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{group.name}</h3>
                <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {group.resources.length} items
                </span>
              </div>

              {group.resources.length === 0 ? (
                <div className="p-8 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-muted-foreground opacity-50">
                  <p className="text-xs">No resources added to this subject yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.resources.map((res) => (
                    <div 
                      key={res.id} 
                      className="glass-card p-4 hover:border-primary/50 transition-all group relative"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2 truncate">
                          {getIcon(res.type)}
                          <h4 className="font-bold text-sm truncate pr-6">{res.title}</h4>
                        </div>
                        <button 
                          className="btn-icon text-red-500 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2" 
                          onClick={() => deleteResource(res.subjectId, res.id)}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      
                      {res.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 h-8">
                          {res.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                          {RESOURCE_TYPES.find(t => t.value === res.type)?.label.split(' ')[1]}
                        </span>
                        {res.url && (
                          <a 
                            href={res.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-1 text-[10px] font-bold text-foreground hover:text-primary transition-colors uppercase tracking-widest"
                          >
                            Open <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Add Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add New Resource">
        <div className="form-grid">
          <div className="form-group full-width">
            <label>Subject</label>
            <select 
              value={form.subjectId} 
              onChange={e => setForm({...form, subjectId: e.target.value})}
              required
            >
              <option value="" disabled>Select Subject</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="form-group full-width"><label>Resource Name</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Midsem Question Bank" /></div>
          <div className="form-group full-width"><label>URL / Link</label><input value={form.url} onChange={e => setForm({...form, url: e.target.value})} placeholder="https://drive.google.com/..." /></div>
          <div className="form-group">
            <label>Type</label>
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
              {RESOURCE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="form-group full-width"><label>Description (optional)</label><input value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="What's this about?" /></div>
          <div className="form-group full-width" style={{ marginTop: '1rem' }}>
            <button 
              className="btn-primary" 
              onClick={handleAdd} 
              disabled={!form.subjectId || !form.name}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Add Resource
            </button>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
}
