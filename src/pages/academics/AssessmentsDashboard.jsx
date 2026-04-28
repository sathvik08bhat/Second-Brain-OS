import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GripVertical, RefreshCw, Calendar, CheckSquare, 
  Target, AlertCircle, ChevronDown, Check
} from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const DEFAULT_ASSESSMENTS_LAYOUT = [
  { i: 'timeline', x: 0, y: 0, w: 12, h: 4, minW: 6, minH: 3 },
  { i: 'assignments', x: 0, y: 4, w: 6, h: 7, minW: 4, minH: 5 },
  { i: 'exams', x: 6, y: 4, w: 6, h: 7, minW: 4, minH: 5 }
];

// --- Mock Data ---

const mockTimelineEvents = [
  { id: 'ev1', title: 'DSA Mid-Sem', subject: 'Data Structures', date: new Date(Date.now() + 86400000 * 2), type: 'exam' }, // In 2 days
  { id: 'ev2', title: 'Math Assignment 3', subject: 'Maths IV', date: new Date(Date.now() + 86400000 * 5), type: 'assignment' },
  { id: 'ev3', title: 'Control Systems Quiz', subject: 'Control Systems', date: new Date(Date.now() + 86400000 * 10), type: 'exam' },
  { id: 'ev4', title: 'Microprocessor Lab Record', subject: 'Microprocessors', date: new Date(Date.now() + 86400000 * 15), type: 'assignment' },
];

const initialAssignments = [
  { id: 'a1', title: 'Implement Dijkstra in C++', subject: 'DSA', due: 'Tomorrow', isUrgent: true, status: 'pending' },
  { id: 'a2', title: 'Bode Plot Worksheet', subject: 'Control Systems', due: 'Friday', isUrgent: true, status: 'pending' },
  { id: 'a3', title: 'Maths Tutorial 5', subject: 'Maths IV', due: 'Next Mon', isUrgent: false, status: 'pending' },
  { id: 'a4', title: '8085 Assembly Code', subject: 'Microprocessors', due: 'Next Wed', isUrgent: false, status: 'pending' },
];

const mockExams = [
  { 
    id: 's1', 
    subject: "Control Systems", 
    components: [
      { name: "Mid-Sem", weight: 30, scored: 25, max: 30 }, 
      { name: "Internal", weight: 20, scored: 18, max: 20 }, 
      { name: "End-Sem", weight: 50, scored: null, max: 100 }
    ] 
  },
  { 
    id: 's2', 
    subject: "Data Structures", 
    components: [
      { name: "Mid-Sem", weight: 30, scored: 22, max: 30 }, 
      { name: "Internal", weight: 20, scored: 15, max: 20 }, 
      { name: "End-Sem", weight: 50, scored: null, max: 100 }
    ] 
  }
];

// --- Widget Wrapper ---
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

// --- Widgets ---

