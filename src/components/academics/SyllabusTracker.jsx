import React from 'react';
import { Target, CheckCircle2, Circle } from 'lucide-react';

export default function SyllabusTracker({ topics, subjectId, onToggle }) {
  if (!topics || topics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 opacity-30 py-20">
        <div className="w-16 h-16 rounded-[24px] bg-secondary flex items-center justify-center text-muted-foreground">
          <Target size={32} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.25em]">No topics defined</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 h-full overflow-y-auto pr-2 scrollbar-hide">
      {topics.map(topic => (
        <div key={topic.id} className="flex flex-col gap-4 p-5 rounded-[24px] bg-secondary/5 border border-border/40 group hover:border-primary/30 transition-all hover:bg-secondary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div 
                onClick={() => onToggle(topic.id, topic.status === 'completed' ? 'pending' : 'completed')}
                className={`cursor-pointer transition-all transform hover:scale-110 ${topic.status === 'completed' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
              >
                {topic.status === 'completed' ? <CheckCircle2 size={22} strokeWidth={3} /> : <Circle size={22} strokeWidth={2.5} />}
              </div>
              <span className={`text-sm font-black tracking-tight ${topic.status === 'completed' ? 'text-muted-foreground/60 line-through' : 'text-foreground'}`}>
                {topic.title}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{topic.masteryLevel || 0}% Mastery</span>
            </div>
          </div>
          
          <div className="h-2 w-full bg-secondary/40 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-primary transition-all duration-700 ease-out rounded-full shadow-[0_0_10px_rgba(var(--accent-primary-rgb),0.3)]" 
              style={{ width: `${topic.masteryLevel || 0}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
