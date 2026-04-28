import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, Plus, Trash2, Clock, AlertTriangle, Filter, 
  ChevronDown, ChevronUp, Calendar, ListTodo, RefreshCw, GripHorizontal,
  CloudLightning, List, LayoutGrid, AlertCircle, Clock3
} from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import StatsCard from '../../components/shared/StatsCard';
import { useTaskStore, TASK_CATEGORIES } from '../../store/taskStore';
import { useGoogleStore } from '../../store/googleStore';

const PRIORITY_COLORS = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };

export default function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskCompletion } = useTaskStore();
  const { 
    isAuthenticated, isTokenValid, googleTasks, fetchGoogleTasks,
    createCalendarEvent, createGoogleTask 
  } = useGoogleStore();
  
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState({ category: 'all', priority: 'all', status: 'all' });
  const [form, setForm] = useState({ title: '', description: '', category: 'personal', priority: 'medium', dueDate: '', deadline: '', status: 'not_started' });
  const [expandedTask, setExpandedTask] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [activeView, setActiveView] = useState('status');

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
    setForm({ title: '', description: '', category: 'personal', priority: 'medium', dueDate: '', deadline: '', status: 'not_started' });
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

      <div className="flex flex-col gap-6 h-[calc(100vh-140px)]">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
          <StatsCard icon={CheckCircle} label="Total" value={totalTasks} color="var(--accent-primary)" variant="minimal" />
          <StatsCard icon={Clock} label="Pending" value={totalTasks - completedTasks} color="var(--accent-blue)" variant="minimal" />
          <StatsCard icon={AlertTriangle} label="Overdue" value={overdueTasks} color="var(--color-danger)" variant="minimal" />
          <StatsCard icon={Filter} label="High Priority" value={highPriority} color="var(--color-warning)" variant="minimal" />
        </div>

        {/* Task Engine Area */}
        <div className="bg-card border border-border/50 rounded-2xl shadow-sm flex flex-col flex-1 overflow-hidden relative group">
          {/* View Switcher Tabs */}
          <div className="flex items-center gap-2 border-b border-border/50 px-6 pt-2 bg-secondary/10 overflow-x-auto no-scrollbar">
            {[
              { id: 'list', label: 'List View', icon: List },
              { id: 'status', label: 'Kanban Board', icon: LayoutGrid },
              { id: 'priority', label: 'Priority Matrix', icon: AlertCircle },
              { id: 'dates', label: 'Timeline', icon: Clock3 }
            ].map(view => (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border-b-2 -mb-px ${
                  activeView === view.id 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                <view.icon size={14} />
                {view.label}
              </button>
            ))}
          </div>

          {/* Filters Bar */}
          <div className="px-6 py-4 flex flex-row flex-wrap items-center gap-4 border-b border-border/50 bg-card">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-muted-foreground" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Filters</span>
            </div>
            <select 
              value={filter.category} 
              onChange={e => setFilter({...filter, category: e.target.value})} 
              className="bg-secondary/50 border border-border text-xs font-medium rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary/20 w-auto text-foreground"
            >
              <option value="all">All Categories</option>
              {TASK_CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
            <select 
              value={filter.priority} 
              onChange={e => setFilter({...filter, priority: e.target.value})}
              className="bg-secondary/50 border border-border text-xs font-medium rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary/20 w-auto text-foreground"
            >
              <option value="all">All Priority</option>
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
            <select 
              value={filter.status} 
              onChange={e => setFilter({...filter, status: e.target.value})}
              className="bg-secondary/50 border border-border text-xs font-medium rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary/20 w-auto text-foreground"
            >
              <option value="all">All Status</option>
              <option value="not_started">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          {/* View Body */}
          <div className="flex-1 overflow-auto bg-secondary/5 p-6 custom-scrollbar">
            {(() => {
              switch (activeView) {
                case 'list': return <ListView tasks={filtered} />;
                case 'status': return <StatusBoard tasks={filtered} />;
                case 'priority': return <PriorityBoard tasks={filtered} />;
                case 'dates': return <TimelineView tasks={filtered} />;
                default: return <ListView tasks={filtered} />;
              }
            })()}
          </div>
        </div>
      </div>

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

// ─── Sub-Components ─────────────────────────────────────────────────────────

function TaskCard({ task, isExpanded, onToggleExpand, onToggleComplete, onDelete, onUpdateStatus }) {
  const deadlineDate = task.deadline || task.dueDate;
  const isOverdue = deadlineDate && new Date(deadlineDate) < new Date() && !task.completed;
  
  const PRIORITY_COLORS = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm hover:border-primary/40 hover:shadow-md transition-all group overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <input 
          type="checkbox" 
          checked={task.completed} 
          onChange={() => onToggleComplete(task.id)} 
          className="w-5 h-5 cursor-pointer accent-primary shrink-0" 
        />
        <div className="flex-1 min-w-0" onClick={() => onToggleExpand(task.id)} style={{ cursor: 'pointer' }}>
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className={`font-semibold text-sm text-foreground transition-all ${task.completed ? 'line-through opacity-40' : ''}`}>
              {task.title}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-primary/10 text-primary border border-primary/20">
                {task.category}
              </span>
              {isOverdue && (
                <span className="px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider rounded bg-red-500/10 text-red-500 border border-red-500/20">
                  ⚠️
                </span>
              )}
            </div>
          </div>
          {deadlineDate && (
            <div className={`text-[9px] font-medium flex items-center gap-1 ${isOverdue ? 'text-red-500' : 'text-muted-foreground'}`}>
              <Calendar size={10} />
              {new Date(deadlineDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <button className="p-1.5 hover:bg-muted rounded-md text-muted-foreground" onClick={() => onToggleExpand(task.id)}>
            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          <button className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded-md text-muted-foreground transition-colors" onClick={() => onDelete(task.id)}>
            <Trash2 size={12} />
          </button>
        </div>
      </div>
      {isExpanded && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="px-12 pb-4 pt-1 border-t border-border bg-muted/20"
        >
          {task.description && <p className="text-xs text-muted-foreground leading-relaxed mb-3">{task.description}</p>}
          <div className="flex items-center gap-4">
            <select 
              value={task.status} 
              onChange={e => onUpdateStatus(task.id, { status: e.target.value, completed: e.target.value === 'done' })}
              className="bg-background border border-border text-[10px] font-semibold rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="not_started">📋 Not Started</option>
              <option value="in_progress">🔄 In Progress</option>
              <option value="done">✅ Done</option>
            </select>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function ListView({ tasks }) {
  const { toggleTaskCompletion, deleteTask, updateTask } = useTaskStore();
  const [expandedId, setExpandedId] = useState(null);

  if (tasks.length === 0) return <EmptyState />;

  return (
    <div className="flex flex-col gap-2">
      {tasks.map(task => (
        <TaskCard 
          key={task.id} 
          task={task} 
          isExpanded={expandedId === task.id}
          onToggleExpand={(id) => setExpandedId(expandedId === id ? null : id)}
          onToggleComplete={toggleTaskCompletion}
          onDelete={deleteTask}
          onUpdateStatus={updateTask}
        />
      ))}
    </div>
  );
}

function StatusBoard({ tasks }) {
  const { toggleTaskCompletion, deleteTask, updateTask } = useTaskStore();
  const [expandedId, setExpandedId] = useState(null);

  const columns = [
    { id: 'not_started', label: 'Not Started', color: 'var(--text-tertiary)' },
    { id: 'in_progress', label: 'In Progress', color: 'var(--accent-blue)' },
    { id: 'done', label: 'Done', color: 'var(--accent-green)' }
  ];

  return (
    <div className="flex flex-row gap-4 w-full h-full min-h-[380px] overflow-x-auto pb-2">
      {columns.map(col => {
        const colTasks = tasks.filter(t => t.status === col.id);
        return (
          <div key={col.id} className="flex flex-col flex-1 min-w-[320px] bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 bg-secondary/30">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">{col.label}</h3>
              </div>
              <span className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                {colTasks.length}
              </span>
            </div>
            <div className="flex flex-col gap-2 p-3 flex-1">
              {colTasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  isExpanded={expandedId === task.id}
                  onToggleExpand={(id) => setExpandedId(expandedId === id ? null : id)}
                  onToggleComplete={toggleTaskCompletion}
                  onDelete={deleteTask}
                  onUpdateStatus={updateTask}
                />
              ))}
              {colTasks.length === 0 && (
                <div className="flex-1 flex items-center justify-center border-2 border-dashed border-border rounded-xl m-2 min-h-[120px] opacity-30">
                  <span className="text-[10px] font-semibold uppercase text-muted-foreground">Empty</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PriorityBoard({ tasks }) {
  const { toggleTaskCompletion, deleteTask, updateTask } = useTaskStore();
  const [expandedId, setExpandedId] = useState(null);

  const columns = [
    { id: 'high', label: 'High Priority', color: '#ef4444' },
    { id: 'medium', label: 'Medium Priority', color: '#f59e0b' },
    { id: 'low', label: 'Low Priority', color: '#10b981' }
  ];

  return (
    <div className="flex flex-row gap-4 w-full h-full min-h-[380px] overflow-x-auto pb-2">
      {columns.map(col => {
        const colTasks = tasks.filter(t => t.priority === col.id);
        return (
          <div key={col.id} className="flex flex-col flex-1 min-w-[320px] bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
            <div 
              className="flex items-center justify-between px-5 py-4 border-b bg-secondary/30"
              style={{ borderColor: `${col.color}40`, borderBottomWidth: '3px' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">{col.label}</h3>
              </div>
              <span className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                {colTasks.length}
              </span>
            </div>
            <div className="flex flex-col gap-2 p-3 flex-1">
              {colTasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  isExpanded={expandedId === task.id}
                  onToggleExpand={(id) => setExpandedId(expandedId === id ? null : id)}
                  onToggleComplete={toggleTaskCompletion}
                  onDelete={deleteTask}
                  onUpdateStatus={updateTask}
                />
              ))}
              {colTasks.length === 0 && (
                <div className="flex-1 flex items-center justify-center border-2 border-dashed border-border rounded-xl m-2 min-h-[120px] opacity-30">
                  <span className="text-[10px] font-semibold uppercase text-muted-foreground">Empty</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TimelineView({ tasks }) {
  const { toggleTaskCompletion, deleteTask, updateTask } = useTaskStore();
  const [expandedId, setExpandedId] = useState(null);

  const groups = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const categories = {
      Overdue: [],
      Today: [],
      Tomorrow: [],
      Upcoming: [],
      'No Date': []
    };

    tasks.forEach(task => {
      const dateStr = task.deadline || task.dueDate;
      if (!dateStr) {
        categories['No Date'].push(task);
        return;
      }
      const date = new Date(dateStr);
      const taskDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

      if (taskDay < today && !task.completed) {
        categories.Overdue.push(task);
      } else if (taskDay.getTime() === today.getTime()) {
        categories.Today.push(task);
      } else if (taskDay.getTime() === tomorrow.getTime()) {
        categories.Tomorrow.push(task);
      } else if (taskDay > tomorrow) {
        categories.Upcoming.push(task);
      }
    });

    return Object.entries(categories).filter(([_, t]) => t.length > 0);
  }, [tasks]);

  if (tasks.length === 0) return <EmptyState />;

  return (
    <div className="flex flex-col gap-8 pr-4 overflow-y-auto custom-scrollbar">
      {groups.map(([label, groupTasks]) => (
        <div key={label}>
          <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-6 border-b border-white/5 pb-3 flex items-center gap-3 ${
            label === 'Overdue' ? 'text-red-500' : 'text-muted-foreground'
          }`}>
            <Clock size={12} className={label === 'Overdue' ? 'animate-pulse' : ''} />
            {label}
            <span className="ml-auto text-[9px] font-black bg-white/5 px-2 py-0.5 rounded-full border border-white/5">{groupTasks.length}</span>
          </h3>
          <div className="flex flex-col gap-3">
            {groupTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                isExpanded={expandedId === task.id}
                onToggleExpand={(id) => setExpandedId(expandedId === id ? null : id)}
                onToggleComplete={toggleTaskCompletion}
                onDelete={deleteTask}
                onUpdateStatus={updateTask}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 opacity-20 h-full">
      <CheckCircle size={64} className="mb-4" />
      <h3 className="text-xl font-bold">No Tasks Found</h3>
      <p className="text-sm">Adjust your filters or create a new one</p>
    </div>
  );
}
