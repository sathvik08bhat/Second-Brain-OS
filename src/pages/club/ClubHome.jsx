import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Calendar, Video, FileText, ArrowRight } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import StatsCard from '../../components/shared/StatsCard';
import { useClubStore } from '../../store/clubStore';

export default function ClubHome() {
  const { members, events, meetings } = useClubStore();

  const subPages = [
    { path: '/club/members', icon: Users, title: 'Member Directory', desc: 'Manage club roster', color: '#3b82f6' },
    { path: '/club/events', icon: Calendar, title: 'Event Planner', desc: 'Upcoming workshops and fests', color: '#ec4899' },
    { path: '/club/meetings', icon: Video, title: 'Meeting Notes', desc: 'Agendas and action items', color: '#10b981' },
  ];

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">🏛️ Tech Society</span></h1>
        <p>Club management dashboard for your secretary role</p>
      </div>

      <div className="grid-3" style={{ marginBottom: 'var(--space-xl)' }}>
        <StatsCard icon={Users} label="Total Members" value={members.length} subtitle="Active pipeline" color="#3b82f6" />
        <StatsCard icon={Calendar} label="Events Planned" value={events.length} subtitle="This semester" color="#ec4899" delay={0.1} />
        <StatsCard icon={FileText} label="Meetings Logged" value={meetings.length} subtitle="Archived" color="#10b981" delay={0.2} />
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
