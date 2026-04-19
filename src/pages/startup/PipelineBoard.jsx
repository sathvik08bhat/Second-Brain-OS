import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Handshake, DollarSign, Plus, MoveRight, TrendingUp } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useStartupStore } from '../../store/startupStore';

const DEAL_STAGES = ['Lead', 'Pitched', 'Negotiating', 'Closed-Won', 'Closed-Lost'];
const INVESTOR_STAGES = ['Sourced', 'Pitching', 'Term Sheet', 'Signed', 'Passed'];

export default function PipelineBoard({ type }) {
  const isDeals = type === 'deals';
  const dbKey = isDeals ? 'dealPipeline' : 'investorPipeline';
  const stages = isDeals ? DEAL_STAGES : INVESTOR_STAGES;
  
  const { [dbKey]: pipeline, addGenericItem, updateGenericItem, deleteGenericItem } = useStartupStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Default forms
  const [formData, setFormData] = useState({ 
    title: '', 
    value: 0, 
    stage: stages[0], 
    contact: '' 
  });

  const handleSave = () => {
    if (!formData.title) return;
    addGenericItem(dbKey, {
      title: formData.title,
      value: document.getElementById('pipelineVal')?.value || formData.value, // value mapping
      stage: formData.stage,
      contact: formData.contact,
      feedback: formData.contact // alias for investors
    });
    setIsModalOpen(false);
    setFormData({ title: '', value: 0, stage: stages[0], contact: '' });
  };

  // Pipeline Metric Calculations
  const activeItems = pipeline?.filter(item => !['Closed-Won', 'Closed-Lost', 'Signed', 'Passed'].includes(item.stage)) || [];
  const totalValue = activeItems.reduce((acc, item) => acc + (Number(item.value) || 0), 0);
  
  const successItems = pipeline?.filter(item => ['Closed-Won', 'Signed'].includes(item.stage)) || [];
  const closedValue = successItems.reduce((acc, item) => acc + (Number(item.value) || 0), 0);

  return (
    <PageWrapper>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <Link to="/startup" style={{ color: 'var(--text-tertiary)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
            <ArrowLeft size={14} /> Back to Startup OS
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: isDeals ? 'rgba(245, 158, 11, 0.1)' : 'rgba(20, 184, 166, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isDeals ? <Handshake size={24} color="#f59e0b" /> : <DollarSign size={24} color="#14b8a6" />}
            </div>
            <h1>{isDeals ? 'B2B Deal Pipeline' : 'VC Investor Pipeline'}</h1>
          </div>
          <p style={{ marginTop: '0.5rem' }}>
            {isDeals 
              ? 'Manage your B2B sales cycles from lead generation to closed-won deals.' 
              : 'Track fundraising efforts, investor meetings, and active term sheets.'}
          </p>
        </div>
        
        <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: isDeals ? '#f59e0b' : '#14b8a6', color: isDeals ? '#000' : '#fff' }}>
          <Plus size={18} /> {isDeals ? 'New Deal' : 'Add Investor'}
        </button>
      </div>

      {/* Analytics Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: `4px solid ${isDeals ? '#f59e0b' : '#14b8a6'}` }}>
          <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Active Pipeline</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ${totalValue.toLocaleString()}
            <TrendingUp size={20} color={isDeals ? '#f59e0b' : '#14b8a6'} />
          </div>
        </div>
        
        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Total Closed/Signed</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981' }}>
            ${closedValue.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', minHeight: '600px' }}>
        
        {stages.map(stage => {
          const itemsInStage = pipeline?.filter(item => item.stage === stage) || [];

          return (
            <div key={stage} style={{ flex: '0 0 300px', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{stage}</h3>
                <span style={{ fontSize: '0.8rem', background: 'var(--bg-secondary)', padding: '0.2rem 0.5rem', borderRadius: '100px' }}>{itemsInStage.length}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {itemsInStage.map(item => (
                  <div key={item.id} className="glass-card" style={{ padding: '1rem', cursor: 'grab', background: 'var(--bg-primary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{item.title}</h4>
                      <button onClick={() => deleteGenericItem(dbKey, item.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>×</button>
                    </div>

                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: isDeals ? '#f59e0b' : '#14b8a6', marginBottom: '0.75rem' }}>
                      ${Number(item.value || 0).toLocaleString()}
                    </div>

                    {item.contact && (
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.contact}
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Move item</span>
                      <select
                        value={item.stage} 
                        onChange={(e) => updateGenericItem(dbKey, item.id, { stage: e.target.value })}
                        style={{ padding: '0.25rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: '0.8rem', cursor: 'pointer', outline: 'none' }}
                      >
                        {stages.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                  </div>
                ))}

                {itemsInStage.length === 0 && (
                  <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                    Empty stage.
                  </div>
                )}
              </div>

            </div>
          );
        })}

      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Add ${isDeals ? 'Deal' : 'Investor'}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          
          <div className="form-group">
            <label>{isDeals ? 'Client / Company Name' : 'VC Firm / Investor Name'}</label>
            <input type="text" className="input-field" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%' }} />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>{isDeals ? 'Deal Value ($)' : 'Check Size ($)'}</label>
              <input type="number" id="pipelineVal" className="input-field" defaultValue="0" style={{ width: '100%' }} />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>Initial Stage</label>
              <select className="input-field" value={formData.stage} onChange={e => setFormData({ ...formData, stage: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white' }}>
                {stages.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>{isDeals ? 'Key Contact / Info' : 'Feedback / Notes'}</label>
            <textarea className="input-field" value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} style={{ width: '100%', minHeight: '80px', resize: 'vertical' }} />
          </div>

          <button onClick={handleSave} className="btn-primary" style={{ marginTop: '1rem', width: '100%', background: isDeals ? '#f59e0b' : '#14b8a6', color: isDeals ? '#000' : '#fff' }}>
            {isDeals ? 'Add Deal to Pipeline' : 'Add Investor'}
          </button>
        </div>
      </Modal>

    </PageWrapper>
  );
}
