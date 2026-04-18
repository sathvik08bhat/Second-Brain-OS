import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '../utils/helpers';

export const useGsocStore = create(
  persist(
    (set, get) => ({
      skills: [],
      contributions: [],
      organizations: [],
      resources: [],
      applications: [],
      milestones: [],

      // Skills
      addSkill: (skill) => set((s) => ({ skills: [...s.skills, { id: generateId(), createdAt: new Date().toISOString(), progress: 0, level: 'beginner', ...skill }] })),
      updateSkill: (id, u) => set((s) => ({ skills: s.skills.map((sk) => sk.id === id ? { ...sk, ...u } : sk) })),
      deleteSkill: (id) => set((s) => ({ skills: s.skills.filter((sk) => sk.id !== id) })),

      // Contributions
      addContribution: (c) => set((s) => ({ contributions: [...s.contributions, { id: generateId(), createdAt: new Date().toISOString(), ...c }] })),
      updateContribution: (id, u) => set((s) => ({ contributions: s.contributions.map((c) => c.id === id ? { ...c, ...u } : c) })),
      deleteContribution: (id) => set((s) => ({ contributions: s.contributions.filter((c) => c.id !== id) })),

      // Organizations
      addOrganization: (o) => set((s) => ({ organizations: [...s.organizations, { id: generateId(), createdAt: new Date().toISOString(), ...o }] })),
      updateOrganization: (id, u) => set((s) => ({ organizations: s.organizations.map((o) => o.id === id ? { ...o, ...u } : o) })),
      deleteOrganization: (id) => set((s) => ({ organizations: s.organizations.filter((o) => o.id !== id) })),

      // Resources
      addResource: (r) => set((s) => ({ resources: [...s.resources, { id: generateId(), createdAt: new Date().toISOString(), ...r }] })),
      updateResource: (id, u) => set((s) => ({ resources: s.resources.map((r) => r.id === id ? { ...r, ...u } : r) })),
      deleteResource: (id) => set((s) => ({ resources: s.resources.filter((r) => r.id !== id) })),

      // Applications
      addApplication: (a) => set((s) => ({ applications: [...s.applications, { id: generateId(), createdAt: new Date().toISOString(), ...a }] })),
      updateApplication: (id, u) => set((s) => ({ applications: s.applications.map((a) => a.id === id ? { ...a, ...u } : a) })),
      deleteApplication: (id) => set((s) => ({ applications: s.applications.filter((a) => a.id !== id) })),

      // Milestones
      addMilestone: (m) => set((s) => ({ milestones: [...s.milestones, { id: generateId(), createdAt: new Date().toISOString(), completed: false, ...m }] })),
      updateMilestone: (id, u) => set((s) => ({ milestones: s.milestones.map((m) => m.id === id ? { ...m, ...u } : m) })),
      deleteMilestone: (id) => set((s) => ({ milestones: s.milestones.filter((m) => m.id !== id) })),
    }),
    { name: 'gsoc-store' }
  )
);
