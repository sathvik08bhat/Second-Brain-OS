import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '../utils/helpers';

export const usePlacementStore = create(
  persist(
    (set) => ({
      dsaProblems: [],
      dsaTopics: [],
      skills: [],
      companies: [],
      interviews: [],
      projects: [],

      // DSA Topics
      addDsaTopic: (t) => set((s) => ({ dsaTopics: [...s.dsaTopics, { id: generateId(), createdAt: new Date().toISOString(), solved: 0, total: 0, ...t }] })),
      updateDsaTopic: (id, u) => set((s) => ({ dsaTopics: s.dsaTopics.map((t) => t.id === id ? { ...t, ...u } : t) })),
      deleteDsaTopic: (id) => set((s) => ({
        dsaTopics: s.dsaTopics.filter((t) => t.id !== id),
        dsaProblems: s.dsaProblems.filter((p) => p.topicId !== id),
      })),

      // DSA Problems
      addDsaProblem: (p) => set((s) => ({ dsaProblems: [...s.dsaProblems, { id: generateId(), createdAt: new Date().toISOString(), status: 'unsolved', ...p }] })),
      updateDsaProblem: (id, u) => set((s) => ({ dsaProblems: s.dsaProblems.map((p) => p.id === id ? { ...p, ...u } : p) })),
      deleteDsaProblem: (id) => set((s) => ({ dsaProblems: s.dsaProblems.filter((p) => p.id !== id) })),

      // Skills
      addSkill: (sk) => set((s) => ({ skills: [...s.skills, { id: generateId(), createdAt: new Date().toISOString(), proficiency: 0, ...sk }] })),
      updateSkill: (id, u) => set((s) => ({ skills: s.skills.map((sk) => sk.id === id ? { ...sk, ...u } : sk) })),
      deleteSkill: (id) => set((s) => ({ skills: s.skills.filter((sk) => sk.id !== id) })),

      // Companies
      addCompany: (c) => set((s) => ({ companies: [...s.companies, { id: generateId(), createdAt: new Date().toISOString(), status: 'watching', ...c }] })),
      updateCompany: (id, u) => set((s) => ({ companies: s.companies.map((c) => c.id === id ? { ...c, ...u } : c) })),
      deleteCompany: (id) => set((s) => ({ companies: s.companies.filter((c) => c.id !== id) })),

      // Interviews
      addInterview: (i) => set((s) => ({ interviews: [...s.interviews, { id: generateId(), createdAt: new Date().toISOString(), ...i }] })),
      updateInterview: (id, u) => set((s) => ({ interviews: s.interviews.map((i) => i.id === id ? { ...i, ...u } : i) })),
      deleteInterview: (id) => set((s) => ({ interviews: s.interviews.filter((i) => i.id !== id) })),

      // Projects
      addProject: (p) => set((s) => ({ projects: [...s.projects, { id: generateId(), createdAt: new Date().toISOString(), ...p }] })),
      updateProject: (id, u) => set((s) => ({ projects: s.projects.map((p) => p.id === id ? { ...p, ...u } : p) })),
      deleteProject: (id) => set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),
    }),
    { name: 'placement-store' }
  )
);
