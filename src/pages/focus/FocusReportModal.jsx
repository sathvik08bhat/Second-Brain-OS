import React from 'react';
import { X, Calendar, TrendingUp, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FocusReportModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={20} className="text-primary" />
            <h2 className="text-xl font-black text-foreground uppercase tracking-widest">Activity Report</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-4 bg-muted/30 border-b border-border flex gap-8">
          {['Summary', 'Detail', 'Ranking'].map((tab, i) => (
            <button 
              key={tab} 
              className={`text-xs font-black uppercase tracking-widest pb-1 border-b-2 transition-all ${
                i === 0 ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-8 flex-1">
          {/* Activity Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/50 border border-border/50 rounded-2xl p-6 text-center space-y-1">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Hours Focused</span>
              <div className="text-3xl font-black text-primary">12.5</div>
              <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">This Week</span>
            </div>
            <div className="bg-muted/50 border border-border/50 rounded-2xl p-6 text-center space-y-1">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Days Accessed</span>
              <div className="text-3xl font-black text-foreground">18</div>
              <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">Lifetime</span>
            </div>
            <div className="bg-muted/50 border border-border/50 rounded-2xl p-6 text-center space-y-1">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Day Streak</span>
              <div className="text-3xl font-black text-foreground">5</div>
              <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">Current</span>
            </div>
          </div>

          {/* Focus Hours Chart Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                <Calendar size={16} /> Focus Hours
              </h3>
              
              {/* Time Filters */}
              <div className="flex bg-muted rounded-lg p-1">
                {['Week', 'Month', 'Year'].map((filter, i) => (
                  <button 
                    key={filter}
                    className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider transition-all ${
                      i === 0 ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart Nav */}
            <div className="flex items-center justify-between text-muted-foreground">
              <button className="p-1 hover:text-foreground"><ChevronLeft size={18} /></button>
              <span className="text-xs font-bold uppercase tracking-widest">Apr 22 - Apr 28, 2026</span>
              <button className="p-1 hover:text-foreground"><ChevronRight size={18} /></button>
            </div>

            {/* Chart Placeholder */}
            <div className="w-full h-72 bg-muted/20 border border-border/50 rounded-2xl flex flex-col items-center justify-center text-muted-foreground gap-3 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <TrendingUp size={24} className="opacity-20" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Chart Engine Initializing</span>
              <div className="flex gap-1 mt-2">
                {[1,2,3,4,5,6,7].map(i => (
                  <div key={i} className="w-4 bg-muted rounded-t-sm" style={{ height: `${Math.random() * 40 + 10}px`, opacity: 0.3 }} />
                ))}
              </div>
            </div>
          </div>

          {/* Achievement Section */}
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20">
              <Award size={24} />
            </div>
            <div>
              <h4 className="font-black text-sm uppercase tracking-wider">Productivity Master</h4>
              <p className="text-[10px] text-muted-foreground font-medium">You've completed 50 focus sessions this month! Keep it up.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
