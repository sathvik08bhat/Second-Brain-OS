import React, { useMemo } from 'react';
import { Clock, MapPin } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ScheduleCalendar({ schedule }) {
  const groupedSchedule = useMemo(() => {
    const groups = {};
    DAYS.forEach(day => groups[day] = []);
    schedule?.forEach(item => {
      if (groups[item.day]) groups[item.day].push(item);
    });
    return groups;
  }, [schedule]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="grid grid-cols-7 border-b border-border/40 mb-2">
        {DAYS.map(day => (
          <div key={day} className="py-2 text-center">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{day.slice(0, 3)}</span>
          </div>
        ))}
      </div>
      
      <div className="flex-1 overflow-y-auto pr-1 scrollbar-hide">
        <div className="grid grid-cols-7 h-full min-h-[300px]">
          {DAYS.map(day => (
            <div key={day} className="border-r border-border/20 last:border-r-0 p-1 min-h-[200px] flex flex-col gap-2">
              {groupedSchedule[day].map((item, idx) => (
                <div 
                  key={idx} 
                  className="p-2 rounded-xl bg-primary/5 border border-primary/20 flex flex-col gap-1 group hover:bg-primary/10 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-1 text-primary">
                    <Clock size={10} />
                    <span className="text-[9px] font-black uppercase tracking-tighter leading-none">{item.startTime}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-foreground leading-tight truncate">{item.room || 'TBD'}</span>
                  </div>
                </div>
              ))}
              {groupedSchedule[day].length === 0 && (
                <div className="flex-1 flex items-center justify-center opacity-10">
                  <span className="text-[8px] font-black uppercase tracking-widest -rotate-90 whitespace-nowrap">No Classes</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
