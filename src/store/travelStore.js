import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '../utils/helpers';

export const useTravelStore = create(
  persist(
    (set) => ({
      trips: [],
      bucketList: [],
      travelHistory: [],
      expenses: [],

      // Trips (planning)
      addTrip: (t) => set((s) => ({ trips: [...s.trips, { id: generateId(), createdAt: new Date().toISOString(), status: 'planning', itinerary: [], packingList: [], ...t }] })),
      updateTrip: (id, u) => set((s) => ({ trips: s.trips.map((t) => t.id === id ? { ...t, ...u } : t) })),
      deleteTrip: (id) => set((s) => ({
        trips: s.trips.filter((t) => t.id !== id),
        expenses: s.expenses.filter((e) => e.tripId !== id),
      })),

      // Bucket List
      addBucketItem: (b) => set((s) => ({ bucketList: [...s.bucketList, { id: generateId(), createdAt: new Date().toISOString(), visited: false, ...b }] })),
      updateBucketItem: (id, u) => set((s) => ({ bucketList: s.bucketList.map((b) => b.id === id ? { ...b, ...u } : b) })),
      deleteBucketItem: (id) => set((s) => ({ bucketList: s.bucketList.filter((b) => b.id !== id) })),

      // Travel History
      addHistoryEntry: (h) => set((s) => ({ travelHistory: [...s.travelHistory, { id: generateId(), createdAt: new Date().toISOString(), ...h }] })),
      updateHistoryEntry: (id, u) => set((s) => ({ travelHistory: s.travelHistory.map((h) => h.id === id ? { ...h, ...u } : h) })),
      deleteHistoryEntry: (id) => set((s) => ({ travelHistory: s.travelHistory.filter((h) => h.id !== id) })),

      // Expenses
      addExpense: (e) => set((s) => ({ expenses: [...s.expenses, { id: generateId(), createdAt: new Date().toISOString(), ...e }] })),
      updateExpense: (id, u) => set((s) => ({ expenses: s.expenses.map((e) => e.id === id ? { ...e, ...u } : e) })),
      deleteExpense: (id) => set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) })),
    }),
    { name: 'travel-store' }
  )
);
