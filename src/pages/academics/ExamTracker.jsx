import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Trash2, Edit3, Check } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useAcademicStore } from '../../store/academicStore';
import { formatDate, daysUntil } from '../../utils/helpers';

export default function ExamTracker() {
  const { exams, addExam, updateExam, deleteExam, subjects, currentSemester } = useAcademicStore();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ subjectId: '', type: 'mid-sem', date: '', syllabus: '', revisionStatus: 'not-started', marks: '', totalMarks: '' });

  const semSubjects = subjects.filter((s) => s.semester === currentSemester);
  const semExams = exams.filter((e) => semSubjects.find((s) => s.id === e.subjectId)).sort((a, b) => new Date(a.date) - new Date(b.date));

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form, marks: form.marks ? Number(form.marks) : null, totalMarks: form.totalMarks ? Number(form.totalMarks) : null };
    if (editId) updateExam(editId, data);
    else addExam(data);
    resetForm();
  };

  const resetForm = () => { setForm({ subjectId: '', type: 'mid-sem', date: '', syllabus: '', revisionStatus: 'not-started', marks: '', totalMarks: '' }); setEditId(null); setShowModal(false); };

  const startEdit = (exam) => { setForm({ subjectId: exam.subjectId, type: exam.type, date: exam.date, syllabus: exam.syllabus || '', revisionStatus: exam.revisionStatus || 'not-started', marks: exam.marks || '', totalMarks: exam.totalMarks || '' }); setEditId(exam.id); setShowModal(true); };

  const getSubjectName = (id) => subjects.find((s) => s.id === id)?.name || 'Unknown';

  const revisionColors = { 'not-started': 'badge-red', 'in-progress': 'badge-yellow', 'completed': 'badge-green' };

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">📝 Exam Tracker</span></h1>
        <p>Track exams, revision status, and marks for semester {currentSemester}</p>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Exam</button>
        </div>
      </div>

      {semExams.length === 0 ? (
        <div className="empty-state">
          <FileText size={48} />
          <h3>No Exams Tracked</h3>
          <p>Add your upcoming exams to track revision and marks.</p>
          <button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Exam</button>
        </div>
      ) : (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Type</th>
                <th>Date</th>
                <th>Days Left</th>
                <th>Revision</th>
                <th>Marks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {semExams.map((exam, i) => {
                const days = daysUntil(exam.date);
                return (
                  <motion.tr key={exam.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{getSubjectName(exam.subjectId)}</td>
                    <td><span className="badge badge-purple">{exam.type}</span></td>
                    <td>{formatDate(exam.date)}</td>
                    <td>
                      {days !== null && (
                        <span style={{ color: days < 0 ? 'var(--accent-red)' : days < 7 ? 'var(--accent-yellow)' : 'var(--accent-green)', fontWeight: 600 }}>
                          {days < 0 ? 'Passed' : `${days} days`}
                        </span>
                      )}
                    </td>
                    <td><span className={`badge ${revisionColors[exam.revisionStatus] || 'badge-red'}`}>{exam.revisionStatus?.replace('-', ' ')}</span></td>
                    <td>{exam.marks != null ? `${exam.marks}/${exam.totalMarks}` : '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button className="btn-icon" onClick={() => startEdit(exam)}><Edit3 size={15} /></button>
                        <button className="btn-icon" onClick={() => deleteExam(exam.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showModal} onClose={resetForm} title={editId ? 'Edit Exam' : 'Add Exam'} size="lg">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Subject *</label>
              <select value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })} required>
                <option value="">Select subject</option>
                {semSubjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Exam Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="mid-sem">Mid Semester</option>
                <option value="end-sem">End Semester</option>
                <option value="quiz">Quiz</option>
                <option value="viva">Viva</option>
                <option value="practical">Practical</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date *</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Revision Status</label>
              <select value={form.revisionStatus} onChange={(e) => setForm({ ...form, revisionStatus: e.target.value })}>
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="form-group">
              <label>Marks Obtained</label>
              <input type="number" value={form.marks} onChange={(e) => setForm({ ...form, marks: e.target.value })} placeholder="e.g. 42" />
            </div>
            <div className="form-group">
              <label>Total Marks</label>
              <input type="number" value={form.totalMarks} onChange={(e) => setForm({ ...form, totalMarks: e.target.value })} placeholder="e.g. 50" />
            </div>
            <div className="form-group full-width">
              <label>Syllabus / Topics</label>
              <textarea value={form.syllabus} onChange={(e) => setForm({ ...form, syllabus: e.target.value })} placeholder="Topics covered in this exam..." rows={3} />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>
            <button type="submit" className="btn-primary"><Check size={16} /> {editId ? 'Update' : 'Add Exam'}</button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
