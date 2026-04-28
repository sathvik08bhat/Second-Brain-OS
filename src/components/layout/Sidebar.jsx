import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, GraduationCap, Code2, BarChart3, Rocket,
  Briefcase, Users, Dumbbell, Brain, Palette, Plane,
  ChevronLeft, ChevronRight, ChevronDown, Zap, Inbox, Sun, Moon,
  CheckCircle, Wallet, Heart, Shield, Cpu, Link2, CalendarDays, Lock,
  Target, FileText
} from 'lucide-react';
import { useGlobalStore } from '../../store/globalStore';
import './Sidebar.css';

export const navSections = [
  {
    title: 'OVERVIEW',
    items: [
      { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
      { 
        path: '/focus', icon: Target, label: 'Focus Mode',
        children: [
          { path: '/focus', label: 'Deep Work' },
          { path: '/focus/stats', label: 'Focus Stats' },
        ]
      },
      { path: '/notes', icon: FileText, label: 'Notes' },
      { 
        path: '/journal', icon: Brain, label: 'Daily Journal',
        children: [
          { path: '/journal', label: 'Writing' },
          { path: '/journal/stats', label: 'Journal Insights' },
        ]
      },
      { 
        path: '/tasks', icon: CheckCircle, label: 'Task Tracker',
        children: [
          { path: '/tasks', label: 'Overview' },
          { path: '/tasks/stats', label: 'Insights & Stats' },
        ]
      },
      { 
        path: '/calendar', icon: CalendarDays, label: 'Calendar',
        children: [
          { path: '/calendar', label: 'Schedule' },
          { path: '/calendar/stats', label: 'Time Analytics' },
        ]
      },
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
      className={`sidebar bg-sidebar text-sidebar-foreground border-r border-border ${sidebarCollapsed ? 'collapsed' : ''}`}
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
          const visibleItems = section.items.filter(i => !i.moduleId || (enabledModules || {})[i.moduleId] !== false);
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
                        // Don't prevent default, allow navigation
                        if (!expandedItems[item.path]) toggleExpand(item.path);
                      }
                    }}
                  >
                    <item.icon size={18} className="nav-icon" />
                    {!sidebarCollapsed && (
                      <>
                        <span className="nav-label">{item.label}</span>
                        {item.children && (
                          <div 
                            className={`nav-chevron-wrapper ${expandedItems[item.path] ? 'expanded' : ''}`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleExpand(item.path);
                            }}
                          >
                            <ChevronDown size={14} className="nav-chevron" />
                          </div>
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
        <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border-primary)' }}>
          <div className="sidebar-user" style={{ borderTop: 'none', padding: 0, marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '0.6rem' }}>
              <div className="user-avatar" onClick={onOpenSettings} style={{ cursor: 'pointer' }} title="Settings & Modules">SB</div>
              <div className="user-info">
                <span className="user-name" style={{ cursor: 'pointer' }} onClick={onOpenSettings}>Sathvik Bhat</span>
                <span className="user-college">IIIT Bhubaneswar</span>
              </div>
            </div>
            <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Day/Night Mode">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center', marginTop: '0.6rem' }}>
            {[
              { color: '#0d9488', hover: '#0f766e', label: 'Teal' },
              { color: '#2563eb', hover: '#1d4ed8', label: 'Blue' },
              { color: 'var(--accent-primary)', hover: '#6d28d9', label: 'Violet' },
              { color: '#db2777', hover: '#be185d', label: 'Pink' },
              { color: '#ea580c', hover: '#c2410c', label: 'Orange' },
              { color: '#16a34a', hover: '#15803d', label: 'Green' },
              { color: '#dc2626', hover: '#b91c1c', label: 'Red' },
            ].map(({ color, hover, label }) => (
              <button
                key={color}
                title={label}
                onClick={() => {
                  const store = useGlobalStore.getState();
                  store.setAccentColor(color);
                  document.documentElement.style.setProperty('--accent-primary', color);
                  document.documentElement.style.setProperty('--accent-primary-hover', hover);
                  document.documentElement.style.setProperty('--accent-primary-muted', `${color}1a`);
                }}
                style={{
                  width: '16px', height: '16px', borderRadius: '50%', background: color,
                  border: '2px solid transparent', cursor: 'pointer',
                  transition: 'transform 0.15s, border-color 0.15s',
                  outline: 'none',
                }}
                onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.2)'; e.currentTarget.style.borderColor = 'var(--text-muted)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'transparent'; }}
              />
            ))}
          </div>
        </div>
      )}
    </motion.aside>
  );
}
