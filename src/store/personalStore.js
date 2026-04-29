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
  orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export const usePersonalStore = create((set, get) => ({
  journalEntries: [],
  habits: [],
  habitLogs: [],
  books: [],
  goals: [],
  affirmations: [],
  meditationLogs: [],
  activeEmail: null,
  isLoading: false,
  unsubscribes: [],

  // ── Sync Engine ──
  startRealtimeSync: (userEmail) => {
    if (!userEmail) return;
    set({ activeEmail: userEmail });
    
    // Clear existing
    get().unsubscribes.forEach(unsub => unsub());
    set({ isLoading: true });

    const collections = [
      { name: 'journalEntries', path: 'journalEntries', sort: 'createdAt' },
      { name: 'habits', path: 'habits', sort: 'createdAt' },
      { name: 'habitLogs', path: 'habitLogs', sort: 'date' },
      { name: 'books', path: 'books', sort: 'createdAt' },
      { name: 'goals', path: 'goals', sort: 'createdAt' },
      { name: 'affirmations', path: 'affirmations', sort: 'createdAt' },
      { name: 'meditationLogs', path: 'meditationLogs', sort: 'createdAt' },
    ];

    const unsubs = collections.map(col => {
      const colRef = collection(db, 'users', userEmail, col.path);
      const q = query(colRef, orderBy(col.sort, 'desc'));
      
      return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
        }));
        set({ [col.name]: data });
      });
    });

    set({ unsubscribes: unsubs, isLoading: false });
  },

  stopRealtimeSync: () => {
    get().unsubscribes.forEach(unsub => unsub());
    set({ unsubscribes: [] });
  },

  // ── Journal Actions ──
  addJournalEntry: async (e) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    const colRef = collection(db, 'users', activeEmail, 'journalEntries');
    await addDoc(colRef, {
      mood: 'neutral',
      ...e,
      createdAt: serverTimestamp(),
    });
  },
  updateJournalEntry: async (id, u) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    const docRef = doc(db, 'users', activeEmail, 'journalEntries', id);
    await updateDoc(docRef, u);
  },
  deleteJournalEntry: async (id) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    const docRef = doc(db, 'users', activeEmail, 'journalEntries', id);
    await deleteDoc(docRef);
  },

  // ── Habits Actions ──
  addHabit: async (h) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    const colRef = collection(db, 'users', activeEmail, 'habits');
    await addDoc(colRef, {
      streak: 0,
      ...h,
      createdAt: serverTimestamp(),
    });
  },
  updateHabit: async (id, u) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    const docRef = doc(db, 'users', activeEmail, 'habits', id);
    await updateDoc(docRef, u);
  },
  deleteHabit: async (id) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    const docRef = doc(db, 'users', activeEmail, 'habits', id);
    await deleteDoc(docRef);
  },

  // ── Habit Logs Actions ──
  toggleHabitLog: async (habitId, date) => {
    const { activeEmail, habitLogs } = get();
    if (!activeEmail) return;
    const existing = habitLogs.find((l) => l.habitId === habitId && l.date === date);
    if (existing) {
      const docRef = doc(db, 'users', activeEmail, 'habitLogs', existing.id);
      await deleteDoc(docRef);
    } else {
      const colRef = collection(db, 'users', activeEmail, 'habitLogs');
      await addDoc(colRef, { habitId, date, completed: true });
    }
  },

  // ── Books Actions ──
  addBook: async (b) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    const colRef = collection(db, 'users', activeEmail, 'books');
    await addDoc(colRef, {
      status: 'to-read',
      progress: 0,
      ...b,
      createdAt: serverTimestamp(),
    });
  },
  updateBook: async (id, u) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    const docRef = doc(db, 'users', activeEmail, 'books', id);
    await updateDoc(docRef, u);
  },
  deleteBook: async (id) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    const docRef = doc(db, 'users', activeEmail, 'books', id);
    await deleteDoc(docRef);
  },

  // ── Goals Actions ──
  addGoal: async (g) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    const colRef = collection(db, 'users', activeEmail, 'goals');
    await addDoc(colRef, {
      progress: 0,
      status: 'active',
      ...g,
      createdAt: serverTimestamp(),
    });
  },
  updateGoal: async (id, u) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    const docRef = doc(db, 'users', activeEmail, 'goals', id);
    await updateDoc(docRef, u);
  },
  deleteGoal: async (id) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    const docRef = doc(db, 'users', activeEmail, 'goals', id);
    await deleteDoc(docRef);
  },

  // ── Affirmations Actions ──
  addAffirmation: async (a) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    const colRef = collection(db, 'users', activeEmail, 'affirmations');
    await addDoc(colRef, {
      ...a,
      createdAt: serverTimestamp(),
    });
  },
  deleteAffirmation: async (id) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    const docRef = doc(db, 'users', activeEmail, 'affirmations', id);
    await deleteDoc(docRef);
  },

  // ── Meditation Actions ──
  addMeditationLog: async (m) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    const colRef = collection(db, 'users', activeEmail, 'meditationLogs');
    await addDoc(colRef, {
      ...m,
      createdAt: serverTimestamp(),
    });
  },
  deleteMeditationLog: async (id) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    const docRef = doc(db, 'users', activeEmail, 'meditationLogs', id);
    await deleteDoc(docRef);
  },
}));
