import { useState } from 'react';
import { motion } from 'framer-motion';
import { Receipt, Plus, Trash2, Filter, Search, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useFinanceStore } from '../../store/financeStore';
import { useTaskStore } from '../../store/taskStore';

export default function FinanceTransactions() {
  const { accounts, transactions, addTransaction, deleteTransaction, SPENDING_CATEGORIES, INCOME_CATEGORIES } = useFinanceStore();
  const { tasks } = useTaskStore();
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState({ type: 'all', account: 'all', category: 'all', search: '' });
  const [form, setForm] = useState({ title: '', amount: '', type: 'expense', category: 'Food & Dining', accountId: accounts[0]?.id || '', note: '', date: new Date().toISOString().split('T')[0], linkedTaskId: '' });

  const filtered = transactions
    .filter(t => filter.type === 'all' || t.type === filter.type)
    .filter(t => filter.account === 'all' || t.accountId === filter.account)
    .filter(t => filter.category === 'all' || t.category === filter.category)
    .filter(t => filter.search === '' || t.title.toLowerCase().includes(filter.search.toLowerCase()) || (t.note || '').toLowerCase().includes(filter.search.toLowerCase()))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleAdd = () => {
    if (!form.title || !form.amount) return;
    addTransaction(form);
    setForm({ title: '', amount: '', type: 'expense', category: 'Food & Dining', accountId: accounts[0]?.id || '', note: '', date: new Date().toISOString().split('T')[0], linkedTaskId: '' });
    setShowAdd(false);
  };

  const getAccountName = (id) => accounts.find(a => a.id === id)?.name || 'Unknown';

  const filteredIncome = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const filteredExpense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">📋 Transactions</span></h1>
        <p>Complete statement of all your financial activity</p>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={16} /> Add Transaction</button>
        </div>
      </div>

      {/* Summary Bar */}
      <motion.div className="glass-card" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-around', marginBottom: 'var(--space-lg)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Showing</div>
          <div style={{ fontWeight: 700 }}>{filtered.length} transactions</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Income</div>
          <div style={{ fontWeight: 700, color: 'var(--accent-green)' }}>+₹{filteredIncome.toLocaleString('en-IN')}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Expenses</div>
          <div style={{ fontWeight: 700, color: 'var(--accent-red)' }}>-₹{filteredExpense.toLocaleString('en-IN')}</div>
        </div>
      </motion.div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px', position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input value={filter.search} onChange={e => setFilter({...filter, search: e.target.value})} placeholder="Search transactions..." style={{ paddingLeft: '2rem' }} />
        </div>
        <select value={filter.type} onChange={e => setFilter({...filter, type: e.target.value})} style={{ width: 120 }}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select value={filter.account} onChange={e => setFilter({...filter, account: e.target.value})} style={{ width: 150 }}>
          <option value="all">All Accounts</option>
          {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </div>

      {/* Transactions List */}
      <motion.div className="glass-card" style={{ overflow: 'hidden' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        {filtered.length > 0 ? (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Account</th>
                  <th>Amount</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(tx => (
                  <tr key={tx.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>{tx.date}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{tx.title}</div>
                      {tx.note && <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{tx.note}</div>}
                      {tx.linkedTaskId && <span className="badge badge-purple" style={{ fontSize: '9px', marginTop: '2px' }}>🔗 Linked Task</span>}
                    </td>
                    <td><span className="badge badge-blue">{tx.category}</span></td>
                    <td style={{ fontSize: 'var(--font-xs)' }}>{getAccountName(tx.accountId)}</td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700, color: tx.type === 'income' ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                        {tx.type === 'income' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        ₹{tx.amount.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td><button className="btn-icon" onClick={() => deleteTransaction(tx.id)}><Trash2 size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state"><Receipt size={48} /><h3>No Transactions</h3><p>Add your first transaction to start tracking.</p></div>
        )}
      </motion.div>

      {/* Add Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Transaction" size="lg">
        <div className="form-grid">
          <div className="form-group full-width">
            <label>Title</label>
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="What was this for?" />
          </div>
          <div className="form-group">
            <label>Amount (₹)</label>
            <input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="0" />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value, category: e.target.value === 'income' ? 'Salary' : 'Food & Dining'})}>
              <option value="expense">Expense 🔻</option>
              <option value="income">Income 🔺</option>
            </select>
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              {(form.type === 'expense' ? SPENDING_CATEGORIES : INCOME_CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Account</label>
            <select value={form.accountId} onChange={e => setForm({...form, accountId: e.target.value})}>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Link to Task (optional)</label>
            <select value={form.linkedTaskId} onChange={e => setForm({...form, linkedTaskId: e.target.value})}>
              <option value="">None</option>
              {tasks.filter(t => !t.completed).map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
          </div>
          <div className="form-group full-width">
            <label>Note</label>
            <input value={form.note} onChange={e => setForm({...form, note: e.target.value})} placeholder="Additional details..." />
          </div>
          <div className="form-group full-width" style={{ marginTop: '0.5rem' }}>
            <button className="btn-primary" onClick={handleAdd} style={{ width: '100%', justifyContent: 'center' }}>Add Transaction</button>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
}
