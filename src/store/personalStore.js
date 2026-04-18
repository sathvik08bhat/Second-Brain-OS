import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '../utils/helpers';

export const usePersonalStore = create(
  persist(
    (set) => ({
      journalEntries: [],
      habits: [],
      habitLogs: [],
      books: [],
      goals: [],
      affirmations: [],
      meditationLogs: [],

      // Journal
      addJournalEntry: (e) => set((s) => ({ journalEntries: [...s.journalEntries, { id: generateId(), createdAt: new Date().toISOString(), mood: 'neutral', ...e }] })),
      updateJournalEntry: (id, u) => set((s) => ({ journalEntries: s.journalEntries.map((e) => e.id === id ? { ...e, ...u } : e) })),
      deleteJournalEntry: (id) => set((s) => ({ journalEntries: s.journalEntries.filter((e) => e.id !== id) })),

      // Habits
      addHabit: (h) => set((s) => ({ habits: [...s.habits, { id: generateId(), createdAt: new Date().toISOString(), streak: 0, ...h }] })),
      updateHabit: (id, u) => set((s) => ({ habits: s.habits.map((h) => h.id === id ? { ...h, ...u } : h) })),
      deleteHabit: (id) => set((s) => ({
        habits: s.habits.filter((h) => h.id !== id),
        habitLogs: s.habitLogs.filter((l) => l.habitId !== id),
      })),

      // Habit Logs
      toggleHabitLog: (habitId, date) => set((s) => {
        const existing = s.habitLogs.find((l) => l.habitId === habitId && l.date === date);
        if (existing) {
          return { habitLogs: s.habitLogs.filter((l) => l.id !== existing.id) };
        }
        return { habitLogs: [...s.habitLogs, { id: generateId(), habitId, date, completed: true }] };
      }),

      // Books
      addBook: (b) => set((s) => ({ books: [...s.books, { id: generateId(), createdAt: new Date().toISOString(), status: 'to-read', progress: 0, ...b }] })),
      updateBook: (id, u) => set((s) => ({ books: s.books.map((b) => b.id === id ? { ...b, ...u } : b) })),
      deleteBook: (id) => set((s) => ({ books: s.books.filter((b) => b.id !== id) })),

      // Goals
      addGoal: (g) => set((s) => ({ goals: [...s.goals, { id: generateId(), createdAt: new Date().toISOString(), progress: 0, status: 'active', ...g }] })),
      updateGoal: (id, u) => set((s) => ({ goals: s.goals.map((g) => g.id === id ? { ...g, ...u } : g) })),
      deleteGoal: (id) => set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),

      // Affirmations
      addAffirmation: (a) => set((s) => ({ affirmations: [...s.affirmations, { id: generateId(), createdAt: new Date().toISOString(), ...a }] })),
      deleteAffirmation: (id) => set((s) => ({ affirmations: s.affirmations.filter((a) => a.id !== id) })),

      // Meditation
      addMeditationLog: (m) => set((s) => ({ meditationLogs: [...s.meditationLogs, { id: generateId(), createdAt: new Date().toISOString(), ...m }] })),
      deleteMeditationLog: (id) => set((s) => ({ meditationLogs: s.meditationLogs.filter((m) => m.id !== id) })),
    }),
    { name: 'personal-store' }
  )
);
