import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useJournalStore = create(
  persist(
    (set, get) => ({
      entries: {}, // format: { 'YYYY-MM-DD': { content: JSON, lastEdited: timestamp } }

      getEntry: (dateString) => {
        return get().entries[dateString] || { 
          content: { type: 'doc', content: [{ type: 'paragraph' }] },
          lastEdited: null 
        };
      },

      updateEntry: (dateString, content) => {
        set((state) => ({
          entries: {
            ...state.entries,
            [dateString]: {
              content,
              lastEdited: Date.now()
            }
          }
        }));
      },

      getHistory: () => {
        return Object.entries(get().entries)
          .map(([date, data]) => ({ date, ...data }))
          .sort((a, b) => new Date(b.date) - new Date(a.date));
      }
    }),
    {
      name: 'daily-journal-storage',
    }
  )
);
