import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import { motion } from 'framer-motion';
import { Target, AlertCircle, Clock, BookOpen, RefreshCw, Plus } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import { WidgetCard } from '../../components/ui/WidgetCard';
import Modal from '../../components/shared/Modal';
import { useAcademicStore } from '../../store/academicStore';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const DEFAULT_ACADEMICS_LAYOUTS = {
  lg: [
    { i: 'gpa', x: 0, y: 0, w: 4, h: 4 },
    { i: 'attendance', x: 4, y: 0, w: 8, h: 6 },
    { i: 'deadlines', x: 0, y: 4, w: 4, h: 6 },
    { i: 'schedule', x: 4, y: 6, w: 8, h: 4 }
  ],
  md: [
    { i: 'gpa', x: 0, y: 0, w: 4, h: 4 },
    { i: 'attendance', x: 4, y: 0, w: 6, h: 6 },
    { i: 'deadlines', x: 0, y: 4, w: 4, h: 6 },
    { i: 'schedule', x: 4, y: 6, w: 6, h: 4 }
  ],
  sm: [
    { i: 'gpa', x: 0, y: 0, w: 6, h: 4 },
    { i: 'attendance', x: 0, y: 4, w: 6, h: 6 },
    { i: 'deadlines', x: 0, y: 10, w: 6, h: 6 },
    { i: 'schedule', x: 0, y: 16, w: 6, h: 4 }
  ]
};

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


