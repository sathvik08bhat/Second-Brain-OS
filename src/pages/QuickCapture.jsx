import { useState } from 'react';
import { motion } from 'framer-motion';
import { Inbox, Plus, Trash2, Check, X } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import { useGlobalStore } from '../store/globalStore';
import { formatDate } from '../utils/helpers';

export default function QuickCapture() {
  const { quickCaptures, addQuickCapture, deleteQuickCapture, toggleQuickCapture } = useGlobalStore();
  const [input, setInput] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    addQuickCapture(input.trim());
    setInput('');
  };

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">Quick Capture</span></h1>
        <p>Dump your thoughts, ideas, and tasks here. Process them later.</p>
      </div>

      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What's on your mind? Type and press Enter..."
          style={{ flex: 1 }}
          autoFocus
        />
        <button type="submit" className="btn-primary">
          <Plus size={16} /> Capture
        </button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {quickCaptures.length === 0 ? (
          <div className="empty-state">
            <Inbox size={48} />
            <h3>Inbox Zero</h3>
            <p>Your quick capture inbox is empty. Start typing above to capture ideas.</p>
          </div>
        ) : (
          quickCaptures.map((note, index) => (
            <motion.div
              key={note.id}
              className="glass-card"
              style={{
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                opacity: note.processed ? 0.5 : 1,
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: note.processed ? 0.5 : 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                className="btn-icon"
                onClick={() => toggleQuickCapture(note.id)}
                style={{
                  color: note.processed ? 'var(--accent-green)' : 'var(--text-muted)',
                  border: `2px solid ${note.processed ? 'var(--accent-green)' : 'var(--border-secondary)'}`,
                  borderRadius: '50%',
                  width: 28,
                  height: 28,
                }}
              >
                {note.processed && <Check size={14} />}
              </button>
              <div style={{ flex: 1 }}>
                <div style={{
                  textDecoration: note.processed ? 'line-through' : 'none',
                  fontSize: 'var(--font-base)',
                }}>{note.text}</div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {formatDate(note.createdAt)}
                </div>
              </div>
              <button className="btn-icon" onClick={() => deleteQuickCapture(note.id)}>
                <Trash2 size={15} />
              </button>
            </motion.div>
          ))
        )}
      </div>
    </PageWrapper>
  );
}
