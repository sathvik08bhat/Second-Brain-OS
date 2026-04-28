import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Plus, ChevronDown, ChevronRight, Trash2, Check, X, Calendar } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useAimlStore, TOPIC_STATUS } from '../../store/aimlStore';
import { useGoogleStore } from '../../store/googleStore';

export default function AimlRoadmap() {
  const { roadmap, updateTopicStatus, updateTopicDeadline, addCustomTopic, deleteTopic, addCategory } = useAimlStore();
  const { isAuthenticated, createCalendarEvent } = useGoogleStore();
  const [expandedCats, setExpandedCats] = useState({});
  const [showAddTopic, setShowAddTopic] = useState(null); // categoryId or null
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newTopic, setNewTopic] = useState({ name: '', deadline: '' });
  const [newCategory, setNewCategory] = useState({ category: '', color: 'var(--accent-primary)' });
  const [syncing, setSyncing] = useState(null);

  const toggleCat = (id) => setExpandedCats(prev => ({ ...prev, [id]: !prev[id] }));

  const handleAddTopic = (catId) => {
    if (!newTopic.name.trim()) return;
    addCustomTopic(catId, { name: newTopic.name, deadline: newTopic.deadline || null });
    setNewTopic({ name: '', deadline: '' });
    setShowAddTopic(null);
  };

  const handleAddCategory = () => {
    if (!newCategory.category.trim()) return;
    addCategory(newCategory);
    setNewCategory({ category: '', color: 'var(--accent-primary)' });
    setShowAddCategory(false);
  };

  const handleSyncToCalendar = async (topic, catName) => {
    if (!topic.deadline) return;
    setSyncing(topic.id);
    try {
      await createCalendarEvent({
        title: `📚 ${topic.name} — ${catName}`,
        description: `AI/ML Learning Deadline\nCategory: ${catName}\nTopic: ${topic.name}`,
        startDate: topic.deadline,
      });
      alert('✅ Synced to Google Calendar!');
    } catch (err) {
      alert('❌ Failed: ' + err.message);
    }
    setSyncing(null);
  };

  const catColors = ['var(--accent-primary)', '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#06b6d4', '#ec4899', '#f97316'];

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">🗺️ Learning Roadmap</span></h1>
        <p>Track your topic-by-topic AI/ML mastery</p>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setShowAddCategory(true)}>
            <Plus size={16} /> Add Category
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {roadmap.map((cat) => {
          const isExpanded = expandedCats[cat.id] !== false; // default expanded
          const masteredCount = cat.topics.filter(t => t.status === 'mastered').length;
          const confidentCount = cat.topics.filter(t => t.status === 'confident').length;
          const progress = cat.topics.length > 0
            ? Math.round(((masteredCount + confidentCount * 0.7) / cat.topics.length) * 100)
            : 0;

          return (
            <motion.div
              key={cat.id}
              className="glass-card"
              style={{ overflow: 'hidden' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Category Header */}
              <div
                onClick={() => toggleCat(cat.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '1rem 1.25rem', cursor: 'pointer',
                  borderBottom: isExpanded ? '2px solid var(--border-primary)' : 'none',
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                  background: `${cat.color}15`, color: cat.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `2px solid ${cat.color}30`,
                }}>
                  <Layers size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 'var(--font-md)' }}>{cat.category}</div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
                    {masteredCount}/{cat.topics.length} mastered • {progress}% complete
                  </div>
                </div>
                <div className="progress-bar-container" style={{ width: 120, height: 6 }}>
                  <motion.div
                    className="progress-bar-fill"
                    style={{ background: cat.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </div>

              {/* Topics */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {cat.topics.map((topic) => (
                      <div
                        key={topic.id}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.75rem',
                          padding: '0.7rem 1.25rem',
                          borderBottom: '1px solid var(--border-primary)',
                          fontSize: 'var(--font-sm)',
                        }}
                      >
                        {/* Status dot */}
                        <div style={{
                          width: 10, height: 10, borderRadius: '50%',
                          background: TOPIC_STATUS[topic.status].color,
                          flexShrink: 0,
                          boxShadow: topic.status === 'mastered' ? `0 0 8px ${TOPIC_STATUS[topic.status].color}` : 'none',
                        }} />

                        <span style={{ flex: 1, fontWeight: 500, color: 'var(--text-primary)' }}>{topic.name}</span>

                        {/* Deadline */}
                        <input
                          type="date"
                          value={topic.deadline || ''}
                          onChange={(e) => updateTopicDeadline(cat.id, topic.id, e.target.value || null)}
                          style={{
                            width: 130, fontSize: 'var(--font-xs)', padding: '0.2rem 0.4rem',
                            background: 'var(--bg-input)', border: '1px solid var(--border-primary)',
                            borderRadius: 'var(--radius-sm)', boxShadow: 'none',
                          }}
                          title="Set deadline"
                        />

                        {/* Sync to Calendar */}
                        {isAuthenticated && topic.deadline && (
                          <button
                            className="btn-icon"
                            onClick={() => handleSyncToCalendar(topic, cat.category)}
                            disabled={syncing === topic.id}
                            title="Sync to Google Calendar"
                            style={{ color: 'var(--accent-blue)' }}
                          >
                            <Calendar size={14} />
                          </button>
                        )}

                        {/* Status Selector */}
                        <select
                          value={topic.status}
                          onChange={(e) => updateTopicStatus(cat.id, topic.id, e.target.value)}
                          style={{
                            width: 120, fontSize: 'var(--font-xs)', padding: '0.25rem 0.4rem',
                            background: `${TOPIC_STATUS[topic.status].color}10`,
                            color: TOPIC_STATUS[topic.status].color,
                            border: `1px solid ${TOPIC_STATUS[topic.status].color}40`,
                            borderRadius: 'var(--radius-sm)', fontWeight: 600,
                            boxShadow: 'none',
                          }}
                        >
                          {Object.entries(TOPIC_STATUS).map(([key, val]) => (
                            <option key={key} value={key}>{val.label}</option>
                          ))}
                        </select>

                        {/* Delete */}
                        <button className="btn-icon" onClick={() => deleteTopic(cat.id, topic.id)} style={{ color: 'var(--accent-red)' }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}

                    {/* Add Topic */}
                    {showAddTopic === cat.id ? (
                      <div style={{ display: 'flex', gap: '0.5rem', padding: '0.6rem 1.25rem', alignItems: 'center' }}>
                        <input
                          value={newTopic.name}
                          onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
                          placeholder="Topic name..."
                          style={{ flex: 1, fontSize: 'var(--font-xs)', padding: '0.35rem 0.6rem', boxShadow: 'none' }}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddTopic(cat.id)}
                          autoFocus
                        />
                        <input
                          type="date"
                          value={newTopic.deadline}
                          onChange={(e) => setNewTopic({ ...newTopic, deadline: e.target.value })}
                          style={{ width: 130, fontSize: 'var(--font-xs)', padding: '0.3rem 0.4rem', boxShadow: 'none' }}
                        />
                        <button className="btn-icon" onClick={() => handleAddTopic(cat.id)} style={{ color: 'var(--accent-green)' }}><Check size={16} /></button>
                        <button className="btn-icon" onClick={() => setShowAddTopic(null)}><X size={16} /></button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowAddTopic(cat.id)}
                        style={{
                          width: '100%', padding: '0.6rem', background: 'none',
                          color: 'var(--text-muted)', fontSize: 'var(--font-xs)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
                          border: 'none', cursor: 'pointer',
                        }}
                      >
                        <Plus size={13} /> Add Topic
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Add Category Modal */}
      <Modal isOpen={showAddCategory} onClose={() => setShowAddCategory(false)} title="Add New Category">
        <div className="form-grid">
          <div className="form-group full-width">
            <label>Category Name</label>
            <input value={newCategory.category} onChange={(e) => setNewCategory({ ...newCategory, category: e.target.value })} placeholder="e.g. Reinforcement Learning" />
          </div>
          <div className="form-group full-width">
            <label>Color</label>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {catColors.map(c => (
                <button
                  key={c}
                  onClick={() => setNewCategory({ ...newCategory, color: c })}
                  style={{
                    width: 32, height: 32, borderRadius: '50%', background: c,
                    border: newCategory.color === c ? '3px solid var(--text-primary)' : '2px solid var(--border-primary)',
                    cursor: 'pointer', boxShadow: newCategory.color === c ? '2px 2px 0 #000' : 'none',
                  }}
                />
              ))}
            </div>
          </div>
          <div className="form-group full-width" style={{ marginTop: '0.5rem' }}>
            <button className="btn-primary" onClick={handleAddCategory} style={{ width: '100%', justifyContent: 'center' }}>
              Add Category
            </button>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
}
