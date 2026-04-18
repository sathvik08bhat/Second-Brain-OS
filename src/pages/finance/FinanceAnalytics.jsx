import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Target, AlertTriangle } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import { useFinanceStore } from '../../store/financeStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend } from 'recharts';

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#3b82f6', '#f97316', '#22d3ee', '#a855f7'];

export default function FinanceAnalytics() {
  const { getCategoryBreakdown, getMonthlyTrend, getBudgetStatus, setBudget, removeBudget, SPENDING_CATEGORIES } = useFinanceStore();
  const [timeRange, setTimeRange] = useState(6);
  const [newBudget, setNewBudget] = useState({ category: 'Food & Dining', amount: '' });

  const expenseBreakdown = getCategoryBreakdown('expense', timeRange);
  const incomeBreakdown = getCategoryBreakdown('income', timeRange);
  const monthlyTrend = getMonthlyTrend(timeRange);
  const budgetStatus = getBudgetStatus();

  const handleAddBudget = () => {
    if (!newBudget.amount) return;
    setBudget(newBudget.category, newBudget.amount);
    setNewBudget({ ...newBudget, amount: '' });
  };

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">📊 Finance Analytics</span></h1>
        <p>Deep dive into your spending patterns and budget adherence</p>
        <div className="header-actions">
          <select value={timeRange} onChange={e => setTimeRange(Number(e.target.value))} style={{ width: 160 }}>
            <option value={1}>Last Month</option>
            <option value={3}>Last 3 Months</option>
            <option value={6}>Last 6 Months</option>
            <option value={12}>Last Year</option>
          </select>
        </div>
      </div>

      {/* Monthly Trend */}
      <motion.div className="glass-card" style={{ padding: '1.5rem', marginBottom: 'var(--space-xl)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><TrendingUp size={18} /> Income vs Expense Trend</h3>
        {monthlyTrend.some(m => m.income > 0 || m.expense > 0) ? (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#6b6b80', fontSize: 11 }} />
              <YAxis tick={{ fill: '#6b6b80', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '2px solid var(--border-primary)', borderRadius: 12, color: 'var(--text-primary)' }} />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="Income" />
              <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} name="Expense" />
              <Line type="monotone" dataKey="net" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} name="Net" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-state" style={{ padding: '2rem' }}><p>Add transactions to see trends</p></div>
        )}
      </motion.div>

      {/* Expense & Income Breakdown */}
      <div className="grid-2" style={{ marginBottom: 'var(--space-xl)' }}>
        <motion.div className="glass-card" style={{ padding: '1.5rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, marginBottom: '1rem' }}>💸 Expense Categories</h3>
          {expenseBreakdown.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={expenseBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                    {expenseBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '2px solid var(--border-primary)', borderRadius: 8, color: 'var(--text-primary)' }} formatter={(val) => `₹${val.toLocaleString('en-IN')}`} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ marginTop: '0.5rem' }}>
                {expenseBreakdown.map((item, i) => (
                  <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', fontSize: 'var(--font-xs)', borderBottom: '1px solid var(--border-primary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i % COLORS.length] }} />{item.name}
                    </span>
                    <span style={{ fontWeight: 700 }}>₹{item.value.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </>
          ) : <div className="empty-state" style={{ padding: '2rem' }}><p>No expenses yet</p></div>}
        </motion.div>

        <motion.div className="glass-card" style={{ padding: '1.5rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, marginBottom: '1rem' }}>💰 Income Sources</h3>
          {incomeBreakdown.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={incomeBreakdown} layout="vertical">
                  <XAxis type="number" tick={{ fill: '#6b6b80', fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" tick={{ fill: '#6b6b80', fontSize: 11 }} width={100} />
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '2px solid var(--border-primary)', borderRadius: 8, color: 'var(--text-primary)' }} formatter={(val) => `₹${val.toLocaleString('en-IN')}`} />
                  <Bar dataKey="value" fill="#10b981" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </>
          ) : <div className="empty-state" style={{ padding: '2rem' }}><p>No income recorded</p></div>}
        </motion.div>
      </div>

      {/* Budget Tracking */}
      <div className="section-title"><Target size={18} /> Budget vs Actual</div>
      <motion.div className="glass-card" style={{ padding: '1.5rem', marginBottom: 'var(--space-lg)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <select value={newBudget.category} onChange={e => setNewBudget({...newBudget, category: e.target.value})} style={{ width: 180 }}>
            {SPENDING_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="number" placeholder="Budget ₹" value={newBudget.amount} onChange={e => setNewBudget({...newBudget, amount: e.target.value})} style={{ width: 120 }} />
          <button className="btn-primary" onClick={handleAddBudget} style={{ padding: '0.5rem 1rem' }}>Set Budget</button>
        </div>

        {budgetStatus.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {budgetStatus.map(b => (
              <div key={b.category} style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 600, fontSize: 'var(--font-sm)' }}>
                    {b.percentage > 100 && <AlertTriangle size={14} style={{ color: 'var(--accent-red)', marginRight: '0.3rem' }} />}
                    {b.category}
                  </span>
                  <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
                    ₹{b.spent.toLocaleString('en-IN')} / ₹{b.budget.toLocaleString('en-IN')}
                    <button className="btn-icon" onClick={() => removeBudget(b.category)} style={{ marginLeft: '0.3rem' }}>×</button>
                  </span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: `${Math.min(b.percentage, 100)}%`, background: b.percentage > 100 ? 'linear-gradient(135deg, #ef4444, #f97316)' : b.percentage > 80 ? 'linear-gradient(135deg, #f59e0b, #f97316)' : 'var(--gradient-primary)' }} />
                </div>
                <div style={{ fontSize: 'var(--font-xs)', color: b.percentage > 100 ? 'var(--accent-red)' : 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                  {b.percentage}% used • ₹{Math.max(b.remaining, 0).toLocaleString('en-IN')} remaining
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: '1rem', fontSize: 'var(--font-sm)' }}>Set budgets for categories to track spending limits.</div>
        )}
      </motion.div>
    </PageWrapper>
  );
}