export default function AcademicsHome() {
  const { subjects, getAllPendingAssignments, cgpa, targetGpa, updateAcademicMeta } = useAcademicStore();
  const [layouts, setLayouts] = useState(DEFAULT_ACADEMICS_LAYOUTS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditGpaOpen, setIsEditGpaOpen] = useState(false);
  const [gpaForm, setGpaForm] = useState({ cgpa: 0, targetGpa: 9.0 });
  
  // Sync form with store data
  useEffect(() => {
    if (cgpa !== undefined && targetGpa !== undefined) {
      setGpaForm({ cgpa, targetGpa });
    }
  }, [cgpa, targetGpa]);

  const pendingAssignments = useMemo(() => 
    getAllPendingAssignments().sort((a, b) => new Date(a.deadline) - new Date(b.deadline)),
    [getAllPendingAssignments]
  );
  
  const next48Hours = useMemo(() => 
    pendingAssignments.filter(a => {
      const hours = (new Date(a.deadline) - new Date()) / (1000 * 60 * 60);
      return hours >= 0 && hours <= 48;
    }),
    [pendingAssignments]
  );
  
  const upcoming = useMemo(() => 
    pendingAssignments.filter(a => {
      const hours = (new Date(a.deadline) - new Date()) / (1000 * 60 * 60);
      return hours > 48;
    }).slice(0, 5),
    [pendingAssignments]
  );

  const todaySchedule = useMemo(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = days[new Date().getDay()];
    return subjects.flatMap(s => 
      (s.schedule || [])
        .filter(i => i.day === todayName)
        .map(i => ({ ...i, subjectName: s.name }))
    ).sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [subjects]);
  useEffect(() => {
    const saved = localStorage.getItem('academics_layouts');
    if (saved) {
      try { setLayouts(JSON.parse(saved)); } catch { setLayouts(DEFAULT_ACADEMICS_LAYOUTS); }
    } else {
      setLayouts(DEFAULT_ACADEMICS_LAYOUTS);
    }
    setIsLoaded(true);
  }, []);

  const handleLayoutChange = (currentLayout, allLayouts) => {
    setLayouts(allLayouts);
    localStorage.setItem('academics_layouts', JSON.stringify(allLayouts));
  };

  const resetLayout = () => {
    setLayouts(DEFAULT_ACADEMICS_LAYOUTS);
    localStorage.removeItem('academics_layouts');
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
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={40}
          onLayoutChange={handleLayoutChange}
          draggableHandle=".drag-handle"
          margin={[16, 16]}
        >
          {/* WIDGET 1: GPA */}
          <WidgetCard 
            key="gpa" 
            title="Performance" 
            icon={Target}
            headerAction={
              <button onClick={() => setIsEditGpaOpen(true)} className="p-1 hover:bg-primary/10 rounded transition-colors text-primary">
                <Plus size={14} />
              </button>
            }
          >
            <div className="flex flex-col h-full justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Current CGPA</span>
                  <span className="text-5xl font-bold text-primary tracking-tighter">{cgpa || '0.00'}</span>
                </div>
                <div className="mt-auto border-t border-border pt-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-foreground">Target SGPA: {targetGpa}</span>
                    <span className="text-muted-foreground font-medium">
                      {cgpa > 0 ? Math.round((cgpa / targetGpa) * 100) : 0}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${cgpa > 0 ? Math.min(100, (cgpa / targetGpa) * 100) : 0}%` }} />
                  </div>
                </div>
              </div>
          </WidgetCard>

          {/* WIDGET 2: ATTENDANCE */}
          <WidgetCard key="attendance" title="Attendance Intelligence" icon={Clock}>
            <div className="flex flex-col gap-4 overflow-y-auto pr-2 h-full">
              {subjects.filter(s => s.attendance?.total > 0).map((item, i) => {
                const logic = calculateAttendanceLogic(item.attendance.attended, item.attendance.total);
                const isSafe = logic.status === 'safe';
                return (
                  <div key={item.id} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground text-sm">{item.name}</span>
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
          </WidgetCard>

          {/* WIDGET 3: DEADLINES */}
          <WidgetCard key="deadlines" title="Deadlines" icon={AlertCircle}>
            <div className="flex flex-col overflow-y-auto h-full pr-2 gap-4">
              <div>
                <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertCircle size={12} /> Next 48 Hours
                </h4>
                {next48Hours.length === 0 ? (
                   <p className="text-xs text-muted-foreground">No immediate deadlines.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {next48Hours.map(a => (
                      <div key={a.id} className="bg-red-500/5 border border-red-500/20 p-2.5 rounded-lg flex flex-col gap-1">
                        <span className="font-semibold text-sm text-foreground">{a.title}</span>
                        <span className="text-xs text-red-500 font-medium">{a.subjectName} • {new Date(a.deadline).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Upcoming
                </h4>
                {upcoming.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No upcoming deadlines.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {upcoming.map(a => (
                      <div key={a.id} className="bg-secondary p-2.5 border border-border rounded-lg flex flex-col gap-1">
                        <span className="font-semibold text-sm text-foreground">{a.title}</span>
                        <span className="text-xs text-muted-foreground font-medium">{a.subjectName} • {new Date(a.deadline).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </WidgetCard>
          {/* WIDGET 4: SCHEDULE */}
          <WidgetCard key="schedule" title="Today's Schedule" icon={BookOpen}>
            <div className="flex flex-col sm:flex-row gap-3 h-full items-stretch overflow-x-auto pr-2">
              {todaySchedule.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground italic">No classes today</div>
              ) : (
                todaySchedule.map((item, idx) => {
                  const now = new Date();
                  const [h, m] = item.startTime.split(':');
                  const startTime = new Date();
                  startTime.setHours(h, m, 0);
                  
                  const [eh, em] = item.endTime.split(':');
                  const endTime = new Date();
                  endTime.setHours(eh, em, 0);

                  const isOngoing = now >= startTime && now <= endTime;

                  return (
                    <Link to={`/academics/subject/${item.subjectId}`} key={idx} className={`flex-1 min-w-[140px] border rounded-xl p-3 flex flex-col justify-center relative overflow-hidden transition-all hover:scale-105 active:scale-95 ${isOngoing ? 'bg-primary/5 border-primary/30' : 'bg-secondary border-border'}`}>
                      {isOngoing && (
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                          </span>
                          <span className="text-[9px] font-bold text-primary uppercase tracking-wider">Ongoing</span>
                        </div>
                      )}
                      <span className={`text-[10px] font-bold mb-1 uppercase tracking-wider ${isOngoing ? 'text-primary' : 'text-muted-foreground'}`}>{item.startTime}</span>
                      <span className="text-sm font-semibold text-foreground truncate">{item.subjectName}</span>
                      <span className="text-xs text-muted-foreground mt-0.5 truncate">{item.room || 'No Room'}</span>
                    </Link>
                  );
                })
              )}
            </div>
          </WidgetCard>

        </ResponsiveGridLayout>
      </div>
      <Modal isOpen={isEditGpaOpen} onClose={() => setIsEditGpaOpen(false)} title="Update Academic Goals">
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Current CGPA</label>
            <input 
              type="number" step="0.01"
              value={gpaForm.cgpa} 
              onChange={e => setGpaForm({...gpaForm, cgpa: Number(e.target.value)})} 
              className="bg-secondary border border-border p-3 rounded-xl outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Target CGPA</label>
            <input 
              type="number" step="0.1"
              value={gpaForm.targetGpa} 
              onChange={e => setGpaForm({...gpaForm, targetGpa: Number(e.target.value)})} 
              className="bg-secondary border border-border p-3 rounded-xl outline-none"
            />
          </div>
          <button 
            className="btn-primary mt-4 py-3 justify-center"
            onClick={async () => {
              await updateAcademicMeta(gpaForm);
              setIsEditGpaOpen(false);
            }}
          >
            Update Goals
          </button>
        </div>
      </Modal>
    </PageWrapper>
  );
}
