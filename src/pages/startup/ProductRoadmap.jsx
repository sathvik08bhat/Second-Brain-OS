import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Map, Plus, GripVertical, CheckCircle2, Clock } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useStartupStore } from '../../store/startupStore';

const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];
const STATUSES = ['Planning', 'In Progress', 'Shipped'];

export default function ProductRoadmap() {
  const { productRoadmap, addGenericItem, updateGenericItem, deleteGenericItem } = useStartupStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Default structure
  const [formData, setFormData] = useState({ title: '', quarter: 'Q1', status: 'Planning', epic: '' });

  const handleSave = () => {
    if (!formData.title) return;
    addGenericItem('productRoadmap', {
      title: formData.title,
      quarter: formData.quarter,
      status: formData.status,
      epic: formData.epic
    });
    setIsModalOpen(false);
    setFormData({ title: '', quarter: 'Q1', status: 'Planning', epic: '' });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Shipped': return <CheckCircle2 size={14} color="#10b981" />;
      case 'In Progress': return <Clock size={14} color="#f59e0b" />;
      default: return <Clock size={14} color="var(--accent-primary)" />;
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
              <Map size={24} color="#3b82f6" />
            </div>
            <h1>Product Roadmap</h1>
          </div>
          <p style={{ marginTop: '0.5rem' }}>High-level epics and feature planning grouped by Quarter.</p>
        </div>
        
        <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add Epic
        </button>
      </div>

      {/* Board Layout */}
      <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem', minHeight: '60vh' }}>
        {QUARTERS.map(quarter => {
          const epicsInQuarter = productRoadmap.filter(e => e.quarter === quarter);

          return (
            <div key={quarter} style={{ flex: '0 0 320px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{quarter}</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.5rem', borderRadius: '100px' }}>
                  {epicsInQuarter.length} Epics
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {epicsInQuarter.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)' }}>
                    No epics planned.
                  </div>
                ) : (
                  epicsInQuarter.map(epic => (
                    <div key={epic.id} className="glass-card" style={{ padding: '1.25rem', borderTop: `3px solid ${epic.status === 'Shipped' ? '#10b981' : epic.status === 'In Progress' ? '#f59e0b' : 'var(--accent-primary)'}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0, lineHeight: 1.3 }}>{epic.title}</h4>
                        <button onClick={() => deleteGenericItem('productRoadmap', epic.id)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>×</button>
                      </div>

                      {epic.epic && <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{epic.epic}</div>}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '100px' }}>
                          {getStatusIcon(epic.status)}
                          {epic.status}
                        </div>
                        
                        <select 
                          value={epic.quarter} 
                          onChange={(e) => updateGenericItem('productRoadmap', epic.id, { quarter: e.target.value })}
                          style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', fontSize: '0.8rem', cursor: 'pointer', outline: 'none' }}
                        >
                          {QUARTERS.map(q => <option key={q} value={q}>Move to {q}</option>)}
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Product Epic">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          
          <div className="form-group">
            <label>Epic Name / Feature</label>
            <input type="text" className="input-field" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Implement Multi-Tenant Architecture" style={{ width: '100%' }} />
          </div>

          <div className="form-group">
            <label>Description (Optional)</label>
            <textarea className="input-field" value={formData.epic} onChange={e => setFormData({ ...formData, epic: e.target.value })} placeholder="Brief summary of the deliverable..." style={{ width: '100%', minHeight: '80px', resize: 'vertical' }} />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Target Quarter</label>
              <select className="input-field" value={formData.quarter} onChange={e => setFormData({ ...formData, quarter: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white' }}>
                {QUARTERS.map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>Status</label>
              <select className="input-field" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white' }}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <button onClick={handleSave} className="btn-primary" style={{ marginTop: '1rem', width: '100%' }}>Plot in Roadmap</button>
        </div>
      </Modal>

    </PageWrapper>
  );
}
