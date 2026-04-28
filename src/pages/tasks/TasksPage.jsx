import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, Plus, Trash2, Clock, AlertTriangle, Filter, 
  ChevronDown, ChevronUp, Calendar, ListTodo, RefreshCw, GripHorizontal,
  CloudLightning
} from 'lucide-react';
import { ResponsiveGridLayout } from 'react-grid-layout';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import StatsCard from '../../components/shared/StatsCard';
import { useTaskStore, TASK_CATEGORIES } from '../../store/taskStore';
import { useGoogleStore } from '../../store/googleStore';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// ResponsiveGridLayout imported directly from react-grid-layout v2

const PRIORITY_COLORS = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };

const DEFAULT_LAYOUTS = {
  lg: [
    { i: 'stats', x: 0, y: 0, w: 12, h: 2, minW: 6 },
    { i: 'engine', x: 0, y: 2, w: 12, h: 8, minW: 6 },
  ]
};

export default function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskCompletion } = useTaskStore();
  const { 
    isAuthenticated, isTokenValid, googleTasks, fetchGoogleTasks,
    createCalendarEvent, createGoogleTask 
  } = useGoogleStore();
  
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState({ category: 'all', priority: 'all', status: 'all' });
  const [form, setForm] = useState({ title: '', description: '', category: 'personal', priority: 'medium', dueDate: '', deadline: '', status: 'todo' });
  const [expandedTask, setExpandedTask] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [layouts, setLayouts] = useState(DEFAULT_LAYOUTS);

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
    addTask({
      ...form,
      dueDate: form.dueDate || null,
      deadline: form.deadline || null,
    });
    setForm({ title: '', description: '', category: 'personal', priority: 'medium', dueDate: '', deadline: '', status: 'todo' });
    setShowAdd(false);
  };

  const handleGoogleSync = async () => {
    if (!isAuthenticated) return alert("Please connect Google account first");
    setSyncing(true);
    try {
      await fetchGoogleTasks();
    } catch (err) {
      alert("Sync failed: " + err.message);
    }
    setSyncing(false);
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const overdueTasks = tasks.filter(t => (t.dueDate || t.deadline) && new Date(t.deadline || t.dueDate) < new Date() && !t.completed).length;
  const highPriority = tasks.filter(t => t.priority === 'high' && !t.completed).length;

  return (
    <PageWrapper>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1><span className="gradient-text">✅ Task Engine</span></h1>
          <p>Fluid, draggable task management ecosystem</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn-secondary" 
            onClick={handleGoogleSync} 
            disabled={syncing}
            style={{ border: '1px dashed var(--border-primary)', background: 'transparent' }}
          >
            <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Syncing...' : 'Sync Google Tasks'}
          </button>
          <button className="btn-primary" onClick={() => setShowAdd(true)}>
            <Plus size={16} /> New Task
          </button>
        </div>
      </div>

      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={60}
        draggableHandle=".drag-handle"
        onLayoutChange={(c, all) => setLayouts(all)}
      >
        {/* Widget 1: Stats Row */}
        <div key="stats">
          <div className="glass-card h-full flex flex-col overflow-hidden">
            <div className="drag-handle p-2 flex justify-center cursor-grab active:cursor-grabbing border-b border-border hover:bg-muted/50 transition-colors">
              <GripHorizontal size={16} className="text-muted-foreground/30" />
            </div>
            <div className="flex-1 grid grid-cols-4 gap-4 p-4">
              <StatsCard icon={CheckCircle} label="Total" value={totalTasks} color="#8b5cf6" variant="minimal" />
              <StatsCard icon={Clock} label="Pending" value={totalTasks - completedTasks} color="#3b82f6" variant="minimal" />
              <StatsCard icon={AlertTriangle} label="Overdue" value={overdueTasks} color="#ef4444" variant="minimal" className="text-red-500" />
              <StatsCard icon={Filter} label="High Priority" value={highPriority} color="#f59e0b" variant="minimal" />
            </div>
          </div>
        </div>

        {/* Widget 2: Task Engine */}
        <div key="engine">
          <div className="glass-card h-full flex flex-col overflow-hidden">
            <div className="drag-handle p-2 flex justify-center cursor-grab active:cursor-grabbing border-b border-border hover:bg-muted/50 transition-colors">
              <GripHorizontal size={16} className="text-muted-foreground/30" />
            </div>
            
            {/* Sticky Header with Filters */}
            <div className="p-4 border-b border-border bg-card/50 backdrop-blur-sm z-10">
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <select 
                  value={filter.category} 
                  onChange={e => setFilter({...filter, category: e.target.value})} 
                  className="bg-muted/50 border-border text-xs rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">All Categories</option>
                  {TASK_CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
                <select 
                  value={filter.priority} 
                  onChange={e => setFilter({...filter, priority: e.target.value})}
                  className="bg-muted/50 border-border text-xs rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">All Priority</option>
                  <option value="high">🔴 High</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="low">🟢 Low</option>
                </select>
                <select 
                  value={filter.status} 
                  onChange={e => setFilter({...filter, status: e.target.value})}
                  className="bg-muted/50 border-border text-xs rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">All Status</option>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>

            {/* List Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {filtered.length > 0 ? (
                <div className="flex flex-col">
                  {filtered.map(task => {
                    const deadlineDate = task.deadline || task.dueDate;
                    const isOverdue = deadlineDate && new Date(deadlineDate) < new Date() && !task.completed;
                    const isExpanded = expandedTask === task.id;
                    return (
                      <div key={task.id} className="border-b border-border bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3 px-4 py-3">
                          <input 
                            type="checkbox" 
                            checked={task.completed} 
                            onChange={() => toggleTaskCompletion(task.id)} 
                            className="w-5 h-5 cursor-pointer accent-primary shrink-0" 
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-0.5">
                              <span className={`font-bold text-card-foreground transition-all ${task.completed ? 'line-through opacity-40' : ''}`}>
                                {task.title}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full bg-primary/10 text-primary border border-primary/20">
                                  {task.category}
                                </span>
                                <span 
                                  className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full border"
                                  style={{ 
                                    backgroundColor: `${PRIORITY_COLORS[task.priority]}10`, 
                                    color: PRIORITY_COLORS[task.priority],
                                    borderColor: `${PRIORITY_COLORS[task.priority]}30`
                                  }}
                                >
                                  {task.priority}
                                </span>
                                {isOverdue && (
                                  <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
                                    ⚠️ Overdue
                                  </span>
                                )}
                              </div>
                            </div>
                            {deadlineDate && (
                              <div className={`text-[10px] font-medium ${isOverdue ? 'text-red-500' : 'text-muted-foreground'}`}>
                                Due: {new Date(deadlineDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <select 
                              value={task.status} 
                              onChange={e => updateTask(task.id, { status: e.target.value, completed: e.target.value === 'done' })}
                              className="bg-muted/50 border-none text-[10px] font-bold rounded-md px-2 py-1 outline-none"
                            >
                              <option value="todo">📋 To Do</option>
                              <option value="in-progress">🔄 In Progress</option>
                              <option value="done">✅ Done</option>
                            </select>
                            <button className="p-1.5 hover:bg-muted rounded-md text-muted-foreground" onClick={() => setExpandedTask(isExpanded ? null : task.id)}>
                              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                            <button className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded-md text-muted-foreground transition-colors" onClick={() => deleteTask(task.id)}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        {isExpanded && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="px-12 pb-4 pt-1"
                          >
                            {task.description && <p className="text-xs text-muted-foreground leading-relaxed mb-2">{task.description}</p>}
                            <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">
                              <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                              {task.googleTaskId && <span className="flex items-center gap-1 text-green-500"><CloudLightning size={10} /> Synced</span>}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 opacity-20">
                  <CheckCircle size={64} className="mb-4" />
                  <h3 className="text-xl font-bold">No Tasks Found</h3>
                  <p className="text-sm">Adjust your filters or create a new one</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </ResponsiveGridLayout>

      {/* Add Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="New Task">
        <div className="form-grid">
          <div className="form-group full-width">
            <label>Title</label>
            <input 
              value={form.title} 
              onChange={e => setForm({...form, title: e.target.value})} 
              placeholder="What needs to be done?" 
              className="bg-muted/50 border-border focus:ring-primary/20"
            />
          </div>
          <div className="form-group full-width">
            <label>Description (optional)</label>
            <textarea 
              value={form.description} 
              onChange={e => setForm({...form, description: e.target.value})} 
              placeholder="Additional details..." 
              rows={2} 
              className="bg-muted/50 border-border focus:ring-primary/20"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">
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
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="form-group"><label>Due Date</label><input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} /></div>
            <div className="form-group"><label>Deadline (for sync)</label><input type="datetime-local" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} /></div>
          </div>
          <div className="form-group full-width" style={{ marginTop: '0.5rem' }}>
            <button className="btn-primary w-full justify-center py-4" onClick={handleAdd}>Create Task</button>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
}
