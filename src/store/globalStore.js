import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '../utils/helpers';

export const useGlobalStore = create(
  persist(
    (set) => ({
      quickCaptures: [],
      sidebarCollapsed: false,
      theme: 'light', // User asked for the bright look primarily
      accentColor: '#E8F396', // Canary Yellow pastel base
      enabledModules: { academics: true, aiml: true, dsa: true, cat: true, gsoc: true, placements: true, startup: true, club: true, fitness: true, finance: true, mentalHealth: true, leadership: true, hobbies: true, travel: true, personal: true },

      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      setAccentColor: (color) => set({ accentColor: color }),
      toggleModule: (moduleKey) => set((s) => ({
        enabledModules: { ...s.enabledModules, [moduleKey]: !s.enabledModules[moduleKey] }
      })),

      addQuickCapture: (note) => set((s) => ({
        quickCaptures: [...s.quickCaptures, { id: generateId(), createdAt: new Date().toISOString(), text: note, processed: false }],
      })),
      deleteQuickCapture: (id) => set((s) => ({
        quickCaptures: s.quickCaptures.filter((n) => n.id !== id),
      })),
      toggleQuickCapture: (id) => set((s) => ({
        quickCaptures: s.quickCaptures.map((n) => n.id === id ? { ...n, processed: !n.processed } : n),
      })),
    }),
    { name: 'global-store' }
  )
);
