import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation as PingPong, Plus, Trash2, Edit3, Check } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useHobbiesStore } from '../../store/hobbiesStore';
import { formatDateShort } from '../../utils/helpers';

export default function TableTennis() {
  const { ttMatches, addTTMatch, updateTTMatch, deleteTTMatch } = useHobbiesStore();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], opponent: '', myScore: '', opponentScore: '', result: 'win', notes: '' });

  const handleSubmit = (e) => { e.preventDefault(); if (editId) updateTTMatch(editId, { ...form, myScore: Number(form.myScore), opponentScore: Number(form.opponentScore) }); else addTTMatch({ ...form, myScore: Number(form.myScore), opponentScore: Number(form.opponentScore) }); resetForm(); };
  const resetForm = () => { setForm({ date: new Date().toISOString().split('T')[0], opponent: '', myScore: '', opponentScore: '', result: 'win', notes: '' }); setEditId(null); setShowModal(false); };
  const startEdit = (m) => { setForm({ date: m.date, opponent: m.opponent, myScore: m.myScore, opponentScore: m.opponentScore, result: m.result, notes: m.notes || '' }); setEditId(m.id); setShowModal(true); };

  const wins = ttMatches.filter(m => m.result === 'win').length;
  const losses = ttMatches.filter(m => m.result === 'loss').length;
  const winRate = ttMatches.length > 0 ? Math.round((wins / ttMatches.length) * 100) : 0;

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">🏓 Table Tennis</span></h1>
        <p>Match history, scores, and win rate tracker</p>
        <div className="header-actions"><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Log Match</button></div>
      </div>

      <div className="grid-3" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}><div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Total Matches</div><div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--accent-purple-light)' }}>{ttMatches.length}</div></div>
        <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}><div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Win/Loss</div><div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--text-primary)' }}><span style={{ color: 'var(--accent-green)' }}>{wins}</span> / <span style={{ color: 'var(--accent-red)' }}>{losses}</span></div></div>
        <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}><div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Win Rate</div><div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--accent-cyan)' }}>{winRate}%</div></div>
      </div>

      {ttMatches.length === 0 ? (
        <div className="empty-state"><PingPong size={48} /><h3>No Matches Logged</h3><p>Play a game and record your score.</p></div>
      ) : (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead><tr><th>Date</th><th>Opponent</th><th>Score</th><th>Result</th><th>Notes</th><th>Actions</th></tr></thead>
            <tbody>
              {ttMatches.sort((a,b) => new Date(b.date) - new Date(a.date)).map((m, i) => (
                <motion.tr key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                  <td>{formatDateShort(m.date)}</td>
                  <td style={{ fontWeight: 600 }}>{m.opponent}</td>
                  <td style={{ letterSpacing: '1px', fontWeight: 700 }}>{m.myScore} - {m.opponentScore}</td>
                  <td><span className={`badge ${m.result === 'win' ? 'badge-green' : 'badge-red'}`} style={{ textTransform: 'uppercase' }}>{m.result}</span></td>
                  <td><span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>{m.notes || '—'}</span></td>
                  <td><div style={{ display: 'flex', gap: '0.25rem' }}><button className="btn-icon" onClick={() => startEdit(m)}><Edit3 size={15} /></button><button className="btn-icon" onClick={() => deleteTTMatch(m.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={15} /></button></div></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showModal} onClose={resetForm} title={editId ? 'Edit Match' : 'Log Match'}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group"><label>Date *</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></div>
            <div className="form-group"><label>Opponent *</label><input value={form.opponent} onChange={(e) => setForm({ ...form, opponent: e.target.value })} required /></div>
            <div className="form-group"><label>My Score *</label><input type="number" min="0" value={form.myScore} onChange={(e) => setForm({ ...form, myScore: e.target.value })} required /></div>
            <div className="form-group"><label>Opponent Score *</label><input type="number" min="0" value={form.opponentScore} onChange={(e) => setForm({ ...form, opponentScore: e.target.value })} required /></div>
            <div className="form-group"><label>Result</label><select value={form.result} onChange={(e) => setForm({ ...form, result: e.target.value })}><option value="win">Win</option><option value="loss">Loss</option></select></div>
            <div className="form-group full-width"><label>Notes</label><input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Tight game, backhand was weak..." /></div>
          </div>
          <div className="modal-actions"><button type="submit" className="btn-primary"><Check size={16} /> Save</button></div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
