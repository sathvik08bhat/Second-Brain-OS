import { create } from 'zustand';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export const useJournalStore = create((set, get) => ({
  entries: {}, // format: { 'YYYY-MM-DD': { content: JSON, lastEdited: timestamp } }
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

    const journalRef = collection(db, 'users', userEmail, 'journal');
    
    const unsub = onSnapshot(journalRef, (snapshot) => {
      const entries = {};
      snapshot.docs.forEach(doc => {
        entries[doc.id] = {
          ...doc.data(),
          lastEdited: doc.data().lastEdited?.toDate?.()?.getTime() || null
        };
      });
      set({ entries, isLoading: false });
    });

    set({ unsubscribes: [unsub] });
  },

  stopRealtimeSync: () => {
    get().unsubscribes.forEach(unsub => unsub());
    set({ unsubscribes: [] });
  },

  getEntry: (dateString) => {
    return get().entries[dateString] || { 
      content: { type: 'doc', content: [{ type: 'paragraph' }] },
      lastEdited: null 
    };
  },

  updateEntry: async (dateString, content) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    
    // Update local state for UI responsiveness
    set(state => ({
      entries: {
        ...state.entries,
        [dateString]: { ...state.getEntry(dateString), content, lastEdited: Date.now() }
      }
    }));

    const docRef = doc(db, 'users', activeEmail, 'journal', dateString);
    await setDoc(docRef, {
      content,
      lastEdited: serverTimestamp()
    }, { merge: true });
  },

  getHistory: () => {
    return Object.entries(get().entries)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }
}));
