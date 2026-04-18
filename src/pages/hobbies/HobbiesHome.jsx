import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Film, Navigation as PingPong, ArrowRight, Plus, Star, X, Palette } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useHobbiesStore } from '../../store/hobbiesStore';

const iconOptions = [
  { name: 'Star', icon: Star }, { name: 'Camera', icon: Camera },
  { name: 'Film', icon: Film }, { name: 'PingPong', icon: PingPong },
];

const colorOptions = ['#f59e0b', '#3b82f6', '#ef4444', '#10b981', '#8b5cf6', '#ec4899', '#f97316', '#06b6d4'];

export default function HobbiesHome() {
  const { customHobbies, addCustomHobby, deleteCustomHobby } = useHobbiesStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newHobby, setNewHobby] = useState({ name: '', description: '', icon: 'Star', color: '#8b5cf6' });

  const handleAddHobby = () => {
    if (!newHobby.name.trim()) return;
    addCustomHobby(newHobby);
    setNewHobby({ name: '', description: '', icon: 'Star', color: '#8b5cf6' });
    setShowAdd(false);
  };

  const getIconComponent = (iconName) => {
    const found = iconOptions.find(i => i.name === iconName);
    return found ? found.icon : Star;
  };

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">🎨 Hobbies & Interests</span></h1>
        <p>Track your creative pursuits and personal interests</p>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={16} /> Add Hobby</button>
        </div>
      </div>

      {(customHobbies || []).length === 0 ? (
        <div className="empty-state">
          <Palette size={48} />
          <h3>No Hobbies Yet</h3>
          <p>Add your hobbies and interests to start tracking them.</p>
          <button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={16} /> Add Your First Hobby</button>
        </div>
      ) : (
        <div className="grid-auto">
          {(customHobbies || []).map((hobby, i) => {
            const IconComp = getIconComponent(hobby.icon);
            return (
              <motion.div key={hobby.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Link to={`/hobbies/custom/${hobby.id}`} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', textDecoration: 'none', color: 'var(--text-primary)' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: `${hobby.color}15`, color: hobby.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconComp size={22} /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{hobby.name}</div>
                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>{hobby.description || 'Custom hobby'}</div>
                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{(hobby.activities || []).length} activities logged</div>
                  </div>
                  <button className="btn-icon" onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteCustomHobby(hobby.id); }}><X size={14} /></button>
                  <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add New Hobby">
        <div className="form-grid">
          <div className="form-group full-width">
            <label>Hobby Name</label>
            <input value={newHobby.name} onChange={e => setNewHobby({...newHobby, name: e.target.value})} placeholder="e.g. Chess, Painting, Cooking..." />
          </div>
          <div className="form-group full-width">
            <label>Description</label>
            <input value={newHobby.description} onChange={e => setNewHobby({...newHobby, description: e.target.value})} placeholder="Short description" />
          </div>
          <div className="form-group">
            <label>Icon</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {iconOptions.map(opt => (
                <button key={opt.name} onClick={() => setNewHobby({...newHobby, icon: opt.name})} style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: newHobby.icon === opt.name ? 'var(--accent-purple)' : 'var(--bg-glass)', border: '2px solid var(--border-primary)', color: newHobby.icon === opt.name ? '#fff' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <opt.icon size={18} />
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Color</label>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {colorOptions.map(c => (
                <button key={c} onClick={() => setNewHobby({...newHobby, color: c})} style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: newHobby.color === c ? '3px solid var(--text-primary)' : '2px solid var(--border-primary)', cursor: 'pointer', boxShadow: newHobby.color === c ? '2px 2px 0px #000' : 'none' }} />
              ))}
            </div>
          </div>
          <div className="form-group full-width" style={{ marginTop: '0.5rem' }}>
            <button className="btn-primary" onClick={handleAddHobby} style={{ width: '100%', justifyContent: 'center' }}>Add Hobby</button>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
}
