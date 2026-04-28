import { motion } from 'framer-motion';
import './StatsCard.css';

export default function StatsCard({ 
  icon: Icon, label, value, subtitle, color, gradient, 
  delay = 0, className = "", variant = "default" 
}) {
  if (variant === 'minimal') {
    return (
      <div className={`stats-card-minimal ${className}`}>
        <div className="stats-card-minimal-icon" style={{ color }}>
          {Icon && <Icon size={16} />}
        </div>
        <span className="stats-card-minimal-label">{label}</span>
        <span className="stats-card-minimal-value" style={{ color }}>{value}</span>
      </div>
    );
  }

  return (
    <motion.div
      className={`stats-card ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <div className="stats-card-icon" style={{ background: `${color}15`, color }}>
        {Icon && <Icon size={18} />}
      </div>
      <div className="stats-card-content">
        <span className="stats-card-label">{label}</span>
        <span className="stats-card-value" style={{ color }}>{value}</span>
        {subtitle && <span className="stats-card-subtitle">{subtitle}</span>}
      </div>
    </motion.div>
  );
}
