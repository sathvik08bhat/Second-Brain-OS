import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GripVertical, BookOpen, ChevronRight, ChevronDown, CheckCircle2, Circle, 
  FileText, PlayCircle, Link as LinkIcon, Plus, Layers, Target, RefreshCw
} from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const DEFAULT_SUBJECTS_LAYOUT = [
  { i: 'selector', x: 0, y: 0, w: 3, h: 8, minW: 3, minH: 5 },
  { i: 'syllabus', x: 3, y: 0, w: 6, h: 5, minW: 4, minH: 4 },
  { i: 'resources', x: 9, y: 0, w: 3, h: 5, minW: 3, minH: 4 },
  { i: 'mastery', x: 3, y: 5, w: 9, h: 3, minW: 6, minH: 3 }
];

const mockSubjects = [
  {
    id: 'sub-1',
    name: 'Data Structures & Algorithms',
    credits: 4,
    faculty: 'Dr. Sharma',
    units: [
      {
        id: 'u-1', title: 'Unit 1: Graph Theory', completed: false, progress: 75,
        topics: [{ id: 't1', name: 'BFS & DFS', done: true }, { id: 't2', name: 'Dijkstra Algorithm', done: true }, { id: 't3', name: 'Bellman Ford', done: false }]
      },
      {
        id: 'u-2', title: 'Unit 2: Dynamic Programming', completed: false, progress: 30,
        topics: [{ id: 't4', name: '0/1 Knapsack', done: true }, { id: 't5', name: 'Matrix Chain Multiplication', done: false }]
      },
      {
        id: 'u-3', title: 'Unit 3: Advanced Trees', completed: false, progress: 0,
        topics: [{ id: 't6', name: 'AVL Trees', done: false }, { id: 't7', name: 'Red-Black Trees', done: false }]
      }
    ],
    resources: [
      { id: 'r-1', title: 'Graph Algorithms Playlist', type: 'video' },
      { id: 'r-2', title: 'DP Cheat Sheet', type: 'pdf' },
      { id: 'r-3', title: 'Leetcode Pattern Guide', type: 'link' }
    ],
    mastery: {
      weak: ['Red-Black Trees', 'Bellman Ford'],
      medium: ['Matrix Chain Multiplication', '0/1 Knapsack'],
      strong: ['BFS & DFS', 'Dijkstra']
    }
  },
  {
    id: 'sub-2',
    name: 'Control Systems',
    credits: 3,
    faculty: 'Prof. Reddy',
    units: [
      {
        id: 'u-4', title: 'Unit 1: Root Locus', completed: true, progress: 100,
        topics: [{ id: 't8', name: 'Angle Criteria', done: true }, { id: 't9', name: 'Magnitude Criteria', done: true }]
      },
      {
        id: 'u-5', title: 'Unit 2: Bode Plots', completed: false, progress: 50,
        topics: [{ id: 't10', name: 'Phase Margin', done: true }, { id: 't11', name: 'Gain Margin', done: false }]
      }
    ],
    resources: [
      { id: 'r-4', title: 'NPTEL Control Systems', type: 'video' },
      { id: 'r-5', title: 'Formula Sheet', type: 'pdf' }
    ],
    mastery: {
      weak: ['Nyquist Plot', 'Gain Margin'],
      medium: ['Bode Plots', 'State Space Analysis'],
      strong: ['Root Locus', 'Transfer Functions']
    }
  },
  {
    id: 'sub-3',
    name: 'Microprocessors',
    credits: 4,
    faculty: 'Dr. Verma',
    units: [],
    resources: [],
    mastery: { weak: [], medium: [], strong: [] }
  }
];

