import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, BookOpen, Target, 
  Map, Kanban, Bug, Server,
  Rocket, Image, Users,
  Handshake, FileText, 
  UserCircle, CheckSquare, Calendar,
  PieChart, Activity, DollarSign
} from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';

// Define the 6 overarching departments
const DEPARTMENTS = [
  {
    title: '🧠 1. Executive Board',
    subtitle: 'Command Center & Strategy',
    color: '#8b5cf6', // Purple
    dbs: [
      { id: 'okrs', title: 'OKRs & Strategy', icon: Target, isCustom: true, path: '/startup/okrs' },
      { id: 'b2cMatrix', title: 'The B2C Matrix', icon: Building2, isCustom: true, path: '/startup/matrix' },
      { id: 'companyWiki', title: 'Company Wiki', icon: BookOpen },
    ]
  },
  {
    title: '💻 2. Engineering & Product',
    subtitle: 'Build & Ship',
    color: '#3b82f6', // Blue
    dbs: [
      { id: 'productRoadmap', title: 'Product Roadmap', icon: Map, isCustom: true, path: '/startup/roadmap' },
      { id: 'tasks', title: 'Sprint Kanban', icon: Kanban, isCustom: true, path: '/startup/tasks' },
      { id: 'bugTracker', title: 'Bug Tracker', icon: Bug },
      { id: 'architectureDB', title: 'Architecture DB', icon: Server },
    ]
  },
  {
    title: '📈 3. Growth & Marketing',
    subtitle: 'Acquisition & Brand',
    color: '#ec4899', // Pink
    dbs: [
      { id: 'gtmCampaigns', title: 'GTM Campaigns', icon: Rocket },
      { id: 'assetLibrary', title: 'Asset Library', icon: Image },
      { id: 'userAcquisitionLogs', title: 'User Acquisition', icon: Users },
    ]
  },
  {
    title: '🤝 4. Sales & B2B',
    subtitle: 'Revenue Pipeline',
    color: '#f59e0b', // Amber
    dbs: [
      { id: 'dealPipeline', title: 'Deal Pipeline', icon: Handshake },
      { id: 'partnerDirectory', title: 'Partner Directory', icon: FileText },
    ]
  },
  {
    title: '💼 5. Operations & HR',
    subtitle: 'Internal Systems',
    color: '#10b981', // Emerald
    dbs: [
      { id: 'team', title: 'Team Roster & Access', icon: UserCircle },
      { id: 'sopDB', title: 'SOP Hub', icon: CheckSquare },
      { id: 'meetingNotes', title: 'Meeting Notes', icon: Calendar },
    ]
  },
  {
    title: '🏦 6. Finance & Investors',
    subtitle: 'Capital & Runway',
    color: '#14b8a6', // Teal
    dbs: [
      { id: 'capTable', title: 'Cap Table & Equity', icon: PieChart },
      { id: 'finances', title: 'Runway & Burn Rate', icon: Activity, isCustom: true, path: '/startup/finance' },
      { id: 'investorPipeline', title: 'Investor Pipeline', icon: DollarSign },
    ]
  }
];

import { useStartupStore } from '../../store/startupStore';

export default function StartupHome() {
  const { dealPipeline, bugTracker, finances, tasks } = useStartupStore();

  // Calculations for Executive Brief
  const activeDeals = dealPipeline.filter(d => ['Lead', 'Pitched', 'Negotiating'].includes(d.stage));
  const pipelineValue = activeDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
  
  const criticalBugs = bugTracker.filter(b => b.severity?.toLowerCase() === 'critical' && b.status?.toLowerCase() !== 'resolved');
  
  const totalIncome = finances.filter(f => f.type === 'income').reduce((s, f) => s + (f.amount || 0), 0);
  const totalExpense = finances.filter(f => f.type === 'expense').reduce((s, f) => s + (f.amount || 0), 0);
  const netCashflow = totalIncome - totalExpense;

  const incompleteTasks = tasks.filter(t => t.status !== 'done').length;

  return (
    <PageWrapper>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1><span className="gradient-text">🚀 Startup OS</span></h1>
        <p>Your comprehensive 6-department company brain.</p>
      </div>

      {/* ── Executive Daily Briefing ── */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', borderLeft: '4px solid #8b5cf6' }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={20} color="#8b5cf6" /> Executive Briefing
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Pipeline Velocity</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }}>
              ${pipelineValue.toLocaleString()} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 400 }}>({activeDeals.length} active)</span>
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px' }}>System Health</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: criticalBugs.length > 0 ? '#ef4444' : '#10b981' }}>
              {criticalBugs.length} Critical Bugs
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Net Cashflow</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: netCashflow >= 0 ? '#10b981' : '#ef4444' }}>
              ${netCashflow.toLocaleString()}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Sprint Progress</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3b82f6' }}>
              {incompleteTasks} Tasks Open
            </span>
          </div>

        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '1.5rem',
        paddingBottom: '2rem'
      }}>
        {DEPARTMENTS.map((dept, i) => (
          <motion.div 
            key={dept.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card"
            style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            {/* Department Head */}
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: dept.color, marginBottom: '0.25rem' }}>
                {dept.title}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                {dept.subtitle}
              </div>
            </div>

            {/* Sub-Databases */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {dept.dbs.map(db => (
                <Link 
                  key={db.id}
                  to={db.isCustom ? db.path : `/startup/db/${db.id}`} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    textDecoration: 'none',
                    color: 'var(--text-secondary)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${dept.color}15`;
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <db.icon size={16} color={dept.color} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{db.title}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </PageWrapper>
  );
}
