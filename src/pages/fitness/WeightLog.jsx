import { useState } from 'react';
import { motion } from 'framer-motion';
import { Scale, Plus, Trash2, Check } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useFitnessStore } from '../../store/fitnessStore';
import { formatDateShort } from '../../utils/helpers';

export default function WeightLog() {
  const { weightLogs, addWeightLog, deleteWeightLog, targetWeight } = useFitnessStore();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], weight: '', bodyFat: '' });

  const handleSubmit = (e) => { e.preventDefault(); addWeightLog({ ...form, weight: Number(form.weight), bodyFat: form.bodyFat ? Number(form.bodyFat) : null }); setShowModal(false); setForm({ ...form, weight: '', bodyFat: '' }); };

  const chartData = [...weightLogs].sort((a,b) => new Date(a.date) - new Date(b.date)).map(w => ({ ...w, displayDate: formatDateShort(w.date) }));
  const yMin = chartData.length ? Math.min(targetWeight - 2, Math.min(...chartData.map(d => d.weight)) - 2) : 70;
  const yMax = chartData.length ? Math.max(...chartData.map(d => d.weight)) + 2 : 95;

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">⚖️ Weight Log</span></h1>
        <p>Track your daily weigh-ins — journey to {targetWeight}kg</p>
        <div className="header-actions"><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Log Weight</button></div>
      </div>

      {chartData.length > 0 && (
        <motion.div className="glass-card" style={{ padding: '1.5rem', marginBottom: 'var(--space-xl)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>Weight Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="displayDate" tick={{ fill: '#6b6b80', fontSize: 12 }} />
              <YAxis domain={[yMin, yMax]} tick={{ fill: '#6b6b80', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#13131d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f0f0f5' }} />
              <ReferenceLine y={targetWeight} label={{ position: 'top', value: `Goal (${targetWeight}kg)`, fill: '#10b981', fontSize: 12 }} stroke="#10b981" strokeDasharray="3 3" />
              <Line type="monotone" dataKey="weight" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {weightLogs.length === 0 ? (
        <div className="empty-state"><Scale size={48} /><h3>No Weigh-ins</h3><p>Record your first weight measurement to start the chart.</p></div>
      ) : (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead><tr><th>Date</th><th>Weight (kg)</th><th>Body Fat (%)</th><th>Trend</th><th>Actions</th></tr></thead>
            <tbody>
              {chartData.reverse().map((log, i) => {
                const prev = chartData[i+1];
                const diff = prev ? log.weight - prev.weight : 0;
                return (
                  <motion.tr key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                    <td>{log.displayDate}</td>
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{log.weight}</td>
                    <td>{log.bodyFat ? `${log.bodyFat}%` : '—'}</td>
                    <td>
                      {diff === 0 ? <span style={{ color: 'var(--text-muted)' }}>—</span> :
                       diff > 0 ? <span style={{ color: 'var(--accent-red)' }}>+{diff.toFixed(1)}</span> :
                       <span style={{ color: 'var(--accent-green)' }}>{diff.toFixed(1)}</span>}
                    </td>
                    <td><button className="btn-icon" onClick={() => deleteWeightLog(log.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={15} /></button></td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Log Weight">
        <form onSubmit={handleSubmit}>
          <div className="form-grid cols-1">
            <div className="form-group"><label>Date *</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></div>
            <div className="form-group"><label>Weight (kg) *</label><input type="number" step="0.1" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} required autoFocus /></div>
            <div className="form-group"><label>Body Fat % (Optional)</label><input type="number" step="0.1" value={form.bodyFat} onChange={(e) => setForm({ ...form, bodyFat: e.target.value })} /></div>
          </div>
          <div className="modal-actions"><button type="submit" className="btn-primary"><Check size={16} /> Save</button></div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
