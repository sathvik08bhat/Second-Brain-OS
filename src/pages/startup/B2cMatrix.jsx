import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Move } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useStartupStore } from '../../store/startupStore';

export default function B2cMatrix() {
  const { b2cMatrix, addGenericItem, updateGenericItem, deleteGenericItem } = useStartupStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', demand: 50, feasibility: 50 });

  const handleSave = () => {
    if (!formData.title) return;
    addGenericItem('b2cMatrix', {
      title: formData.title,
      demand: Number(formData.demand), // 0 to 100
      feasibility: Number(formData.feasibility) // 0 to 100
    });
    setIsModalOpen(false);
    setFormData({ title: '', demand: 50, feasibility: 50 });
  };

  return (
    <PageWrapper>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <Link to="/startup" style={{ color: 'var(--text-tertiary)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
            <ArrowLeft size={14} /> Back to Startup OS
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--accent-primary)' }}></div>
            <h1>B2C Idea Matrix</h1>
          </div>
          <p style={{ marginTop: '0.25rem' }}>Visually validate ideas mapping Demand against Feasibility.</p>
        </div>
        
        <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Plot Idea
        </button>
      </div>

      {/* The Map */}
      <div className="glass-card" style={{ padding: '2rem', height: '600px', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ flex: 1, position: 'relative', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          
          {/* Axis Labels */}
          <div style={{ position: 'absolute', left: -20, top: '50%', transform: 'translateY(-50%) rotate(-90deg)', color: 'var(--text-tertiary)', fontWeight: 600, letterSpacing: '2px' }}>
            MARKET DEMAND
          </div>
          <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', color: 'var(--text-tertiary)', fontWeight: 600, letterSpacing: '2px' }}>
            FEASIBILITY
          </div>

          {/* Quadrant Lines */}
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '1px', background: 'var(--border-color)', borderStyle: 'dashed' }}></div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: '1px', background: 'var(--border-color)', borderStyle: 'dashed' }}></div>

          {/* Quadrant Labels */}
          <span style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#10b981', opacity: 0.5, fontWeight: 700 }}>DO NOW (High P/M Fit)</span>
          <span style={{ position: 'absolute', top: '1rem', left: '1rem', color: '#f59e0b', opacity: 0.5, fontWeight: 700 }}>MAYBE (Too Hard)</span>
          <span style={{ position: 'absolute', bottom: '2rem', right: '1rem', color: '#3b82f6', opacity: 0.5, fontWeight: 700 }}>EASY WIN (Low Value)</span>
          <span style={{ position: 'absolute', bottom: '2rem', left: '1rem', color: '#ef4444', opacity: 0.5, fontWeight: 700 }}>TRASH (Don't Do)</span>

          {/* Plotting Ideas */}
          {b2cMatrix.map(idea => (
            <div 
              key={idea.id}
              style={{
                position: 'absolute',
                left: `${idea.feasibility}%`,
                bottom: `${idea.demand}%`,
                transform: 'translate(-50%, 50%)',
                background: 'var(--bg-primary)',
                border: '1px solid var(--accent-primary)',
                padding: '0.5rem 1rem',
                borderRadius: '100px',
                color: 'var(--text-primary)',
                fontWeight: 500,
                fontSize: '0.85rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                zIndex: 10
              }}
              onClick={() => deleteGenericItem('b2cMatrix', idea.id)}
              title="Click to delete"
            >
              <Move size={12} color="var(--accent-primary)" />
              {idea.title}
            </div>
          ))}

        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Plot New Idea">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          
          <div className="form-group">
            <label>Idea Name</label>
            <input type="text" className="input-field" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. AI Content Writer" />
          </div>

          <div className="form-group">
            <label>Market Demand (0 to 100)</label>
            <input type="range" min="0" max="100" value={formData.demand} onChange={e => setFormData({ ...formData, demand: e.target.value })} style={{ width: '100%' }} />
            <div style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--accent-primary)' }}>{formData.demand}/100</div>
          </div>

          <div className="form-group">
            <label>Feasibility / Ease of Building (0 to 100)</label>
            <input type="range" min="0" max="100" value={formData.feasibility} onChange={e => setFormData({ ...formData, feasibility: e.target.value })} style={{ width: '100%' }} />
            <div style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--accent-primary)' }}>{formData.feasibility}/100</div>
          </div>

          <button onClick={handleSave} className="btn-primary" style={{ marginTop: '1rem', width: '100%' }}>Plot Idea</button>
        </div>
      </Modal>

    </PageWrapper>
  );
}