function WidgetWrapper({ children, title, icon: Icon, action }) {
  return (
    <div className="bg-card border border-border/50 rounded-2xl shadow-sm flex flex-col w-full h-full overflow-hidden hover:shadow-md transition-shadow group">
      <div className="drag-handle h-6 w-full cursor-grab active:cursor-grabbing flex items-center justify-center bg-transparent group-hover:bg-muted/30 transition-colors shrink-0">
         <GripVertical className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />
      </div>
      
      <div className="px-6 pb-6 flex-1 flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
           <h3 className="text-xs font-black tracking-widest uppercase text-muted-foreground flex items-center gap-2">
             {Icon && <Icon size={14} className="text-primary" />}
             {title}
           </h3>
           {action && <div>{action}</div>}
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Widget 1: Subject Selector ──
function SelectorWidget({ activeId, onSelect }) {
  return (
    <div className="flex flex-col gap-2 overflow-y-auto h-full pr-1">
      {mockSubjects.map(sub => {
        const isActive = sub.id === activeId;
        return (
          <button
            key={sub.id}
            onClick={() => onSelect(sub.id)}
            className={`flex flex-col items-start p-3 rounded-xl border transition-all text-left w-full ${
              isActive 
                ? 'bg-primary/10 border-primary text-primary' 
                : 'bg-secondary/30 border-border text-foreground hover:bg-secondary hover:border-border/80'
            }`}
          >
            <span className="font-bold text-sm leading-tight mb-1">{sub.name}</span>
            <div className={`flex items-center gap-2 text-[10px] uppercase tracking-wider font-semibold ${isActive ? 'text-primary/70' : 'text-muted-foreground'}`}>
              <span>{sub.credits} Credits</span>
              <span>•</span>
              <span>{sub.faculty}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ── Widget 2: Syllabus Tracker ──
function SyllabusWidget({ subject }) {
  const [expandedUnits, setExpandedUnits] = useState({});

  const toggleUnit = (id) => {
    setExpandedUnits(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!subject.units || subject.units.length === 0) {
    return <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">No syllabus added yet.</div>;
  }

  const totalProgress = subject.units.length > 0 
    ? subject.units.reduce((acc, u) => acc + u.progress, 0) / subject.units.length 
    : 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-foreground truncate mr-2">{subject.name}</h3>
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">Completion: {Math.round(totalProgress)}%</span>
        </div>
      </div>
      
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-5">
        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${totalProgress}%` }} />
      </div>

      <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3">
        {subject.units.map((unit) => (
          <div key={unit.id} className="border border-border bg-secondary/20 rounded-xl overflow-hidden">
            <div 
              className="flex items-center gap-3 p-3 cursor-pointer hover:bg-secondary/50 transition-colors"
              onClick={() => toggleUnit(unit.id)}
            >
              <button className="text-muted-foreground hover:text-primary transition-colors focus:outline-none" onClick={(e) => { e.stopPropagation(); }}>
                {unit.completed ? <CheckCircle2 size={18} className="text-primary" /> : <Circle size={18} />}
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-foreground mb-1">{unit.title}</div>
                <div className="flex items-center gap-2">
                  <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${unit.progress}%` }} />
                  </div>
                </div>
              </div>
              
              <div className="text-muted-foreground transition-transform duration-200" style={{ transform: expandedUnits[unit.id] ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                <ChevronDown size={16} />
              </div>
            </div>

            <AnimatePresence>
              {expandedUnits[unit.id] && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-card border-t border-border overflow-hidden"
                >
                  <div className="p-2 pl-10 flex flex-col gap-1">
                    {unit.topics.map(topic => (
                      <div key={topic.id} className="flex items-center gap-2 py-1.5">
                        <input type="checkbox" checked={topic.done} readOnly className="w-3.5 h-3.5 accent-primary cursor-pointer" />
                        <span className={`text-xs ${topic.done ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{topic.name}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Widget 3: Resources ──
function ResourcesWidget({ subject }) {
  const getIcon = (type) => {
    switch(type) {
      case 'video': return <PlayCircle size={16} className="text-red-500" />;
      case 'pdf': return <FileText size={16} className="text-blue-500" />;
      default: return <LinkIcon size={16} className="text-primary" />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2">
        {subject.resources.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground text-xs text-center opacity-50">
            <BookOpen size={24} className="mb-2" />
            No resources yet.
          </div>
        ) : (
          subject.resources.map(res => (
            <div key={res.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-secondary/30 hover:bg-secondary transition-colors cursor-pointer group">
              {getIcon(res.type)}
              <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors flex-1 truncate">{res.title}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Widget 4: Topic Mastery ──
function MasteryWidget({ subject }) {
  const { weak, medium, strong } = subject.mastery;

  const renderTags = (tags, colorClass) => {
    if (!tags || tags.length === 0) return <span className="text-xs text-muted-foreground italic">None yet</span>;
    return (
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span key={i} className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${colorClass} cursor-grab active:cursor-grabbing`}>
            {tag}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row h-full gap-3">
      <div className="flex-1 bg-red-500/5 border border-red-500/10 rounded-xl p-3 flex flex-col">
        <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Circle size={10} fill="currentColor" /> Weak (Review)
        </h4>
        <div className="flex-1 overflow-y-auto">
          {renderTags(weak, 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20')}
        </div>
      </div>

      <div className="flex-1 bg-yellow-500/5 border border-yellow-500/10 rounded-xl p-3 flex flex-col">
        <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Circle size={10} fill="currentColor" /> Medium (Practice)
        </h4>
        <div className="flex-1 overflow-y-auto">
          {renderTags(medium, 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-500 border-yellow-500/20')}
        </div>
      </div>

      <div className="flex-1 bg-green-500/5 border border-green-500/10 rounded-xl p-3 flex flex-col">
        <h4 className="text-xs font-bold text-green-600 dark:text-green-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Circle size={10} fill="currentColor" /> Strong (Exam Ready)
        </h4>
        <div className="flex-1 overflow-y-auto">
          {renderTags(strong, 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20')}
        </div>
      </div>
    </div>
  );
}

export default function Subjects() {
  const [layout, setLayout] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSubjectId, setActiveSubjectId] = useState(mockSubjects[0].id);

  const activeSubject = mockSubjects.find(s => s.id === activeSubjectId) || mockSubjects[0];

  useEffect(() => {
    const saved = localStorage.getItem('academics_subjects_layout');
    if (saved) {
      try {
        setLayout(JSON.parse(saved));
      } catch {
        setLayout(DEFAULT_SUBJECTS_LAYOUT);
      }
    } else {
      setLayout(DEFAULT_SUBJECTS_LAYOUT);
    }
    setIsLoaded(true);
  }, []);

  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
    localStorage.setItem('academics_subjects_layout', JSON.stringify(newLayout));
  };

  const resetLayout = () => {
    setLayout(DEFAULT_SUBJECTS_LAYOUT);
    localStorage.removeItem('academics_subjects_layout');
  };

  if (!isLoaded) return null;

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1">Subject Workspace</h1>
          <p className="text-muted-foreground">Manage syllabus, resources, and track topic mastery.</p>
        </div>
        <button 
          onClick={resetLayout}
          className="btn-secondary"
        >
          <RefreshCw size={14} />
          Reset Layout
        </button>
      </div>

      <div className="-mx-2 h-[calc(100vh-140px)]">
        <ResponsiveGridLayout
          className="layout h-full"
          layouts={{ lg: layout, md: layout, sm: layout, xs: layout, xxs: layout }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={60}
          onLayoutChange={handleLayoutChange}
          draggableHandle=".drag-handle"
          margin={[16, 16]}
        >
          {/* WIDGET 1: Subject Selector */}
          <div key="selector">
            <WidgetWrapper title="Your Subjects" icon={BookOpen}>
              <SelectorWidget activeId={activeSubjectId} onSelect={setActiveSubjectId} />
            </WidgetWrapper>
          </div>

          {/* WIDGET 2: Syllabus Tracker */}
          <div key="syllabus">
            <WidgetWrapper title="Syllabus Tracker" icon={Layers}>
              <SyllabusWidget subject={activeSubject} />
            </WidgetWrapper>
          </div>

          {/* WIDGET 3: Resources Vault */}
          <div key="resources">
            <WidgetWrapper 
              title="Resources Vault" 
              icon={LinkIcon}
              action={
                <button className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-md transition-colors">
                  <Plus size={12} /> Add
                </button>
              }
            >
              <ResourcesWidget subject={activeSubject} />
            </WidgetWrapper>
          </div>

          {/* WIDGET 4: Topic Mastery Matrix */}
          <div key="mastery">
            <WidgetWrapper title="Topic Mastery Matrix" icon={Target}>
              <MasteryWidget subject={activeSubject} />
            </WidgetWrapper>
          </div>
        </ResponsiveGridLayout>
      </div>
    </PageWrapper>
  );
}
