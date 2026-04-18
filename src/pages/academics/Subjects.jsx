import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Trash2, Edit3, X, Check } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useAcademicStore } from '../../store/academicStore';
import { gradePoints } from '../../utils/helpers';

export default function Subjects() {
  const { subjects, addSubject, updateSubject, deleteSubject, currentSemester, setCurrentSemester } = useAcademicStore();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', code: '', credits: '', type: 'theory', semester: currentSemester, grade: '', gradePoint: '' });

  const semSubjects = subjects.filter((s) => s.semester === currentSemester);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...form,
      credits: Number(form.credits),
      semester: Number(form.semester),
      gradePoint: form.grade ? gradePoints[form.grade] || 0 : null,
    };
    if (editId) {
      updateSubject(editId, data);
    } else {
      addSubject(data);
    }
    resetForm();
  };

  const resetForm = () => {
    setForm({ name: '', code: '', credits: '', type: 'theory', semester: currentSemester, grade: '', gradePoint: '' });
    setEditId(null);
    setShowModal(false);
  };

  const startEdit = (subj) => {
    setForm({ name: subj.name, code: subj.code || '', credits: subj.credits, type: subj.type || 'theory', semester: subj.semester, grade: subj.grade || '', gradePoint: subj.gradePoint || '' });
    setEditId(subj.id);
    setShowModal(true);
  };

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">📖 Subject Database</span></h1>
        <p>All subjects linked to exams, assignments, and attendance trackers</p>
        <div className="header-actions">
          <select value={currentSemester} onChange={(e) => setCurrentSemester(Number(e.target.value))} style={{ width: 160 }}>
            {[1,2,3,4,5,6,7,8].map((s) => <option key={s} value={s}>Semester {s}</option>)}
          </select>
          <button className="btn-primary" onClick={() => { setForm({ ...form, semester: currentSemester }); setShowModal(true); }}>
            <Plus size={16} /> Add Subject
          </button>
        </div>
      </div>

      {semSubjects.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={48} />
          <h3>No Subjects Yet</h3>
          <p>Add subjects for Semester {currentSemester} to start tracking your academics.</p>
          <button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add First Subject</button>
        </div>
      ) : (
        <div className="glass-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Code</th>
                  <th>Credits</th>
                  <th>Type</th>
                  <th>Grade</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {semSubjects.map((subj, i) => (
                  <motion.tr key={subj.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{subj.name}</td>
                    <td><span className="badge badge-purple">{subj.code || '—'}</span></td>
                    <td>{subj.credits}</td>
                    <td><span className={`badge ${subj.type === 'lab' ? 'badge-cyan' : 'badge-blue'}`}>{subj.type}</span></td>
                    <td>
                      {subj.grade ? (
                        <span className={`badge ${subj.grade === 'F' ? 'badge-red' : 'badge-green'}`}>{subj.grade} ({subj.gradePoint})</span>
                      ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button className="btn-icon" onClick={() => startEdit(subj)}><Edit3 size={15} /></button>
                        <button className="btn-icon" onClick={() => deleteSubject(subj.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={showModal} onClose={resetForm} title={editId ? 'Edit Subject' : 'Add Subject'}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Subject Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Power Systems" required />
            </div>
            <div className="form-group">
              <label>Subject Code</label>
              <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g. EEE301" />
            </div>
            <div className="form-group">
              <label>Credits *</label>
              <input type="number" value={form.credits} onChange={(e) => setForm({ ...form, credits: e.target.value })} placeholder="e.g. 4" required min="1" max="12" />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="theory">Theory</option>
                <option value="lab">Lab</option>
                <option value="project">Project</option>
                <option value="elective">Elective</option>
              </select>
            </div>
            <div className="form-group">
              <label>Semester</label>
              <select value={form.semester} onChange={(e) => setForm({ ...form, semester: Number(e.target.value) })}>
                {[1,2,3,4,5,6,7,8].map((s) => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Grade (if available)</label>
              <select value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value, gradePoint: gradePoints[e.target.value] || '' })}>
                <option value="">Not graded yet</option>
                {Object.keys(gradePoints).map((g) => <option key={g} value={g}>{g} ({gradePoints[g]})</option>)}
              </select>
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>
            <button type="submit" className="btn-primary"><Check size={16} /> {editId ? 'Update' : 'Add Subject'}</button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
