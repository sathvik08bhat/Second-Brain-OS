import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '../utils/helpers';

const SPENDING_CATEGORIES = [
  'Food & Dining', 'Transport', 'Shopping', 'Bills & Utilities',
  'Entertainment', 'Health & Medical', 'Education', 'Rent & Housing',
  'Subscriptions', 'Personal Care', 'Gifts & Donations', 'Investments',
  'Savings', 'EMI & Loans', 'Recharge & Top-up', 'Travel', 'Other'
];

const INCOME_CATEGORIES = [
  'Salary', 'Freelance', 'Allowance', 'Scholarship', 'Gift',
  'Refund', 'Interest', 'Investment Returns', 'Side Hustle', 'Other'
];

export const useFinanceStore = create(
  persist(
    (set, get) => ({
      accounts: [
        { id: 'bank', name: 'Main Bank Account', type: 'bank', balance: 0, color: '#3b82f6', icon: 'bank' },
        { id: 'cash', name: 'Cash Wallet', type: 'cash', balance: 0, color: '#10b981', icon: 'wallet' },
        { id: 'upi', name: 'UPI (GPay/PhonePe)', type: 'upi', balance: 0, color: '#8b5cf6', icon: 'smartphone' }
      ],
      transactions: [],
      budgets: {},           // { 'Food & Dining': 5000, 'Transport': 2000, ... }
      savingsGoals: [],      // [{ id, name, targetAmount, currentAmount, deadline, color }]
      recurringTransactions: [], // [{ id, title, amount, type, category, accountId, frequency, nextDate }]
      emis: [],              // [{ id, name, totalAmount, emiAmount, paidCount, totalCount, startDate, accountId }]

      // ── Accounts ──
      addAccount: (acc) => set((state) => ({
        accounts: [...state.accounts, { id: generateId(), balance: 0, color: '#6b7280', icon: 'wallet', ...acc }]
      })),

      updateAccount: (id, updates) => set((state) => ({
        accounts: state.accounts.map(a => a.id === id ? { ...a, ...updates } : a)
      })),

      deleteAccount: (id) => set((state) => ({
        accounts: state.accounts.filter(a => a.id !== id),
        transactions: state.transactions.filter(t => t.accountId !== id)
      })),

      // ── Transactions ──
      addTransaction: (tx) => set((state) => {
        const amount = Number(tx.amount);
        const newTx = {
          id: generateId(),
          createdAt: new Date().toISOString(),
          date: new Date().toISOString().split('T')[0],
          category: 'Other',
          note: '',
          linkedTaskId: null,
          tags: [],
          ...tx,
          amount
        };

        const updatedAccounts = state.accounts.map(acc => {
          if (acc.id === tx.accountId) {
            return {
              ...acc,
              balance: acc.balance + (tx.type === 'income' ? amount : -amount)
            };
          }
          return acc;
        });

        return {
          transactions: [...state.transactions, newTx],
          accounts: updatedAccounts
        };
      }),

      deleteTransaction: (id) => set((state) => {
        const tx = state.transactions.find(t => t.id === id);
        if (!tx) return state;

        const amount = Number(tx.amount);
        const updatedAccounts = state.accounts.map(acc => {
          if (acc.id === tx.accountId) {
            return {
              ...acc,
              balance: acc.balance + (tx.type === 'income' ? -amount : amount)
            };
          }
          return acc;
        });

        return {
          transactions: state.transactions.filter(t => t.id !== id),
          accounts: updatedAccounts
        };
      }),

      // ── Budgets ──
      setBudget: (category, amount) => set((state) => ({
        budgets: { ...state.budgets, [category]: Number(amount) }
      })),

      removeBudget: (category) => set((state) => {
        const newBudgets = { ...state.budgets };
        delete newBudgets[category];
        return { budgets: newBudgets };
      }),

      // ── Savings Goals ──
      addSavingsGoal: (goal) => set((state) => ({
        savingsGoals: [...state.savingsGoals, { id: generateId(), currentAmount: 0, color: '#10b981', createdAt: new Date().toISOString(), ...goal }]
      })),

      updateSavingsGoal: (id, updates) => set((state) => ({
        savingsGoals: state.savingsGoals.map(g => g.id === id ? { ...g, ...updates } : g)
      })),

      deleteSavingsGoal: (id) => set((state) => ({
        savingsGoals: state.savingsGoals.filter(g => g.id !== id)
      })),

      contributeSavings: (id, amount) => set((state) => ({
        savingsGoals: state.savingsGoals.map(g =>
          g.id === id ? { ...g, currentAmount: g.currentAmount + Number(amount) } : g
        )
      })),

      // ── Recurring Transactions ──
      addRecurring: (rec) => set((state) => ({
        recurringTransactions: [...state.recurringTransactions, { id: generateId(), createdAt: new Date().toISOString(), frequency: 'monthly', ...rec }]
      })),

      deleteRecurring: (id) => set((state) => ({
        recurringTransactions: state.recurringTransactions.filter(r => r.id !== id)
      })),

      // ── EMIs ──
      addEMI: (emi) => set((state) => ({
        emis: [...state.emis, { id: generateId(), paidCount: 0, createdAt: new Date().toISOString(), ...emi }]
      })),

      payEMI: (id) => set((state) => ({
        emis: state.emis.map(e => e.id === id ? { ...e, paidCount: e.paidCount + 1 } : e)
      })),

      deleteEMI: (id) => set((state) => ({
        emis: state.emis.filter(e => e.id !== id)
      })),

      // ── Analytics Helpers ──
      getTotalBalance: () => {
        return get().accounts.reduce((sum, acc) => sum + acc.balance, 0);
      },

      getMonthlyData: (year, month) => {
        const txs = get().transactions.filter(t => {
          const d = new Date(t.date);
          return d.getFullYear() === year && d.getMonth() === month;
        });
        const income = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const expense = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        return { income, expense, net: income - expense, transactions: txs };
      },

      getCategoryBreakdown: (type = 'expense', months = 1) => {
        const cutoff = new Date();
        cutoff.setMonth(cutoff.getMonth() - months);
        const txs = get().transactions.filter(t => t.type === type && new Date(t.date) >= cutoff);
        const breakdown = {};
        txs.forEach(t => {
          breakdown[t.category] = (breakdown[t.category] || 0) + t.amount;
        });
        return Object.entries(breakdown).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
      },

      getMonthlyTrend: (months = 6) => {
        const result = [];
        const now = new Date();
        for (let i = months - 1; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const data = get().getMonthlyData(d.getFullYear(), d.getMonth());
          result.push({
            month: d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
            income: data.income,
            expense: data.expense,
            net: data.net
          });
        }
        return result;
      },

      getBudgetStatus: () => {
        const now = new Date();
        const txs = get().transactions.filter(t => {
          const d = new Date(t.date);
          return t.type === 'expense' && d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
        });
        const budgets = get().budgets;
        return Object.entries(budgets).map(([category, budget]) => {
          const spent = txs.filter(t => t.category === category).reduce((s, t) => s + t.amount, 0);
          return { category, budget, spent, remaining: budget - spent, percentage: budget > 0 ? Math.round((spent / budget) * 100) : 0 };
        });
      },

      SPENDING_CATEGORIES,
      INCOME_CATEGORIES,
    }),
    { name: 'finance-store' }
  )
);
