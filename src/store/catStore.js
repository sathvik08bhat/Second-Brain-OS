import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '../utils/helpers';

export const useCatStore = create(
  persist(
    (set, get) => ({
      sections: [],      // VARC, DILR, QA topic-wise
      mockTests: [],
      resources: [],
      dailyTasks: [],
      targetColleges: [],

      // Sections
      addSection: (s) => set((st) => ({ sections: [...st.sections, { id: generateId(), createdAt: new Date().toISOString(), topicsDone: 0, totalTopics: 0, accuracy: 0, ...s }] })),
      updateSection: (id, u) => set((st) => ({ sections: st.sections.map((s) => s.id === id ? { ...s, ...u } : s) })),
      deleteSection: (id) => set((st) => ({ sections: st.sections.filter((s) => s.id !== id) })),

      // Mock Tests
      addMockTest: (m) => set((st) => ({ mockTests: [...st.mockTests, { id: generateId(), createdAt: new Date().toISOString(), ...m }] })),
      updateMockTest: (id, u) => set((st) => ({ mockTests: st.mockTests.map((m) => m.id === id ? { ...m, ...u } : m) })),
      deleteMockTest: (id) => set((st) => ({ mockTests: st.mockTests.filter((m) => m.id !== id) })),

      // Resources
      addResource: (r) => set((st) => ({ resources: [...st.resources, { id: generateId(), createdAt: new Date().toISOString(), ...r }] })),
      updateResource: (id, u) => set((st) => ({ resources: st.resources.map((r) => r.id === id ? { ...r, ...u } : r) })),
      deleteResource: (id) => set((st) => ({ resources: st.resources.filter((r) => r.id !== id) })),

      // Daily Tasks
      addDailyTask: (t) => set((st) => ({ dailyTasks: [...st.dailyTasks, { id: generateId(), createdAt: new Date().toISOString(), completed: false, ...t }] })),
      updateDailyTask: (id, u) => set((st) => ({ dailyTasks: st.dailyTasks.map((t) => t.id === id ? { ...t, ...u } : t) })),
      deleteDailyTask: (id) => set((st) => ({ dailyTasks: st.dailyTasks.filter((t) => t.id !== id) })),
      toggleDailyTask: (id) => set((st) => ({ dailyTasks: st.dailyTasks.map((t) => t.id === id ? { ...t, completed: !t.completed } : t) })),

      // Target Colleges
      addCollege: (c) => set((st) => ({ targetColleges: [...st.targetColleges, { id: generateId(), ...c }] })),
      updateCollege: (id, u) => set((st) => ({ targetColleges: st.targetColleges.map((c) => c.id === id ? { ...c, ...u } : c) })),
      deleteCollege: (id) => set((st) => ({ targetColleges: st.targetColleges.filter((c) => c.id !== id) })),
    }),
    { name: 'cat-store' }
  )
);
