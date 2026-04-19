import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Plus, Clock, Users, ArrowRight } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useStartupStore } from '../../store/startupStore';

export default function MeetingTimeline() {
  const { meetingNotes, addGenericItem, deleteGenericItem } = useStartupStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', date: new Date().toISOString().split('T')[0], actionItems: '', blockers: '' });

  const handleSave = () => {
    if (!formData.title) return;
    addGenericItem('meetingNotes', {
      title: formData.title,
      date: formData.date,
      actionItems: formData.actionItems,
      blockers: formData.blockers
    });
    setIsModalOpen(false);
    setFormData({ title: '', date: new Date().toISOString().split('T')[0], actionItems: '', blockers: '' });
  };

  // Sort meetings chronologically (newest first)
  const sortedMeetings = [...meetingNotes].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <PageWrapper>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <Link to="/startup" style={{ color: 'var(--text-tertiary)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
            <ArrowLeft size={14} /> Back to Startup OS
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'rgba(236, 72, 153, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={24} color="#ec4899" />
            </div>
            <h1>Meeting Timeline</h1>
          </div>
          <p style={{ marginTop: '0.5rem' }}>Chronological history of team syncs, blockages, and action items.</p>
        </div>
        
        <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ec4899' }}>
          <Plus size={18} /> Log Sync
        </button>
      </div>

      <div style={{ position: 'relative', paddingLeft: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        
        {/* The Vertical Timeline Line */}
        <div style={{ position: 'absolute', left: '0', top: '0', bottom: '0', width: '2px', background: 'rgba(255,255,255,0.1)' }}></div>

        {sortedMeetings.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No meetings logged yet.</div>
        ) : (
          sortedMeetings.map((mtg, i) => (
            <div key={mtg.id} style={{ position: 'relative', marginBottom: '3rem' }}>
              
              {/* Timeline Bullet */}
              <div style={{ position: 'absolute', left: '-2.4rem', top: '0.25rem', width: '14px', height: '14px', borderRadius: '50%', background: i === 0 ? '#ec4899' : 'var(--bg-secondary)', border: `2px solid ${i === 0 ? '#ec4899' : 'rgba(255,255,255,0.2)'}`, zIndex: 10 }}></div>

              <div className="glass-card" style={{ padding: '1.5rem', borderLeft: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{mtg.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <Clock size={14} /> {new Date(mtg.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <button onClick={() => deleteGenericItem('meetingNotes', mtg.id)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>×</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  
                  {/* Action Items */}
                  <div>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.9rem', marginBottom: '0.75rem', fontWeight: 600 }}>
                      <ArrowRight size={14} /> Action Items
                    </h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, whiteSpace: 'pre-wrap', margin: 0 }}>
                      {mtg.actionItems || 'None recorded.'}
                    </p>
                  </div>

                  {/* Blockers */}
                  <div>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ef4444', fontSize: '0.9rem', marginBottom: '0.75rem', fontWeight: 600 }}>
                      <Plus style={{ transform: 'rotate(45deg)' }} size={14} /> Active Blockers
                    </h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, whiteSpace: 'pre-wrap', margin: 0 }}>
                      {mtg.blockers || 'No blockers reported.'}
                    </p>
                  </div>

                </div>
              </div>

            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Team Sync">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          
          <div className="form-group">
            <label>Meeting Title</label>
            <input type="text" className="input-field" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Weekly Engineering Sync" style={{ width: '100%' }} />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input type="date" className="input-field" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white', colorScheme: 'dark' }} />
          </div>

          <div className="form-group">
            <label>Action Items Delivered</label>
            <textarea className="input-field" value={formData.actionItems} onChange={e => setFormData({ ...formData, actionItems: e.target.value })} placeholder="- John to finalize DB schema&#10;- Sarah to draft PR release" style={{ width: '100%', minHeight: '80px', resize: 'vertical' }} />
          </div>

          <div className="form-group">
            <label>Blockers / Issues Raised</label>
            <textarea className="input-field" value={formData.blockers} onChange={e => setFormData({ ...formData, blockers: e.target.value })} placeholder="Write any factors blocking progress..." style={{ width: '100%', minHeight: '60px', resize: 'vertical' }} />
          </div>

          <button onClick={handleSave} className="btn-primary" style={{ marginTop: '1rem', width: '100%', background: '#ec4899', color: 'white' }}>Save Timeline Log</button>
        </div>
      </Modal>

    </PageWrapper>
  );
}