function TimelineWidget() {
  return (
    <div className="flex-1 overflow-x-auto flex flex-row gap-4 h-full items-center pb-2">
      {mockTimelineEvents.sort((a,b) => a.date - b.date).map(ev => {
        const diffDays = Math.ceil((ev.date - new Date()) / (1000 * 60 * 60 * 24));
        const isUrgent = diffDays <= 3;
        
        return (
          <div 
            key={ev.id} 
            className={`min-w-[200px] h-full flex flex-col justify-center border-l-4 p-4 rounded-r-xl bg-secondary/30 relative overflow-hidden ${
              isUrgent ? 'border-red-500 bg-red-500/5' : 'border-primary'
            }`}
          >
            {isUrgent && (
              <div className="absolute top-2 right-2 flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider">Urgent</span>
              </div>
            )}
            
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">
              {ev.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ({diffDays}d)
            </span>
            <span className={`font-bold text-sm mb-0.5 truncate ${isUrgent ? 'text-red-500' : 'text-foreground'}`}>
              {ev.title}
            </span>
            <span className="text-xs text-muted-foreground truncate">{ev.subject}</span>
          </div>
        );
      })}
    </div>
  );
}

function AssignmentWidget() {
  const [assignments, setAssignments] = useState(initialAssignments);

  const handleCheck = (id) => {
    // Mark as completing (for animation)
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, status: 'completing' } : a));
    
    // Remove after delay
    setTimeout(() => {
      setAssignments(prev => prev.filter(a => a.id !== id));
    }, 1000);
  };

  const dueThisWeek = assignments.filter(a => a.isUrgent);
  const later = assignments.filter(a => !a.isUrgent);

  const renderList = (title, list) => (
    <div className="mb-4">
      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{title}</h4>
      <div className="flex flex-col gap-2">
        <AnimatePresence>
          {list.map(a => {
            const isCompleting = a.status === 'completing';
            return (
              <motion.div 
                key={a.id}
                layout
                initial={{ opacity: 1, scale: 1 }}
                animate={{ 
                  opacity: isCompleting ? 0.4 : 1, 
                  scale: isCompleting ? 0.98 : 1,
                  textDecoration: isCompleting ? 'line-through' : 'none'
                }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/20"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <button 
                    onClick={() => handleCheck(a.id)}
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${isCompleting ? 'bg-primary border-primary text-white' : 'border-muted-foreground hover:border-primary'}`}
                  >
                    {isCompleting && <Check size={12} />}
                  </button>
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-semibold text-sm text-foreground truncate">{a.title}</span>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-primary mt-0.5 bg-primary/10 w-fit px-1.5 py-0.5 rounded">
                      {a.subject}
                    </span>
                  </div>
                </div>
                <div className={`shrink-0 ml-2 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${a.isUrgent ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500'}`}>
                  {a.due}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {list.length === 0 && (
          <div className="text-xs text-muted-foreground italic px-2 py-1">All clear!</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto pr-2">
      {renderList("Due This Week", dueThisWeek)}
      {renderList("Later", later)}
    </div>
  );
}

function ExamsWidget() {
  const [examData, setExamData] = useState(mockExams);
  const [expandedSub, setExpandedSub] = useState(mockExams[0].id);

  const handlePredictChange = (subId, compName, val) => {
    setExamData(prev => prev.map(sub => {
      if (sub.id !== subId) return sub;
      const newComps = sub.components.map(c => 
        c.name === compName ? { ...c, predicted: val === '' ? null : Number(val) } : c
      );
      return { ...sub, components: newComps };
    }));
  };

  return (
    <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3">
      {examData.map(sub => {
        // Calculate totals
        let accumulatedWeight = 0; // Out of 100
        let accumulatedScore = 0;
        
        let pendingWeight = 0;
        let pendingCompName = "";

        sub.components.forEach(c => {
          if (c.scored !== null) {
            // Normalize score to its weight out of 100
            // Example: scored 25/30 for 30 weight => 25 points out of 100. 
            // Wait, usually component weight is the max. If weight=30, and scored 25/30, that's 25%.
            const percentage = c.scored / c.max;
            accumulatedScore += percentage * c.weight;
            accumulatedWeight += c.weight;
          } else {
            pendingWeight += c.weight;
            pendingCompName = c.name;
          }
        });

        // The Magic Feature: What do I need for an O (90%)?
        // Need 90 total. Currently have accumulatedScore.
        // Need to score (90 - accumulatedScore) out of pendingWeight points.
        const neededForO = 90 - accumulatedScore;
        const possibleRemaining = pendingWeight;
        let predictionText = "";
        
        if (neededForO > possibleRemaining) {
          predictionText = `You currently have ${accumulatedScore.toFixed(1)}/100. O grade is mathematically impossible (need ${neededForO.toFixed(1)} but only ${possibleRemaining} left). Aim for an A!`;
        } else if (neededForO <= 0) {
          predictionText = `You currently have ${accumulatedScore.toFixed(1)}/100. You already secured an O grade!`;
        } else {
          // Calculate raw score needed on the pending exam.
          // If pending exam is End-Sem, weight=50, max=100. 
          // Needed points = neededForO. So needed % on exam = neededForO / weight. Raw score = needed % * max.
          const pendingComp = sub.components.find(c => c.scored === null);
          if (pendingComp) {
            const rawNeeded = (neededForO / pendingComp.weight) * pendingComp.max;
            predictionText = `You currently have ${accumulatedScore.toFixed(1)}/${accumulatedWeight}. You need ${Math.ceil(rawNeeded)}/${pendingComp.max} on the ${pendingComp.name} to secure an O (90%+) grade.`;
          }
        }

        const isExpanded = expandedSub === sub.id;

        return (
          <div key={sub.id} className="border border-border rounded-xl bg-secondary/10 overflow-hidden">
            <div 
              className="p-3 cursor-pointer flex items-center justify-between hover:bg-secondary/50 transition-colors"
              onClick={() => setExpandedSub(isExpanded ? null : sub.id)}
            >
              <div className="flex-1">
                <div className="font-bold text-foreground text-sm mb-1">{sub.subject}</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, accumulatedScore)}%` }} />
                  </div>
                  <span className="text-[10px] font-bold uppercase text-primary w-12 text-right">
                    {accumulatedScore.toFixed(1)}%
                  </span>
                </div>
              </div>
              <ChevronDown size={16} className={`text-muted-foreground ml-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-border bg-card p-3"
                >
                  <div className="flex flex-col gap-3">
                    {sub.components.map(c => (
                      <div key={c.name} className="flex items-center justify-between text-sm">
                        <span className="font-medium text-muted-foreground">{c.name} <span className="text-[10px] ml-1 opacity-50">({c.weight}%)</span></span>
                        {c.scored !== null ? (
                          <span className="font-bold text-foreground">{c.scored}/{c.max}</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Predict:</span>
                            <input 
                              type="number" 
                              className="w-16 bg-secondary border border-border rounded px-2 py-1 text-xs text-foreground font-bold text-center focus:outline-none focus:border-primary"
                              placeholder="-"
                              max={c.max}
                              onChange={(e) => handlePredictChange(sub.id, c.name, e.target.value)}
                            />
                            <span className="text-xs text-muted-foreground">/ {c.max}</span>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    <div className="mt-2 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                      <p className="text-xs font-medium leading-relaxed text-primary">
                        ✨ {predictionText}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export default function AssessmentsDashboard() {
  const [layout, setLayout] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('academics_assessments_layout');
    if (saved) {
      try {
        setLayout(JSON.parse(saved));
      } catch {
        setLayout(DEFAULT_ASSESSMENTS_LAYOUT);
      }
    } else {
      setLayout(DEFAULT_ASSESSMENTS_LAYOUT);
    }
    setIsLoaded(true);
  }, []);

  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
    localStorage.setItem('academics_assessments_layout', JSON.stringify(newLayout));
  };

  const resetLayout = () => {
    setLayout(DEFAULT_ASSESSMENTS_LAYOUT);
    localStorage.removeItem('academics_assessments_layout');
  };

  if (!isLoaded) return null;

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1">Assessments & Exams</h1>
          <p className="text-muted-foreground">Manage workload, deadlines, and grade targets.</p>
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
          resizeHandles={['se', 'e', 's']}
          margin={[16, 16]}
        >
          {/* WIDGET 1: Timeline */}
          <div key="timeline">
            <WidgetWrapper title="Horizon Timeline" icon={Calendar}>
              <TimelineWidget />
            </WidgetWrapper>
          </div>

          {/* WIDGET 2: Assignments */}
          <div key="assignments">
            <WidgetWrapper 
              title="Pending Assignments" 
              icon={CheckSquare}
              action={
                <button className="text-xs font-bold text-primary hover:bg-primary hover:text-white border border-primary px-2 py-1 rounded-md transition-colors">
                  + Add
                </button>
              }
            >
              <AssignmentWidget />
            </WidgetWrapper>
          </div>

          {/* WIDGET 3: Exams & Grades */}
          <div key="exams">
            <WidgetWrapper title="Grade & Exam Weight Tracker" icon={Target}>
              <ExamsWidget />
            </WidgetWrapper>
          </div>

        </ResponsiveGridLayout>
      </div>
    </PageWrapper>
  );
}
