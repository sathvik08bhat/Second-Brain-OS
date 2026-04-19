import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import { Zap, Menu, X, ChevronDown, ChevronRight, Moon, Sun } from 'lucide-react';
import { useGlobalStore } from '../../store/globalStore';
import { navSections } from './Sidebar';

export default function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const { theme, toggleTheme } = useGlobalStore();
  const location = useLocation();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const toggleSection = (sectionTitle) => {
    setExpandedSection(expandedSection === sectionTitle ? null : sectionTitle);
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Top Navbar */}
      <div 
        style={{ 
          position: 'fixed', top: 0, left: 0, width: '100%', height: '60px', 
          background: 'var(--bg-glass)', borderBottom: '2px solid var(--border-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 1rem', zIndex: 1000, WebkitBackdropFilter: 'blur(10px)', backdropFilter: 'blur(10px)'
        }}
        className="mobile-only-flex"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 32, height: 32, background: 'var(--border-primary)', color: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
            <Zap size={18} />
          </div>
          <span style={{ fontWeight: 800, letterSpacing: '-0.02em', fontSize: '1.1rem' }}>SB OS</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="theme-toggle-btn" onClick={toggleTheme} style={{ background: 'transparent', border: 'none', padding: 0 }}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={toggleDropdown} style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer' }}>
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Dropdown Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed', top: '60px', left: 0, width: '100%',
              background: 'var(--bg-primary)', zIndex: 999,
              maxHeight: 'calc(100vh - 60px)', overflowY: 'auto', borderBottom: '2px solid var(--border-primary)',
              boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {navSections.map((section) => (
                <div key={section.title} className="glass-card" style={{ padding: '0.5rem', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-tertiary)', letterSpacing: '0.05em', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
                    {section.title}
                  </div>
                  {section.items.map(item => (
                    <div key={item.path}>
                      {item.children ? (
                        <div 
                          onClick={() => toggleSection(item.path)}
                          style={{ 
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                            padding: '0.75rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                            background: isActive(item.path) ? 'var(--bg-glass-hover)' : 'transparent',
                            fontWeight: 600, fontSize: '0.95rem'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <item.icon size={18} style={{ color: isActive(item.path) ? 'var(--accent-purple)' : 'var(--text-secondary)' }} />
                            {item.label}
                          </div>
                          {expandedSection === item.path ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </div>
                      ) : (
                        <NavLink 
                          to={item.path} 
                          onClick={() => setIsOpen(false)}
                          style={({ isActive }) => ({
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            padding: '0.75rem', borderRadius: 'var(--radius-sm)',
                            background: isActive ? 'var(--bg-glass-hover)' : 'transparent',
                            color: isActive ? 'var(--accent-purple)' : 'var(--text-primary)',
                            fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none'
                          })}
                        >
                          <item.icon size={18} />
                          {item.label}
                        </NavLink>
                      )}

                      {/* Render Children if expanded */}
                      <AnimatePresence>
                        {item.children && expandedSection === item.path && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            style={{ overflow: 'hidden' }}
                          >
                            <div style={{ padding: '0.25rem 0.5rem 0.5rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                              {item.children.map(child => (
                                <NavLink
                                  key={child.path}
                                  to={child.path}
                                  onClick={() => setIsOpen(false)}
                                  style={({ isActive }) => ({
                                    padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)',
                                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                                    fontWeight: isActive ? 700 : 500, fontSize: '0.85rem',
                                    textDecoration: 'none', display: 'block',
                                    background: isActive ? 'var(--bg-tertiary)' : 'transparent'
                                  })}
                                >
                                  {child.label}
                                </NavLink>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
