import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, Circle, Clock, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageWrapper from '../../components/layout/PageWrapper';
import { useDsaStore } from '../../store/dsaStore';

const STATUS_OPTIONS = [
  { value: 'not_started', label: 'Not Started', icon: Circle, color: '#94a3b8' },
  { value: 'learning', label: 'Learning', icon: Loader2, color: '#f59e0b' },
  { value: 'confident', label: 'Confident', icon: CheckCircle2, color: '#3b82f6' },
  { value: 'mastered', label: 'Mastered', icon: Target, color: '#10b981' },
];

export default function DsaRoadmap() {
  const { roadmap, updateRoadmapTopic } = useDsaStore();
  const [filter, setFilter] = useState('all');

  const filteredRoadmap = filter === 'all' 
    ? roadmap 
    : roadmap.filter(t => t.status === filter);

  return (
    <PageWrapper>
      <div className="page-header" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <Link to="/dsa" className="btn-icon" style={{ marginTop: 4 }}><ArrowLeft size={20} /></Link>
        <div>
          <h1><span className="gradient-text">🗺️ DSA Roadmap</span></h1>
          <p>Master 15 core structural patterns for technical interviews</p>
        </div>
      </div>

      <div className="tab-nav" style={{ marginBottom: 'var(--space-lg)' }}>
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All Topics</button>
        {STATUS_OPTIONS.map(opt => (
          <button key={opt.value} className={filter === opt.value ? 'active' : ''} onClick={() => setFilter(opt.value)}>
            <opt.icon size={14} style={{ marginRight: 4, color: opt.color }} /> {opt.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {filteredRoadmap.map((topic, index) => {
          const currentStatus = STATUS_OPTIONS.find(s => s.value === topic.status) || STATUS_OPTIONS[0];
          
          return (
            <motion.div 
              key={topic.id}
              className="glass-card"
              style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${currentStatus.color}20`, color: currentStatus.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>
                {index + 1}
              </div>
              
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{topic.title}</h3>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  {topic.deadline && (
                    <span style={{ fontSize: 'var(--font-xs)', color: new Date(topic.deadline) < new Date() ? 'var(--accent-red)' : 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} /> Due: {new Date(topic.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input 
                  type="date" 
                  value={topic.deadline ? topic.deadline.split('T')[0] : ''}
                  onChange={(e) => updateRoadmapTopic(topic.id, { deadline: e.target.value })}
                  className="input-primary"
                  style={{ padding: '0.4rem 0.8rem', fontSize: 'var(--font-xs)' }}
                />
                
                <select 
                  className="input-primary"
                  value={topic.status}
                  onChange={(e) => updateRoadmapTopic(topic.id, { status: e.target.value })}
                  style={{ 
                    padding: '0.4rem 0.8rem', fontSize: 'var(--font-xs)', fontWeight: 600,
                    color: currentStatus.color, borderColor: `${currentStatus.color}40`,
                    background: `${currentStatus.color}10`
                  }}
                >
                  {STATUS_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </motion.div>
          );
        })}
      </div>
    </PageWrapper>
  );
}
