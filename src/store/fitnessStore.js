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

export const useFitnessStore = create((set, get) => ({
  weightLogs: [],
  meals: [],
  workouts: [],
  cardioLogs: [],
  measurements: [],
  targetWeight: 0,
  currentWeight: 0,
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
      { name: 'weightLogs', path: 'weightLogs', sort: 'date', dir: 'desc' },
      { name: 'meals', path: 'meals', sort: 'date', dir: 'desc' },
      { name: 'workouts', path: 'workouts', sort: 'date', dir: 'desc' },
      { name: 'cardioLogs', path: 'cardioLogs', sort: 'date', dir: 'desc' },
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
        if (col.name === 'weightLogs' && data.length > 0) {
          set({ currentWeight: data[0].weight });
        }
      });
    });

    // Sync Goals
    const goalRef = doc(db, 'users', userEmail, 'fitnessMeta', 'goals');
    const unsubGoals = onSnapshot(goalRef, (doc) => {
      if (doc.exists()) set({ targetWeight: doc.data().targetWeight || 0 });
    });

    set({ unsubscribes: [...unsubs, unsubGoals], isLoading: false });
  },

  stopRealtimeSync: () => {
    get().unsubscribes.forEach(unsub => unsub());
    set({ unsubscribes: [] });
  },

  setTargetWeight: async (w) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    const docRef = doc(db, 'users', activeEmail, 'fitnessMeta', 'goals');
    await setDoc(docRef, { targetWeight: Number(w) }, { merge: true });
  },

  addWeightLog: async (w) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    const colRef = collection(db, 'users', activeEmail, 'weightLogs');
    await addDoc(colRef, {
      weight: Number(w.weight),
      date: w.date || new Date().toISOString().split('T')[0],
      createdAt: serverTimestamp()
    });
  },

  addWorkout: async (w) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    const colRef = collection(db, 'users', activeEmail, 'workouts');
    await addDoc(colRef, {
      ...w,
      date: w.date || new Date().toISOString().split('T')[0],
      createdAt: serverTimestamp()
    });
  },

  addCardio: async (c) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    const colRef = collection(db, 'users', activeEmail, 'cardioLogs');
    await addDoc(colRef, {
      ...c,
      date: c.date || new Date().toISOString().split('T')[0],
      createdAt: serverTimestamp()
    });
  },

  deleteWorkout: async (id) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    const docRef = doc(db, 'users', activeEmail, 'workouts', id);
    await deleteDoc(docRef);
  },
}));
