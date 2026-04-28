import { motion } from 'framer-motion';
import './StatsCard.css';

export default function StatsCard({ 
  icon: Icon, label, value, subtitle, color, gradient, 
  delay = 0, className = "", variant = "default" 
}) {
  if (variant === 'minimal') {
    return (
      <div className={`flex flex-col items-center justify-center p-2 rounded-xl bg-muted/20 border border-border/50 ${className}`}>
        <div className="p-2 rounded-lg mb-1" style={{ color }}>
          {Icon && <Icon size={16} />}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-0.5">{label}</span>
        <span className="text-lg font-black tracking-tighter" style={{ color }}>{value}</span>
      </div>
    );
  }

  return (
    <motion.div
      className={`stats-card glass-card ${className}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div className="stats-card-icon" style={{ background: gradient || `${color}15`, color: color, border: '2px solid var(--border-primary)', boxShadow: '2px 2px 0px var(--border-primary)' }}>
        {Icon && <Icon size={20} />}
      </div>
      <div className="stats-card-content">
        <span className="stats-card-label">{label}</span>
        <span className="stats-card-value" style={{ color }}>{value}</span>
        {subtitle && <span className="stats-card-subtitle">{subtitle}</span>}
      </div>
    </motion.div>
  );
}
