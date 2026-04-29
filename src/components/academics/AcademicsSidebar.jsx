import React from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { 
  Plus, ChevronRight, LayoutDashboard, 
  GraduationCap, Settings, LogOut,
  TrendingUp
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { useAcademicStore } from '../../store/academicStore';

const sgpaData = [
  { val: 7.8 }, { val: 8.2 }, { val: 8.0 }, { val: 8.4 }, { val: 8.24 }
];

export default function AcademicsSidebar() {
  const { subjects } = useAcademicStore();
  const { id: activeSubjectId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="w-80 bg-sidebar border-r border-border h-full flex flex-col pt-8 shrink-0 relative z-20 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-64 bg-primary/5 blur-[120px] -z-10" />

      {/* Header */}
      <div className="px-8 mb-10">
        <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-1 opacity-50">Intelligence Hub</h2>
        <h1 className="text-2xl font-black text-foreground tracking-tight">SUBJECTS</h1>
      </div>

      {/* Action Area */}
      <div className="px-6 mb-8">
        <button 
          onClick={() => {/* Trigger Add Modal via Store or Event */}}
          className="w-full py-4 rounded-[20px] bg-primary/10 border border-primary/20 text-primary flex items-center justify-center gap-3 hover:bg-primary hover:text-white transition-all duration-500 shadow-lg shadow-primary/10 group"
        >
          <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <Plus size={18} strokeWidth={3} />
          </div>
          <span className="text-xs font-black uppercase tracking-[0.2em]">Create Subject</span>
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-hide">
        <NavLink
          to="/academics/cgpa"
          className={({ isActive }) => `flex items-center gap-3 px-5 py-4 rounded-[24px] transition-all duration-500 mb-4 ${
            isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-secondary/20 text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
          }`}
        >
          <TrendingUp size={18} strokeWidth={3} />
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">CGPA Analytics</span>
        </NavLink>

        <div className="pt-2 pb-4 px-4 flex items-center justify-between">
          <h3 className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-40">Your Subjects</h3>
          <div className="w-8 h-px bg-border/20" />
        </div>

        {subjects.map((sub) => {
          const isActive = activeSubjectId === sub.id;
          return (
            <NavLink
              key={sub.id}
              to={`/academics/subject/${sub.id}`}
              className={`flex items-center justify-between p-5 rounded-[24px] transition-all duration-500 group relative overflow-hidden ${
                isActive 
                  ? 'bg-card border border-primary/30 shadow-xl shadow-black/20' 
                  : 'hover:bg-card/40 border border-transparent'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 w-1.5 h-full bg-primary rounded-r-full" />
              )}
              
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full shadow-sm ${
                    sub.semester % 2 === 0 ? 'bg-emerald-500' : 'bg-primary'
                  }`} />
                  <span className={`text-sm font-black truncate tracking-tight transition-colors ${
                    isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                  }`}>
                    {sub.name}
                  </span>
                </div>
                <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest ml-4">
                  {sub.code || 'NO-CODE'}
                </span>
              </div>
              
              {isActive && (
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <ChevronRight size={16} strokeWidth={3} />
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Analytics Footer Section */}
      <div 
        onClick={() => navigate('/academics/cgpa')}
        className="p-8 border-t border-border/40 bg-black/20 backdrop-blur-sm cursor-pointer hover:bg-black/40 transition-colors group"
      >
        <div className="flex items-end justify-between mb-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1 group-hover:text-primary transition-colors">SGPA (Sem 3)</span>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black text-foreground tracking-tighter">8.24</span>
              <div className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-[9px] font-black text-emerald-500 border border-emerald-500/20">
                +0.12
              </div>
            </div>
          </div>
          <div className="w-24 h-12">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sgpaData}>
                <Line 
                  type="monotone" 
                  dataKey="val" 
                  stroke="var(--accent-primary)" 
                  strokeWidth={3} 
                  dot={false} 
                  animationDuration={2000}
                />
                <YAxis hide domain={['dataMin - 0.5', 'dataMax + 0.5']} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Total Credits</span>
            <span className="text-xl font-black text-foreground">24 Units</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-secondary/30 flex items-center justify-center text-muted-foreground/40 border border-border/50 group-hover:border-primary/40 group-hover:text-primary transition-all">
             <TrendingUp size={20} />
          </div>
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); navigate('/'); }}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-[20px] bg-secondary/30 border border-border/40 text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all text-[10px] font-black uppercase tracking-[0.2em]"
        >
          <LogOut size={14} strokeWidth={3} />
          Exit Academia
        </button>
      </div>
    </div>
  );
}
