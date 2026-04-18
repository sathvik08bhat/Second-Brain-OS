import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Plus, Trash2, Clock, AlertTriangle, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import StatsCard from '../../components/shared/StatsCard';
import { useTaskStore, TASK_CATEGORIES } from '../../store/taskStore';

const PRIORITY_COLORS = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };
const STATUS_LABELS = { todo: '📋 To Do', 'in-progress': '🔄 In Progress', done: '✅ Done' };

export default function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskCompletion } = useTaskStore();
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState({ category: 'all', priority: 'all', status: 'all' });
  const [form, setForm] = useState({ title: '', description: '', category: 'personal', priority: 'medium', dueDate: '', status: 'todo' });
  const [expandedTask, setExpandedTask] = useState(null);

  const filtered = tasks
    .filter(t => filter.category === 'all' || t.category === filter.category)
    .filter(t => filter.priority === 'all' || t.priority === filter.priority)
    .filter(t => filter.status === 'all' || t.status === filter.status)
    .sort((a, b) => {
      const pri = { high: 3, medium: 2, low: 1 };
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return (pri[b.priority] || 0) - (pri[a.priority] || 0);
    });

  const handleAdd = () => {
    if (!form.title.trim()) return;
    addTask(form);
    setForm({ title: '', description: '', category: 'personal', priority: 'medium', dueDate: '', status: 'todo' });
    setShowAdd(false);
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && !t.completed).length;
  const highPriority = tasks.filter(t => t.priority === 'high' && !t.completed).length;

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">✅ Task Tracker</span></h1>
        <p>Manage all your tasks across every life area</p>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={16} /> New Task</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-xl)' }}>
        <StatsCard icon={CheckCircle} label="Total Tasks" value={totalTasks} subtitle={`${completedTasks} completed`} color="#8b5cf6" />
        <StatsCard icon={Clock} label="Pending" value={totalTasks - completedTasks} subtitle="To complete" color="#3b82f6" delay={0.1} />
        <StatsCard icon={AlertTriangle} label="Overdue" value={overdueTasks} subtitle="Past deadline" color="#ef4444" delay={0.2} />
        <StatsCard icon={Filter} label="High Priority" value={highPriority} subtitle="Urgent tasks" color="#f59e0b" delay={0.3} />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}>
        <select value={filter.category} onChange={e => setFilter({...filter, category: e.target.value})} style={{ width: 150 }}>
          <option value="all">All Categories</option>
          {TASK_CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
        <select value={filter.priority} onChange={e => setFilter({...filter, priority: e.target.value})} style={{ width: 130 }}>
          <option value="all">All Priority</option>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>
        <select value={filter.status} onChange={e => setFilter({...filter, status: e.target.value})} style={{ width: 140 }}>
          <option value="all">All Status</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {/* Task List */}
      <motion.div className="glass-card" style={{ overflow: 'hidden' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {filtered.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filtered.map(task => {
              const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
              const isExpanded = expandedTask === task.id;
              return (
                <div key={task.id} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1.25rem' }}>
                    <input type="checkbox" checked={task.completed} onChange={() => toggleTaskCompletion(task.id)} style={{ width: 20, height: 20, cursor: 'pointer', accentColor: '#8b5cf6', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 600, textDecoration: task.completed ? 'line-through' : 'none', opacity: task.completed ? 0.5 : 1, color: 'var(--text-primary)' }}>{task.title}</span>
                        <span className="badge" style={{ background: `${PRIORITY_COLORS[task.priority]}15`, color: PRIORITY_COLORS[task.priority], fontSize: '9px' }}>{task.priority}</span>
                        <span className="badge badge-blue" style={{ fontSize: '9px' }}>{task.category}</span>
                        {isOverdue && <span className="badge badge-red" style={{ fontSize: '9px' }}>⚠️ Overdue</span>}
                        {task.linkedTransactionId && <span className="badge badge-purple" style={{ fontSize: '9px' }}>💰 Linked</span>}
                      </div>
                      {task.dueDate && <div style={{ fontSize: 'var(--font-xs)', color: isOverdue ? 'var(--accent-red)' : 'var(--text-muted)' }}>Due: {task.dueDate}</div>}
                    </div>
                    <select value={task.status} onChange={e => updateTask(task.id, { status: e.target.value, completed: e.target.value === 'done' })} style={{ width: 130, fontSize: 'var(--font-xs)' }}>
                      <option value="todo">📋 To Do</option>
                      <option value="in-progress">🔄 In Progress</option>
                      <option value="done">✅ Done</option>
                    </select>
                    <button className="btn-icon" onClick={() => setExpandedTask(isExpanded ? null : task.id)}>{isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</button>
                    <button className="btn-icon" onClick={() => deleteTask(task.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={14} /></button>
                  </div>
                  {isExpanded && (
                    <div style={{ padding: '0 1.25rem 0.85rem 3.5rem', fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
                      {task.description && <p>{task.description}</p>}
                      <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Created: {new Date(task.createdAt).toLocaleDateString('en-IN')}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state"><CheckCircle size={48} /><h3>No Tasks</h3><p>Create your first task to get started!</p></div>
        )}
      </motion.div>

      {/* Add Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="New Task">
        <div className="form-grid">
          <div className="form-group full-width"><label>Title</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="What needs to be done?" /></div>
          <div className="form-group full-width"><label>Description (optional)</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Additional details..." rows={2} /></div>
          <div className="form-group">
            <label>Category</label>
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              {TASK_CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
          </div>
          <div className="form-group"><label>Due Date</label><input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} /></div>
          <div className="form-group">
            <label>Status</label>
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
            </select>
          </div>
          <div className="form-group full-width" style={{ marginTop: '0.5rem' }}><button className="btn-primary" onClick={handleAdd} style={{ width: '100%', justifyContent: 'center' }}>Create Task</button></div>
        </div>
      </Modal>
    </PageWrapper>
  );
}
