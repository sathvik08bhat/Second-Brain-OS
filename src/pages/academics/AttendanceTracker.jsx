import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Plus, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import PageWrapper from '../../components/layout/PageWrapper';
import { useAcademicStore } from '../../store/academicStore';

export default function AttendanceTracker() {
  const { subjects, currentSemester, attendance, markAttendance, getAttendanceStats } = useAcademicStore();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const semSubjects = subjects.filter((s) => s.semester === currentSemester);

  const getStatus = (subjectId, date) => {
    const record = attendance.find((a) => a.subjectId === subjectId && a.date === date);
    return record?.status || null;
  };

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">📊 Attendance Tracker</span></h1>
        <p>Track subject-wise attendance — alerts when below 75%</p>
      </div>

      {/* Date Selector */}
      <div style={{ marginBottom: 'var(--space-xl)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <label style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>Mark attendance for:</label>
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} style={{ width: 180 }} />
      </div>

      {semSubjects.length === 0 ? (
        <div className="empty-state">
          <Clock size={48} />
          <h3>No Subjects</h3>
          <p>Add subjects first to start tracking attendance.</p>
        </div>
      ) : (
        <>
          {/* Quick Mark */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: 'var(--space-xl)' }}>
            <h3 className="section-title">Quick Mark — {new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</h3>
            {semSubjects.map((subj, i) => {
              const current = getStatus(subj.id, selectedDate);
              return (
                <motion.div
                  key={subj.id}
                  className="glass-card"
                  style={{ padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div style={{ flex: 1, fontWeight: 600 }}>{subj.name}</div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className={current === 'present' ? 'btn-primary' : 'btn-secondary'}
                      onClick={() => markAttendance(subj.id, selectedDate, 'present')}
                      style={{ padding: '0.35rem 0.8rem', fontSize: 'var(--font-xs)', background: current === 'present' ? 'var(--accent-green)' : undefined }}
                    >
                      <CheckCircle size={14} /> Present
                    </button>
                    <button
                      className={current === 'absent' ? 'btn-danger' : 'btn-secondary'}
                      onClick={() => markAttendance(subj.id, selectedDate, 'absent')}
                      style={{ padding: '0.35rem 0.8rem', fontSize: 'var(--font-xs)' }}
                    >
                      <XCircle size={14} /> Absent
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Overview */}
          <h3 className="section-title">Attendance Overview</h3>
          <div className="grid-auto">
            {semSubjects.map((subj, i) => {
              const stats = getAttendanceStats(subj.id);
              const isLow = stats.percentage < 75 && stats.total > 0;
              const pieData = stats.total > 0 ? [
                { name: 'Present', value: stats.present },
                { name: 'Absent', value: stats.absent },
              ] : [{ name: 'No data', value: 1 }];
              const colors = stats.total > 0 ? ['#10b981', '#ef4444'] : ['#1a1a2e'];

              return (
                <motion.div
                  key={subj.id}
                  className="glass-card"
                  style={{ padding: '1.25rem', borderColor: isLow ? 'rgba(239, 68, 68, 0.3)' : undefined }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: 700 }}>{subj.name}</div>
                    {isLow && <AlertTriangle size={16} style={{ color: 'var(--accent-red)' }} />}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <ResponsiveContainer width={80} height={80}>
                      <PieChart>
                        <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={25} outerRadius={35} startAngle={90} endAngle={-270}>
                          {pieData.map((_, idx) => <Cell key={idx} fill={colors[idx]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ background: '#13131d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12, color: '#f0f0f5' }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div>
                      <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: isLow ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                        {stats.percentage}%
                      </div>
                      <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
                        {stats.present}/{stats.total} classes
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </PageWrapper>
  );
}
