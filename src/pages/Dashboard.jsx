import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap, Code2, BarChart3, Briefcase, Rocket, Users,
  Dumbbell, Brain, Palette, Plane, ArrowRight, Zap, TrendingUp,
  Wallet, Heart, Shield, CheckCircle, Plus, Cpu, Calendar, ListTodo, Clock
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
import { getGreeting } from '../utils/helpers';
import './Dashboard.css';

function DashboardTaskTracker() {
  const { tasks, addTask, toggleTaskCompletion, deleteTask } = useTaskStore();
  const { googleTasks, toggleGoogleTaskComplete, deleteGoogleTask, isTokenValid } = useGoogleStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', category: 'personal', priority: 'medium' });
  const [filter, setFilter] = useState('all');

  const showGoogle = isTokenValid();

  const localFiltered = tasks.filter(t => filter === 'all' || t.category === filter).map(t => ({...t, isGoogle: false}));
  const googleFiltered = showGoogle 
    ? googleTasks.filter(t => filter === 'all' || filter === 'google').map(t => ({
        ...t, 
        isGoogle: true,
        priority: 'medium',
        category: t.listName || 'google'
      })) 
    : [];

  const combined = [...localFiltered, ...googleFiltered]
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const pri = { high: 3, medium: 2, low: 1 };
      return (pri[b.priority] || 0) - (pri[a.priority] || 0);
    })
    .slice(0, 8);

  const handleAdd = () => {
    if (!newTask.title.trim()) return;
    addTask(newTask);
    setNewTask({ title: '', category: 'personal', priority: 'medium' });
    setShowAdd(false);
  };

  const pendingCount = combined.filter(t => !t.completed).length;

  const PRIORITY_COLORS = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>{pendingCount} top pending</span>
          <select value={filter} onChange={e => setFilter(e.target.value)} style={{ width: 120, fontSize: 'var(--font-xs)', padding: '0.3rem 0.5rem' }}>
            <option value="all">All Tracking</option>
            {TASK_CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            {showGoogle && <option value="google">Google Tasks</option>}
          </select>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Link to="/tasks" style={{ fontSize: 'var(--font-xs)', color: 'var(--accent-purple-light)' }}>View All →</Link>
          <button className="btn-primary" onClick={() => setShowAdd(!showAdd)} style={{ padding: '0.3rem 0.6rem', fontSize: 'var(--font-xs)' }}><Plus size={12} /></button>
        </div>
      </div>

      {showAdd && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <input value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="Task title..." style={{ flex: '1 1 200px', fontSize: 'var(--font-xs)', padding: '0.4rem 0.6rem' }} onKeyDown={e => e.key === 'Enter' && handleAdd()} />
          <select value={newTask.category} onChange={e => setNewTask({...newTask, category: e.target.value})} style={{ width: 100, fontSize: 'var(--font-xs)', padding: '0.3rem' }}>
            {TASK_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})} style={{ width: 90, fontSize: 'var(--font-xs)', padding: '0.3rem' }}>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Med</option>
            <option value="low">🟢 Low</option>
          </select>
          <button className="btn-primary" onClick={handleAdd} style={{ padding: '0.3rem 0.8rem', fontSize: 'var(--font-xs)' }}>Add</button>
        </motion.div>
      )}

      {combined.length === 0 ? (
        <div style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-sm)', textAlign: 'center', padding: '1rem' }}>No tasks found in this view.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {combined.map(task => (
            <div key={task.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.75rem', background: 'var(--bg-secondary)', border: `1px solid ${task.isGoogle ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-primary)'}`, borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: 0 }}>
                <input type="checkbox" checked={task.completed} onChange={() => task.isGoogle ? toggleGoogleTaskComplete(task.listId, task.id, task.completed) : toggleTaskCompletion(task.id)} style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: task.isGoogle ? '#10b981' : '#8b5cf6', flexShrink: 0 }} title={task.isGoogle ? "Syncs to Google Tasks" : "Local Task"} />
                <span style={{ fontWeight: 600, fontSize: 'var(--font-sm)', color: 'var(--text-primary)', textDecoration: task.completed ? 'line-through' : 'none', opacity: task.completed ? 0.5 : 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</span>
                {task.isGoogle ? <span className="badge" style={{ background: '#10b98115', color: '#10b981', fontSize: '9px', flexShrink: 0 }}>Cloud</span> : null}
                {!task.isGoogle && <span className="badge" style={{ background: `${PRIORITY_COLORS[task.priority]}15`, color: PRIORITY_COLORS[task.priority], fontSize: '9px', flexShrink: 0 }}>{task.priority}</span>}
                <span className="badge badge-blue" style={{ fontSize: '9px', flexShrink: 0 }}>{task.category}</span>
              </div>
              <button className="btn-icon" onClick={() => task.isGoogle ? deleteGoogleTask(task.listId, task.id) : deleteTask(task.id)} style={{ fontSize: '10px', padding: '0.2rem', flexShrink: 0 }}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const sections = [
  { moduleId: 'academics', path: '/academics', icon: GraduationCap, label: 'Academics', desc: 'CGPA, Exams, Attendance', color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' },
  { moduleId: 'dsa', path: '/dsa', icon: Code2, label: 'DSA Hub', desc: 'LeetCode & Roadmap', color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)' },
  { moduleId: 'aiml', path: '/aiml', icon: Cpu, label: 'AI/ML', desc: 'Learning & Research', color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444, #f97316)' },
  { moduleId: 'placements', path: '/placements', icon: Briefcase, label: 'Placements', desc: 'DSA & Skills', color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)' },
  { moduleId: 'cat', path: '/cat', icon: BarChart3, label: 'CAT 2027', desc: 'IIM Preparation', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
  { moduleId: 'gsoc', path: '/gsoc', icon: Code2, label: 'GSoC 2027', desc: 'Open Source & Skills', color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)' },
  { moduleId: 'startup', path: '/startup', icon: Rocket, label: 'Startup', desc: 'Ideas & Execution', color: '#f97316', gradient: 'linear-gradient(135deg, #f97316, #fb923c)' },
  { moduleId: 'club', path: '/club', icon: Users, label: 'Tech Society', desc: 'Club Management', color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899, #f472b6)' },
  { moduleId: 'finance', path: '/finance', icon: Wallet, label: 'Finance', desc: 'Track Every Rupee', color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #06b6d4)' },
  { moduleId: 'fitness', path: '/fitness', icon: Dumbbell, label: 'Fitness', desc: '89kg → 75kg Journey', color: '#22d3ee', gradient: 'linear-gradient(135deg, #22d3ee, #67e8f9)' },
  { moduleId: 'mentalHealth', path: '/mental-health', icon: Heart, label: 'Mental Health', desc: 'Wellbeing & Growth', color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899, #f472b6)' },
  { moduleId: 'leadership', path: '/leadership', icon: Shield, label: 'Leadership', desc: 'Skills & Development', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
  { moduleId: 'personal', path: '/personal', icon: Brain, label: 'Personal Dev', desc: 'Mind & Growth', color: '#a78bfa', gradient: 'linear-gradient(135deg, #a78bfa, #c4b5fd)' },
  { moduleId: 'hobbies', path: '/hobbies', icon: Palette, label: 'Hobbies', desc: 'Skills & Fun', color: '#f43f5e', gradient: 'linear-gradient(135deg, #f43f5e, #fb7185)' },
  { moduleId: 'travel', path: '/travel', icon: Plane, label: 'Travel', desc: 'Explore the World', color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  const { enabledModules } = useGlobalStore();
  const subjects = useAcademicStore((s) => s.subjects);
  const exams = useAcademicStore((s) => s.exams);
  const { currentWeight, targetWeight } = useFitnessStore();
  const habits = usePersonalStore((s) => s.habits);
  const gsocSkills = useGsocStore((s) => s.skills);
  const mockTests = useCatStore((s) => s.mockTests);
  const tasks = useTaskStore((s) => s.tasks);
  const totalBalance = useFinanceStore((s) => s.getTotalBalance());
  const { leetcodeStats } = useDsaStore();

  const pendingTasks = tasks.filter(t => !t.completed).length;

  return (
    <PageWrapper>
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
            Command center for your academics, career, fitness, and life goals. Everything interlinked, everything tracked.
          </p>
        </motion.div>
        <div className="hero-particles">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.6, 0.2],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <motion.div
        className="grid-4"
        style={{ marginBottom: 'var(--space-xl)' }}
        variants={container}
        initial="hidden"
        animate="show"
      >
        <StatsCard
          icon={CheckCircle}
          label="Pending Tasks"
          value={pendingTasks}
          subtitle={`of ${tasks.length} total`}
          color="#8b5cf6"
          delay={0}
        />
        <StatsCard
          icon={TrendingUp}
          label="DSA Solved"
          value={leetcodeStats ? leetcodeStats.totalSolved : 0}
          subtitle={leetcodeStats ? 'Synced via LeetCode' : 'Unsynced'}
          color="#3b82f6"
          delay={0.1}
        />
        <StatsCard
          icon={Wallet}
          label="Balance"
          value={`₹${totalBalance.toLocaleString('en-IN')}`}
          subtitle="All accounts"
          color="#10b981"
          delay={0.2}
        />
        <StatsCard
          icon={BarChart3}
          label="Mock Tests"
          value={mockTests.length}
          subtitle="CAT attempts"
          color="#f59e0b"
          delay={0.3}
        />
      </motion.div>

      {/* Main Task Tracker */}
      <div className="section-title" style={{ marginBottom: 'var(--space-md)' }}>
        <Zap size={18} />
        Main Task Tracker
      </div>
      <motion.div
        className="glass-card"
        style={{ padding: '1.5rem', marginBottom: 'var(--space-xl)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <DashboardTaskTracker />
      </motion.div>

      {/* Google Calendar & Tasks Overview */}
      <DashboardCalendarWidget />

      {/* Section Grid */}
      <div className="section-title" style={{ marginBottom: 'var(--space-lg)' }}>
        <Zap size={18} />
        Life Areas
      </div>
      <motion.div
        className="dashboard-grid"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {sections.filter(s => enabledModules[s.moduleId] !== false).map((section) => (
          <motion.div key={section.path} variants={item}>
            <Link to={section.path} className="section-card glass-card">
              <div className="section-card-icon" style={{ background: `${section.color}12`, color: section.color }}>
                <section.icon size={24} />
              </div>
              <div className="section-card-info">
                <h3>{section.label}</h3>
                <p>{section.desc}</p>
              </div>
              <div className="section-card-arrow">
                <ArrowRight size={16} />
              </div>
              <div className="section-card-glow" style={{ background: section.gradient }} />
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </PageWrapper>
  );
}

function DashboardCalendarWidget() {
  const { isAuthenticated, isTokenValid, calendarEvents, googleTasks, fetchCalendarEvents, fetchGoogleTasks } = useGoogleStore();
  const [loaded, setLoaded] = useState(false);

  const isReady = isAuthenticated && isTokenValid();

  useEffect(() => {
    if (isReady && !loaded) {
      Promise.all([fetchCalendarEvents(), fetchGoogleTasks()]).then(() => setLoaded(true)).catch(() => {});
    }
  }, [isReady]);

  const now = new Date();
  const upcomingEvents = calendarEvents
    .filter(e => new Date(e.start) >= new Date(now.getFullYear(), now.getMonth(), now.getDate()))
    .slice(0, 4);
  const pendingTasks = googleTasks.filter(t => !t.completed).slice(0, 4);

  const formatTime = (s) => {
    if (!s || s.length <= 10) return 'All day';
    return new Date(s).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <>
      <div className="section-title" style={{ marginBottom: 'var(--space-md)' }}>
        <Calendar size={18} /> Calendar & Tasks
        <Link to="/calendar" style={{ marginLeft: 'auto', fontSize: 'var(--font-xs)', color: 'var(--accent-purple-light)' }}>
          {isReady ? 'View Full Calendar →' : 'Connect Google →'}
        </Link>
      </div>
      {!isReady ? (
        <motion.div className="glass-card" style={{ padding: '2rem', textAlign: 'center', marginBottom: 'var(--space-xl)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Calendar size={32} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
          <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Google Calendar & Tasks Not Connected</div>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginBottom: '1rem' }}>Connect your account to see upcoming events and tasks here.</div>
          <Link to="/google-sync" className="btn-secondary" style={{ display: 'inline-flex', fontSize: 'var(--font-xs)', padding: '0.4rem 0.8rem' }}>
            Connect Now
          </Link>
        </motion.div>
      ) : (
        <motion.div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Upcoming Events */}
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '0.75rem 1rem', borderBottom: '2px solid var(--border-primary)', fontWeight: 700, fontSize: 'var(--font-sm)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Calendar size={14} style={{ color: '#8b5cf6' }} /> Upcoming Events
            </div>
            {upcomingEvents.length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 'var(--font-xs)' }}>No upcoming events</div>
            ) : (
              upcomingEvents.map(ev => (
                <div key={ev.id} style={{ padding: '0.6rem 1rem', borderBottom: '1px solid var(--border-primary)', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 3, minHeight: 28, borderRadius: 2, background: '#8b5cf6', flexShrink: 0, marginTop: 2 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 'var(--font-xs)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.title}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Clock size={9} />
                      {new Date(ev.start).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {formatTime(ev.start)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Google Tasks */}
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '0.75rem 1rem', borderBottom: '2px solid var(--border-primary)', fontWeight: 700, fontSize: 'var(--font-sm)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <ListTodo size={14} style={{ color: '#10b981' }} /> Google Tasks
            </div>
            {pendingTasks.length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--accent-green)', fontSize: 'var(--font-xs)', fontWeight: 600 }}>All caught up! 🎉</div>
            ) : (
              pendingTasks.map(t => (
                <div key={t.id} style={{ padding: '0.6rem 1rem', borderBottom: '1px solid var(--border-primary)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', border: '2px solid #f59e0b', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 'var(--font-xs)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</div>
                    {t.due && <div style={{ fontSize: '10px', color: new Date(t.due) < new Date() ? 'var(--accent-red)' : 'var(--text-muted)' }}>{new Date(t.due).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>}
                  </div>
                  <span className="badge badge-blue" style={{ fontSize: '8px' }}>{t.listName}</span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </>
  );
}
