import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Debounce utility map to handle multiple notes
const saveTimeouts = new Map();
const debouncedSave = (noteId, callback, delay = 1000) => {
  if (saveTimeouts.has(noteId)) clearTimeout(saveTimeouts.get(noteId));
  saveTimeouts.set(noteId, setTimeout(() => {
    callback();
    saveTimeouts.delete(noteId);
  }, delay));
};

export const useNoteStore = create(
  persist(
    (set, get) => ({
      notes: [],
      openNoteIds: [], // IDs of notes currently on the canvas
      activeNoteId: null,
      lastSaved: null,
      isSaving: false,

      createNote: (title = 'Untitled') => {
        const id = crypto.randomUUID();
        const note = {
          id,
          title,
          content: { type: 'doc', content: [{ type: 'paragraph' }] },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((s) => ({
          notes: [note, ...s.notes],
          openNoteIds: [...s.openNoteIds, id],
          activeNoteId: id,
        }));
        return id;
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

      updateNoteContent: (noteId, content) => {
        // Update local state immediately for responsiveness
        set((s) => ({
          notes: s.notes.map((n) =>
            n.id === noteId ? { ...n, content, updatedAt: new Date().toISOString() } : n
          ),
        }));

        // Debounced "sync" or "save" indicator
        debouncedSave(noteId, () => {
          set({ isSaving: true });
          setTimeout(() => {
            set({ lastSaved: new Date().toISOString(), isSaving: false });
          }, 500);
        });
      },

      updateTitle: (noteId, title) => {
        set((s) => ({
          notes: s.notes.map((n) =>
            n.id === noteId ? { ...n, title, updatedAt: new Date().toISOString() } : n
          ),
        }));
      },

      deleteNote: (noteId) => {
        set((s) => ({
          notes: s.notes.filter((n) => n.id !== noteId),
          openNoteIds: s.openNoteIds.filter(id => id !== noteId),
          activeNoteId: s.activeNoteId === noteId ? null : s.activeNoteId,
        }));
      },

      setNotes: (notes) => set({ notes }),
    }),
    { name: 'note-store' }
  )
);
