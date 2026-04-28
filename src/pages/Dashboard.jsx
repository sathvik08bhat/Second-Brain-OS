import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import 'react-resizable/css/styles.css';
import { motion } from 'framer-motion';
import {
  GraduationCap, Code2, BarChart3, Briefcase, Rocket, Users,
  Dumbbell, Brain, Palette, Plane, ArrowRight, Zap, TrendingUp,
  Wallet, Heart, Shield, CheckCircle, Plus, Cpu, Calendar, ListTodo, Clock,
  GripVertical, Maximize2, FileText, Target
} from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import StatsCard from '../components/shared/StatsCard';
import { useAcademicStore } from '../store/academicStore';
import { usePlacementStore } from '../store/placementStore';
import { useFitnessStore } from '../store/fitnessStore';
import { usePersonalStore } from '../store/personalStore';
import { useGsocStore } from '../store/gsocStore';
import { useCatStore } from '../store/catStore';
import { useTaskStore, TASK_CATEGORIES } from '../store/taskStore';
import { useFinanceStore } from '../store/financeStore';
import { useGoogleStore } from '../store/googleStore';
import { useDsaStore } from '../store/dsaStore';
import { useGlobalStore } from '../store/globalStore';
import { useDashboardLayout } from '../hooks/useDashboardLayout';
import { getGreeting } from '../utils/helpers';
import 'react-grid-layout/css/styles.css';
import './Dashboard.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

// ── Default Grid Layout ──
const DEFAULT_LAYOUT = [
  { i: 'stats', x: 0, y: 0, w: 12, h: 4, minW: 6, minH: 3 },
  { i: 'tasks', x: 0, y: 4, w: 7, h: 8, minW: 4, minH: 5 },
  { i: 'calendar', x: 7, y: 4, w: 5, h: 8, minW: 3, minH: 5 },
];

