import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Trash2, Edit3, Check } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useCatStore } from '../../store/catStore';
import { formatDate } from '../../utils/helpers';

export default function CatMocks() {
  const { mockTests, addMockTest, updateMockTest, deleteMockTest } = useCatStore();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', date: '', score: '', percentile: '', varcScore: '', dilrScore: '', qaScore: '', analysis: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form, score: Number(form.score), percentile: Number(form.percentile), varcScore: Number(form.varcScore), dilrScore: Number(form.dilrScore), qaScore: Number(form.qaScore) };
    if (editId) updateMockTest(editId, data); else addMockTest(data);
    resetForm();
  };
  const resetForm = () => { setForm({ name: '', date: '', score: '', percentile: '', varcScore: '', dilrScore: '', qaScore: '', analysis: '' }); setEditId(null); setShowModal(false); };
  const startEdit = (m) => { setForm({ name: m.name, date: m.date, score: m.score, percentile: m.percentile, varcScore: m.varcScore || '', dilrScore: m.dilrScore || '', qaScore: m.qaScore || '', analysis: m.analysis || '' }); setEditId(m.id); setShowModal(true); };

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">📝 Mock Tests</span></h1>
        <p>Log your CAT mock attempts, scores, and analysis</p>
        <div className="header-actions"><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Mock Test</button></div>
      </div>

      {mockTests.length === 0 ? (
        <div className="empty-state"><FileText size={48} /><h3>No Mocks Yet</h3><p>Record your mock tests to track your progression.</p><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add First Mock</button></div>
      ) : (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead><tr><th>Test Name</th><th>Date</th><th>Score</th><th>Percentile</th><th>VARC</th><th>DILR</th><th>QA</th><th>Actions</th></tr></thead>
            <tbody>
              {mockTests.map((mock, i) => (
                <motion.tr key={mock.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{mock.name}</td>
                  <td>{formatDate(mock.date)}</td>
                  <td style={{ fontWeight: 700, color: 'var(--accent-purple-light)' }}>{mock.score}</td>
                  <td style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{mock.percentile}%</td>
                  <td>{mock.varcScore}</td>
                  <td>{mock.dilrScore}</td>
                  <td>{mock.qaScore}</td>
                  <td><div style={{ display: 'flex', gap: '0.25rem' }}><button className="btn-icon" onClick={() => startEdit(mock)}><Edit3 size={15} /></button><button className="btn-icon" onClick={() => deleteMockTest(mock.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={15} /></button></div></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showModal} onClose={resetForm} title={editId ? 'Edit Mock' : 'Add Mock'} size="lg">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group"><label>Test Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. SIMCAT 1" /></div>
            <div className="form-group"><label>Date *</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></div>
            <div className="form-group"><label>Total Score *</label><input type="number" value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} required /></div>
            <div className="form-group"><label>Percentile *</label><input type="number" step="0.01" value={form.percentile} onChange={(e) => setForm({ ...form, percentile: e.target.value })} required /></div>
            <div className="form-group"><label>VARC Score</label><input type="number" value={form.varcScore} onChange={(e) => setForm({ ...form, varcScore: e.target.value })} /></div>
            <div className="form-group"><label>DILR Score</label><input type="number" value={form.dilrScore} onChange={(e) => setForm({ ...form, dilrScore: e.target.value })} /></div>
            <div className="form-group"><label>QA Score</label><input type="number" value={form.qaScore} onChange={(e) => setForm({ ...form, qaScore: e.target.value })} /></div>
            <div className="form-group full-width"><label>Analysis Notes</label><textarea value={form.analysis} onChange={(e) => setForm({ ...form, analysis: e.target.value })} rows={3} placeholder="What went wrong? What went well?" /></div>
          </div>
          <div className="modal-actions"><button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button><button type="submit" className="btn-primary"><Check size={16} /> {editId ? 'Update' : 'Add'}</button></div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
