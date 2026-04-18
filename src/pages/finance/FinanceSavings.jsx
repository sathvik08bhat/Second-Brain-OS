import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, Trash2, TrendingUp, CreditCard } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useFinanceStore } from '../../store/financeStore';

export default function FinanceSavings() {
  const { savingsGoals, addSavingsGoal, contributeSavings, deleteSavingsGoal, emis, addEMI, payEMI, deleteEMI, recurringTransactions, addRecurring, deleteRecurring, accounts } = useFinanceStore();
  const [showGoal, setShowGoal] = useState(false);
  const [showEMI, setShowEMI] = useState(false);
  const [showRecurring, setShowRecurring] = useState(false);
  const [goalForm, setGoalForm] = useState({ name: '', targetAmount: '', deadline: '', color: '#10b981' });
  const [emiForm, setEmiForm] = useState({ name: '', totalAmount: '', emiAmount: '', totalCount: 12, startDate: '', accountId: '' });
  const [recForm, setRecForm] = useState({ title: '', amount: '', type: 'expense', category: 'Subscriptions', accountId: '', frequency: 'monthly' });
  const [contributeId, setContributeId] = useState(null);
  const [contributeAmt, setContributeAmt] = useState('');

  const handleAddGoal = () => {
    if (!goalForm.name || !goalForm.targetAmount) return;
    addSavingsGoal({ ...goalForm, targetAmount: Number(goalForm.targetAmount) });
    setGoalForm({ name: '', targetAmount: '', deadline: '', color: '#10b981' });
    setShowGoal(false);
  };

  const handleContribute = () => {
    if (!contributeAmt || !contributeId) return;
    contributeSavings(contributeId, Number(contributeAmt));
    setContributeId(null);
    setContributeAmt('');
  };

  const handleAddEMI = () => {
    if (!emiForm.name || !emiForm.emiAmount) return;
    addEMI({ ...emiForm, totalAmount: Number(emiForm.totalAmount), emiAmount: Number(emiForm.emiAmount), totalCount: Number(emiForm.totalCount) });
    setEmiForm({ name: '', totalAmount: '', emiAmount: '', totalCount: 12, startDate: '', accountId: '' });
    setShowEMI(false);
  };

  const handleAddRecurring = () => {
    if (!recForm.title || !recForm.amount) return;
    addRecurring({ ...recForm, amount: Number(recForm.amount) });
    setRecForm({ title: '', amount: '', type: 'expense', category: 'Subscriptions', accountId: '', frequency: 'monthly' });
    setShowRecurring(false);
  };

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">🎯 Savings, EMIs & Recurring</span></h1>
        <p>Track your savings targets, loan EMIs, and recurring payments</p>
      </div>

      {/* Savings Goals */}
      <div className="section-title" style={{ marginBottom: 'var(--space-md)' }}>
        <Target size={18} /> Savings Goals
        <button className="btn-primary" onClick={() => setShowGoal(true)} style={{ marginLeft: 'auto', fontSize: 'var(--font-xs)', padding: '0.4rem 0.8rem' }}><Plus size={14} /> Add Goal</button>
      </div>
      <div className="grid-2" style={{ marginBottom: 'var(--space-xl)' }}>
        {savingsGoals.length > 0 ? savingsGoals.map((goal, i) => {
          const pct = goal.targetAmount > 0 ? Math.round((goal.currentAmount / goal.targetAmount) * 100) : 0;
          return (
            <motion.div key={goal.id} className="glass-card" style={{ padding: '1.5rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <h4 style={{ fontWeight: 700 }}>{goal.name}</h4>
                <button className="btn-icon" onClick={() => deleteSavingsGoal(goal.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={14} /></button>
              </div>
              <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: goal.color || 'var(--accent-green)' }}>
                ₹{goal.currentAmount.toLocaleString('en-IN')} <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)', fontWeight: 400 }}>/ ₹{goal.targetAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="progress-bar-container" style={{ margin: '0.75rem 0' }}>
                <div className="progress-bar-fill" style={{ width: `${Math.min(pct, 100)}%`, background: pct >= 100 ? 'linear-gradient(135deg, #10b981, #06b6d4)' : `linear-gradient(135deg, ${goal.color || '#10b981'}, #06b6d4)` }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginBottom: '0.75rem' }}>
                <span>{pct}% complete</span>
                {goal.deadline && <span>Deadline: {goal.deadline}</span>}
              </div>
              {contributeId === goal.id ? (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="number" placeholder="Amount ₹" value={contributeAmt} onChange={e => setContributeAmt(e.target.value)} style={{ flex: 1 }} />
                  <button className="btn-primary" onClick={handleContribute} style={{ padding: '0.4rem 0.8rem' }}>Save</button>
                  <button className="btn-secondary" onClick={() => setContributeId(null)} style={{ padding: '0.4rem 0.6rem' }}>×</button>
                </div>
              ) : (
                <button className="btn-secondary" onClick={() => setContributeId(goal.id)} style={{ width: '100%', justifyContent: 'center' }}><Plus size={14} /> Add Money</button>
              )}
            </motion.div>
          );
        }) : <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)', gridColumn: '1 / -1' }}>No savings goals yet. Create one!</div>}
      </div>

      {/* EMIs */}
      <div className="section-title" style={{ marginBottom: 'var(--space-md)' }}>
        <CreditCard size={18} /> EMIs & Loans
        <button className="btn-primary" onClick={() => setShowEMI(true)} style={{ marginLeft: 'auto', fontSize: 'var(--font-xs)', padding: '0.4rem 0.8rem' }}><Plus size={14} /> Add EMI</button>
      </div>
      <div className="grid-auto" style={{ marginBottom: 'var(--space-xl)' }}>
        {emis.length > 0 ? emis.map((emi, i) => (
          <motion.div key={emi.id} className="glass-card" style={{ padding: '1.25rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 700 }}>{emi.name}</span>
              <button className="btn-icon" onClick={() => deleteEMI(emi.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={12} /></button>
            </div>
            <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>₹{emi.emiAmount?.toLocaleString('en-IN')}/month</div>
            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>{emi.paidCount}/{emi.totalCount} paid</div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${(emi.paidCount / emi.totalCount) * 100}%` }} />
            </div>
            <button className="btn-secondary" onClick={() => payEMI(emi.id)} style={{ width: '100%', justifyContent: 'center', marginTop: '0.75rem', fontSize: 'var(--font-xs)' }}>Mark Paid</button>
          </motion.div>
        )) : <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>No EMIs tracked</div>}
      </div>

      {/* Recurring */}
      <div className="section-title" style={{ marginBottom: 'var(--space-md)' }}>
        <TrendingUp size={18} /> Recurring Transactions
        <button className="btn-primary" onClick={() => setShowRecurring(true)} style={{ marginLeft: 'auto', fontSize: 'var(--font-xs)', padding: '0.4rem 0.8rem' }}><Plus size={14} /> Add Recurring</button>
      </div>
      <motion.div className="glass-card" style={{ padding: '1.5rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        {recurringTransactions.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {recurringTransactions.map(rec => (
              <div key={rec.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-primary)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--font-sm)' }}>{rec.title}</div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>{rec.category} • {rec.frequency}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, color: rec.type === 'income' ? 'var(--accent-green)' : 'var(--accent-red)' }}>₹{rec.amount?.toLocaleString('en-IN')}</span>
                  <button className="btn-icon" onClick={() => deleteRecurring(rec.id)}><Trash2 size={12} /></button>
                </div>
              </div>
            ))}
          </div>
        ) : <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '1rem' }}>No recurring transactions</div>}
      </motion.div>

      {/* Modals */}
      <Modal isOpen={showGoal} onClose={() => setShowGoal(false)} title="Add Savings Goal">
        <div className="form-grid">
          <div className="form-group full-width"><label>Goal Name</label><input value={goalForm.name} onChange={e => setGoalForm({...goalForm, name: e.target.value})} placeholder="e.g. Emergency Fund" /></div>
          <div className="form-group"><label>Target Amount (₹)</label><input type="number" value={goalForm.targetAmount} onChange={e => setGoalForm({...goalForm, targetAmount: e.target.value})} /></div>
          <div className="form-group"><label>Deadline</label><input type="date" value={goalForm.deadline} onChange={e => setGoalForm({...goalForm, deadline: e.target.value})} /></div>
          <div className="form-group full-width"><button className="btn-primary" onClick={handleAddGoal} style={{ width: '100%', justifyContent: 'center' }}>Create Goal</button></div>
        </div>
      </Modal>

      <Modal isOpen={showEMI} onClose={() => setShowEMI(false)} title="Add EMI">
        <div className="form-grid">
          <div className="form-group full-width"><label>Loan/EMI Name</label><input value={emiForm.name} onChange={e => setEmiForm({...emiForm, name: e.target.value})} placeholder="e.g. Laptop EMI" /></div>
          <div className="form-group"><label>Total Amount (₹)</label><input type="number" value={emiForm.totalAmount} onChange={e => setEmiForm({...emiForm, totalAmount: e.target.value})} /></div>
          <div className="form-group"><label>Monthly EMI (₹)</label><input type="number" value={emiForm.emiAmount} onChange={e => setEmiForm({...emiForm, emiAmount: e.target.value})} /></div>
          <div className="form-group"><label>Total Installments</label><input type="number" value={emiForm.totalCount} onChange={e => setEmiForm({...emiForm, totalCount: e.target.value})} /></div>
          <div className="form-group"><label>Start Date</label><input type="date" value={emiForm.startDate} onChange={e => setEmiForm({...emiForm, startDate: e.target.value})} /></div>
          <div className="form-group full-width"><button className="btn-primary" onClick={handleAddEMI} style={{ width: '100%', justifyContent: 'center' }}>Add EMI</button></div>
        </div>
      </Modal>

      <Modal isOpen={showRecurring} onClose={() => setShowRecurring(false)} title="Add Recurring Transaction">
        <div className="form-grid">
          <div className="form-group full-width"><label>Title</label><input value={recForm.title} onChange={e => setRecForm({...recForm, title: e.target.value})} placeholder="e.g. Netflix subscription" /></div>
          <div className="form-group"><label>Amount (₹)</label><input type="number" value={recForm.amount} onChange={e => setRecForm({...recForm, amount: e.target.value})} /></div>
          <div className="form-group"><label>Frequency</label>
            <select value={recForm.frequency} onChange={e => setRecForm({...recForm, frequency: e.target.value})}>
              <option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option>
            </select>
          </div>
          <div className="form-group full-width"><button className="btn-primary" onClick={handleAddRecurring} style={{ width: '100%', justifyContent: 'center' }}>Add Recurring</button></div>
        </div>
      </Modal>
    </PageWrapper>
  );
}
