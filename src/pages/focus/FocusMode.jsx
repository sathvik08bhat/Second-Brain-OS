import { useState, useEffect, useRef } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import { 
  GripHorizontal, MoreVertical, Plus, Circle, CheckCircle2,
  ArrowLeft, X, Moon, Music as MusicIcon, Clock, Trash2,
  TrendingUp, Calendar, Award, Maximize, Minimize, RotateCcw, SkipForward
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import PageWrapper from '../../components/layout/PageWrapper';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const DEFAULT_LAYOUT = {
  lg: [
    { i: 'timer', x: 0, y: 0, w: 6, h: 7 },
    { i: 'audio', x: 0, y: 7, w: 6, h: 4 },
    { i: 'tasks', x: 6, y: 0, w: 6, h: 11 },
  ]
};

const CHART_DATA = [
  { name: 'Mon', focus: 2.5 },
  { name: 'Tue', focus: 3.8 },
  { name: 'Wed', focus: 1.2 },
  { name: 'Thu', focus: 4.5 },
  { name: 'Fri', focus: 0.5 },
  { name: 'Sat', focus: 3.0 },
  { name: 'Sun', focus: 2.2 },
];

const INITIAL_TASKS = [
  { id: 1, text: 'Refactor Architecture', est: 3, done: 0, completed: false },
  { id: 2, text: 'Finalize UI Polish', est: 1, done: 0, completed: false },
  { id: 3, text: 'Beta Testing', est: 5, done: 0, completed: false },
  { id: 4, text: 'Documentation', est: 2, done: 0, completed: false },
];

// ─── Zen Mode Clock ──────────────────────────────────────────────────────────
function ZenModeClock({ timeLeft, isRunning, onExit, activeTask }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onExit();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onExit]);

  const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const s = (timeLeft % 60).toString().padStart(2, '0');

  const FlipCard = ({ value }) => (
    <div className="relative bg-[#1a1a1a] rounded-[2rem] md:rounded-[3rem] w-[40vw] max-w-[300px] aspect-square flex items-center justify-center overflow-hidden shadow-2xl border border-white/10">
      <span className="text-[25vw] md:text-[200px] font-black tracking-tighter text-[#e0e0e0] z-10 leading-none select-none">
        {value}
      </span>
      {/* Split Line */}
      <div className="absolute top-1/2 left-0 w-full h-[2px] bg-black z-20 shadow-[0_2px_10px_rgba(0,0,0,0.5)]"></div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.95 }} 
      className="fixed inset-0 z-[9999] bg-black text-white flex flex-col items-center justify-center cursor-default"
    >
      <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center opacity-40">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">Focusing On</span>
        <h2 className="text-lg font-bold tracking-tight">{activeTask?.text || 'No Active Task'}</h2>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <FlipCard value={m} />
        <div className="flex flex-col gap-4 opacity-30">
          <div className="w-4 h-4 rounded-full bg-white animate-pulse" />
          <div className="w-4 h-4 rounded-full bg-white animate-pulse" />
        </div>
        <FlipCard value={s} />
      </div>

      <div className="absolute top-8 right-8 opacity-0 hover:opacity-100 transition-opacity">
        <button 
          onClick={onExit} 
          className="bg-white/10 hover:bg-white/20 p-4 rounded-full backdrop-blur-md text-white transition-all hover:scale-110"
        >
          <Minimize className="w-8 h-8" />
        </button>
      </div>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.4, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-12 text-[10px] font-black uppercase tracking-[0.4em] text-white/50"
      >
        Press ESC to exit Zen Mode
      </motion.p>
    </motion.div>
  );
}

