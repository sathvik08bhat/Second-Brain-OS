import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, Trash2, Edit3, Check, Clock, AlertCircle } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useAcademicStore } from '../../store/academicStore';
import { formatDate, daysUntil } from '../../utils/helpers';

export default function AssignmentTracker() {
  const { subjects, addAssignmentToSubject, updateAssignment, deleteAssignment } = useAcademicStore();
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  
  const [form, setForm] = useState({ 
    subjectId: '', 
    title: '', 
    deadline: '', 
    status: 'todo', 
    description: '', 
    link: '' 
  });

  // Derived state: All assignments flat list
  const allAssignments = subjects.flatMap(s => 
    (s.assignments || []).map(a => ({ ...a, subjectId: s.id, subjectName: s.name }))
  );

  const pendingAssignments = allAssignments.filter(a => a.status === 'todo' || a.status === 'in-progress');
  const doneAssignments = allAssignments.filter(a => a.status === 'done' || a.status === 'submitted');

  const handleSubmit = (e) => { 
    e.preventDefault(); 
    if (editData) {
      // If subject changed, we'd have to delete from old subject and add to new. 
      // For simplicity in this UI, we might just update within the same subject, or handle it properly:
      if (editData.subjectId !== form.subjectId) {
        deleteAssignment(editData.subjectId, editData.id);
        addAssignmentToSubject(form.subjectId, form);
      } else {
        updateAssignment(form.subjectId, editData.id, form); 
      }
    } else {
      addAssignmentToSubject(form.subjectId, form); 
    }
    resetForm(); 
  };

  const resetForm = () => { 
    setForm({ subjectId: '', title: '', deadline: '', status: 'todo', description: '', link: '' }); 
    setEditData(null); 
    setShowModal(false); 
  };

  const startEdit = (a) => { 
    setForm({ 
      subjectId: a.subjectId, 
      title: a.title, 
      deadline: a.deadline, 
      status: a.status, 
      description: a.description || '', 
      link: a.link || '' 
    }); 
    setEditData(a); 
    setShowModal(true); 
  };

  const handleStatusChange = (assignment, newStatus) => {
    updateAssignment(assignment.subjectId, assignment.id, { status: newStatus });
  };

  const renderAssignmentCard = (a) => {
    const days = daysUntil(a.deadline);
    const isOverdue = days < 0 && a.status !== 'done' && a.status !== 'submitted';
    
    return (
      <motion.div 
        key={a.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card border border-border/50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col gap-3 group relative"
      >
        <div className="flex justify-between items-start gap-2">
          <div>
            <h4 className="font-bold text-foreground text-sm leading-tight">{a.title}</h4>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{a.subjectName}</span>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => startEdit(a)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><Edit3 size={14}/></button>
            <button onClick={() => deleteAssignment(a.subjectId, a.id)} className="p-1.5 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-auto">
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold ${
            isOverdue ? 'bg-red-500/10 text-red-500' : 
            days <= 2 && a.status !== 'done' ? 'bg-orange-500/10 text-orange-500' : 
            'bg-muted text-muted-foreground'
          }`}>
            {isOverdue ? <AlertCircle size={12}/> : <Clock size={12}/>}
            {isOverdue ? 'Overdue' : days === 0 ? 'Today' : `${days}d left`}
          </div>

          <select 
            value={a.status} 
            onChange={(e) => handleStatusChange(a, e.target.value)}
            className="text-xs bg-secondary border border-border rounded-md px-2 py-1 text-foreground cursor-pointer outline-none ml-auto"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
            <option value="submitted">Submitted</option>
          </select>
        </div>
      </motion.div>
    );
  };

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1">Assignments</h1>
          <p className="text-muted-foreground">Kanban tracker for your deadlines</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowModal(true)}>
          <Plus size={16} /> 
          <span>New Assignment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
        {/* PENDING COLUMN */}
        <div className="flex flex-col bg-secondary/30 rounded-2xl border border-border/50 p-4 h-full overflow-hidden">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" /> Pending
            </h3>
            <span className="bg-muted px-2 py-0.5 rounded-full text-xs font-semibold text-muted-foreground">{pendingAssignments.length}</span>
          </div>
          
          <div className="flex flex-col gap-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
            <AnimatePresence>
              {pendingAssignments.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground text-sm">No pending assignments. Great job!</div>
              ) : (
                pendingAssignments.map(renderAssignmentCard)
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* DONE COLUMN */}
        <div className="flex flex-col bg-secondary/30 rounded-2xl border border-border/50 p-4 h-full overflow-hidden">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" /> Done
            </h3>
            <span className="bg-muted px-2 py-0.5 rounded-full text-xs font-semibold text-muted-foreground">{doneAssignments.length}</span>
          </div>
          
          <div className="flex flex-col gap-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
            <AnimatePresence>
              {doneAssignments.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground text-sm">Nothing completed yet.</div>
              ) : (
                doneAssignments.map(renderAssignmentCard)
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={resetForm} title={editData ? 'Edit Assignment' : 'Add Assignment'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-foreground">Title *</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Assignment title" className="bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:border-primary outline-none" />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-foreground">Subject *</label>
            <select value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })} required className="bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:border-primary outline-none">
              <option value="">Select a Subject</option>
              {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-foreground">Deadline *</label>
            <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} required className="bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:border-primary outline-none" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-foreground">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:border-primary outline-none">
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
              <option value="submitted">Submitted</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>
            <button type="submit" className="btn-primary flex items-center gap-2">
              <Check size={16} /> {editData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
