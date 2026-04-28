import React from 'react';
import { X, Volume2, Moon, Monitor, Link, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FocusSettingsModal({ isOpen, onClose, durations, setDurations }) {
  if (!isOpen) return null;

  const handleDurationChange = (key, value) => {
    const mins = parseInt(value) || 0;
    setDurations(prev => ({
      ...prev,
      [key]: mins * 60
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        className="bg-card border border-border rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto p-6 shadow-2xl flex flex-col"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
          <h2 className="text-xl font-black text-foreground uppercase tracking-widest">Settings</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Timer Settings */}
        <div className="space-y-6 flex-1">
          <section className="space-y-4">
            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              Timer (minutes)
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Pomodoro</label>
                <input 
                  type="number" 
                  value={durations.focus / 60} 
                  onChange={(e) => handleDurationChange('focus', e.target.value)}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm font-bold focus:border-primary outline-none" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Short Break</label>
                <input 
                  type="number" 
                  value={durations.short / 60} 
                  onChange={(e) => handleDurationChange('short', e.target.value)}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm font-bold focus:border-primary outline-none" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Long Break</label>
                <input 
                  type="number" 
                  value={durations.long / 60} 
                  onChange={(e) => handleDurationChange('long', e.target.value)}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm font-bold focus:border-primary outline-none" 
                />
              </div>
            </div>
          </section>

          {/* Sound Section */}
          <section className="space-y-4 pt-4 border-t border-border">
            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Volume2 size={14} /> Sound Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">Alarm Sound</span>
                <select className="bg-muted border border-border rounded-lg px-3 py-1.5 text-xs font-bold outline-none">
                  <option>Kitchen Timer</option>
                  <option>Digital</option>
                  <option>Bells</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                  <span>Volume</span>
                  <span>50%</span>
                </div>
                <input type="range" className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">Focus Sound</span>
                <select className="bg-muted border border-border rounded-lg px-3 py-1.5 text-xs font-bold outline-none">
                  <option>None</option>
                  <option>White Noise</option>
                  <option>Rain</option>
                  <option>Forest</option>
                </select>
              </div>
            </div>
          </section>

          {/* Theme/Display Section */}
          <section className="space-y-4 pt-4 border-t border-border">
            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Moon size={14} /> Display
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">Dark Mode when running</span>
                <div className="w-10 h-5 bg-primary rounded-full relative">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-primary-foreground rounded-full" />
                </div>
              </div>
              <button className="w-full bg-muted border border-border rounded-lg py-2.5 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-muted/80 transition-colors">
                <Monitor size={14} /> Small Window
              </button>
            </div>
          </section>

          {/* Integration Section */}
          <section className="space-y-4 pt-4 border-t border-border">
            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Link size={14} /> Integrations
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-red-500 flex items-center justify-center text-white font-bold text-[10px]">T</div>
                  <span className="text-sm font-bold">Todoist</span>
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest bg-primary text-primary-foreground px-3 py-1 rounded-md">Connect</button>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe size={14} />
                  <span className="text-sm font-bold">Webhook</span>
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest bg-card border border-border px-3 py-1 rounded-md">Add</button>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-8">
          <button 
            onClick={onClose}
            className="bg-primary text-primary-foreground w-full py-3 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-[0.98]"
          >
            OK
          </button>
        </div>
      </motion.div>
    </div>
  );
}
