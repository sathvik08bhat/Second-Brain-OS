import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, GraduationCap, Code2, BarChart3, Rocket,
  Briefcase, Users, Dumbbell, Brain, Palette, Plane,
  ChevronLeft, ChevronRight, ChevronDown, Zap, Inbox, Sun, Moon,
  CheckCircle, Wallet, Heart, Shield, Cpu, Link2, CalendarDays, Lock
} from 'lucide-react';
import { useGlobalStore } from '../../store/globalStore';
import './Sidebar.css';

export const navSections = [
  {
    title: 'OVERVIEW',
    items: [
      { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/inbox', icon: Inbox, label: 'Quick Capture' },
      { path: '/tasks', icon: CheckCircle, label: 'Task Tracker' },
      { path: '/calendar', icon: CalendarDays, label: 'Calendar & Tasks' },
      { path: '/google-sync', icon: Link2, label: 'Google Sync' },
    ]
  },
  {
    title: 'ACADEMICS & CAREER',
    items: [
      {
        path: '/academics', icon: GraduationCap, label: 'Academics', moduleId: 'academics',
        children: [
          { path: '/academics', label: 'Overview' },
          { path: '/academics/subjects', label: 'Subjects' },
          { path: '/academics/cgpa', label: 'CGPA Tracker' },
          { path: '/academics/exams', label: 'Exams' },
          { path: '/academics/assignments', label: 'Assignments' },
          { path: '/academics/attendance', label: 'Attendance' },
          { path: '/academics/resources', label: 'Resources' },
        ]
      },
      {
        path: '/dsa', icon: Code2, label: 'DSA Hub', moduleId: 'dsa',
        children: [
          { path: '/dsa', label: 'Overview' },
          { path: '/dsa/roadmap', label: 'Roadmap' },
          { path: '/dsa/videos', label: 'Videos' },
        ]
      },
      {
        path: '/aiml', icon: Cpu, label: 'AI/ML', moduleId: 'aiml',
        children: [
          { path: '/aiml', label: 'Overview' },
          { path: '/aiml/roadmap', label: 'Roadmap' },
          { path: '/aiml/courses', label: 'Courses' },
          { path: '/aiml/projects', label: 'Projects' },
          { path: '/aiml/papers', label: 'Papers' },
        ]
      },
      {
        path: '/gsoc', icon: Code2, label: 'GSoC 2027', moduleId: 'gsoc',
        children: [
          { path: '/gsoc', label: 'Overview' },
          { path: '/gsoc/skills', label: 'Skills' },
          { path: '/gsoc/contributions', label: 'Contributions' },
          { path: '/gsoc/organizations', label: 'Organizations' },
        ]
      },
      {
        path: '/cat', icon: BarChart3, label: 'CAT 2027', moduleId: 'cat',
        children: [
          { path: '/cat', label: 'Overview' },
          { path: '/cat/sections', label: 'Sections' },
          { path: '/cat/mocks', label: 'Mock Tests' },
          { path: '/cat/resources', label: 'Resources' },
        ]
      },
      { path: '/placements', icon: Briefcase, label: 'Placements', moduleId: 'placements',
        children: [
          { path: '/placements', label: 'Overview' },
          { path: '/placements/skills', label: 'Skills' },
          { path: '/placements/companies', label: 'Companies' },
        ]
      },
    ]
  },
  {
    title: 'VENTURES',
    items: [
      { path: '/startup', icon: Rocket, label: 'Startup', moduleId: 'startup',
        children: [
          { path: '/startup', label: 'Overview' },
          { path: '/startup/ideas', label: 'Idea Lab' },
          { path: '/startup/tasks', label: 'Sprint Board' },
          { path: '/startup/finance', label: 'Finance' },
        ]
      },
      { path: '/club', icon: Users, label: 'Tech Society', moduleId: 'club',
        children: [
          { path: '/club', label: 'Overview' },
          { path: '/club/members', label: 'Members' },
          { path: '/club/events', label: 'Events' },
          { path: '/club/meetings', label: 'Meetings' },
        ]
      },
    ]
  },
  {
    title: 'LIFE & GROWTH',
    items: [
      { path: '/finance', icon: Wallet, label: 'Finance', moduleId: 'finance',
        children: [
          { path: '/finance', label: 'Overview' },
          { path: '/finance/accounts', label: 'Accounts' },
          { path: '/finance/transactions', label: 'Transactions' },
          { path: '/finance/analytics', label: 'Analytics' },
          { path: '/finance/savings', label: 'Savings & EMIs' },
        ]
      },
      { path: '/fitness', icon: Dumbbell, label: 'Fitness', moduleId: 'fitness',
        children: [
          { path: '/fitness', label: 'Overview' },
          { path: '/fitness/google-fit', label: 'Google Fit Hub' },
          { path: '/fitness/weight', label: 'Weight Log' },
          { path: '/fitness/diet', label: 'Diet Tracker' },
          { path: '/fitness/workouts', label: 'Workouts' },
          { path: '/fitness/cardio', label: 'Cardio' },
        ]
      },
      { path: '/mental-health', icon: Heart, label: 'Mental Health', moduleId: 'mentalHealth',
        children: [
          { path: '/mental-health', label: 'Overview' },
          { path: '/mental-health/mood', label: 'Mood Tracker' },
          { path: '/mental-health/checkin', label: 'Wellness Check-in' },
          { path: '/mental-health/resources', label: 'Resources' },
        ]
      },
      { path: '/leadership', icon: Shield, label: 'Leadership', moduleId: 'leadership',
        children: [
          { path: '/leadership', label: 'Overview' },
          { path: '/leadership/skills', label: 'Skill Deep Dive' },
          { path: '/leadership/resources', label: 'Resources' },
        ]
      },
      { path: '/vault', icon: Lock, label: 'Private Vault' },
      { path: '/personal', icon: Brain, label: 'Personal Dev', moduleId: 'personal',
        children: [
          { path: '/personal', label: 'Overview' },
          { path: '/personal/journal', label: 'Journal' },
          { path: '/personal/habits', label: 'Habits' },
          { path: '/personal/goals', label: 'Goals' },
        ]
      },
      { path: '/hobbies', icon: Palette, label: 'Hobbies', moduleId: 'hobbies' },
      { path: '/travel', icon: Plane, label: 'Travel', moduleId: 'travel',
        children: [
          { path: '/travel', label: 'Overview' },
          { path: '/travel/planner', label: 'Trip Planner' },
          { path: '/travel/history', label: 'History' },
        ]
      },
    ]
  },
];

export default function Sidebar({ onOpenSettings }) {
  const { sidebarCollapsed, toggleSidebar, theme, toggleTheme, enabledModules } = useGlobalStore();
  const [expandedItems, setExpandedItems] = useState({});
  const location = useLocation();

  const toggleExpand = (path) => {
    setExpandedItems((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <motion.aside
      className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}
      animate={{ width: sidebarCollapsed ? 70 : 260 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Logo */}
      <div className="sidebar-logo">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
          <div 
            className="logo-icon" 
            onClick={toggleSidebar} 
            style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <Zap size={20} />
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                className="logo-text"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                onClick={toggleSidebar}
                style={{ cursor: 'pointer' }}
              >
                <span className="logo-title">Second Brain</span>
                <span className="logo-subtitle">OS</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navSections.map((section) => {
          // Filter items based on enabledModules (if no moduleId, it's always visible like Dashboard)
          const visibleItems = section.items.filter(i => !i.moduleId || enabledModules[i.moduleId] !== false);
          if (visibleItems.length === 0) return null;

          return (
          <div key={section.title} className="nav-section">
            {!sidebarCollapsed && (
              <div className="nav-section-title">{section.title}</div>
            )}
            {visibleItems.map((item) => (
              <div key={item.path} className="nav-item-wrapper">
                <div className="nav-item-row">
                  <NavLink
                    to={item.path}
                    end={!item.children}
                    className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                    onClick={(e) => {
                      if (item.children && !sidebarCollapsed) {
                        e.preventDefault();
                        toggleExpand(item.path);
                      }
                    }}
                  >
                    <item.icon size={18} className="nav-icon" />
                    {!sidebarCollapsed && (
                      <>
                        <span className="nav-label">{item.label}</span>
                        {item.children && (
                          <ChevronDown
                            size={14}
                            className={`nav-chevron ${expandedItems[item.path] ? 'expanded' : ''}`}
                          />
                        )}
                      </>
                    )}
                    {isActive(item.path) && (
                      <motion.div
                        className="nav-active-indicator"
                        layoutId="activeNav"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </NavLink>
                </div>
                {/* Sub-items */}
                <AnimatePresence>
                  {item.children && expandedItems[item.path] && !sidebarCollapsed && (
                    <motion.div
                      className="nav-children"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.children.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          end
                          className={({ isActive }) => `nav-child ${isActive ? 'active' : ''}`}
                        >
                          <span className="nav-child-dot" />
                          {child.label}
                        </NavLink>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )})}
      </nav>

      {/* User info & Theme Toggle */}
      {!sidebarCollapsed && (
        <div style={{ padding: '0.85rem 1rem', borderTop: '2px solid var(--border-primary)', background: 'var(--bg-glass)' }}>
          <div className="sidebar-user" style={{ borderTop: 'none', padding: 0, marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '0.65rem' }}>
              <div className="user-avatar" style={{ border: '2px solid #000', boxShadow: '2px 2px 0px #000', color: '#000', background: 'var(--accent-primary, #fff)', cursor: 'pointer' }} onClick={onOpenSettings} title="Settings & Modules">SB</div>
              <div className="user-info">
                <span className="user-name" style={{cursor:'pointer'}} onClick={onOpenSettings}>Sathvik Bhat</span>
                <span className="user-college">IIIT Bhubaneswar</span>
              </div>
            </div>
            <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Day/Night Mode">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', marginTop: '0.8rem' }}>
            {['#E8F396', '#DCDDFF', '#FFCFD2', '#B9FBC0', '#8b5cf6'].map(color => (
              <button
                key={color}
                onClick={() => useGlobalStore.getState().setAccentColor(color)}
                style={{
                  width: '18px', height: '18px', borderRadius: '50%', background: color, 
                  border: '2px solid #000', cursor: 'pointer',
                  transform: 'translate(0, 0)', transition: 'all 0.2s',
                  boxShadow: '1px 1px 0px #000'
                }}
                onMouseOver={e => e.currentTarget.style.transform = 'translate(-1px, -1px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translate(0, 0)'}
              />
            ))}
          </div>
        </div>
      )}
    </motion.aside>
  );
}
