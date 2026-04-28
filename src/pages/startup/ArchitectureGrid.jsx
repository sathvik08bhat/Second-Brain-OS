import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Server, Plus, Database, Layout, Cloud } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useStartupStore } from '../../store/startupStore';

const CATEGORIES = ['Frontend', 'Backend', 'Infrastructure', 'Database', 'Third-Party'];
const STATUSES = ['Stable', 'Evaluating', 'Deprecated'];

export default function ArchitectureGrid() {
  const { architectureDB, addGenericItem, updateGenericItem, deleteGenericItem } = useStartupStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', category: 'Frontend', status: 'Stable', link: '' });

  const handleSave = () => {
    if (!formData.title) return;
    addGenericItem('architectureDB', {
      title: formData.title,
      category: formData.category,
      status: formData.status,
      link: formData.link
    });
    setIsModalOpen(false);
    setFormData({ title: '', category: 'Frontend', status: 'Stable', link: '' });
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Frontend': return <Layout size={20} color="#f59e0b" />;
      case 'Backend': return <Server size={20} color="var(--accent-primary)" />;
      case 'Database': return <Database size={20} color="#3b82f6" />;
      case 'Infrastructure': return <Cloud size={20} color="#10b981" />;
      default: return <Server size={20} color="#ec4899" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Stable': return '#10b981';
      case 'Evaluating': return '#f59e0b';
      case 'Deprecated': return '#ef4444';
      default: return 'var(--accent-primary)';
    }
  };

  return (
    <PageWrapper>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <Link to="/startup" style={{ color: 'var(--text-tertiary)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
            <ArrowLeft size={14} /> Back to Startup OS
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Server size={24} color="#3b82f6" />
            </div>
            <h1>Architecture & Systems</h1>
          </div>
          <p style={{ marginTop: '0.5rem' }}>Visual mapping of your entire technology stack and infrastructure.</p>
        </div>
        
        <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add Tech Stack
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {CATEGORIES.map(category => {
          const items = architectureDB.filter(item => item.category === category);
          if (items.length === 0) return null; // Only show populated categories

          return (
            <div key={category} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                {getCategoryIcon(category)} {category}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {items.map(tech => (
                  <div key={tech.id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(255,255,255,0.02)' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{tech.title}</h4>
                      <button onClick={() => deleteGenericItem('architectureDB', tech.id)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>×</button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                      <span style={{ 
                        padding: '0.2rem 0.6rem', 
                        borderRadius: '100px', 
                        fontSize: '0.75rem', 
                        fontWeight: 600, 
                        background: `${getStatusColor(tech.status)}15`, 
                        color: getStatusColor(tech.status),
                        border: `1px solid ${getStatusColor(tech.status)}40`
                      }}>
                        {tech.status}
                      </span>

                      {tech.link && (
                        <a href={tech.link} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', textDecoration: 'none' }}>
                          Docs →
                        </a>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {architectureDB.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-color)' }}>
            No technologies mapped yet. Add your tech stack to visualize your architecture.
          </div>
        )}

      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Map New Technology">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          
          <div className="form-group">
            <label>Technology / Service Name</label>
            <input type="text" className="input-field" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. PostgreSQL, React, AWS S3" style={{ width: '100%' }} />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Stack Category</label>
              <select className="input-field" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white' }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>Status</label>
              <select className="input-field" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white' }}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Documentation URL (Optional)</label>
            <input type="url" className="input-field" value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} placeholder="https://..." style={{ width: '100%' }} />
          </div>

          <button onClick={handleSave} className="btn-primary" style={{ marginTop: '1rem', width: '100%' }}>Add to Architecture</button>
        </div>
      </Modal>

    </PageWrapper>
  );
}
