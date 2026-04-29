import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, AlertTriangle, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import PageWrapper from '../../components/layout/PageWrapper';
import { useAcademicStore } from '../../store/academicStore';

// Generate GitHub/Leetcode style grid dates
// Starts on a Sunday, ends on Today. (Roughly 15 weeks)
const generateGridDates = () => {
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0 is Sunday
  
  const start = new Date(today);
  start.setDate(today.getDate() - currentDayOfWeek - (14 * 7)); // 15 weeks total

  const dates = [];
  let curr = new Date(start);
  while (curr <= today) {
    dates.push(curr.toISOString().split('T')[0]);
    curr.setDate(curr.getDate() + 1);
  }
  return dates;
};

export default function AttendanceTracker() {
  const { subjects, updateSubject } = useAcademicStore();
  const [selectedDay, setSelectedDay] = useState(null); // { subjectId, date }
  const gridDates = useMemo(() => generateGridDates(), []);
  
  // A helper to format a date nicely
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">📊 Attendance Matrix</span></h1>
        <p>Click on any day in the contribution grid to toggle your attendance.</p>
      </div>

      {subjects.length === 0 ? (
        <div className="empty-state">
          <Clock size={48} />
          <h3>No Subjects</h3>
          <p>Add subjects first to start tracking attendance.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {subjects.map((subj, i) => {
            const records = subj.attendance?.records || [];
            const attended = records.filter(r => r.status === 'present').length;
            const total = records.length;
            const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;
            const isLow = percentage < 75 && total > 0;
            
            // Calculate safe bunks
            const requiredPercentage = 0.75;
            const safeBunks = total > 0 ? Math.floor(attended / requiredPercentage) - total : 0;
            let statusBadge = null;
            
            if (total > 0) {
              if (percentage >= 75) {
                statusBadge = <span className="badge badge-green">Safe to skip {safeBunks} classes</span>;
              } else {
                const neededClasses = Math.ceil((0.75 * total - attended) / 0.25);
                statusBadge = <span className="badge badge-red">Need to attend {neededClasses} classes</span>;
              }
            } else {
              statusBadge = <span className="badge badge-purple">No classes marked yet</span>;
            }

            const pieData = total > 0 ? [
              { name: 'Present', value: attended },
              { name: 'Absent', value: total - attended },
            ] : [{ name: 'No data', value: 1 }];
            const colors = total > 0 ? ['#10b981', '#ef4444'] : ['#1a1a2e'];

            return (
              <motion.div
                key={subj.id}
                className="glass-card"
                style={{ padding: '1.5rem', borderColor: isLow ? 'rgba(239, 68, 68, 0.3)' : undefined }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left: Stats & Pie */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg text-foreground">{subj.name}</h3>
                        {isLow && <AlertTriangle size={16} className="text-red-500" />}
                      </div>
                      <div className="mb-4">{statusBadge}</div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <ResponsiveContainer width={100} height={100}>
                        <PieChart>
                          <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={35} outerRadius={45} startAngle={90} endAngle={-270}>
                            {pieData.map((_, idx) => <Cell key={idx} fill={colors[idx]} />)}
                          </Pie>
                          <RechartsTooltip contentStyle={{ background: '#13131d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12, color: '#f0f0f5' }} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div>
                        <div className={`text-3xl font-black tracking-tight ${isLow ? 'text-red-500' : 'text-emerald-500'}`}>
                          {percentage}%
                        </div>
                        <div className="text-sm text-muted-foreground font-medium">
                          {attended} / {total} Classes
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Leetcode Grid */}
                  <div className="flex-[2] bg-secondary/20 p-4 rounded-xl border border-border flex flex-col items-start overflow-hidden">
                    <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-muted-foreground">
                      <Calendar size={14} /> Class Activity Grid
                    </div>
                    
                    {/* The Grid */}
                    <div className="w-full overflow-x-auto pb-2">
                      <div className="inline-grid gap-1.5" style={{ gridTemplateRows: 'repeat(7, 1fr)', gridAutoFlow: 'column' }}>
                        {gridDates.map(date => {
                          const record = records.find(r => r.date === date);
                          const status = record?.status;
                          
                          let bgClass = 'bg-secondary hover:bg-secondary/80 border border-border/50'; // unmarked
                          if (status === 'present') bgClass = 'bg-emerald-500 hover:bg-emerald-600 border border-emerald-600/50';
                          if (status === 'absent') bgClass = 'bg-red-500 hover:bg-red-600 border border-red-600/50';

                          return (
                            <div 
                              key={date}
                              onClick={() => setSelectedDay({ subjectId: subj.id, date })}
                              className={`w-4 h-4 rounded-[3px] cursor-pointer transition-colors ${bgClass} tooltip`}
                              data-tip={`${formatDate(date)}: ${status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unmarked'}`}
                            />
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Legend */}
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground font-medium">
                      <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-[2px] bg-secondary border border-border/50" /> Unmarked</div>
                      <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-[2px] bg-emerald-500" /> Present</div>
                      <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-[2px] bg-red-500" /> Absent</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
      {/* Selection Modal */}
      <Modal 
        isOpen={!!selectedDay} 
        onClose={() => setSelectedDay(null)} 
        title={`Mark Attendance: ${selectedDay ? formatDate(selectedDay.date) : ''}`}
      >
        <div className="flex flex-col gap-4 p-4">
          <p className="text-sm text-muted-foreground">Select status for this class session:</p>
          <div className="grid grid-cols-1 gap-2">
            <button 
              className="btn-primary bg-emerald-600 hover:bg-emerald-700 border-none justify-center"
              onClick={async () => {
                const subj = subjects.find(s => s.id === selectedDay.subjectId);
                const records = [...(subj.attendance?.records || [])];
                const idx = records.findIndex(r => r.date === selectedDay.date);
                if (idx >= 0) records[idx].status = 'present';
                else records.push({ date: selectedDay.date, status: 'present' });
                
                await updateSubject(selectedDay.subjectId, {
                  attendance: {
                    ...subj.attendance,
                    records,
                    attended: records.filter(r => r.status === 'present').length,
                    total: records.length
                  }
                });
                setSelectedDay(null);
              }}
            >
              <CheckCircle size={16} /> Present
            </button>
            <button 
              className="btn-primary bg-red-600 hover:bg-red-700 border-none justify-center"
              onClick={async () => {
                const subj = subjects.find(s => s.id === selectedDay.subjectId);
                const records = [...(subj.attendance?.records || [])];
                const idx = records.findIndex(r => r.date === selectedDay.date);
                if (idx >= 0) records[idx].status = 'absent';
                else records.push({ date: selectedDay.date, status: 'absent' });
                
                await updateSubject(selectedDay.subjectId, {
                  attendance: {
                    ...subj.attendance,
                    records,
                    attended: records.filter(r => r.status === 'present').length,
                    total: records.length
                  }
                });
                setSelectedDay(null);
              }}
            >
              <XCircle size={16} /> Absent
            </button>
            <button 
              className="btn-secondary justify-center"
              onClick={async () => {
                const subj = subjects.find(s => s.id === selectedDay.subjectId);
                const records = (subj.attendance?.records || []).filter(r => r.date !== selectedDay.date);
                
                await updateSubject(selectedDay.subjectId, {
                  attendance: {
                    ...subj.attendance,
                    records,
                    attended: records.filter(r => r.status === 'present').length,
                    total: records.length
                  }
                });
                setSelectedDay(null);
              }}
            >
              Reset to Unmarked
            </button>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
}
