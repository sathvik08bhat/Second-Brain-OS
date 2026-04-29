import React, { useState, useMemo } from 'react';
import { 
  RefreshCw, TrendingUp, Target, 
  Calendar, Award, Info, 
  ChevronRight, Calculator,
  Search, Bell, User, BarChart2
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import PageWrapper from '../../components/layout/PageWrapper';
import { useAcademicStore } from '../../store/academicStore';

// ── Components ───────────────────────────────────────────────────────────────

const MetricCard = ({ title, value, subtext, icon: Icon, color = "text-primary", bg = "bg-primary/10" }) => (
  <div className="bg-card flex flex-col p-6 rounded-2xl shadow-sm border border-border/50 transition-all duration-300 hover:border-primary/30">
    <div className="flex flex-col h-full justify-between gap-4">
       {/* Top: Icon + Title */}
       <div className="flex items-start gap-3">
          <div className={`p-2 ${bg} rounded-lg ${color}`}><Icon size={20} /></div>
          <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mt-1">{title}</span>
       </div>
       {/* Bottom: Massive Number + Subtitle */}
       <div>
          <div className="text-4xl font-bold tracking-tight text-foreground flex items-baseline gap-1">
            {value} 
            {typeof value === 'number' && <span className="text-sm text-muted-foreground font-normal">/10</span>}
          </div>
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1 opacity-60">{subtext}</div>
       </div>
    </div>
  </div>
);

const SectionTitle = ({ children }) => (
  <h3 className="text-sm font-bold tracking-widest uppercase text-foreground mb-6">{children}</h3>
);

export default function CGPATracker() {
  const { academicProfile, semesters, subjects, syncFromPortal, updateTargetCGPA, isLoading } = useAcademicStore();
  const [activeTab, setActiveTab] = useState('Semester Overview');

  const completedSems = useMemo(() => semesters.filter(s => s.status === 'Completed'), [semesters]);
  const remainingSems = 8 - completedSems.length;
  
  const requiredCGPA = useMemo(() => {
    const totalTarget = academicProfile.targetCGPA * 8;
    const currentTotal = academicProfile.currentCGPA * completedSems.length;
    const needed = (totalTarget - currentTotal) / remainingSems;
    return Math.min(10, Math.max(0, needed)).toFixed(2);
  }, [academicProfile, completedSems, remainingSems]);

  const targetStatusPercent = useMemo(() => {
    return Math.min(100, Math.round((academicProfile.currentCGPA / academicProfile.targetCGPA) * 100));
  }, [academicProfile]);

  return (
    <PageWrapper>
      <div className="flex flex-col gap-8 pb-20 max-w-[1600px] mx-auto px-6">
        
        {/* Navbar Utility */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
            <span className="hover:text-primary cursor-pointer transition-colors">Academics</span>
            <ChevronRight size={12} className="opacity-30" />
            <span className="text-foreground">CGPA Tracker</span>
          </div>
          <div className="flex items-center gap-6">
            <Search size={18} className="text-muted-foreground opacity-40 hover:opacity-100 cursor-pointer transition-all" />
            <Bell size={18} className="text-muted-foreground opacity-40 hover:opacity-100 cursor-pointer transition-all" />
            <div className="w-8 h-8 rounded-full bg-secondary/50 border border-border/50 flex items-center justify-center overflow-hidden">
               <User size={16} className="text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">CGPA Tracker</h1>
            <p className="text-sm text-muted-foreground font-medium">Track your academic performance and plan for your goals</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-2">
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Last synced: {academicProfile.lastSynced}</span>
               </div>
            </div>
            <button 
              onClick={() => syncFromPortal()}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary border border-border/40 text-[11px] font-bold text-foreground uppercase tracking-widest hover:bg-secondary/80 transition-all disabled:opacity-50 shadow-sm"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
              {isLoading ? 'Syncing...' : 'Sync CGPA (Web Scraping)'}
            </button>
          </div>
        </div>

        {/* Top Metric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <MetricCard 
            title="Current CGPA" 
            value={academicProfile.currentCGPA} 
            subtext={`Till Semester ${completedSems.length}`} 
            icon={Award}
          />
          <MetricCard 
            title="Target CGPA" 
            value={
              <input 
                type="number" 
                step="0.1" 
                className="bg-transparent border-none outline-none w-20 p-0 text-4xl font-bold text-foreground tracking-tight tabular-nums"
                value={academicProfile.targetCGPA}
                onChange={(e) => updateTargetCGPA(e.target.value)}
              />
            } 
            subtext="Your Goal" 
            icon={Target}
            color="text-purple-500"
            bg="bg-purple-500/10"
          />
          <MetricCard 
            title="Remaining Semesters" 
            value={remainingSems} 
            subtext={`Sem ${completedSems.length + 1} to Sem 8`} 
            icon={Calendar}
            color="text-amber-500"
            bg="bg-amber-500/10"
          />
          <MetricCard 
            title="Required CGPA" 
            value={requiredCGPA} 
            subtext="In Remaining Sems" 
            icon={TrendingUp}
            color="text-cyan-500"
            bg="bg-cyan-500/10"
          />
          <div className="bg-card flex flex-col p-6 rounded-2xl shadow-sm border border-border/50">
             <div className="flex flex-col h-full justify-between gap-2">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500"><TrendingUp size={20} /></div>
                   <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mt-1">Target Status</span>
                </div>
                <div className="relative h-20">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie
                          data={[{v: targetStatusPercent}, {v: 100 - targetStatusPercent}]}
                          innerRadius={35}
                          outerRadius={45}
                          startAngle={180}
                          endAngle={0}
                          paddingAngle={0}
                          dataKey="v"
                          stroke="none"
                        >
                          <Cell fill="var(--color-success)" />
                          <Cell fill="var(--bg-secondary)" />
                        </Pie>
                     </PieChart>
                   </ResponsiveContainer>
                   <div className="absolute inset-0 flex flex-col items-center justify-center pt-6">
                      <span className="text-xl font-bold text-foreground tabular-nums">{targetStatusPercent}%</span>
                      <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">On Track</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide border-b border-border/20 mb-8">
          {['Semester Overview', 'Subject Analysis', 'Prediction & Planner', 'Historical Data'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 rounded-t-xl text-[11px] font-bold uppercase tracking-[0.2em] transition-all relative ${
                activeTab === tab 
                  ? 'text-primary after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[2px] after:bg-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="bg-card flex flex-col p-6 rounded-2xl shadow-sm border border-border/50">
               <SectionTitle>Semester-wise Performance</SectionTitle>
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="border-b border-border/20">
                       <th className="pb-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Semester</th>
                       <th className="pb-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">SGPA</th>
                       <th className="pb-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">Credits</th>
                       <th className="pb-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">Status</th>
                       <th className="pb-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">CGPA After Sem</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-border/10">
                     {semesters.map((sem) => (
                       <tr key={sem.id} className="group hover:bg-white/5 transition-colors">
                         <td className="py-4 text-sm font-medium text-foreground">{sem.label}</td>
                         <td className="py-4 text-sm font-bold text-center tabular-nums text-foreground">{sem.sgpa || '-'}</td>
                         <td className="py-4 text-sm font-bold text-center tabular-nums text-muted-foreground opacity-60">{sem.credits}</td>
                         <td className="py-4 text-center">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${
                              sem.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                              sem.status === 'In Progress' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                              'bg-muted/10 text-muted-foreground border-muted/20 opacity-40'
                            }`}>
                              {sem.status}
                            </span>
                         </td>
                         <td className="py-4 text-right">
                            <div className="flex items-center justify-end gap-3">
                               <span className="text-sm font-bold text-foreground tabular-nums w-10">{sem.cgpaAfterSem || '-'}</span>
                               <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary transition-all duration-1000" 
                                    style={{ width: `${(sem.cgpaAfterSem || 0) * 10}%` }}
                                  />
                               </div>
                            </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>

            <div className="bg-card flex flex-col p-6 rounded-2xl shadow-sm border border-border/50">
               <SectionTitle>CGPA Progression</SectionTitle>
               <div className="h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={semesters}>
                     <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" opacity={0.1} />
                     <XAxis 
                       dataKey="label" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--text-muted)' }} 
                     />
                     <YAxis 
                       domain={[0, 10]} 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--text-muted)' }} 
                     />
                     <Tooltip 
                       contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '12px' }}
                       itemStyle={{ fontWeight: 700, fontSize: '11px' }}
                     />
                     <Line 
                        type="monotone" 
                        dataKey="cgpaAfterSem" 
                        stroke="var(--accent-primary)" 
                        strokeWidth={3} 
                        dot={{ r: 4, fill: 'white', stroke: 'var(--accent-primary)', strokeWidth: 2 }} 
                        activeDot={{ r: 6, fill: 'white', stroke: 'var(--accent-primary)', strokeWidth: 3 }}
                        name="Actual CGPA"
                     />
                     <Line 
                        type="step" 
                        dataKey={() => academicProfile.targetCGPA} 
                        stroke="var(--color-success)" 
                        strokeWidth={1} 
                        strokeDasharray="4 4" 
                        dot={false}
                        name="Target CGPA"
                     />
                   </LineChart>
                 </ResponsiveContainer>
               </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            
            {/* Context Cards */}
            <div className="bg-card flex flex-col p-6 rounded-2xl shadow-sm border border-border/50 gap-6">
               <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0"><TrendingUp size={20} /></div>
                  <div className="flex flex-col gap-1">
                     <p className="text-sm font-bold text-foreground">To achieve <span className="text-emerald-500">{academicProfile.targetCGPA.toFixed(2)} CGPA</span></p>
                     <span className="text-[11px] font-medium text-muted-foreground opacity-70">You need <span className="text-primary font-bold">{requiredCGPA} SGPA</span> in the remaining {remainingSems} semesters.</span>
                  </div>
               </div>
               <div className="flex items-start gap-4">
                  <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-500 shrink-0"><Info size={20} /></div>
                  <div className="flex flex-col gap-1">
                     <p className="text-sm font-bold text-foreground">Stay consistent!</p>
                     <span className="text-[11px] font-medium text-muted-foreground opacity-70">You are on track, keep maintaining your current performance.</span>
                  </div>
               </div>
            </div>

            {/* Subject Analysis */}
            <div className="bg-card flex flex-col p-6 rounded-2xl shadow-sm border border-border/50">
               <SectionTitle>Subject-wise Analysis (Sem 3)</SectionTitle>
               <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
                     <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">SGPA (SEM 3)</span>
                     <span className="text-sm font-bold text-foreground">7.22 | 24 Credits</span>
                  </div>

                  <div className="flex flex-col divide-y divide-border/10">
                    {subjects.filter(s => s.semester === 3).map((sub) => {
                      const totalScored = Object.values(sub.marks || {}).reduce((acc, m) => acc + (Number(m.scored) || 0), 0);
                      const totalMax = Object.values(sub.marks || {}).reduce((acc, m) => acc + (Number(m.max) || 0), 0);
                      const percent = totalMax > 0 ? (totalScored / totalMax) * 100 : 0;
                      const gradePoint = Math.round(percent / 10);

                      return (
                        <div key={sub.id} className="flex flex-row items-center justify-between py-3 gap-4">
                          <div className="flex flex-col w-1/2 min-w-0">
                            <span className="text-sm font-medium text-foreground truncate">{sub.name}</span>
                          </div>
                          <div className="w-16 text-right text-sm text-muted-foreground tabular-nums">{gradePoint} GP</div>
                          <div className="w-16 text-right text-sm text-muted-foreground tabular-nums">{sub.credits} Cr</div>
                          <div className="w-1/3 flex items-center justify-end gap-2">
                             <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
                                <div 
                                  className={`h-full rounded-full transition-all duration-1000 ${
                                    percent > 80 ? 'bg-primary' : percent > 70 ? 'bg-emerald-500' : 'bg-amber-500'
                                  }`} 
                                  style={{ width: `${percent}%` }}
                                />
                             </div>
                             <span className="text-[10px] font-bold text-muted-foreground w-8 text-right tabular-nums">{Math.round(percent)}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
               </div>
            </div>

            {/* Prediction Planner */}
            <div className="bg-card flex flex-col p-6 rounded-2xl shadow-sm border border-border/50">
               <SectionTitle>CGPA Prediction Planner</SectionTitle>
               <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    {[7.0, 8.0, 9.0, 10.0].map(scen => {
                      const totalSems = 8;
                      const completed = completedSems.length;
                      const remaining = totalSems - completed;
                      const predictedOverall = ((academicProfile.currentCGPA * completed) + (scen * remaining)) / totalSems;
                      const isSuccess = predictedOverall >= academicProfile.targetCGPA;

                      return (
                        <div 
                          key={scen} 
                          className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                            isSuccess 
                              ? 'bg-primary/5 border-primary shadow-sm' 
                              : 'bg-secondary/20 border-transparent border-dashed border-border/40'
                          }`}
                        >
                           <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">If you score</span>
                           <span className={`text-lg font-bold tabular-nums ${isSuccess ? 'text-primary' : 'text-foreground opacity-70'}`}>{scen.toFixed(1)}</span>
                           <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 mt-1">Predicted CGPA</span>
                           <span className={`text-sm font-bold tabular-nums ${isSuccess ? 'text-foreground' : 'text-muted-foreground opacity-40'}`}>{predictedOverall.toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[9px] font-medium text-muted-foreground/40 text-center uppercase tracking-widest">
                    * Predictions based on current data
                  </p>
               </div>
            </div>

          </div>
        </div>

      </div>
    </PageWrapper>
  );
}
