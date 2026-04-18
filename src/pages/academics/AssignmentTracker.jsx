import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Trash2, Edit3, Check } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useAcademicStore } from '../../store/academicStore';
import { formatDate, daysUntil } from '../../utils/helpers';

export default function AssignmentTracker() {
  const { assignments, addAssignment, updateAssignment, deleteAssignment, subjects, currentSemester } = useAcademicStore();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ subjectId: '', title: '', deadline: '', status: 'todo', description: '', link: '' });

  const semSubjects = subjects.filter((s) => s.semester === currentSemester);
  const semAssignments = assignments.filter((a) => semSubjects.find((s) => s.id === a.subjectId)).sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  const handleSubmit = (e) => { e.preventDefault(); if (editId) updateAssignment(editId, form); else addAssignment(form); resetForm(); };
  const resetForm = () => { setForm({ subjectId: '', title: '', deadline: '', status: 'todo', description: '', link: '' }); setEditId(null); setShowModal(false); };
  const startEdit = (a) => { setForm({ subjectId: a.subjectId, title: a.title, deadline: a.deadline, status: a.status, description: a.description || '', link: a.link || '' }); setEditId(a.id); setShowModal(true); };
  const getSubjectName = (id) => subjects.find((s) => s.id === id)?.name || 'Unknown';

  const statusBadge = { 'todo': 'badge-red', 'in-progress': 'badge-yellow', 'done': 'badge-blue', 'submitted': 'badge-green' };

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">📋 Assignment Tracker</span></h1>
        <p>Track deadlines and submission status — linked to your subjects</p>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Assignment</button>
        </div>
      </div>

      {semAssignments.length === 0 ? (
        <div className="empty-state">
          <Calendar size={48} />
          <h3>No Assignments</h3>
          <p>Add assignments to track deadlines and completion status.</p>
          <button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Assignment</button>
        </div>
      ) : (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead><tr><th>Title</th><th>Subject</th><th>Deadline</th><th>Days Left</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {semAssignments.map((a, i) => {
                const days = daysUntil(a.deadline);
                return (
                  <motion.tr key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{a.title}</td>
                    <td>{getSubjectName(a.subjectId)}</td>
                    <td>{formatDate(a.deadline)}</td>
                    <td><span style={{ color: days < 0 ? 'var(--accent-red)' : days < 3 ? 'var(--accent-yellow)' : 'var(--accent-green)', fontWeight: 600 }}>{days < 0 ? 'Overdue' : `${days}d`}</span></td>
                    <td>
                      <select value={a.status} onChange={(e) => updateAssignment(a.id, { status: e.target.value })} style={{ width: 'auto', padding: '0.2rem 0.5rem', fontSize: 'var(--font-xs)' }}>
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                        <option value="submitted">Submitted</option>
                      </select>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button className="btn-icon" onClick={() => startEdit(a)}><Edit3 size={15} /></button>
                        <button className="btn-icon" onClick={() => deleteAssignment(a.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showModal} onClose={resetForm} title={editId ? 'Edit Assignment' : 'Add Assignment'}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full-width"><label>Title *</label><input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Assignment title" /></div>
            <div className="form-group"><label>Subject *</label><select value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })} required><option value="">Select</option>{semSubjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
            <div className="form-group"><label>Deadline *</label><input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} required /></div>
            <div className="form-group"><label>Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="todo">To Do</option><option value="in-progress">In Progress</option><option value="done">Done</option><option value="submitted">Submitted</option></select></div>
            <div className="form-group"><label>Link</label><input type="url" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="Submission link" /></div>
            <div className="form-group full-width"><label>Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Details..." /></div>
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
