import { useState } from 'react';
import { motion } from 'framer-motion';
import { Kanban, Plus, Trash2, Edit3, Check } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useStartupStore } from '../../store/startupStore';

export default function SprintBoard() {
  const { tasks, addTask, updateTask, deleteTask, moveTask } = useStartupStore();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', status: 'backlog' });

  const columns = [
    { id: 'backlog', title: 'Backlog', color: '#6b6b80' },
    { id: 'todo', title: 'To Do', color: '#3b82f6' },
    { id: 'inProgress', title: 'In Progress', color: '#f59e0b' },
    { id: 'done', title: 'Done', color: '#10b981' }
  ];

  const handleSubmit = (e) => { e.preventDefault(); if (editId) updateTask(editId, form); else addTask(form); resetForm(); };
  const resetForm = () => { setForm({ title: '', description: '', priority: 'medium', status: 'backlog' }); setEditId(null); setShowModal(false); };
  const startEdit = (t) => { setForm({ title: t.title, description: t.description || '', priority: t.priority, status: t.status }); setEditId(t.id); setShowModal(true); };

  const priorityColors = { low: 'badge-blue', medium: 'badge-yellow', high: 'badge-red' };

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">📋 Sprint Board</span></h1>
        <p>Manage startup development tasks</p>
        <div className="header-actions"><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Task</button></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
        {columns.map(col => (
          <div key={col.id} className="glass-card" style={{ padding: '1rem', minHeight: '60vh', background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h3 style={{ fontSize: 'var(--font-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: col.color, borderBottom: `2px solid ${col.color}40`, paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>{col.title} <span style={{ float: 'right', color: 'var(--text-tertiary)' }}>{tasks.filter(t => t.status === col.id).length}</span></h3>
            {tasks.filter(t => t.status === col.id).map(task => (
              <motion.div key={task.id} className="glass-card" style={{ padding: '0.85rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)', cursor: 'grab' }} layoutId={task.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--font-sm)' }}>{task.title}</div>
                  <button className="btn-icon" onClick={() => startEdit(task)} style={{ padding: '0.1rem' }}><Edit3 size={12} /></button>
                </div>
                {task.description && <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>{task.description}</p>}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={`badge ${priorityColors[task.priority]}`}>{task.priority}</span>
                  <select value={task.status} onChange={(e) => moveTask(task.id, e.target.value)} style={{ padding: '0.1rem 0.3rem', fontSize: '10px', width: 'auto' }}>
                    {columns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={resetForm} title={editId ? 'Edit Task' : 'Add Task'}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full-width"><label>Task Title *</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
            <div className="form-group full-width"><label>Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} /></div>
            <div className="form-group"><label>Priority</label><select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
            <div className="form-group"><label>Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="backlog">Backlog</option><option value="todo">To Do</option><option value="inProgress">In Progress</option><option value="done">Done</option></select></div>
          </div>
          <div className="modal-actions"><button type="submit" className="btn-primary"><Check size={16} /> Save</button></div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