// ── Widget Card Wrapper with Antigravity styling ──
function WidgetCard({ title, icon: Icon, children, id }) {
  return (
    <motion.div
      className="ag-widget overflow-hidden"
      whileHover={{ scale: 1.008, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
    >
      <div className="ag-widget-header">
        <div className="ag-widget-drag-handle">
          <GripVertical size={14} />
        </div>
        <Icon size={16} />
        <span>{title}</span>
      </div>
      <div className="ag-widget-body">
        {children}
      </div>
    </motion.div>
  );
}

// ── Quick Stats Widget ──
function StatsWidget() {
  const tasks = useTaskStore((s) => s.tasks);
  const totalBalance = useFinanceStore((s) => s.getTotalBalance());
  const { leetcodeStats } = useDsaStore();
  const mockTests = useCatStore((s) => s.mockTests);
  const pendingTasks = tasks.filter(t => !t.completed).length;

  return (
    <div className="ag-stats-grid">
      <div className="ag-stat-card group" style={{ '--stat-color': 'var(--accent-primary)' }}>
        <CheckCircle size={20} />
        <div className="ag-stat-info">
          <span className="text-primary font-bold text-3xl">{pendingTasks}</span>
          <span className="text-muted-foreground text-[0.65rem] font-medium uppercase tracking-wider">Pending Tasks</span>
        </div>
      </div>
      <div className="ag-stat-card group" style={{ '--stat-color': '#3b82f6' }}>
        <TrendingUp size={20} />
        <div className="ag-stat-info">
          <span className="text-primary font-bold text-3xl">{leetcodeStats?.totalSolved || 0}</span>
          <span className="text-muted-foreground text-[0.65rem] font-medium uppercase tracking-wider">DSA Solved</span>
        </div>
      </div>
      <div className="ag-stat-card group" style={{ '--stat-color': '#10b981' }}>
        <Wallet size={20} />
        <div className="ag-stat-info">
          <span className="text-primary font-bold text-2xl truncate">₹{totalBalance.toLocaleString('en-IN')}</span>
          <span className="text-muted-foreground text-[0.65rem] font-medium uppercase tracking-wider">Balance</span>
        </div>
      </div>
      <div className="ag-stat-card group" style={{ '--stat-color': '#f59e0b' }}>
        <BarChart3 size={20} />
        <div className="ag-stat-info">
          <span className="text-primary font-bold text-3xl">{mockTests.length}</span>
          <span className="text-muted-foreground text-[0.65rem] font-medium uppercase tracking-wider">Mock Tests</span>
        </div>
      </div>
    </div>
  );
}


// ── Task Tracker Widget ──
function TaskWidget() {
  const { tasks, addTask, toggleTaskCompletion, deleteTask } = useTaskStore();
  const { googleTasks, toggleGoogleTaskComplete, deleteGoogleTask, isTokenValid } = useGoogleStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', category: 'personal', priority: 'medium' });

  const showGoogle = isTokenValid();
  const localFiltered = tasks.map(t => ({ ...t, isGoogle: false }));
  const googleFiltered = showGoogle
    ? googleTasks.map(t => ({ ...t, isGoogle: true, priority: 'medium', category: t.listName || 'google' }))
    : [];

  const combined = [...localFiltered, ...googleFiltered]
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const pri = { high: 3, medium: 2, low: 1 };
      return (pri[b.priority] || 0) - (pri[a.priority] || 0);
    })
    .slice(0, 6);

  const handleAdd = () => {
    if (!newTask.title.trim()) return;
    addTask(newTask);
    setNewTask({ title: '', category: 'personal', priority: 'medium' });
    setShowAdd(false);
  };

  const PRIORITY_COLORS = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };

  return (
    <div className="ag-task-list">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <Link to="/tasks" style={{ fontSize: '0.65rem', color: 'var(--accent-primary)', fontWeight: 600 }}>View All →</Link>
        <button className="ag-mini-btn" onClick={() => setShowAdd(!showAdd)}>
          <Plus size={12} />
        </button>
      </div>

      {showAdd && (
        <div className="ag-task-add">
          <input
            value={newTask.title}
            onChange={e => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="New task..."
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <button className="ag-mini-btn" onClick={handleAdd}>Add</button>
        </div>
      )}

      {combined.length === 0 ? (
        <div className="ag-empty">No tasks yet</div>
      ) : (
        combined.map(task => (
          <div key={task.id} className="ag-task-item">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => task.isGoogle ? toggleGoogleTaskComplete(task.listId, task.id, task.completed) : toggleTaskCompletion(task.id)}
            />
            <span className={`ag-task-title ${task.completed ? 'done' : ''}`}>{task.title}</span>
            <span className="ag-task-badge" style={{ color: PRIORITY_COLORS[task.priority], background: `${PRIORITY_COLORS[task.priority]}15` }}>
              {task.priority}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

// ── Calendar Widget ──
function CalendarWidget() {
  const { isAuthenticated, isTokenValid, calendarEvents, googleTasks } = useGoogleStore();
  const isReady = isAuthenticated && isTokenValid();

  const now = new Date();
  const upcomingEvents = calendarEvents
    .filter(e => new Date(e.start) >= new Date(now.getFullYear(), now.getMonth(), now.getDate()))
    .slice(0, 5);

  const formatTime = (s) => {
    if (!s || s.length <= 10) return 'All day';
    return new Date(s).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  if (!isReady) {
    return (
      <div className="ag-empty" style={{ padding: '2rem' }}>
        <Calendar size={24} style={{ marginBottom: '0.5rem', opacity: 0.4 }} />
        <p>Connect Google to see events</p>
        <Link to="/google-sync" className="ag-mini-btn" style={{ marginTop: '0.5rem' }}>Connect</Link>
      </div>
    );
  }

  return (
    <div className="ag-calendar-list">
      {upcomingEvents.length === 0 ? (
        <div className="ag-empty">No upcoming events</div>
      ) : (
        upcomingEvents.map(ev => (
          <div key={ev.id} className="ag-calendar-item">
            <div className="ag-cal-dot" />
            <div className="ag-cal-info">
              <span className="ag-cal-title">{ev.title}</span>
              <span className="ag-cal-time">
                <Clock size={10} />
                {new Date(ev.start).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {formatTime(ev.start)}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ── Life Areas Grid (below the widgets) ──
const sections = [
  { moduleId: 'academics', path: '/academics', icon: GraduationCap, label: 'Academics', desc: 'CGPA, Exams, Attendance', color: 'var(--accent-primary)' },
  { moduleId: 'dsa', path: '/dsa', icon: Code2, label: 'DSA Hub', desc: 'LeetCode & Roadmap', color: '#06b6d4' },
  { moduleId: 'aiml', path: '/aiml', icon: Cpu, label: 'AI/ML', desc: 'Learning & Research', color: '#ef4444' },
  { moduleId: 'placements', path: '/placements', icon: Briefcase, label: 'Placements', desc: 'DSA & Skills', color: '#3b82f6' },
  { moduleId: 'cat', path: '/cat', icon: BarChart3, label: 'CAT 2027', desc: 'IIM Preparation', color: '#f59e0b' },
  { moduleId: 'gsoc', path: '/gsoc', icon: Code2, label: 'GSoC 2027', desc: 'Open Source & Skills', color: '#06b6d4' },
  { moduleId: 'startup', path: '/startup', icon: Rocket, label: 'Startup', desc: 'Ideas & Execution', color: '#f97316' },
  { moduleId: 'club', path: '/club', icon: Users, label: 'Tech Society', desc: 'Club Management', color: '#ec4899' },
  { moduleId: 'finance', path: '/finance', icon: Wallet, label: 'Finance', desc: 'Track Every Rupee', color: '#10b981' },
  { moduleId: 'fitness', path: '/fitness', icon: Dumbbell, label: 'Fitness', desc: '89kg → 75kg Journey', color: '#22d3ee' },
  { moduleId: 'mentalHealth', path: '/mental-health', icon: Heart, label: 'Mental Health', desc: 'Wellbeing & Growth', color: '#ec4899' },
  { moduleId: 'leadership', path: '/leadership', icon: Shield, label: 'Leadership', desc: 'Skills & Development', color: '#f59e0b' },
  { moduleId: 'personal', path: '/personal', icon: Brain, label: 'Personal Dev', desc: 'Mind & Growth', color: 'var(--accent-primary)' },
  { moduleId: 'hobbies', path: '/hobbies', icon: Palette, label: 'Hobbies', desc: 'Skills & Fun', color: '#f43f5e' },
  { moduleId: 'travel', path: '/travel', icon: Plane, label: 'Travel', desc: 'Explore the World', color: '#06b6d4' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  const { enabledModules } = useGlobalStore();
  const [layout, setLayout] = useState(DEFAULT_LAYOUT);

  // Sync layout with Firebase
  const { saveLayout } = useDashboardLayout(layout, setLayout);

  const handleLayoutChange = (newLayout) => {
    saveLayout(newLayout);
  };

  return (
    <PageWrapper showBackButton={false}>
      {/* Hero */}
      <div className="dashboard-hero">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="hero-greeting">
            <Zap size={24} className="hero-icon" />
            <span>{getGreeting()}, Sathvik</span>
          </div>
          <h1 className="hero-title">
            Your <span className="gradient-text">Second Brain</span> OS
          </h1>
          <p className="hero-subtitle">
            Command center for your academics, career, fitness, and life goals.
          </p>
        </motion.div>
      </div>

      {/* Draggable Grid Widgets */}
      <div className="ag-grid-container">
        <ResponsiveGridLayout
          className="ag-grid-layout"
          layouts={{ lg: layout, md: layout, sm: layout, xs: layout, xxs: layout }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={30}
          isDraggable={true}
          isResizable={true}
          resizeHandles={['se', 'e', 's']}
          draggableHandle=".ag-widget-drag-handle"
          onLayoutChange={handleLayoutChange}
          compactType="vertical"
          margin={[16, 16]}
          useCSSTransforms={true}
        >
          <div key="stats">
            <WidgetCard title="Quick Stats" icon={Zap} id="stats">
              <StatsWidget />
            </WidgetCard>
          </div>
          <div key="tasks">
            <WidgetCard title="Task Tracker" icon={CheckCircle} id="tasks">
              <TaskWidget />
            </WidgetCard>
          </div>
          <div key="calendar">
            <WidgetCard title="Calendar & Events" icon={Calendar} id="calendar">
              <CalendarWidget />
            </WidgetCard>
          </div>
        </ResponsiveGridLayout>
      </div>

      {/* Life Areas Section */}
      <div className="flex items-center gap-2 text-foreground font-bold text-xl mt-12 mb-6">
        <Zap size={20} className="text-yellow-500" />
        Life Areas
      </div>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {sections.filter(s => (enabledModules || {})[s.moduleId] !== false).map((section) => (
          <motion.div key={section.path} variants={itemVariants}>
            <Link 
              to={section.path} 
              className="section-card"
            >
              <div 
                className="section-card-icon" 
                style={{ background: `${section.color}15`, color: section.color }}
              >
                <section.icon size={24} />
              </div>
              <div className="section-card-info">
                <h3>{section.label}</h3>
                <p>{section.desc}</p>
              </div>
              <div className="section-card-arrow">
                <ArrowRight size={18} />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

    </PageWrapper>
  );
}
