import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, Plane, History, ArrowRight } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import StatsCard from '../../components/shared/StatsCard';
import { useTravelStore } from '../../store/travelStore';

export default function TravelHome() {
  const { trips, log } = useTravelStore();

  const activeTrips = trips.filter(t => t.status === 'planning' || t.status === 'booked').length;

  const subPages = [
    { path: '/travel/planner', icon: Map, title: 'Trip Planner', desc: 'Itineraries and budgets', color: '#06b6d4' },
    { path: '/travel/history', icon: History, title: 'Travel Log', desc: 'Past trips and memories', color: '#10b981' },
  ];

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">✈️ Travel Tracker</span></h1>
        <p>Plan future trips and log your travel history</p>
      </div>

      <div className="grid-2" style={{ marginBottom: 'var(--space-xl)' }}>
        <StatsCard icon={Plane} label="Upcoming Trips" value={activeTrips} subtitle="In planning" color="#06b6d4" />
        <StatsCard icon={History} label="Places Visited" value={log.length} subtitle="Past travels" color="#10b981" delay={0.1} />
      </div>

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
