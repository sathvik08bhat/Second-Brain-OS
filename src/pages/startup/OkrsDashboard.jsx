import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Target, Plus, CheckCircle, Clock } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useStartupStore } from '../../store/startupStore';

export default function OkrsDashboard() {
  const { okrs, addGenericItem, updateGenericItem, deleteGenericItem } = useStartupStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', progress: 0, status: 'On Track' });

  const handleSave = () => {
    if (!formData.title) return;
    addGenericItem('okrs', {
      title: formData.title,
      progress: Number(formData.progress),
      status: formData.status
    });
    setIsModalOpen(false);
    setFormData({ title: '', progress: 0, status: 'On Track' });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Achieved': return '#10b981';
      case 'On Track': return '#3b82f6';
      case 'At Risk': return '#f59e0b';
      case 'Missed': return '#ef4444';
      default: return '#8b5cf6';
    }
  };

  const overallProgress = okrs.length > 0 
    ? Math.round(okrs.reduce((sum, o) => sum + (Number(o.progress) || 0), 0) / okrs.length)
    : 0;

  return (
    <PageWrapper>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <Link to="/startup" style={{ color: 'var(--text-tertiary)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
            <ArrowLeft size={14} /> Back to Startup OS
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Target size={24} color="#8b5cf6" />
            </div>
            <h1>OKRs & Strategy</h1>
          </div>
          <p style={{ marginTop: '0.5rem' }}>Company-wide Objectives and Key Results for the current quarter.</p>
        </div>
        
        <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> New Objective
        </button>
      </div>

      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(139, 92, 246, 0.05) 100%)' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Company Overview Progress</h3>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: '#8b5cf6' }}>{overallProgress}%</div>
          <div style={{ flex: 1 }}>
            <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '100px', overflow: 'hidden' }}>
              <div style={{ width: `${overallProgress}%`, height: '100%', background: '#8b5cf6', transition: 'width 1s ease-in-out' }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
              <span>Q-Start</span>
              <span>Q-End Target</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
        {okrs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No objectives set for this quarter.</div>
        ) : (
          okrs.map(okr => (
            <div key={okr.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3, flex: 1 }}>{okr.title}</h3>
                <button onClick={() => deleteGenericItem('okrs', okr.id)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>×</button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ padding: '0.25rem 0.5rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600, background: `${getStatusColor(okr.status)}20`, color: getStatusColor(okr.status), border: `1px solid ${getStatusColor(okr.status)}50` }}>
                  {okr.status}
                </span>
              </div>
              
              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Objective Progress</span>
                  <span style={{ fontWeight: 700, color: getStatusColor(okr.status) }}>{okr.progress}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden' }}>
                  <div style={{ width: `${okr.progress}%`, height: '100%', background: getStatusColor(okr.status), transition: 'width 0.5s ease-in-out' }}></div>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Company Objective">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          
          <div className="form-group">
            <label>Objective Title</label>
            <input type="text" className="input-field" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Achieve $1M in ARR" style={{ width: '100%' }} />
          </div>

          <div className="form-group">
            <label>Current Progress (%)</label>
            <input type="number" min="0" max="100" className="input-field" value={formData.progress} onChange={e => setFormData({ ...formData, progress: e.target.value })} style={{ width: '100%' }} />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select className="input-field" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white' }}>
              <option value="On Track">On Track</option>
              <option value="At Risk">At Risk</option>
              <option value="Missed">Missed</option>
              <option value="Achieved">Achieved</option>
            </select>
          </div>

          <button onClick={handleSave} className="btn-primary" style={{ marginTop: '1rem', width: '100%' }}>Create Objective</button>
        </div>
      </Modal>

    </PageWrapper>
  );
}
