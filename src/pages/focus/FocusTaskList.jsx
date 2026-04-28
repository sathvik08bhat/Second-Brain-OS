import React, { useState } from 'react';
import { MoreVertical, Plus, CheckCircle2, Circle, Trash2, Import, ChevronUp, ChevronDown, AlignLeft, FolderPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FocusTaskList() {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Refactor Focus UI', est: 3, act: 0, completed: false },
    { id: '2', title: 'Implement Grid Layout', est: 2, act: 0, completed: false },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', est: 1 });

  const addTask = () => {
    if (!newTask.title.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), ...newTask, act: 0, completed: false }]);
    setNewTask({ title: '', est: 1 });
    setIsAdding(false);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-8 h-full flex flex-col shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">Tasks</h2>
          <button className="text-[10px] font-bold text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors uppercase tracking-widest">
            <Import size={10} /> Import
          </button>
        </div>
        <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Task List */}
      <div className="flex-1 space-y-4 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {tasks.map((task) => (
            <motion.div 
              key={task.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="group flex items-center justify-between p-4 bg-muted/30 border border-border/50 rounded-xl hover:border-primary/30 transition-all cursor-grab active:cursor-grabbing"
            >
              <div className="flex items-center gap-3 flex-1 min-width-0">
                <button className="text-muted-foreground hover:text-primary transition-colors">
                  {task.completed ? <CheckCircle2 size={18} className="text-primary" /> : <Circle size={18} />}
                </button>
                <span className={`text-sm font-bold truncate ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {task.title}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-card px-2 py-1 rounded-md border border-border">
                  {task.act} / {task.est}
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-red-500 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add Task Area */}
        {!isAdding ? (
          <button 
            onClick={() => setIsAdding(true)}
            className="w-full py-4 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-[0.2em]"
          >
            <Plus size={16} /> Add Task
          </button>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-muted border border-primary/30 rounded-xl p-6 space-y-6 shadow-lg shadow-primary/5 mb-4"
          >
            <input 
              autoFocus
              className="w-full bg-transparent text-lg font-black text-foreground placeholder:text-muted-foreground outline-none"
              placeholder="What are you working on?"
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
            />
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Est Pomodoros</label>
              <div className="flex items-center gap-3">
                <input 
                  type="number"
                  className="w-16 bg-card border border-border rounded-lg px-3 py-2 text-sm font-black text-foreground outline-none focus:border-primary"
                  value={newTask.est}
                  onChange={(e) => setNewTask({...newTask, est: parseInt(e.target.value) || 1})}
                />
                <div className="flex flex-col">
                  <button onClick={() => setNewTask({...newTask, est: newTask.est + 1})} className="p-1 hover:text-primary transition-colors"><ChevronUp size={14} /></button>
                  <button onClick={() => setNewTask({...newTask, est: Math.max(1, newTask.est - 1)})} className="p-1 hover:text-primary transition-colors"><ChevronDown size={14} /></button>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button className="px-3 py-1.5 rounded-lg bg-card border border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                <AlignLeft size={12} /> Add Note
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-card border border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                <FolderPlus size={12} /> Project
              </button>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button 
                onClick={addTask}
                className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.15em] shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
              >
                Save
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
