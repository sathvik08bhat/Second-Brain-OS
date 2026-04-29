import React from 'react';
import { GripVertical } from 'lucide-react';

export const WidgetCard = React.forwardRef(({ 
  children, 
  title, 
  icon: Icon, 
  className = "", 
  headerAction,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={`group bg-card text-card-foreground border border-border/50 rounded-[40px] shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500 flex flex-col h-full overflow-hidden ${className}`}
      {...props}
    >
      {/* Header */}
      <div className="drag-handle flex items-center justify-between p-8 pb-4 cursor-grab active:cursor-grabbing shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-1.5 -ml-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground/30">
            <GripVertical size={20} />
          </div>
          
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner transition-transform group-hover:scale-110 duration-500">
            {Icon && <Icon size={24} strokeWidth={2.5} />}
          </div>
          
          <h3 className="text-xl font-black text-foreground uppercase tracking-tight pt-1">
            {title}
          </h3>
        </div>
        
        {headerAction}
      </div>
      
      {/* Content */}
      <div className="px-8 pb-8 pt-2 flex-1 flex flex-col overflow-y-auto scrollbar-hide">
        {children}
      </div>
    </div>
  );
});

WidgetCard.displayName = "WidgetCard";
