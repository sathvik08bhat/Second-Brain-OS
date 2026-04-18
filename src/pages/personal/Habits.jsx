import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Plus, Trash2, Edit3, Check, X } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { usePersonalStore } from '../../store/personalStore';

export default function Habits() {
  const { habits, habitLogs, addHabit, updateHabit, deleteHabit, toggleHabitLog } = usePersonalStore();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', frequency: 'daily', category: 'health' });

  const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM
  const [month, setMonth] = useState(currentMonth);

  const getDaysInMonth = (yearMonth) => {
    const [year, m] = yearMonth.split('-');
    return new Date(year, m, 0).getDate();
  };

  const days = getDaysInMonth(month);
  const daysArray = Array.from({ length: days }, (_, i) => {
    const day = i + 1;
    return `${month}-${day.toString().padStart(2, '0')}`;
  });

  const handleSubmit = (e) => { e.preventDefault(); if (editId) updateHabit(editId, form); else addHabit(form); resetForm(); };
  const resetForm = () => { setForm({ title: '', frequency: 'daily', category: 'health' }); setEditId(null); setShowModal(false); };
  const startEdit = (h) => { setForm({ title: h.title, frequency: h.frequency, category: h.category }); setEditId(h.id); setShowModal(true); };

  const getCategoryColor = (cat) => { 
    const colors = { health: '#10b981', learning: '#3b82f6', productivity: '#8b5cf6', mindfulness: '#ec4899' }; 
    if (colors[cat]) return colors[cat];
    let hash = 0;
    for (let i = 0; i < cat.length; i++) hash = cat.charCodeAt(i) + ((hash << 5) - hash);
    return `hsl(${Math.abs(hash) % 360}, 70%, 60%)`;
  };

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">✅ Habit Tracker</span></h1>
        <p>Build consistency and track your daily routines</p>
        <div className="header-actions">
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} style={{ padding: '0.4rem', borderRadius: '4px', background: 'var(--bg-card)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }} />
          <button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Habit</button>
        </div>
      </div>

      {habits.length === 0 ? (
        <div className="empty-state"><CheckSquare size={48} /><h3>No Habits Tracked</h3><p>Add a habit to start building consistency.</p></div>
      ) : (
        <div className="glass-card" style={{ padding: '1rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', minWidth: '800px' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.5rem', minWidth: '150px' }}>Habit</th>
                {daysArray.map((date, i) => (
                  <th key={date} style={{ padding: '0.2rem', fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 'normal' }}>
                    {i + 1}
                  </th>
                ))}
                <th style={{ padding: '0.5rem' }}></th>
              </tr>
            </thead>
            <tbody>
              {habits.map((habit, i) => (
                <motion.tr key={habit.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ textAlign: 'left', padding: '0.75rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <span style={{ fontWeight: 600, fontSize: 'var(--font-sm)' }}>{habit.title}</span>
                    <span style={{ fontSize: '10px', color: getCategoryColor(habit.category), textTransform: 'uppercase' }}>{habit.category}</span>
                  </td>
                  {daysArray.map(date => {
                    const isDone = habitLogs.some(l => l.habitId === habit.id && l.date === date);
                    return (
                      <td key={date} style={{ padding: '0.2rem' }}>
                        <button
                          onClick={() => toggleHabitLog(habit.id, date)}
                          style={{
                            width: '20px', height: '20px', borderRadius: '4px', border: 'none', cursor: 'pointer',
                            background: isDone ? getCategoryColor(habit.category) : 'var(--bg-secondary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s ease', transform: isDone ? 'scale(1.1)' : 'scale(1)'
                          }}
                        >
                          {isDone ? <Check size={12} color="white" /> : <X size={10} color="var(--text-muted)" opacity={0.3} />}
                        </button>
                      </td>
                    );
                  })}
                  <td style={{ padding: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.2rem', justifyContent: 'center' }}>
                      <button className="btn-icon" onClick={() => startEdit(habit)} style={{ padding: '0.2rem' }}><Edit3 size={12} /></button>
                      <button className="btn-icon" onClick={() => deleteHabit(habit.id)} style={{ color: 'var(--accent-red)', padding: '0.2rem' }}><Trash2 size={12} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showModal} onClose={resetForm} title={editId ? 'Edit Habit' : 'Add Habit'}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full-width"><label>Habit Name *</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="e.g. Read 10 pages, Meditate" /></div>
            <div className="form-group">
              <label>Category</label>
              <input list="category-options" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. finance, health..." />
              <datalist id="category-options">
                <option value="health" />
                <option value="learning" />
                <option value="productivity" />
                <option value="mindfulness" />
              </datalist>
            </div>
            <div className="form-group"><label>Frequency</label><select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}><option value="daily">Daily</option><option value="weekly">Weekly</option></select></div>
          </div>
          <div className="modal-actions"><button type="submit" className="btn-primary"><Check size={16} /> Save</button></div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