export default function FocusMode() {
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(true);
  const [newTask, setNewTask] = useState({ title: '', est: 1 });
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({ text: '', est: 1 });
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [isZenMode, setIsZenMode] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(INITIAL_TASKS[0]?.id);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsZenMode(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const enterZenMode = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsZenMode(true);
    } catch (err) {
      console.error("Error attempting to enable full-screen mode:", err);
      setIsZenMode(true); // Fallback to just overlay if API fails
    }
  };

  const exitZenMode = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
    setIsZenMode(false);
  };

  // Timer durations (minutes)
  const POMO_MIN = 25, SHORT_MIN = 5, LONG_MIN = 15;

  // Persistent layout
  const [layouts, setLayouts] = useState(() => {
    const saved = localStorage.getItem('focus_os_layout');
    return saved ? JSON.parse(saved) : DEFAULT_LAYOUT;
  });

  const onLayoutChange = (currentLayout, allLayouts) => {
    setLayouts(allLayouts);
    localStorage.setItem('focus_os_layout', JSON.stringify(allLayouts));
  };

  const timerRef = useRef(null);
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    } else if (isRunning && timeLeft === 0) {
      clearInterval(timerRef.current);
      handleTimerComplete();
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft, mode, pomodoroCount, currentTaskId]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const restartTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? POMO_MIN * 60 : mode === 'short' ? SHORT_MIN * 60 : LONG_MIN * 60);
  };

  const skipSession = () => {
    setIsRunning(false);
    handleTimerComplete();
  };

  const handleTimerComplete = () => {
    if (mode === 'focus') {
      // Increment task progress
      if (currentTaskId) {
        setTasks(prev => prev.map(t => t.id === currentTaskId ? { ...t, done: t.done + 1 } : t));
      }
      
      const next = pomodoroCount + 1;
      setPomodoroCount(next);
      if (next % 4 === 0) { // Long break every 4 pomos
        setMode('long'); setTimeLeft(LONG_MIN * 60);
      } else {
        setMode('short'); setTimeLeft(SHORT_MIN * 60);
      }
    } else {
      setMode('focus'); setTimeLeft(POMO_MIN * 60);
    }
  };

  const toggleTask = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));

  const openEditModal = (task) => {
    setEditingTask(task);
    setEditForm({ text: task.text, est: task.est });
  };

  const saveEditModal = () => {
    if (editingTask && editForm.text.trim()) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, text: editForm.text.trim(), est: editForm.est } : t));
    }
    setEditingTask(null);
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    setTasks(prev => [...prev, { id: Date.now(), text: newTask.title.trim(), est: newTask.est, done: 0, completed: false }]);
    setNewTask({ title: '', est: 1 });
    setIsAddingTask(false);
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  // Estimated completion time calculator
  const calcEstTime = () => {
    const totalPomos = activeTasks.reduce((sum, t) => sum + (t.est - t.done), 0);
    if (totalPomos <= 0) return null;
    let mins = 0, streak = 0;
    for (let i = 0; i < totalPomos; i++) {
      mins += POMO_MIN;
      streak++;
      if (i < totalPomos - 1) {
        mins += (streak % 3 === 0) ? LONG_MIN : SHORT_MIN;
      }
    }
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return { totalPomos, h, m, totalMins: mins };
  };
  const estTime = calcEstTime();

  return (
    <div className="w-full min-h-screen bg-background text-foreground p-4 md:p-8 flex flex-col font-sans selection:bg-primary/20">
      
      {/* Task 1: Header Bar Polish */}
      <header className="bg-card border border-border rounded-2xl py-6 px-8 mb-8 flex justify-between items-center shadow-sm w-full">
        <div className="flex items-center gap-6">
          <button onClick={() => window.history.back()} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground">
            <ArrowLeft size={20} />
          </button>
          <div className="h-6 w-px bg-border mx-2" />
          <h1 className="text-lg font-bold uppercase tracking-widest text-foreground">Focus Workspace</h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsReportOpen(true)}
            className="bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
          >
            Report
          </button>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
          >
            Setting
          </button>
        </div>
      </header>

      <div className="flex-1">
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={60}
          margin={[24, 24]}
          isDraggable={true}
          isResizable={true}
          resizeHandles={['se', 'e', 's']}
          draggableHandle=".drag-handle"
          onLayoutChange={onLayoutChange}
        >
          {/* Timer Tile */}
          <div key="timer" className="bg-card border border-border rounded-2xl shadow-sm flex flex-col relative overflow-hidden h-full group">
            <div className="drag-handle w-full h-10 cursor-grab active:cursor-grabbing flex items-center justify-center bg-transparent hover:bg-muted/50 transition-colors absolute top-0 left-0 z-10">
              <GripHorizontal className="w-4 h-4 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center p-10 pt-20 @container">
              <div className="flex gap-8 mb-8">
                {['Pomodoro', 'Short Break', 'Long Break'].map((tab, idx) => {
                  const key = idx === 0 ? 'focus' : idx === 1 ? 'short' : 'long';
                  return (
                    <button 
                      key={tab}
                      onClick={() => { setMode(key); setTimeLeft(idx === 0 ? 25*60 : idx === 1 ? 5*60 : 15*60); setIsRunning(false); }}
                      className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        mode === key ? 'bg-primary/10 text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col items-center gap-2 mb-8 text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">Current Focus</span>
                <h3 className="text-sm font-bold text-foreground">
                  {tasks.find(t => t.id === currentTaskId)?.text || 'No Active Task'}
                </h3>
              </div>

              <h1 className="text-[18cqw] font-black tracking-tighter leading-none text-card-foreground select-none mb-12">
                {formatTime(timeLeft)}
              </h1>

              <div className="flex items-center justify-center gap-3 w-full max-w-[400px] mx-auto">
                <button 
                  onClick={restartTimer}
                  className="bg-muted hover:bg-muted/80 text-muted-foreground p-5 rounded-2xl transition-all flex-shrink-0 group"
                  title="Restart Timer"
                >
                  <RotateCcw className="w-5 h-5 group-hover:rotate-[-45deg] transition-transform" />
                </button>

                <button 
                  onClick={() => setIsRunning(!isRunning)}
                  className="bg-primary text-primary-foreground text-2xl font-black tracking-widest px-8 py-5 rounded-2xl flex-1 shadow-md hover:opacity-90 transition-all"
                >
                  {isRunning ? 'PAUSE' : 'START'}
                </button>

                <button 
                  onClick={skipSession}
                  className="bg-muted hover:bg-muted/80 text-muted-foreground p-5 rounded-2xl transition-all flex-shrink-0 group"
                  title="Skip Session"
                >
                  <SkipForward className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button 
                  onClick={enterZenMode}
                  className="bg-card border border-border text-muted-foreground hover:text-foreground p-5 rounded-2xl shadow-sm hover:bg-muted transition-all flex-shrink-0 group"
                  title="Full Screen"
                >
                  <Maximize className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Task Engine Tile */}
          <div key="tasks" className="bg-card border border-border rounded-2xl shadow-sm flex flex-col relative overflow-hidden h-full group">
            <div className="drag-handle w-full h-10 cursor-grab active:cursor-grabbing flex items-center justify-center bg-transparent hover:bg-muted/50 transition-colors absolute top-0 left-0 z-10">
              <GripHorizontal className="w-4 h-4 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="flex flex-col h-full px-6 py-4 pt-14 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-foreground">Tasks</h2>
                <button className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground"><MoreVertical size={20}/></button>
              </div>

              {/* Estimated Time */}
              {estTime && (
                <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                  <Clock size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {estTime.totalPomos} pomos · {estTime.h > 0 ? `${estTime.h}h ` : ''}{estTime.m}m est.
                  </span>
                </div>
              )}

              {/* Add Task */}
              {!isAddingTask ? (
                <button 
                  onClick={() => setIsAddingTask(true)}
                  className="w-full py-4 bg-muted/30 border border-border rounded-xl text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 my-4 shrink-0"
                >
                  <Plus size={16} /> Add Task
                </button>
              ) : (
                <div className="bg-muted/30 border border-border rounded-xl p-4 my-4 flex flex-col gap-4 shrink-0">
                  <input 
                    autoFocus
                    className="w-full bg-transparent text-base font-bold text-foreground placeholder:text-muted-foreground outline-none"
                    placeholder="What are you working on?"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                  />
                  <div className="flex items-center gap-4">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Est Pomos</label>
                    <input 
                      type="number" min="1"
                      className="w-20 bg-card border border-border rounded-lg px-3 py-1.5 text-sm font-black text-foreground"
                      value={newTask.est}
                      onChange={(e) => setNewTask({...newTask, est: parseInt(e.target.value) || 1})}
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button onClick={() => { setIsAddingTask(false); setNewTask({ title: '', est: 1 }); }} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors px-4 py-2">Cancel</button>
                    <button onClick={handleAddTask} className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest">Save</button>
                  </div>
                </div>
              )}

              {/* Scrollable task list with Drag-to-Reorder */}
              <div className="flex-1 overflow-y-auto pr-2 mt-2 custom-scrollbar">
                <Reorder.Group 
                  axis="y" 
                  values={activeTasks} 
                  onReorder={(newOrder) => {
                    setTasks([...newOrder, ...completedTasks]);
                  }}
                  className="space-y-2"
                >
                  {activeTasks.map(task => (
                    <Reorder.Item 
                      key={task.id} 
                      value={task}
                      dragListener={!editingTask}
                    >
                      <div 
                        onClick={() => setCurrentTaskId(task.id)}
                        className={`flex justify-between items-center py-3 border-b border-border group cursor-pointer rounded-lg px-2 transition-all ${
                          currentTaskId === task.id ? 'bg-primary/5 border-primary/20 shadow-sm' : 'hover:bg-muted/50 border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <button 
                            onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }} 
                            className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                          >
                            <Circle size={18} />
                          </button>
                          <span 
                            onClick={(e) => { e.stopPropagation(); openEditModal(task); }}
                            className="text-sm font-bold text-foreground truncate border-b border-transparent group-hover:border-muted-foreground/30 transition-colors"
                          >
                            {task.text}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black text-muted-foreground tracking-widest shrink-0">{task.done} / {task.est}</span>
                          <GripHorizontal size={14} className="text-muted-foreground/20 group-hover:text-muted-foreground/50 transition-colors cursor-grab active:cursor-grabbing" />
                        </div>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>

                {completedTasks.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-border">
                    <h3 className="text-[10px] font-black text-muted-foreground mb-3 uppercase tracking-wider">Completed</h3>
                    <div className="space-y-2">
                      {completedTasks.map(task => (
                        <div key={task.id} className="flex justify-between items-center py-3 px-2 rounded-lg opacity-60">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <button onClick={() => toggleTask(task.id)} className="shrink-0">
                              <CheckCircle2 size={18} className="text-green-500 fill-green-500/20" />
                            </button>
                            <span className="text-sm font-bold text-muted-foreground line-through truncate">{task.text}</span>
                          </div>
                          <span className="text-[10px] font-black text-muted-foreground/50 tracking-widest ml-3 shrink-0">{task.done} / {task.est}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Audio Tile */}
          <div key="audio" className="bg-card border border-border rounded-2xl shadow-sm flex flex-col relative overflow-hidden h-full group">
            <div className="drag-handle w-full h-10 cursor-grab active:cursor-grabbing flex items-center justify-center bg-transparent hover:bg-muted/50 transition-colors absolute top-0 left-0 z-10">
              <GripHorizontal className="w-4 h-4 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="p-4 pt-14 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-3">
                <MusicIcon size={16} className="text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Deep Focus Audio</span>
              </div>
              
              {!isSpotifyConnected ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-muted/20 rounded-xl border border-dashed border-border">
                  <MusicIcon className="w-10 h-10 text-muted-foreground/30 mb-4" />
                  <p className="text-xs font-bold text-muted-foreground mb-6 max-w-[200px]">Connect Spotify to control music directly from your workspace.</p>
                  <button 
                    onClick={() => setIsSpotifyConnected(true)}
                    className="bg-[#1DB954] text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
                  >
                    Connect Account
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1 w-full min-h-[152px] rounded-xl overflow-hidden">
                    <iframe
                      className="w-full h-full"
                      src="https://open.spotify.com/embed/playlist/0vvXsWCC9xrXsKd4FyS8kM?utm_source=generator&theme=0"
                      frameBorder="0"
                      allowFullScreen=""
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      title="Audio Integration"
                    />
                  </div>
                  <div className="mt-4 pt-3 border-t border-border flex justify-end">
                    <button 
                      onClick={() => setIsSpotifyConnected(false)}
                      className="text-xs font-bold tracking-wider text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 px-4 py-1.5 rounded-full transition-colors uppercase"
                    >
                      Disconnect
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </ResponsiveGridLayout>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card border border-border w-full max-w-md p-6 rounded-3xl shadow-2xl relative"
          >
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
              <h2 className="text-xl font-black tracking-widest uppercase">Settings</h2>
              <button onClick={() => setIsSettingsOpen(false)} className="p-2 hover:bg-muted rounded-full"><X size={20}/></button>
            </div>
            
            <div className="space-y-8">
              <section className="space-y-4">
                <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest">Timer Durations</h3>
                <div className="grid grid-cols-3 gap-4">
                  {['Pomo', 'Short', 'Long'].map(l => (
                    <div key={l} className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">{l}</label>
                      <input type="number" defaultValue={25} className="w-full bg-muted border border-border rounded-xl px-3 py-3 text-sm font-black" />
                    </div>
                  ))}
                </div>
              </section>

              <section className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-sm font-bold">Dark Mode on running</span>
                <Moon size={20} className="text-muted-foreground" />
              </section>

              <section className="flex items-center justify-between">
                <span className="text-sm font-bold">Alarm Sound</span>
                <select className="bg-muted border border-border rounded-xl px-4 py-2 text-xs font-black">
                  <option>Kitchen</option>
                  <option>Bells</option>
                </select>
              </section>
            </div>

            <button onClick={() => setIsSettingsOpen(false)} className="w-full mt-10 bg-primary text-primary-foreground py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20">SAVE CHANGES</button>
          </motion.div>
        </div>
      )}

      {/* Report Modal */}
      {isReportOpen && (
        <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-card border border-border w-full max-w-2xl p-8 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
              <h2 className="text-xl font-black tracking-widest uppercase">Activity Report</h2>
              <button onClick={() => setIsReportOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors"><X size={20}/></button>
            </div>

            <div className="flex gap-10 mb-8 border-b border-border">
              {['Summary', 'Detail', 'Ranking'].map((t, i) => (
                <button key={t} className={`text-[10px] font-black uppercase tracking-[0.2em] pb-3 border-b-2 transition-all ${i===0?'border-primary text-foreground':'border-transparent text-muted-foreground'}`}>{t}</button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-6 mb-10">
              {[
                { l: 'Hours Focused', v: '12.5', i: TrendingUp },
                { l: 'Days Accessed', v: '18', i: Calendar },
                { l: 'Day Streak', v: '5', i: Award }
              ].map(s => (
                <div key={s.l} className="bg-muted rounded-2xl p-6 text-center space-y-2 border border-border/50">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-2">
                    <s.i size={12} /> {s.l}
                  </span>
                  <div className="text-3xl font-black text-primary tracking-tighter">{s.v}</div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Focus Distribution (Weekly)</h3>
              <div className="h-64 w-full bg-muted/20 border border-border rounded-2xl p-6 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={CHART_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 'bold' }} 
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', fontSize: '10px', fontWeight: 'bold' }}
                      cursor={{ fill: 'hsl(var(--primary))', opacity: 0.1 }}
                    />
                    <Bar dataKey="focus" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card border border-border w-full max-w-md p-8 rounded-3xl shadow-xl flex flex-col gap-5"
          >
            <h2 className="text-lg font-black tracking-widest uppercase">Edit Task</h2>
            
            <div className="space-y-1">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Task Name</label>
              <input 
                autoFocus
                type="text"
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground outline-none focus:border-primary/50"
                value={editForm.text}
                onChange={(e) => setEditForm({...editForm, text: e.target.value})}
                onKeyDown={(e) => e.key === 'Enter' && saveEditModal()}
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Est Pomodoros</label>
              <input 
                type="number" min="1"
                className="w-24 bg-muted border border-border rounded-xl px-4 py-3 text-sm font-black text-foreground outline-none focus:border-primary/50"
                value={editForm.est}
                onChange={(e) => setEditForm({...editForm, est: parseInt(e.target.value) || 1})}
              />
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-border mt-2">
              <button 
                onClick={() => { deleteTask(editingTask.id); setEditingTask(null); }}
                className="text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors"
              >
                Delete
              </button>
              <div className="flex gap-3">
                <button onClick={() => setEditingTask(null)} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors px-4 py-2">Cancel</button>
                <button onClick={saveEditModal} className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest">Save</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <AnimatePresence>
        {isZenMode && (
          <ZenModeClock 
            timeLeft={timeLeft} 
            isRunning={isRunning} 
            activeTask={tasks.find(t => t.id === currentTaskId)}
            onExit={exitZenMode} 
          />
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--border));
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.5);
        }
      `}} />
    </div>
  );
}
