import React from 'react';
import { FileText, Folder, MoreVertical, Upload, Share2 } from 'lucide-react';

const resources = [
  { name: 'Syllabus', type: 'PDF', size: '2.4 MB', date: '10 May', icon: FileText, color: 'text-red-500 bg-red-500/10' },
  { name: 'PYQ\'s', type: 'Folder', size: '12 files', date: '8 May', icon: Folder, color: 'text-amber-500 bg-amber-500/10' },
  { name: 'Presentations', type: 'Folder', size: '25 files', date: '7 May', icon: Folder, color: 'text-amber-500 bg-amber-500/10' },
  { name: 'Class Notes', type: 'Folder', size: '18 files', date: '5 May', icon: Folder, color: 'text-amber-500 bg-amber-500/10' },
];

export default function ResourcesList() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-foreground uppercase tracking-widest pt-1">Resources</h3>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:text-foreground transition-all">
            <Upload size={14} strokeWidth={3} /> Upload
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-[10px] font-black text-primary uppercase tracking-widest border border-primary/20 hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/10">
            <Share2 size={14} strokeWidth={3} /> Drive Sync
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
        <div className="flex flex-col gap-2">
          {resources.map((res, i) => (
            <div 
              key={i} 
              className="group flex items-center justify-between p-4 rounded-2xl border border-transparent hover:border-border/40 hover:bg-white/5 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${res.color} transition-transform group-hover:scale-110`}>
                  <res.icon size={22} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-foreground tracking-tight">{res.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">{res.type}</span>
                    <div className="w-1 h-1 rounded-full bg-border" />
                    <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">{res.size}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest hidden sm:block">Modified {res.date}</span>
                <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
