import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import { LEADERSHIP_ASPECTS, LEADERSHIP_RESOURCES } from '../../store/leadershipStore';

export default function LeadershipResources() {
  const [expandedAspect, setExpandedAspect] = useState(null);

  const typeColors = {
    technique: '#8b5cf6', framework: '#3b82f6', principle: '#10b981',
    practice: '#f59e0b', method: '#06b6d4', template: '#ec4899', concept: '#f97316',
  };

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">📖 Leadership Resources</span></h1>
        <p>Proven frameworks, techniques, and practices to develop each leadership skill</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {LEADERSHIP_ASPECTS.map((aspect, i) => {
          const resources = LEADERSHIP_RESOURCES[aspect.key] || [];
          const isExpanded = expandedAspect === aspect.key;

          return (
            <motion.div key={aspect.key} className="glass-card" style={{ overflow: 'hidden' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <button onClick={() => setExpandedAspect(isExpanded ? null : aspect.key)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', background: 'none', color: 'var(--text-primary)', borderBottom: isExpanded ? '2px solid var(--border-primary)' : 'none', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{aspect.emoji}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 'var(--font-md)' }}>{aspect.label}</div>
                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>{aspect.description}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-cyan">{resources.length} resources</span>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              {isExpanded && resources.length > 0 && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} style={{ padding: '1rem 1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {resources.map((res, j) => (
                      <div key={j} style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-primary)', borderLeft: `4px solid ${typeColors[res.type] || '#8b5cf6'}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                          <h4 style={{ fontWeight: 700, fontSize: 'var(--font-sm)' }}>{res.title}</h4>
                          <span className="badge" style={{ background: `${typeColors[res.type] || '#8b5cf6'}15`, color: typeColors[res.type] || '#8b5cf6', fontSize: '9px' }}>{res.type}</span>
                        </div>
                        <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{res.description}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </PageWrapper>
  );
}
