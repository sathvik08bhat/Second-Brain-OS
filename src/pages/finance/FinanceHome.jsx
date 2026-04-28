import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, CreditCard, PiggyBank, ArrowRight, Plus, DollarSign, BarChart3, Receipt, Target } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import StatsCard from '../../components/shared/StatsCard';
import Modal from '../../components/shared/Modal';
import { useFinanceStore } from '../../store/financeStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const CHART_COLORS = ['var(--accent-primary)', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#3b82f6', '#f97316', '#22d3ee', '#a855f7'];

export default function FinanceHome() {
  const { accounts, transactions, getTotalBalance, getCategoryBreakdown, getMonthlyTrend, savingsGoals, addTransaction, SPENDING_CATEGORIES, INCOME_CATEGORIES } = useFinanceStore();
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickTx, setQuickTx] = useState({ title: '', amount: '', type: 'expense', category: 'Food & Dining', accountId: 'bank', note: '' });

  const totalBalance = getTotalBalance();
  const monthlyTrend = getMonthlyTrend(6);
  const expenseBreakdown = getCategoryBreakdown('expense', 1);
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const recentTxs = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);

  const handleQuickAdd = () => {
    if (!quickTx.title || !quickTx.amount) return;
    addTransaction(quickTx);
    setQuickTx({ title: '', amount: '', type: 'expense', category: 'Food & Dining', accountId: 'bank', note: '' });
    setShowQuickAdd(false);
  };

  const subPages = [
    { path: '/finance/accounts', icon: CreditCard, title: 'Accounts', desc: 'Manage bank, cash, UPI accounts', color: '#3b82f6' },
    { path: '/finance/transactions', icon: Receipt, title: 'Transactions', desc: 'Statement & transaction history', color: '#10b981' },
    { path: '/finance/analytics', icon: BarChart3, title: 'Analytics', desc: 'Spending graphs & budget tracking', color: 'var(--accent-primary)' },
    { path: '/finance/savings', icon: Target, title: 'Savings Goals', desc: 'Track savings targets & EMIs', color: '#f59e0b' },
  ];

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">💰 Personal Finance</span></h1>
        <p>Track every rupee — accounts, spending, savings, and budgets</p>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setShowQuickAdd(true)}><Plus size={16} /> Add Transaction</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-xl)' }}>
        <StatsCard icon={Wallet} label="Total Balance" value={`₹${totalBalance.toLocaleString('en-IN')}`} subtitle="All accounts" color="var(--accent-primary)" />
        <StatsCard icon={TrendingUp} label="Total Income" value={`₹${totalIncome.toLocaleString('en-IN')}`} subtitle="All time" color="#10b981" delay={0.1} />
        <StatsCard icon={TrendingDown} label="Total Expenses" value={`₹${totalExpense.toLocaleString('en-IN')}`} subtitle="All time" color="#ef4444" delay={0.2} />
        <StatsCard icon={PiggyBank} label="Savings Goals" value={savingsGoals.length} subtitle="Active targets" color="#f59e0b" delay={0.3} />
      </div>

      {/* Charts */}
      <div className="grid-2" style={{ marginBottom: 'var(--space-xl)' }}>
        {/* Monthly Trend */}
        <motion.div className="glass-card" style={{ padding: '1.5rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, marginBottom: '1rem' }}>Monthly Income vs Expenses</h3>
          {monthlyTrend.some(m => m.income > 0 || m.expense > 0) ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#6b6b80', fontSize: 11 }} />
                <YAxis tick={{ fill: '#6b6b80', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '2px solid var(--border-primary)', borderRadius: 12, color: 'var(--text-primary)', boxShadow: '4px 4px 0px var(--border-primary)' }} />
                <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} name="Income" />
                <Bar dataKey="expense" fill="#ef4444" radius={[6, 6, 0, 0]} name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: '2rem' }}><p>Add transactions to see trends</p></div>
          )}
        </motion.div>

        {/* Spending Breakdown */}
        <motion.div className="glass-card" style={{ padding: '1.5rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, marginBottom: '1rem' }}>Spending Breakdown</h3>
          {expenseBreakdown.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie data={expenseBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                    {expenseBreakdown.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '2px solid var(--border-primary)', borderRadius: 8, color: 'var(--text-primary)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1 }}>
                {expenseBreakdown.slice(0, 5).map((item, i) => (
                  <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.3rem 0', fontSize: 'var(--font-xs)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: CHART_COLORS[i] }} />
                      {item.name}
                    </span>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>₹{item.value.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '2rem' }}><p>No expenses recorded yet</p></div>
          )}
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <div className="section-title" style={{ marginBottom: 'var(--space-md)' }}>
        <Receipt size={18} /> Recent Transactions
      </div>
      <motion.div className="glass-card" style={{ padding: '1.5rem', marginBottom: 'var(--space-xl)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        {recentTxs.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {recentTxs.map(tx => (
              <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-primary)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--font-sm)' }}>{tx.title}</div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>{tx.category} • {tx.date}</div>
                </div>
                <span style={{ fontWeight: 700, color: tx.type === 'income' ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                  {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: '1rem' }}>No transactions yet. Add your first one!</div>
        )}
      </motion.div>

      {/* Sub-pages */}
      <div className="grid-auto">
        {subPages.map((page, i) => (
          <motion.div key={page.path} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.08 }}>
            <Link to={page.path} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', textDecoration: 'none', color: 'var(--text-primary)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: `${page.color}15`, color: page.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><page.icon size={22} /></div>
              <div style={{ flex: 1 }}><div style={{ fontWeight: 700 }}>{page.title}</div><div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>{page.desc}</div></div>
              <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Add Modal */}
      <Modal isOpen={showQuickAdd} onClose={() => setShowQuickAdd(false)} title="Add Transaction">
        <div className="form-grid">
          <div className="form-group full-width">
            <label>Title</label>
            <input value={quickTx.title} onChange={e => setQuickTx({...quickTx, title: e.target.value})} placeholder="e.g. Lunch at canteen" />
          </div>
          <div className="form-group">
            <label>Amount (₹)</label>
            <input type="number" value={quickTx.amount} onChange={e => setQuickTx({...quickTx, amount: e.target.value})} placeholder="500" />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select value={quickTx.type} onChange={e => setQuickTx({...quickTx, type: e.target.value, category: e.target.value === 'income' ? 'Salary' : 'Food & Dining'})}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={quickTx.category} onChange={e => setQuickTx({...quickTx, category: e.target.value})}>
              {(quickTx.type === 'expense' ? SPENDING_CATEGORIES : INCOME_CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Account</label>
            <select value={quickTx.accountId} onChange={e => setQuickTx({...quickTx, accountId: e.target.value})}>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div className="form-group full-width">
            <label>Note (optional)</label>
            <input value={quickTx.note} onChange={e => setQuickTx({...quickTx, note: e.target.value})} placeholder="Additional details..." />
          </div>
          <div className="form-group full-width" style={{ marginTop: '0.5rem' }}>
            <button className="btn-primary" onClick={handleQuickAdd} style={{ width: '100%', justifyContent: 'center' }}>Add Transaction</button>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
}
