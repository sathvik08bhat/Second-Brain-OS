import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const CLASSES = [
  { date: 21, day: 'Wed', month: 'May', title: 'Arrays & Linked Lists', time: '10:00 AM - 11:00 AM', room: 'A-201' },
  { date: 23, day: 'Fri', month: 'May', title: 'Stacks & Queues', time: '10:00 AM - 11:00 AM', room: 'A-201' },
  { date: 26, day: 'Mon', month: 'May', title: 'Recursion', time: '10:00 AM - 11:00 AM', room: 'A-201' },
];

export default function UpcomingClasses() {
  const [selectedDate, setSelectedDate] = useState(21);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full">
      {/* Calendar View */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
             <ChevronLeft size={16} className="text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
             <span className="text-[11px] font-black text-foreground uppercase tracking-[0.2em]">May 2025</span>
             <ChevronRight size={16} className="text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
            <div key={d} className="text-[9px] font-black text-muted-foreground uppercase text-center opacity-40">{d}</div>
          ))}
          {days.slice(26, 31).map(d => (
            <div key={`p-${d}`} className="aspect-square flex items-center justify-center text-[10px] font-black text-muted-foreground/20">{d}</div>
          ))}
          {days.map(d => (
            <div 
              key={d} 
              onClick={() => setSelectedDate(d)}
              className={`aspect-square flex items-center justify-center rounded-xl text-[11px] font-black cursor-pointer transition-all ${
                selectedDate === d 
                  ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110' 
                  : 'text-muted-foreground hover:bg-white/5'
              } ${[21, 23, 26].includes(d) && selectedDate !== d ? 'text-primary' : ''}`}
            >
              {d}
              {[21, 23, 26].includes(d) && selectedDate !== d && (
                <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-primary" />
              )}
            </div>
          ))}
        </div>

        <button className="w-full mt-auto py-3 rounded-2xl bg-secondary/50 border border-border/40 text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-2 hover:text-foreground transition-all">
          <Calendar size={14} /> View Full Calendar
        </button>
      </div>

      {/* Classes List */}
      <div className="w-full md:w-64 flex flex-col gap-4 overflow-y-auto pr-2 scrollbar-hide">
        {CLASSES.map((cls, i) => (
          <div 
            key={i} 
            className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
              selectedDate === cls.date 
                ? 'bg-primary/10 border-primary/40' 
                : 'bg-card/40 border-border/20 hover:border-border/40'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{cls.day}</span>
                <span className="text-lg font-black text-foreground tabular-nums leading-none mt-1">{cls.date}</span>
              </div>
              <div className="flex-1 flex flex-col gap-1 min-w-0">
                <h4 className="text-xs font-black text-foreground leading-tight truncate">{cls.title}</h4>
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{cls.time}</span>
                <span className="text-[9px] font-black text-primary/60 uppercase tracking-widest">Room: {cls.room}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
