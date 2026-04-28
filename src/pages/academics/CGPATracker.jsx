import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import PageWrapper from '../../components/layout/PageWrapper';
import { useAcademicStore } from '../../store/academicStore';
import { calculateCGPA } from '../../utils/helpers';

export default function CGPATracker() {
  const { subjects } = useAcademicStore();

  const semesterData = [1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
    const semSubjects = subjects.filter((s) => s.semester === sem && s.gradePoint != null);
    const sgpa = calculateCGPA(semSubjects);
    return { semester: `Sem ${sem}`, sgpa: Number(sgpa), subjects: semSubjects.length };
  }).filter((d) => d.subjects > 0);

  // Calculate cumulative CGPA
  let cumulativeData = [];
  let allGraded = [];
  [1, 2, 3, 4, 5, 6, 7, 8].forEach((sem) => {
    const semSubjects = subjects.filter((s) => s.semester === sem && s.gradePoint != null);
    allGraded = [...allGraded, ...semSubjects];
    if (semSubjects.length > 0) {
      cumulativeData.push({
        semester: `Sem ${sem}`,
        cgpa: Number(calculateCGPA(allGraded)),
      });
    }
  });

  const overallCGPA = calculateCGPA(subjects.filter((s) => s.gradePoint != null));

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">🏆 CGPA Tracker</span></h1>
        <p>Track your semester-wise and cumulative CGPA progression</p>
      </div>

      {/* Overall CGPA */}
      <motion.div
        className="glass-card"
        style={{ padding: '2rem', textAlign: 'center', marginBottom: 'var(--space-xl)' }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
          Cumulative CGPA
        </div>
        <div style={{ fontSize: '4rem', fontWeight: 900, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {overallCGPA || '—'}
        </div>
        <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Based on {subjects.filter((s) => s.gradePoint != null).length} graded subjects
        </div>
      </motion.div>

      {semesterData.length > 0 ? (
        <div className="grid-2">
          {/* SGPA Chart */}
          <motion.div className="glass-card" style={{ padding: '1.5rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, marginBottom: '1rem' }}>Semester-wise SGPA</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={semesterData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="semester" tick={{ fill: '#6b6b80', fontSize: 12 }} />
                <YAxis domain={[0, 10]} tick={{ fill: '#6b6b80', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#13131d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f0f0f5' }} />
                <Bar dataKey="sgpa" fill="url(#sgpaGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="sgpaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-primary)" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Cumulative CGPA Chart */}
          <motion.div className="glass-card" style={{ padding: '1.5rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, marginBottom: '1rem' }}>Cumulative CGPA Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={cumulativeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="semester" tick={{ fill: '#6b6b80', fontSize: 12 }} />
                <YAxis domain={[0, 10]} tick={{ fill: '#6b6b80', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#13131d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f0f0f5' }} />
                <Line type="monotone" dataKey="cgpa" stroke="var(--accent-primary)" strokeWidth={3} dot={{ fill: 'var(--accent-primary)', r: 5 }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      ) : (
        <div className="empty-state">
          <Trophy size={48} />
          <h3>No Grades Yet</h3>
          <p>Add grades to your subjects to see CGPA analytics here.</p>
        </div>
      )}
    </PageWrapper>
  );
}
