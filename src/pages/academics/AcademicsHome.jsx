import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import { motion } from 'framer-motion';
import { GripVertical, Target, AlertCircle, Clock, BookOpen, RefreshCw } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const DEFAULT_ACADEMICS_LAYOUT = [
  { i: 'gpa', x: 0, y: 0, w: 4, h: 4, minW: 3, minH: 3 },
  { i: 'attendance', x: 4, y: 0, w: 8, h: 6, minW: 5, minH: 5 },
  { i: 'deadlines', x: 0, y: 4, w: 4, h: 6, minW: 3, minH: 4 },
  { i: 'schedule', x: 4, y: 6, w: 8, h: 4, minW: 5, minH: 3 }
];

const mockAttendance = [
  { subject: "DSA", attended: 35, total: 40 },
  { subject: "Signals & Systems", attended: 20, total: 35 },
  { subject: "Control Systems", attended: 28, total: 32 }
];

// Helper to calculate skip/attend logic
function calculateAttendanceLogic(attended, total) {
  const target = 0.75;
  const current = attended / total;
  if (current >= target) {
    // How many more classes can I skip and still be >= 75%?
    // (attended) / (total + skips) = 0.75 => total + skips = attended / 0.75 => skips = (attended / 0.75) - total
    const safeToSkip = Math.floor(attended / 0.75) - total;
    return { status: 'safe', value: safeToSkip, percent: current * 100 };
  } else {
    // How many more classes do I need to attend to reach 75%?
    // (attended + need) / (total + need) = 0.75 => attended + need = 0.75*total + 0.75*need => 0.25*need = 0.75*total - attended => need = (0.75*total - attended) / 0.25
    const needToAttend = Math.ceil((0.75 * total - attended) / 0.25);
    return { status: 'danger', value: needToAttend, percent: current * 100 };
  }
}

function WidgetWrapper({ children, title, icon: Icon }) {
  return (
    <div className="bg-card border border-border/50 rounded-2xl shadow-sm flex flex-col w-full h-full overflow-hidden hover:shadow-md transition-shadow group">
      <div className="drag-handle h-6 w-full cursor-grab active:cursor-grabbing flex items-center justify-center bg-transparent group-hover:bg-muted/30 transition-colors shrink-0">
         <GripVertical className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />
      </div>
      
      <div className="px-6 pb-6 flex-1 flex flex-col overflow-y-auto">
         <h3 className="text-xs font-black tracking-widest uppercase text-muted-foreground mb-4 flex items-center gap-2">
           {Icon && <Icon size={14} className="text-primary" />}
           {title}
         </h3>
         {children}
      </div>
    </div>
  );
}

