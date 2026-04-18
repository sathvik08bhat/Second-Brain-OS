import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Trash2, Edit3, Check } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { usePersonalStore } from '../../store/personalStore';
import { formatDateShort } from '../../utils/helpers';

export default function Journal() {
  const { journalEntries, addJournalEntry, updateJournalEntry, deleteJournalEntry } = usePersonalStore();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], mood: 'good', content: '', tags: '' });

  const handleSubmit = (e) => { e.preventDefault(); if (editId) updateJournalEntry(editId, form); else addJournalEntry(form); resetForm(); };
  const resetForm = () => { setForm({ date: new Date().toISOString().split('T')[0], mood: 'good', content: '', tags: '' }); setEditId(null); setShowModal(false); };
  const startEdit = (j) => { setForm({ date: j.date, mood: j.mood, content: j.content, tags: j.tags || '' }); setEditId(j.id); setShowModal(true); };

  const moodEmojis = { great: '🤩 Great', good: '🙂 Good', neutral: '😐 Neutral', bad: '😔 Bad', terrible: '😫 Terrible' };

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">📖 Daily Journal</span></h1>
        <p>Reflect on your day, thoughts, and emotions</p>
        <div className="header-actions"><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> New Entry</button></div>
      </div>

      {journalEntries.length === 0 ? (
        <div className="empty-state"><BookOpen size={48} /><h3>No Entries Yet</h3><p>Start recording your daily thoughts.</p><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> First Entry</button></div>
      ) : (
        <div className="grid-auto">
          {journalEntries.sort((a,b) => new Date(b.date) - new Date(a.date)).map((entry, i) => (
            <motion.div key={entry.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                <div style={{ fontWeight: 600, color: 'var(--accent-purple-light)' }}>{formatDateShort(entry.date)}</div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: 'var(--font-sm)' }}>{moodEmojis[entry.mood]}</span>
                  <button className="btn-icon" onClick={() => startEdit(entry)}><Edit3 size={14} /></button>
                  <button className="btn-icon" onClick={() => deleteJournalEntry(entry.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={14} /></button>
                </div>
              </div>
              <p style={{ fontSize: 'var(--font-md)', lineHeight: 1.6, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', flex: 1 }}>{entry.content}</p>
              {entry.tags && (
                <div style={{ marginTop: '1rem', paddingTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {entry.tags.split(',').map(t => t.trim()).filter(Boolean).map((t, idx) => (
                    <span key={idx} className="badge" style={{ background: '#3b82f615', color: '#3b82f6', fontSize: '10px' }}>#{t}</span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={resetForm} title={editId ? 'Edit Entry' : 'New Entry'} size="lg">
        <form onSubmit={handleSubmit}>
          <div className="form-grid cols-1">
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="form-group" style={{ flex: 1 }}><label>Date *</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></div>
              <div className="form-group" style={{ flex: 1 }}><label>Mood</label><select value={form.mood} onChange={(e) => setForm({ ...form, mood: e.target.value })}><option value="great">Great 🤩</option><option value="good">Good 🙂</option><option value="neutral">Neutral 😐</option><option value="bad">Bad 😔</option><option value="terrible">Terrible 😫</option></select></div>
            </div>
            <div className="form-group"><label>What's on your mind? *</label><textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required rows={8} autoFocus placeholder="Write your thoughts here..." /></div>
            <div className="form-group"><label>Tags (comma separated)</label><input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="e.g. productivity, ideas, stress" /></div>
          </div>
          <div className="modal-actions"><button type="submit" className="btn-primary"><Check size={16} /> Save Entry</button></div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
