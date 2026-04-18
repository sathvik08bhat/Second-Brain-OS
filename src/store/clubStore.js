import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '../utils/helpers';

export const useClubStore = create(
  persist(
    (set) => ({
      members: [],
      events: [],
      meetings: [],
      content: [],
      budget: [],

      // Members
      addMember: (m) => set((s) => ({ members: [...s.members, { id: generateId(), createdAt: new Date().toISOString(), status: 'active', ...m }] })),
      updateMember: (id, u) => set((s) => ({ members: s.members.map((m) => m.id === id ? { ...m, ...u } : m) })),
      deleteMember: (id) => set((s) => ({ members: s.members.filter((m) => m.id !== id) })),

      // Events
      addEvent: (e) => set((s) => ({ events: [...s.events, { id: generateId(), createdAt: new Date().toISOString(), status: 'planned', ...e }] })),
      updateEvent: (id, u) => set((s) => ({ events: s.events.map((e) => e.id === id ? { ...e, ...u } : e) })),
      deleteEvent: (id) => set((s) => ({ events: s.events.filter((e) => e.id !== id) })),

      // Meetings
      addMeeting: (m) => set((s) => ({ meetings: [...s.meetings, { id: generateId(), createdAt: new Date().toISOString(), ...m }] })),
      updateMeeting: (id, u) => set((s) => ({ meetings: s.meetings.map((m) => m.id === id ? { ...m, ...u } : m) })),
      deleteMeeting: (id) => set((s) => ({ meetings: s.meetings.filter((m) => m.id !== id) })),

      // Content Calendar
      addContent: (c) => set((s) => ({ content: [...s.content, { id: generateId(), createdAt: new Date().toISOString(), status: 'draft', ...c }] })),
      updateContent: (id, u) => set((s) => ({ content: s.content.map((c) => c.id === id ? { ...c, ...u } : c) })),
      deleteContent: (id) => set((s) => ({ content: s.content.filter((c) => c.id !== id) })),

      // Budget
      addBudgetEntry: (b) => set((s) => ({ budget: [...s.budget, { id: generateId(), createdAt: new Date().toISOString(), ...b }] })),
      updateBudgetEntry: (id, u) => set((s) => ({ budget: s.budget.map((b) => b.id === id ? { ...b, ...u } : b) })),
      deleteBudgetEntry: (id) => set((s) => ({ budget: s.budget.filter((b) => b.id !== id) })),
    }),
    { name: 'club-store' }
  )
);
