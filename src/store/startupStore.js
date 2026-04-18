import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '../utils/helpers';

export const useStartupStore = create(
  persist(
    (set) => ({
      ideas: [],
      tasks: [],
      finances: [],
      team: [],
      milestones: [],

      // Ideas
      addIdea: (i) => set((s) => ({ ideas: [...s.ideas, { id: generateId(), createdAt: new Date().toISOString(), status: 'brainstorm', validationScore: 0, ...i }] })),
      updateIdea: (id, u) => set((s) => ({ ideas: s.ideas.map((i) => i.id === id ? { ...i, ...u } : i) })),
      deleteIdea: (id) => set((s) => ({ ideas: s.ideas.filter((i) => i.id !== id) })),

      // Tasks (Kanban)
      addTask: (t) => set((s) => ({ tasks: [...s.tasks, { id: generateId(), createdAt: new Date().toISOString(), status: 'backlog', ...t }] })),
      updateTask: (id, u) => set((s) => ({ tasks: s.tasks.map((t) => t.id === id ? { ...t, ...u } : t) })),
      deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
      moveTask: (id, status) => set((s) => ({ tasks: s.tasks.map((t) => t.id === id ? { ...t, status } : t) })),

      // Finances
      addFinance: (f) => set((s) => ({ finances: [...s.finances, { id: generateId(), createdAt: new Date().toISOString(), ...f }] })),
      updateFinance: (id, u) => set((s) => ({ finances: s.finances.map((f) => f.id === id ? { ...f, ...u } : f) })),
      deleteFinance: (id) => set((s) => ({ finances: s.finances.filter((f) => f.id !== id) })),

      // Team
      addTeamMember: (m) => set((s) => ({ team: [...s.team, { id: generateId(), createdAt: new Date().toISOString(), ...m }] })),
      updateTeamMember: (id, u) => set((s) => ({ team: s.team.map((m) => m.id === id ? { ...m, ...u } : m) })),
      deleteTeamMember: (id) => set((s) => ({ team: s.team.filter((m) => m.id !== id) })),

      // Milestones
      addMilestone: (m) => set((s) => ({ milestones: [...s.milestones, { id: generateId(), createdAt: new Date().toISOString(), completed: false, ...m }] })),
      updateMilestone: (id, u) => set((s) => ({ milestones: s.milestones.map((m) => m.id === id ? { ...m, ...u } : m) })),
      deleteMilestone: (id) => set((s) => ({ milestones: s.milestones.filter((m) => m.id !== id) })),
    }),
    { name: 'startup-store' }
  )
);
