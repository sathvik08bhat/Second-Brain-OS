import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import { 
  ChevronLeft, Plus, Clock, 
  Target, Layers, RefreshCw,
  Search, Bell, User, Edit3,
  Calendar, BookOpen, BarChart2,
  FileText
} from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import { useAcademicStore } from '../../store/academicStore';

// Components
import GradingDetails from '../../components/academics/GradingDetails';
import AttendanceTracker from '../../components/academics/AttendanceTracker';
import UpcomingClasses from '../../components/academics/UpcomingClasses';
import GradePointAnalyzer from '../../components/academics/GradePointAnalyzer';
import ResourcesList from '../../components/academics/ResourcesList';
import AcademicWidget from '../../components/academics/AcademicWidget';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const DEFAULT_LAYOUTS = {
  lg: [
    { i: 'schedule', x: 0, y: 0, w: 7, h: 9 },
    { i: 'grading', x: 7, y: 0, w: 5, h: 9 },
    { i: 'gpa', x: 0, y: 9, w: 7, h: 9 },
    { i: 'resources', x: 7, y: 9, w: 5, h: 9 }
  ],
  md: [
    { i: 'schedule', x: 0, y: 0, w: 10, h: 9 },
    { i: 'grading', x: 0, y: 9, w: 10, h: 9 },
    { i: 'gpa', x: 0, y: 18, w: 10, h: 9 },
    { i: 'resources', x: 0, y: 27, w: 10, h: 9 }
  ]
};

export default function SubjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { subjects, isLoading } = useAcademicStore();
  
  const subject = useMemo(() => subjects.find(s => s.id === id), [subjects, id]);
  const [activeTab, setActiveTab] = useState('Overview');
  const [layouts, setLayouts] = useState(DEFAULT_LAYOUTS);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem(`academic_layout_v2_${id}`);
    if (saved) {
      try { setLayouts(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, [id]);

  const onLayoutChange = (current, all) => {
    setLayouts(all);
    localStorage.setItem(`academic_layout_v2_${id}`, JSON.stringify(all));
  };

  if (isLoading) return (
    <PageWrapper>
       <div className="flex items-center justify-center h-[80vh]">
         <RefreshCw size={32} className="animate-spin text-primary opacity-20" />
       </div>
    </PageWrapper>
  );
  
  if (!subject) return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
        <h2 className="text-2xl font-black text-muted-foreground">Subject Void Detected</h2>
        <button onClick={() => navigate('/academics')} className="btn-primary py-3 px-8 rounded-xl">Return to Roadmap</button>
      </div>
    </PageWrapper>
  );

  const tabs = ['Overview', 'Syllabus', 'Upcoming Classes', 'Grading', 'Grade Analyzer', 'Resources', 'Attendance'];

  return (
    <PageWrapper>
      <div className="flex flex-col gap-10 pb-20 max-w-[1600px] mx-auto px-6">
        
        {/* Top Navbar Utility */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
            <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => navigate('/academics')}>Academics</span>
            <ChevronLeft size={12} className="rotate-180 opacity-30" />
            <span className="hover:text-primary cursor-pointer transition-colors">Semester {subject.semester}</span>
            <ChevronLeft size={12} className="rotate-180 opacity-30" />
            <span className="text-foreground">{subject.name}</span>
          </div>
          <div className="flex items-center gap-6">
            <Search size={20} className="text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
            <Bell size={20} className="text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
            <div className="w-10 h-10 rounded-full bg-secondary/50 border border-border/50 flex items-center justify-center overflow-hidden">
               <User size={20} className="text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Subject Profile Header */}
        <div className="bg-card/40 border border-border/40 rounded-[48px] p-10 flex flex-col md:flex-row items-center gap-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10 group-hover:bg-primary/10 transition-colors" />
          
          <div className="w-32 h-32 rounded-[40px] bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-primary/20 transition-transform hover:scale-105 duration-700">
             <div className="text-4xl font-black">&lt; /&gt;</div>
          </div>

          <div className="flex-1 flex flex-col gap-6 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-black text-foreground tracking-tight leading-none">{subject.name}</h1>
                  <span className="px-3 py-1 rounded-lg bg-primary/10 text-[11px] font-black text-primary uppercase tracking-widest border border-primary/20">
                    {subject.code || 'CS301'}
                  </span>
                </div>
              </div>
              <button className="flex items-center gap-3 px-8 py-4 rounded-[24px] bg-secondary border border-border/40 text-[11px] font-black text-muted-foreground uppercase tracking-widest hover:text-foreground hover:bg-secondary/80 transition-all shadow-lg active:scale-95">
                <Edit3 size={16} /> Edit Details
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-4 border-t border-border/20">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-40">Professor</span>
                <span className="text-sm font-bold text-foreground opacity-80">{subject.professor?.name || 'Dr. Arvind Kumar'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-40">Email</span>
                <span className="text-sm font-bold text-foreground opacity-80">{subject.professor?.email || 'arvind.kumar@iiitm.ac.in'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-40">Phone</span>
                <span className="text-sm font-bold text-foreground opacity-80">{subject.professor?.phone || '+91 98765 43210'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide border-b border-border/20 pb-2">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 rounded-t-[20px] text-[11px] font-black uppercase tracking-[0.2em] transition-all relative ${
                activeTab === tab 
                  ? 'text-primary after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[3px] after:bg-primary after:rounded-full' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Modular Widget Workspace */}
        <div className="-mx-6">
          <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4 }}
            rowHeight={40}
            draggableHandle=".drag-handle"
            onLayoutChange={onLayoutChange}
            margin={[24, 24]}
          >
            {/* 1. Upcoming Classes */}
            <div key="schedule">
              <AcademicWidget title="Upcoming Classes" icon={Calendar} iconBg="bg-primary/10" iconColor="text-primary">
                <UpcomingClasses />
              </AcademicWidget>
            </div>

            {/* 2. Grading Details */}
            <div key="grading">
              <AcademicWidget title="Grading Details" icon={BookOpen} iconBg="bg-emerald-500/10" iconColor="text-emerald-500">
                <GradingDetails marks={subject.marks} />
              </AcademicWidget>
            </div>

            {/* 3. GPA Analyzer */}
            <div key="gpa">
              <AcademicWidget title="Grade Point Analyzer" icon={BarChart2} iconBg="bg-purple-500/10" iconColor="text-purple-500">
                <GradePointAnalyzer gpa={8.0} />
              </AcademicWidget>
            </div>

            {/* 4. Resources */}
            <div key="resources">
              <AcademicWidget title="Resources" icon={FileText} iconBg="bg-amber-500/10" iconColor="text-amber-500">
                <ResourcesList />
              </AcademicWidget>
            </div>
          </ResponsiveGridLayout>
        </div>

        {/* Footer Full-Width Widget */}
        <div className="w-full">
           <AcademicWidget title="Attendance Tracker" icon={Clock} iconBg="bg-cyan-500/10" iconColor="text-cyan-500">
              <AttendanceTracker attendance={subject.attendance} />
           </AcademicWidget>
        </div>
      </div>
    </PageWrapper>
  );
}
