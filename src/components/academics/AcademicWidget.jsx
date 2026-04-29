import React from 'react';
import { motion } from 'framer-motion';
import { GripVertical } from 'lucide-react';

export default function AcademicWidget({ 
  title, 
  icon: Icon, 
  children, 
  headerAction, 
  className = "",
  iconColor = "text-primary",
  iconBg = "bg-primary/10"
}) {
  return (
    <div className={`group bg-card border border-border/50 rounded-[40px] shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500 flex flex-col h-full overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-8 pb-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          {/* Drag Handle */}
          <div className="drag-handle cursor-grab active:cursor-grabbing p-1.5 -ml-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground/30 hover:text-primary">
            <GripVertical size={20} />
          </div>
          
          <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center ${iconColor} shadow-inner transition-transform group-hover:scale-110 duration-500`}>
            <Icon size={24} strokeWidth={2.5} />
          </div>
          
          <h3 className="text-xl font-black text-foreground uppercase tracking-tight leading-none pt-1">
            {title}
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          {headerAction}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 pt-2 overflow-hidden flex flex-col">
        {children}
      </div>
    </div>
  );
}
