import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, Activity, Utensils, HeartPulse, Scale, ArrowRight, Target } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import StatsCard from '../../components/shared/StatsCard';
import { useFitnessStore } from '../../store/fitnessStore';

export default function FitnessHome() {
  const { currentWeight, targetWeight, workouts, cardioLogs } = useFitnessStore();
  const weightLost = 89 - currentWeight;
  const progress = Math.min(100, Math.max(0, Math.round((weightLost / (89 - targetWeight)) * 100)));

  const subPages = [
    { path: '/fitness/weight', icon: Scale, title: 'Weight Tracker', desc: 'Log daily weight & trends', color: '#8b5cf6' },
    { path: '/fitness/diet', icon: Utensils, title: 'Diet & Calories', desc: 'Meals and macros', color: '#10b981' },
    { path: '/fitness/workouts', icon: Dumbbell, title: 'Gym Workouts', desc: 'Progressive overload', color: '#f59e0b' },
    { path: '/fitness/cardio', icon: HeartPulse, title: 'Cardio Log', desc: 'Running and cycling', color: '#ef4444' },
  ];

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">🏋️ Fitness Journey</span></h1>
        <p>Goal: 89kg → 75kg. Track weight, diet, and workouts.</p>
      </div>

      <div className="grid-3" style={{ marginBottom: 'var(--space-md)' }}>
        <StatsCard icon={Scale} label="Current Weight" value={`${currentWeight} kg`} subtitle={`Target: ${targetWeight} kg`} color="#8b5cf6" />
        <StatsCard icon={Dumbbell} label="Workouts Logged" value={workouts.length} subtitle="Gym sessions" color="#f59e0b" delay={0.1} />
        <StatsCard icon={HeartPulse} label="Cardio Sessions" value={cardioLogs.length} subtitle="Runs & cycles" color="#ef4444" delay={0.2} />
      </div>

      <motion.div className="glass-card" style={{ padding: '1.5rem', marginBottom: 'var(--space-xl)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <strong style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Target size={16} style={{ color: 'var(--accent-green)' }} /> Weight Loss Progress</strong>
          <span>{weightLost.toFixed(1)} kg lost ({progress}%)</span>
        </div>
        <div className="progress-bar-container" style={{ height: '10px' }}>
          <motion.div className="progress-bar-fill" style={{ background: 'var(--gradient-green)' }} initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1.5, ease: 'easeOut' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem', fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
          <span>Start: 89 kg</span>
          <span>Goal: 75 kg</span>
        </div>
      </motion.div>

      <div className="grid-auto">
        {subPages.map((page, i) => (
          <motion.div key={page.path} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Link to={page.path} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', textDecoration: 'none', color: 'var(--text-primary)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: `${page.color}15`, color: page.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><page.icon size={22} /></div>
              <div style={{ flex: 1 }}><div style={{ fontWeight: 700 }}>{page.title}</div><div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>{page.desc}</div></div>
              <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
            </Link>
          </motion.div>
        ))}
      </div>
    </PageWrapper>
  );
}
