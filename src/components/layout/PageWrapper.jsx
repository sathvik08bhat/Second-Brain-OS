import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 40, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -40, scale: 0.98 },
};

export default function PageWrapper({ children, showBackButton = true }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Don't show back button on main dashboard
  const isHome = location.pathname === '/';

  return (
    <motion.div
      className="page-content"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {showBackButton && !isHome && (
        <div style={{ marginBottom: '1rem', width: '100%' }}>
          <button 
            onClick={() => navigate(-1)} 
            className="btn-icon" 
            style={{ 
              background: 'var(--bg-glass)', border: '2px solid var(--border-primary)',
              boxShadow: 'var(--shadow-sm)', color: 'var(--text-primary)',
              display: 'inline-flex', padding: '0.4rem 0.8rem', gap: '0.5rem',
              fontWeight: 600, fontSize: '0.85rem'
            }}
          >
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>
      )}
      {children}
    </motion.div>
  );
}
