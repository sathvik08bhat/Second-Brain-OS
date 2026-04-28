import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function PageWrapper({ children, showBackButton = true }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isHome = location.pathname === '/';

  return (
    <motion.div
      className="page-island"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {showBackButton && !isHome && (
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <button 
            onClick={() => navigate(-1)} 
            className="btn-secondary"
            style={{ padding: '0.35rem 0.7rem', fontSize: 'var(--font-sm)' }}
          >
            <ArrowLeft size={14} /> Back
          </button>
        </div>
      )}
      {children}
    </motion.div>
  );
}
