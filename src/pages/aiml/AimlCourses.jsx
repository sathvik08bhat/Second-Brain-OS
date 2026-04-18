import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Trash2, Edit3, Check, ExternalLink, Calendar } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useAimlStore } from '../../store/aimlStore';
import { useGoogleStore } from '../../store/googleStore';

const statusColors = { planned: '#64748b', 'in-progress': '#f59e0b', completed: '#10b981', dropped: '#ef4444' };
const statusLabels = { planned: '📋 Planned', 'in-progress': '📖 In Progress', completed: '✅ Completed', dropped: '❌ Dropped' };

export default function AimlCourses() {
  const { courses, addCourse, updateCourse, deleteCourse } = useAimlStore();
  const { isAuthenticated, createCalendarEvent } = useGoogleStore();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ name: '', platform: '', url: '', progress: 0, status: 'planned', deadline: '', notes: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form, progress: Number(form.progress), deadline: form.deadline || null };
    if (editId) updateCourse(editId, data);
    else addCourse(data);
    resetForm();
  };

  const resetForm = () => { setForm({ name: '', platform: '', url: '', progress: 0, status: 'planned', deadline: '', notes: '' }); setEditId(null); setShowModal(false); };

  const startEdit = (c) => {
    setForm({ name: c.name, platform: c.platform || '', url: c.url || '', progress: c.progress, status: c.status, deadline: c.deadline || '', notes: c.notes || '' });
    setEditId(c.id);
    setShowModal(true);
  };

  const syncToCalendar = async (course) => {
    if (!course.deadline) return;
    try {
      await createCalendarEvent({
        title: `📚 Course Deadline: ${course.name}`,
        description: `Platform: ${course.platform}\nProgress: ${course.progress}%\n${course.url || ''}`,
        startDate: course.deadline,
      });
      alert('✅ Synced to Google Calendar!');
    } catch (err) { alert('❌ ' + err.message); }
  };

  const filtered = courses.filter(c => filter === 'all' || c.status === filter);

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">📚 Courses</span></h1>
        <p>Online courses, certifications, and learning programs</p>
        <div className="header-actions">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ width: 140 }}>
            <option value="all">All Courses</option>
            {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Course</button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><BookOpen size={48} /><h3>No Courses</h3><p>Start tracking your learning journey.</p><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Course</button></div>
      ) : (
        <div className="grid-auto">
          {filtered.map((course, i) => (
            <motion.div key={course.id} className="glass-card" style={{ padding: '1.25rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 'var(--font-md)', marginBottom: '0.25rem' }}>{course.name}</div>
                  {course.platform && <span className="badge" style={{ background: '#3b82f615', color: '#3b82f6', marginRight: '0.3rem' }}>{course.platform}</span>}
                  <span className="badge" style={{ background: `${statusColors[course.status]}15`, color: statusColors[course.status] }}>{course.status}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.2rem', flexShrink: 0 }}>
                  {course.url && <a href={course.url} target="_blank" rel="noreferrer" className="btn-icon" title="Open course"><ExternalLink size={14} /></a>}
                  {isAuthenticated && course.deadline && <button className="btn-icon" onClick={() => syncToCalendar(course)} title="Sync deadline" style={{ color: 'var(--accent-blue)' }}><Calendar size={14} /></button>}
                  <button className="btn-icon" onClick={() => startEdit(course)}><Edit3 size={14} /></button>
                  <button className="btn-icon" onClick={() => deleteCourse(course.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="progress-bar-container">
                <motion.div className="progress-bar-fill" style={{ background: statusColors[course.status] }} initial={{ width: 0 }} animate={{ width: `${course.progress}%` }} transition={{ duration: 1, delay: i * 0.1 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem', fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
                <span>{course.progress}% complete</span>
                {course.deadline && <span style={{ color: new Date(course.deadline) < new Date() && course.status !== 'completed' ? 'var(--accent-red)' : 'var(--text-muted)' }}>📅 {course.deadline}</span>}
              </div>
              {course.notes && <div style={{ marginTop: '0.5rem', fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-primary)', paddingTop: '0.5rem' }}>{course.notes}</div>}
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={resetForm} title={editId ? 'Edit Course' : 'Add Course'}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group"><label>Course Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Andrew Ng's ML Course" /></div>
            <div className="form-group"><label>Platform</label><input value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} placeholder="Coursera, Udemy, YouTube..." /></div>
            <div className="form-group"><label>URL</label><input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." /></div>
            <div className="form-group"><label>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Progress ({form.progress}%)</label><input type="range" min="0" max="100" value={form.progress} onChange={(e) => setForm({ ...form, progress: e.target.value })} style={{ border: 'none', padding: 0, boxShadow: 'none' }} /></div>
            <div className="form-group"><label>Deadline</label><input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></div>
            <div className="form-group full-width"><label>Notes</label><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Key takeaways, progress notes..." /></div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>
            <button type="submit" className="btn-primary"><Check size={16} /> {editId ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
