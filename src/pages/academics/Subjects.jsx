import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Plus, GraduationCap, ChevronRight, 
  Search, ChevronLeft
} from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useAcademicStore } from '../../store/academicStore';

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function Subjects() {
  const { subjects, isLoading, addSubject } = useAcademicStore();
  const navigate = useNavigate();
  const [activeSem, setActiveSem] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newSubjectForm, setNewSubjectForm] = useState({ 
    name: '', 
    code: '', 
    credits: 3, 
    semester: 1,
    professor: { name: '', email: '', phone: '' }
  });

  if (isLoading && subjects.length === 0) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Initializing Roadmap Intelligence...</span>
        </div>
      </PageWrapper>
    );
  }

  const filteredSubjects = subjects.filter(s => 
    s.semester === activeSem && 
    ((s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
     (s.code || '').toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSaveSubject = async () => {
    if (newSubjectForm.name.trim()) {
      const newId = await addSubject(newSubjectForm);
      setShowAddModal(false);
      setNewSubjectForm({ 
        name: '', 
        code: '', 
        credits: 3, 
        semester: activeSem,
        professor: { name: '', email: '', phone: '' }
      });
      navigate(`/academics/subject/${newId}`);
    }
  };

  return (
    <PageWrapper>
      <div className="flex flex-col gap-12 pb-20 max-w-[1400px] mx-auto px-4">
        {/* Navigation & Header */}
        <div className="flex flex-col gap-8">
          <button 
            onClick={() => navigate('/academics')}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all w-fit px-4 py-2 rounded-xl bg-secondary/30 border border-border/50 hover:bg-primary/5 hover:border-primary/20 shadow-sm"
          >
            <ChevronLeft size={14} strokeWidth={3} /> Return to Hub
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2">
              <h1 className="text-6xl font-black text-foreground tracking-tighter leading-none">Curriculum Roadmap</h1>
              <p className="text-muted-foreground text-lg font-medium opacity-80">Architect your academic journey across 8 semesters.</p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn-primary py-5 px-10 rounded-[28px] flex items-center gap-3 shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all transform hover:-translate-y-1 active:translate-y-0 group"
            >
              <Plus size={24} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />
              <span className="font-black uppercase tracking-[0.2em] text-xs">Deploy Subject</span>
            </button>
          </div>
        </div>

        {/* Semester Selection */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
          {SEMESTERS.map(sem => (
            <button
              key={sem}
              onClick={() => setActiveSem(sem)}
              className={`px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all whitespace-nowrap border-2 ${
                activeSem === sem 
                  ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-105' 
                  : 'bg-secondary/20 text-muted-foreground border-transparent hover:bg-secondary/40 hover:text-foreground'
              }`}
            >
              Semester {sem}
            </button>
          ))}
        </div>

        {/* Filter & Intelligence Panel */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-secondary/10 border border-border/40 p-8 rounded-[40px] backdrop-blur-xl shadow-inner relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <div className="relative w-full md:w-[450px] group z-10">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
              <Search className="text-muted-foreground group-focus-within:text-primary transition-all duration-300" size={22} />
            </div>
            <input 
              type="text" 
              placeholder="Search curriculum intelligence..."
              className="w-full bg-background/50 border border-border/60 !pl-16 pr-6 py-4 rounded-[24px] text-sm font-bold outline-none focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all shadow-sm placeholder:text-muted-foreground/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-12 px-6 z-10">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-2 opacity-60">Aggregate Weight</span>
              <span className="text-4xl font-black text-foreground tabular-nums tracking-tighter">
                {filteredSubjects.reduce((acc, s) => acc + (Number(s.credits) || 0), 0)}
              </span>
            </div>
            <div className="w-px h-12 bg-border/40" />
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-2 opacity-60">Course Count</span>
              <span className="text-4xl font-black text-foreground tabular-nums tracking-tighter">{filteredSubjects.length}</span>
            </div>
          </div>
        </div>

        {/* Curriculum Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredSubjects.map((sub, i) => (
              <motion.div
                key={sub.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -10, shadow: '0 30px 60px -12px rgba(0,0,0,0.2)' }}
                onClick={() => navigate(`/academics/subject/${sub.id}`)}
                className="bg-card border border-border/40 rounded-[48px] p-10 cursor-pointer hover:border-primary/40 group transition-all relative overflow-hidden flex flex-col min-h-[380px]"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -mr-24 -mt-24 blur-3xl group-hover:bg-primary/10 transition-all duration-700" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full -ml-16 -mb-16 blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />

                <div className="flex items-start justify-between mb-10 relative z-10">
                  <div className="w-16 h-16 rounded-[24px] bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                    <GraduationCap size={32} strokeWidth={2.5} />
                  </div>
                  <div className="px-4 py-2 rounded-2xl bg-secondary/50 text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] border border-border/40 group-hover:text-primary group-hover:border-primary/30 transition-all">
                    {sub.code || 'UNNAMED'}
                  </div>
                </div>

                <div className="relative z-10 flex-1">
                  <h3 className="text-3xl font-black text-foreground mb-3 tracking-tighter group-hover:text-primary transition-colors leading-none">{sub.name}</h3>
                  <p className="text-sm text-muted-foreground font-bold opacity-60 mb-8 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                    {sub.professor?.name || 'Faculty Not Specified'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-border/40 relative z-10 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-50">Weight</span>
                    <span className="text-lg font-black text-foreground">{sub.credits} Units</span>
                  </div>
                  <div className="flex items-center gap-3 text-primary font-black text-xs uppercase tracking-widest translate-x-4 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    Enter Workspace <ChevronRight size={18} strokeWidth={4} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty State Architectural Placeholder */}
          {filteredSubjects.length === 0 && (
            <div className="col-span-full py-32 flex flex-col items-center justify-center border-4 border-dashed border-border/20 rounded-[64px] gap-8 bg-secondary/5 group">
              <div className="w-24 h-24 rounded-[36px] bg-secondary/20 flex items-center justify-center text-muted-foreground/30 group-hover:scale-110 transition-transform duration-700">
                <BookOpen size={48} strokeWidth={1.5} />
              </div>
              <div className="text-center space-y-3">
                <h3 className="text-3xl font-black text-foreground tracking-tighter">Void Detected</h3>
                <p className="text-muted-foreground font-bold max-w-sm mx-auto opacity-60">No curriculum data exists for Semester {activeSem}. Initialize deployment to proceed.</p>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="btn-primary py-4 px-10 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
              >
                <Plus size={18} strokeWidth={4} /> Initialize Workspace
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Deployment Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Workspace Deployment">
        <div className="flex flex-col gap-10 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-2">Subject Identifier</label>
              <input 
                value={newSubjectForm.name} 
                onChange={e => setNewSubjectForm({...newSubjectForm, name: e.target.value})} 
                className="bg-secondary/40 border-2 border-border/40 p-5 rounded-[24px] outline-none focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all font-bold text-foreground"
                placeholder="e.g. Advanced AI"
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-2">Unique Access Code</label>
              <input 
                value={newSubjectForm.code} 
                onChange={e => setNewSubjectForm({...newSubjectForm, code: e.target.value})} 
                className="bg-secondary/40 border-2 border-border/40 p-5 rounded-[24px] outline-none focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all font-bold text-foreground"
                placeholder="CS402"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-2">Credit Units</label>
              <input 
                type="number"
                value={newSubjectForm.credits} 
                onChange={e => setNewSubjectForm({...newSubjectForm, credits: e.target.value})} 
                className="bg-secondary/40 border-2 border-border/40 p-5 rounded-[24px] outline-none focus:border-primary transition-all font-bold text-foreground"
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-2">Academic Semester</label>
              <select 
                value={newSubjectForm.semester} 
                onChange={e => setNewSubjectForm({...newSubjectForm, semester: Number(e.target.value)})} 
                className="bg-secondary/40 border-2 border-border/40 p-5 rounded-[24px] outline-none focus:border-primary transition-all font-bold text-foreground appearance-none"
              >
                {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
          </div>

          <div className="p-8 rounded-[32px] bg-primary/5 border-2 border-primary/10 flex flex-col gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                <Plus size={18} strokeWidth={3} />
              </div>
              <h4 className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">Faculty Intelligence</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <input 
                placeholder="Faculty Principal"
                value={newSubjectForm.professor.name}
                onChange={e => setNewSubjectForm({...newSubjectForm, professor: {...newSubjectForm.professor, name: e.target.value}})}
                className="bg-transparent border-b-2 border-border/60 p-3 outline-none text-base font-black focus:border-primary transition-all placeholder:text-muted-foreground/30"
              />
              <input 
                placeholder="Official Directory"
                value={newSubjectForm.professor.email}
                onChange={e => setNewSubjectForm({...newSubjectForm, professor: {...newSubjectForm.professor, email: e.target.value}})}
                className="bg-transparent border-b-2 border-border/60 p-3 outline-none text-base font-black focus:border-primary transition-all placeholder:text-muted-foreground/30"
              />
            </div>
          </div>

          <button 
            onClick={handleSaveSubject}
            className="btn-primary py-6 rounded-[32px] font-black uppercase tracking-[0.4em] text-xs shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Authorize Deployment
          </button>
        </div>
      </Modal>
    </PageWrapper>
  );
}
