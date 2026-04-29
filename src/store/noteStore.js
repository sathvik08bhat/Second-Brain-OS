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

// Debounce utility map to handle multiple notes
const saveTimeouts = new Map();
const debouncedSave = (noteId, callback, delay = 1000) => {
  if (saveTimeouts.has(noteId)) clearTimeout(saveTimeouts.get(noteId));
  saveTimeouts.set(noteId, setTimeout(() => {
    callback();
    saveTimeouts.delete(noteId);
  }, delay));
};

export const useNoteStore = create((set, get) => ({
  notes: [],
  openNoteIds: [], // IDs of notes currently on the canvas
  activeNoteId: null,
  activeEmail: null,
  isLoading: false,
  isSaving: false,
  lastSaved: null,
  unsubscribes: [],

  // ── Sync Engine ──
  startRealtimeSync: (userEmail) => {
    if (!userEmail) return;
    set({ activeEmail: userEmail });
    
    // Clear existing
    get().unsubscribes.forEach(unsub => unsub());
    set({ isLoading: true });

    const notesRef = collection(db, 'users', userEmail, 'notes');
    const q = query(notesRef, orderBy('updatedAt', 'desc'));
    
    const unsub = onSnapshot(q, (snapshot) => {
      const notes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
      }));
      set({ notes, isLoading: false });
    });

    set({ unsubscribes: [unsub] });
  },

  stopRealtimeSync: () => {
    get().unsubscribes.forEach(unsub => unsub());
    set({ unsubscribes: [] });
  },

  // ── Actions ──
  createNote: async (title = 'Untitled') => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    const notesRef = collection(db, 'users', activeEmail, 'notes');
    const docRef = await addDoc(notesRef, {
      title,
      content: { type: 'doc', content: [{ type: 'paragraph' }] },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    set((s) => ({
      openNoteIds: [...s.openNoteIds, docRef.id],
      activeNoteId: docRef.id,
    }));
    return docRef.id;
  },

  setActiveNote: (noteId) => {
    set((s) => ({
      activeNoteId: noteId,
      openNoteIds: s.openNoteIds.includes(noteId) ? s.openNoteIds : [...s.openNoteIds, noteId]
    }));
  },

  toggleOpenNote: (noteId) => {
    set((s) => {
      const isOpen = s.openNoteIds.includes(noteId);
      if (isOpen) {
        return { openNoteIds: s.openNoteIds.filter(id => id !== noteId) };
      } else {
        return { openNoteIds: [...s.openNoteIds, noteId], activeNoteId: noteId };
      }
    });
  },

  updateNoteContent: async (noteId, content) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    
    // Update local state immediately for visual feedback
    set({ isSaving: true });

    debouncedSave(noteId, async () => {
      const docRef = doc(db, 'users', activeEmail, 'notes', noteId);
      await updateDoc(docRef, {
        content,
        updatedAt: serverTimestamp()
      });
      set({ lastSaved: new Date().toISOString(), isSaving: false });
    });
  },

  updateTitle: async (noteId, title) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    const docRef = doc(db, 'users', activeEmail, 'notes', noteId);
    await updateDoc(docRef, {
      title,
      updatedAt: serverTimestamp()
    });
  },

  deleteNote: async (noteId) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    const docRef = doc(db, 'users', activeEmail, 'notes', noteId);
    await deleteDoc(docRef);
    set((s) => ({
      openNoteIds: s.openNoteIds.filter(id => id !== noteId),
      activeNoteId: s.activeNoteId === noteId ? null : s.activeNoteId,
    }));
  },

  setNotes: (notes) => set({ notes }),
}));
