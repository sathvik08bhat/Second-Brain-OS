import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Trophy, FileText, Calendar, Clock, ArrowRight } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import StatsCard from '../../components/shared/StatsCard';
import { useAcademicStore } from '../../store/academicStore';
import { calculateCGPA } from '../../utils/helpers';

const subPages = [
  { path: '/academics/subjects', icon: BookOpen, title: 'Subject Database', desc: 'Add and manage all your subjects across semesters', color: '#8b5cf6' },
  { path: '/academics/cgpa', icon: Trophy, title: 'CGPA Tracker', desc: 'Track your semester-wise and cumulative CGPA', color: '#f59e0b' },
  { path: '/academics/exams', icon: FileText, title: 'Exam Tracker', desc: 'Upcoming exams, syllabus coverage, and revision', color: '#ef4444' },
  { path: '/academics/assignments', icon: Calendar, title: 'Assignment Tracker', desc: 'Track deadlines and submission status', color: '#3b82f6' },
  { path: '/academics/attendance', icon: Clock, title: 'Attendance Tracker', desc: 'Subject-wise attendance with alerts', color: '#10b981' },
  { path: '/academics/resources', icon: BookOpen, title: 'Study Resources', desc: 'Connect Google Drive & Study Material Links', color: '#0ea5e9' },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function AcademicsHome() {
  const { subjects, exams, assignments, currentSemester, setCurrentSemester } = useAcademicStore();
  const semSubjects = subjects.filter((s) => s.semester === currentSemester);
  const cgpa = calculateCGPA(semSubjects.filter((s) => s.gradePoint));
  const pendingAssignments = assignments.filter((a) => a.status !== 'submitted' && a.status !== 'done').length;
  const upcomingExams = exams.filter((e) => new Date(e.date) >= new Date()).length;

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">📚 Academics</span></h1>
        <p>IIIT Bhubaneswar — EEE Department</p>
        <div className="header-actions">
          <select value={currentSemester} onChange={(e) => setCurrentSemester(Number(e.target.value))} style={{ width: 160 }}>
            {[1,2,3,4,5,6,7,8].map((s) => <option key={s} value={s}>Semester {s}</option>)}
          </select>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 'var(--space-xl)' }}>
        <StatsCard icon={BookOpen} label="Subjects" value={semSubjects.length} subtitle={`Semester ${currentSemester}`} color="#8b5cf6" delay={0} />
        <StatsCard icon={Trophy} label="CGPA" value={cgpa || '—'} subtitle="Current semester" color="#f59e0b" delay={0.1} />
        <StatsCard icon={FileText} label="Upcoming Exams" value={upcomingExams} subtitle="Scheduled" color="#ef4444" delay={0.2} />
        <StatsCard icon={Calendar} label="Pending" value={pendingAssignments} subtitle="Assignments" color="#3b82f6" delay={0.3} />
      </div>

      <motion.div className="grid-auto" variants={container} initial="hidden" animate="show">
        {subPages.map((page) => (
          <motion.div key={page.path} variants={item}>
            <Link to={page.path} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', textDecoration: 'none', color: 'var(--text-primary)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: `${page.color}12`, color: page.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <page.icon size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 'var(--font-md)' }}>{page.title}</div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>{page.desc}</div>
              </div>
              <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </PageWrapper>
  );
}