export default function AcademicsHome() {
  const [layout, setLayout] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('academics_layout');
    if (saved) {
      try {
        setLayout(JSON.parse(saved));
      } catch {
        setLayout(DEFAULT_ACADEMICS_LAYOUT);
      }
    } else {
      setLayout(DEFAULT_ACADEMICS_LAYOUT);
    }
    setIsLoaded(true);
  }, []);

  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
    localStorage.setItem('academics_layout', JSON.stringify(newLayout));
  };

  const resetLayout = () => {
    setLayout(DEFAULT_ACADEMICS_LAYOUT);
    localStorage.removeItem('academics_layout');
  };

  if (!isLoaded) return null;

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1">Academics Hub</h1>
          <p className="text-muted-foreground">Semester 5 Overview & Intelligence</p>
        </div>
        <button 
          onClick={resetLayout}
          className="btn-secondary"
        >
          <RefreshCw size={14} />
          Reset Layout
        </button>
      </div>

      <div className="-mx-2">
        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: layout, md: layout, sm: layout, xs: layout, xxs: layout }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={40}
          onLayoutChange={handleLayoutChange}
          draggableHandle=".drag-handle"
          margin={[16, 16]}
        >
          {/* WIDGET 1: GPA */}
          <div key="gpa">
            <WidgetWrapper title="Performance" icon={Target}>
              <div className="flex flex-col h-full justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Current CGPA</span>
                  <span className="text-5xl font-bold text-primary tracking-tighter">8.45</span>
                </div>
                <div className="mt-auto border-t border-border pt-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-foreground">Target SGPA: 9.0</span>
                    <span className="text-muted-foreground font-medium">85%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '85%' }} />
                  </div>
                </div>
              </div>
            </WidgetWrapper>
          </div>

          {/* WIDGET 2: ATTENDANCE */}
          <div key="attendance">
            <WidgetWrapper title="Attendance Intelligence" icon={Clock}>
              <div className="flex flex-col gap-4 overflow-y-auto pr-2 h-full">
                {mockAttendance.map((item, i) => {
                  const logic = calculateAttendanceLogic(item.attended, item.total);
                  const isSafe = logic.status === 'safe';
                  return (
                    <div key={i} className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground text-sm">{item.subject}</span>
                        {isSafe ? (
                          <span className="bg-green-500/10 text-green-600 dark:text-green-400 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                            Skip safely: {logic.value}
                          </span>
                        ) : (
                          <span className="bg-red-500/10 text-red-600 dark:text-red-400 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                            Attend next {logic.value}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${isSafe ? 'bg-green-500' : 'bg-red-500'}`} 
                            style={{ width: `${Math.min(100, logic.percent)}%` }} 
                          />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground w-12 text-right">
                          {logic.percent.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </WidgetWrapper>
          </div>

          {/* WIDGET 3: DEADLINES */}
          <div key="deadlines">
            <WidgetWrapper title="Deadlines" icon={AlertCircle}>
              <div className="flex flex-col overflow-y-auto h-full pr-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertCircle size={12} /> Next 48 Hours
                  </h4>
                  <div className="flex flex-col gap-2">
                    <div className="bg-red-500/5 border border-red-500/20 p-2.5 rounded-lg flex flex-col gap-1">
                      <span className="font-semibold text-sm text-foreground">Lab Record Submission</span>
                      <span className="text-xs text-red-500 font-medium">Tomorrow, 11:59 PM</span>
                    </div>
                    <div className="bg-red-500/5 border border-red-500/20 p-2.5 rounded-lg flex flex-col gap-1">
                      <span className="font-semibold text-sm text-foreground">Microprocessor Quiz</span>
                      <span className="text-xs text-red-500 font-medium">Thursday, 10:00 AM</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Upcoming
                  </h4>
                  <div className="flex flex-col gap-2">
                    <div className="bg-secondary p-2.5 border border-border rounded-lg flex flex-col gap-1">
                      <span className="font-semibold text-sm text-foreground">Math Assignment 3</span>
                      <span className="text-xs text-muted-foreground font-medium">Next Monday</span>
                    </div>
                    <div className="bg-secondary p-2.5 border border-border rounded-lg flex flex-col gap-1">
                      <span className="font-semibold text-sm text-foreground">Mini Project Proposal</span>
                      <span className="text-xs text-muted-foreground font-medium">Next Friday</span>
                    </div>
                  </div>
                </div>
              </div>
            </WidgetWrapper>
          </div>

          {/* WIDGET 4: SCHEDULE */}
          <div key="schedule">
            <WidgetWrapper title="Today's Schedule" icon={BookOpen}>
              <div className="flex flex-col sm:flex-row gap-3 h-full items-stretch">
                <div className="flex-1 bg-secondary border border-border rounded-xl p-3 flex flex-col justify-center">
                  <span className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">09:00 AM</span>
                  <span className="text-sm font-semibold text-foreground">Control Systems</span>
                  <span className="text-xs text-muted-foreground mt-0.5">Room 204</span>
                </div>
                
                <div className="flex-1 bg-primary/5 border border-primary/30 rounded-xl p-3 flex flex-col justify-center relative overflow-hidden">
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="text-[9px] font-bold text-primary uppercase tracking-wider">Ongoing</span>
                  </div>
                  <span className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">10:00 AM</span>
                  <span className="text-sm font-semibold text-foreground">Data Structures</span>
                  <span className="text-xs text-muted-foreground mt-0.5">Lab 3</span>
                </div>

                <div className="flex-1 bg-secondary border border-border rounded-xl p-3 flex flex-col justify-center opacity-70">
                  <span className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">11:30 AM</span>
                  <span className="text-sm font-semibold text-foreground">Maths IV</span>
                  <span className="text-xs text-muted-foreground mt-0.5">Room 302</span>
                </div>
              </div>
            </WidgetWrapper>
          </div>

        </ResponsiveGridLayout>
      </div>
    </PageWrapper>
  );
}
