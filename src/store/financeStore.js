import { create } from 'zustand';
import { 
  collection, 
  doc, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  query,
  orderBy,
  setDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';

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

export const useFinanceStore = create((set, get) => ({
  accounts: [],
  transactions: [],
  budgets: {},
  savingsGoals: [],
  recurringTransactions: [],
  emis: [],
  activeEmail: null,
  isLoading: false,
  unsubscribes: [],

  // ── Sync Engine ──
  startRealtimeSync: (userEmail) => {
    if (!userEmail) return;
    set({ activeEmail: userEmail });
    
    get().unsubscribes.forEach(unsub => unsub());
    set({ isLoading: true });

    const collections = [
      { name: 'accounts', path: 'accounts', sort: 'name', dir: 'asc' },
      { name: 'transactions', path: 'transactions', sort: 'date', dir: 'desc' },
      { name: 'savingsGoals', path: 'savingsGoals', sort: 'createdAt', dir: 'desc' },
      { name: 'emis', path: 'emis', sort: 'createdAt', dir: 'desc' },
    ];

    const unsubs = collections.map(col => {
      const colRef = collection(db, 'users', userEmail, col.path);
      const q = query(colRef, orderBy(col.sort, col.dir));
      
      return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        set({ [col.name]: data });
      });
    });

    // Sync Budgets (Single Doc)
    const budgetRef = doc(db, 'users', userEmail, 'financeMeta', 'budgets');
    const unsubBudgets = onSnapshot(budgetRef, (doc) => {
      if (doc.exists()) set({ budgets: doc.data() });
    });

    set({ unsubscribes: [...unsubs, unsubBudgets], isLoading: false });
  },

  stopRealtimeSync: () => {
    get().unsubscribes.forEach(unsub => unsub());
    set({ unsubscribes: [] });
  },

  // ── Accounts ──
  addAccount: async (acc) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    const colRef = collection(db, 'users', activeEmail, 'accounts');
    await addDoc(colRef, {
      name: acc.name || "New Account",
      type: acc.type || "bank",
      balance: Number(acc.balance) || 0,
      color: acc.color || "#3b82f6",
      icon: acc.icon || "wallet",
      createdAt: serverTimestamp()
    });
  },

  updateAccount: async (id, updates) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    const docRef = doc(db, 'users', activeEmail, 'accounts', id);
    await updateDoc(docRef, updates);
  },

  deleteAccount: async (id) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    const docRef = doc(db, 'users', activeEmail, 'accounts', id);
    await deleteDoc(docRef);
  },

  // ── Transactions ──
  addTransaction: async (tx) => {
    const { activeEmail, accounts } = get();
    if (!activeEmail) return;
    const colRef = collection(db, 'users', activeEmail, 'transactions');
    const amount = Number(tx.amount);
    
    await addDoc(colRef, {
      title: tx.title || "Untitled",
      amount: amount,
      type: tx.type || "expense",
      category: tx.category || "Other",
      accountId: tx.accountId,
      date: tx.date || new Date().toISOString().split('T')[0],
      note: tx.note || "",
      createdAt: serverTimestamp()
    });

    // Update account balance
    const account = accounts.find(a => a.id === tx.accountId);
    if (account) {
      const newBalance = account.balance + (tx.type === 'income' ? amount : -amount);
      await get().updateAccount(tx.accountId, { balance: newBalance });
    }
  },

  deleteTransaction: async (id) => {
    const { activeEmail, transactions, accounts } = get();
    if (!activeEmail) return;
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;

    // Revert account balance
    const account = accounts.find(a => a.id === tx.accountId);
    if (account) {
      const newBalance = account.balance + (tx.type === 'income' ? -tx.amount : tx.amount);
      await get().updateAccount(tx.accountId, { balance: newBalance });
    }

    const docRef = doc(db, 'users', activeEmail, 'transactions', id);
    await deleteDoc(docRef);
  },

  // ── Savings Goals ──
  addSavingsGoal: async (goal) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    const colRef = collection(db, 'users', activeEmail, 'savingsGoals');
    await addDoc(colRef, {
      ...goal,
      currentAmount: Number(goal.currentAmount) || 0,
      targetAmount: Number(goal.targetAmount) || 0,
      createdAt: serverTimestamp()
    });
  },

  // ── Budgets ──
  setBudget: async (category, amount) => {
    const { activeEmail, budgets } = get();
    if (!activeEmail) return;
    const docRef = doc(db, 'users', activeEmail, 'financeMeta', 'budgets');
    await setDoc(docRef, { ...budgets, [category]: Number(amount) });
  },

  // ── Helpers ──
  getTotalBalance: () => {
    return get().accounts.reduce((sum, acc) => sum + acc.balance, 0);
  },

  getMonthlyTrend: (months = 6) => {
    const txs = get().transactions;
    const result = [];
    const now = new Date();
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mStr = d.toISOString().substring(0, 7); // YYYY-MM
      const monthTxs = txs.filter(t => t.date.startsWith(mStr));
      const income = monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const expense = monthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      result.push({
        month: d.toLocaleDateString('en-IN', { month: 'short' }),
        income,
        expense
      });
    }
    return result;
  },

  getCategoryBreakdown: (type = 'expense') => {
    const txs = get().transactions.filter(t => t.type === type);
    const breakdown = {};
    txs.forEach(t => {
      breakdown[t.category] = (breakdown[t.category] || 0) + t.amount;
    });
    return Object.entries(breakdown).map(([name, value]) => ({ name, value }));
  },

  SPENDING_CATEGORIES,
  INCOME_CATEGORIES,
}));
