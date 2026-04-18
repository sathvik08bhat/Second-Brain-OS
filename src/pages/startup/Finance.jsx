import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Plus, Trash2, Edit3, Check } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useStartupStore } from '../../store/startupStore';
import { formatDate } from '../../utils/helpers';

export default function Finance() {
  const { finances, addFinance, updateFinance, deleteFinance } = useStartupStore();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', amount: '', type: 'expense', category: 'software', date: '' });

  const handleSubmit = (e) => { e.preventDefault(); if (editId) updateFinance(editId, { ...form, amount: Number(form.amount) }); else addFinance({ ...form, amount: Number(form.amount) }); resetForm(); };
  const resetForm = () => { setForm({ title: '', amount: '', type: 'expense', category: 'software', date: '' }); setEditId(null); setShowModal(false); };
  const startEdit = (f) => { setForm({ title: f.title, amount: f.amount, type: f.type, category: f.category, date: f.date }); setEditId(f.id); setShowModal(true); };

  const totalIncome = finances.filter(f => f.type === 'income').reduce((s, f) => s + f.amount, 0);
  const totalExpense = finances.filter(f => f.type === 'expense').reduce((s, f) => s + f.amount, 0);
  const net = totalIncome - totalExpense;

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">💰 Finance Tracker</span></h1>
        <p>Monitor your startup income, expenses, and runway</p>
        <div className="header-actions"><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Transaction</button></div>
      </div>

      <div className="grid-3" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="glass-card" style={{ padding: '1.25rem', borderTop: '3px solid var(--accent-green)' }}><div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Income</div><div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--accent-green)' }}>₹{totalIncome}</div></div>
        <div className="glass-card" style={{ padding: '1.25rem', borderTop: '3px solid var(--accent-red)' }}><div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Expenses</div><div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--accent-red)' }}>₹{totalExpense}</div></div>
        <div className="glass-card" style={{ padding: '1.25rem', borderTop: `3px solid ${net >= 0 ? 'var(--accent-blue)' : 'var(--accent-red)'}` }}><div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Net Balance</div><div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: net >= 0 ? 'var(--text-primary)' : 'var(--accent-red)' }}>₹{net}</div></div>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead><tr><th>Date</th><th>Title</th><th>Category</th><th>Type</th><th>Amount</th><th>Actions</th></tr></thead>
          <tbody>
            {finances.sort((a,b) => new Date(b.date) - new Date(a.date)).map((f, i) => (
              <motion.tr key={f.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                <td>{formatDate(f.date)}</td>
                <td style={{ fontWeight: 600 }}>{f.title}</td>
                <td><span className="badge badge-purple">{f.category}</span></td>
                <td><span className={`badge ${f.type === 'income' ? 'badge-green' : 'badge-red'}`}>{f.type}</span></td>
                <td style={{ fontWeight: 700, color: f.type === 'income' ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                  {f.type === 'income' ? '+' : '-'}₹{f.amount}
                </td>
                <td><div style={{ display: 'flex', gap: '0.25rem' }}><button className="btn-icon" onClick={() => startEdit(f)}><Edit3 size={15} /></button><button className="btn-icon" onClick={() => deleteFinance(f.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={15} /></button></div></td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={resetForm} title={editId ? 'Edit Transaction' : 'Add Transaction'}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full-width"><label>Title *</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
            <div className="form-group"><label>Type</label><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="expense">Expense</option><option value="income">Income</option></select></div>
            <div className="form-group"><label>Amount (₹) *</label><input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required min="0" /></div>
            <div className="form-group"><label>Category</label><input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required placeholder="e.g. Software, Cloud, Freelance" /></div>
            <div className="form-group"><label>Date *</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></div>
          </div>
          <div className="modal-actions"><button type="submit" className="btn-primary"><Check size={16} /> Save</button></div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
