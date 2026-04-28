import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Plus, Trash2, Edit3, Wallet, Smartphone, Building2, Banknote } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useFinanceStore } from '../../store/financeStore';

const accountTypeIcons = { bank: Building2, cash: Banknote, upi: Smartphone, credit: CreditCard, wallet: Wallet };
const accountTypeColors = { bank: '#3b82f6', cash: '#10b981', upi: 'var(--accent-primary)', credit: '#ef4444', wallet: '#f59e0b' };

export default function FinanceAccounts() {
  const { accounts, addAccount, updateAccount, deleteAccount } = useFinanceStore();
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', type: 'bank', balance: 0, color: '#3b82f6' });

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editId) {
      updateAccount(editId, form);
    } else {
      addAccount({ ...form, balance: Number(form.balance) });
    }
    setForm({ name: '', type: 'bank', balance: 0, color: '#3b82f6' });
    setEditId(null);
    setShowAdd(false);
  };

  const startEdit = (acc) => {
    setForm({ name: acc.name, type: acc.type, balance: acc.balance, color: acc.color || '#3b82f6' });
    setEditId(acc.id);
    setShowAdd(true);
  };

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">💳 Accounts</span></h1>
        <p>Manage your bank accounts, wallets, and UPI</p>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => { setEditId(null); setForm({ name: '', type: 'bank', balance: 0, color: '#3b82f6' }); setShowAdd(true); }}><Plus size={16} /> Add Account</button>
        </div>
      </div>

      {/* Total Balance Card */}
      <motion.div className="glass-card" style={{ padding: '2rem', textAlign: 'center', marginBottom: 'var(--space-xl)' }} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Net Worth</div>
        <div style={{ fontSize: '3.5rem', fontWeight: 900, background: totalBalance >= 0 ? 'linear-gradient(135deg, #10b981, #06b6d4)' : 'linear-gradient(135deg, #ef4444, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          ₹{totalBalance.toLocaleString('en-IN')}
        </div>
        <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Across {accounts.length} accounts</div>
      </motion.div>

      {/* Account Cards */}
      <div className="grid-3">
        {accounts.map((acc, i) => {
          const Icon = accountTypeIcons[acc.type] || Wallet;
          const color = acc.color || accountTypeColors[acc.type] || '#6b7280';
          return (
            <motion.div key={acc.id} className="glass-card" style={{ padding: '1.5rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: `${color}15`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--border-primary)', boxShadow: '2px 2px 0px var(--border-primary)' }}>
                  <Icon size={22} />
                </div>
                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  <button className="btn-icon" onClick={() => startEdit(acc)}><Edit3 size={14} /></button>
                  <button className="btn-icon" onClick={() => deleteAccount(acc.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={14} /></button>
                </div>
              </div>
              <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{acc.name}</div>
              <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: acc.balance >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                ₹{acc.balance.toLocaleString('en-IN')}
              </div>
              <div className="badge" style={{ marginTop: '0.5rem', background: `${color}15`, color: color }}>{acc.type.toUpperCase()}</div>
            </motion.div>
          );
        })}
      </div>

      <Modal isOpen={showAdd} onClose={() => { setShowAdd(false); setEditId(null); }} title={editId ? 'Edit Account' : 'Add Account'}>
        <div className="form-grid">
          <div className="form-group full-width">
            <label>Account Name</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. SBI Savings" />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
              <option value="bank">Bank Account</option>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="credit">Credit Card</option>
              <option value="wallet">E-Wallet</option>
            </select>
          </div>
          <div className="form-group">
            <label>Initial Balance (₹)</label>
            <input type="number" value={form.balance} onChange={e => setForm({...form, balance: e.target.value})} />
          </div>
          <div className="form-group full-width" style={{ marginTop: '0.5rem' }}>
            <button className="btn-primary" onClick={handleSave} style={{ width: '100%', justifyContent: 'center' }}>{editId ? 'Update' : 'Add'} Account</button>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
}
