import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap, Code2, BarChart3, Briefcase, Rocket, Users,
  Dumbbell, Brain, Palette, Plane, ArrowRight, Zap, TrendingUp,
  Wallet, Heart, Shield, CheckCircle, Plus
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
import { getGreeting } from '../utils/helpers';
import './Dashboard.css';

function DashboardTaskTracker() {
  const { tasks, addTask, toggleTaskCompletion, deleteTask } = useTaskStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', category: 'personal', priority: 'medium' });
  const [filter, setFilter] = useState('all');

  const filtered = tasks
    .filter(t => filter === 'all' || t.category === filter)
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

  const pendingCount = tasks.filter(t => !t.completed).length;
  const completedToday = tasks.filter(t => t.completed && t.createdAt && new Date(t.createdAt).toDateString() === new Date().toDateString()).length;

  const PRIORITY_COLORS = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>{pendingCount} pending</span>
          <select value={filter} onChange={e => setFilter(e.target.value)} style={{ width: 120, fontSize: 'var(--font-xs)', padding: '0.3rem 0.5rem' }}>
            <option value="all">All</option>
            {TASK_CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
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

      {tasks.length === 0 ? (
        <div style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-sm)', textAlign: 'center', padding: '1rem' }}>No tasks yet. Click + to add your first task!</div>
      ) : filtered.length === 0 ? (
        <div style={{ color: 'var(--accent-green)', fontWeight: 600, textAlign: 'center', padding: '0.5rem' }}>All caught up in this category! 🎉</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {filtered.map(task => (
            <div key={task.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: 0 }}>
                <input type="checkbox" checked={task.completed} onChange={() => toggleTaskCompletion(task.id)} style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#8b5cf6', flexShrink: 0 }} />
                <span style={{ fontWeight: 600, fontSize: 'var(--font-sm)', color: 'var(--text-primary)', textDecoration: task.completed ? 'line-through' : 'none', opacity: task.completed ? 0.5 : 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</span>
                <span className="badge" style={{ background: `${PRIORITY_COLORS[task.priority]}15`, color: PRIORITY_COLORS[task.priority], fontSize: '9px', flexShrink: 0 }}>{task.priority}</span>
                <span className="badge badge-blue" style={{ fontSize: '9px', flexShrink: 0 }}>{task.category}</span>
              </div>
              <button className="btn-icon" onClick={() => deleteTask(task.id)} style={{ fontSize: '10px', padding: '0.2rem', flexShrink: 0 }}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const sections = [
  { path: '/academics', icon: GraduationCap, label: 'Academics', desc: 'CGPA, Exams, Attendance', color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' },
  { path: '/gsoc', icon: Code2, label: 'GSoC 2027', desc: 'Open Source & Skills', color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)' },
  { path: '/cat', icon: BarChart3, label: 'CAT 2027', desc: 'IIM Preparation', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
  { path: '/placements', icon: Briefcase, label: 'Placements', desc: 'DSA & AI/ML Skills', color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)' },
  { path: '/startup', icon: Rocket, label: 'Startup', desc: 'Ideas & Execution', color: '#f97316', gradient: 'linear-gradient(135deg, #f97316, #fb923c)' },
  { path: '/club', icon: Users, label: 'Tech Society', desc: 'Club Management', color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899, #f472b6)' },
  { path: '/finance', icon: Wallet, label: 'Finance', desc: 'Track Every Rupee', color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #06b6d4)' },
  { path: '/fitness', icon: Dumbbell, label: 'Fitness', desc: '89kg → 75kg Journey', color: '#22d3ee', gradient: 'linear-gradient(135deg, #22d3ee, #67e8f9)' },
  { path: '/mental-health', icon: Heart, label: 'Mental Health', desc: 'Wellbeing & Growth', color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899, #f472b6)' },
  { path: '/leadership', icon: Shield, label: 'Leadership', desc: 'Skills & Development', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
  { path: '/personal', icon: Brain, label: 'Personal Dev', desc: 'Mind & Growth', color: '#a78bfa', gradient: 'linear-gradient(135deg, #a78bfa, #c4b5fd)' },
  { path: '/hobbies', icon: Palette, label: 'Hobbies', desc: 'Skills & Fun', color: '#f43f5e', gradient: 'linear-gradient(135deg, #f43f5e, #fb7185)' },
  { path: '/travel', icon: Plane, label: 'Travel', desc: 'Explore the World', color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)' },
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
  const subjects = useAcademicStore((s) => s.subjects);
  const exams = useAcademicStore((s) => s.exams);
  const dsaProblems = usePlacementStore((s) => s.dsaProblems);
  const { currentWeight, targetWeight } = useFitnessStore();
  const habits = usePersonalStore((s) => s.habits);
  const gsocSkills = useGsocStore((s) => s.skills);
  const mockTests = useCatStore((s) => s.mockTests);
  const tasks = useTaskStore((s) => s.tasks);
  const totalBalance = useFinanceStore((s) => s.getTotalBalance());

  const solvedDsa = dsaProblems.filter((p) => p.status === 'solved').length;
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
          value={solvedDsa}
          subtitle={`of ${dsaProblems.length} problems`}
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
        {sections.map((section) => (
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
