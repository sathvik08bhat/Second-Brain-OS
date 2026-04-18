import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '../utils/helpers';

export const useHobbiesStore = create(
  persist(
    (set) => ({
      photography: [],
      videoEditing: [],
      healthNutrition: [],
      tableTennis: [],
      customHobbies: [],    // [{ id, name, description, icon, color, activities: [] }]

      // Photography
      addPhoto: (p) => set((s) => ({ photography: [...s.photography, { id: generateId(), createdAt: new Date().toISOString(), ...p }] })),
      updatePhoto: (id, u) => set((s) => ({ photography: s.photography.map((p) => p.id === id ? { ...p, ...u } : p) })),
      deletePhoto: (id) => set((s) => ({ photography: s.photography.filter((p) => p.id !== id) })),

      // Video Editing
      addVideoProject: (v) => set((s) => ({ videoEditing: [...s.videoEditing, { id: generateId(), createdAt: new Date().toISOString(), status: 'planned', ...v }] })),
      updateVideoProject: (id, u) => set((s) => ({ videoEditing: s.videoEditing.map((v) => v.id === id ? { ...v, ...u } : v) })),
      deleteVideoProject: (id) => set((s) => ({ videoEditing: s.videoEditing.filter((v) => v.id !== id) })),

      // Health & Nutrition
      addHealthNote: (h) => set((s) => ({ healthNutrition: [...s.healthNutrition, { id: generateId(), createdAt: new Date().toISOString(), ...h }] })),
      updateHealthNote: (id, u) => set((s) => ({ healthNutrition: s.healthNutrition.map((h) => h.id === id ? { ...h, ...u } : h) })),
      deleteHealthNote: (id) => set((s) => ({ healthNutrition: s.healthNutrition.filter((h) => h.id !== id) })),

      // Table Tennis
      addTTSession: (t) => set((s) => ({ tableTennis: [...s.tableTennis, { id: generateId(), createdAt: new Date().toISOString(), ...t }] })),
      updateTTSession: (id, u) => set((s) => ({ tableTennis: s.tableTennis.map((t) => t.id === id ? { ...t, ...u } : t) })),
      deleteTTSession: (id) => set((s) => ({ tableTennis: s.tableTennis.filter((t) => t.id !== id) })),

      // ── Custom Hobbies ──
      addCustomHobby: (hobby) => set((s) => ({
        customHobbies: [...s.customHobbies, { id: generateId(), activities: [], createdAt: new Date().toISOString(), ...hobby }]
      })),
      updateCustomHobby: (id, u) => set((s) => ({
        customHobbies: s.customHobbies.map((h) => h.id === id ? { ...h, ...u } : h)
      })),
      deleteCustomHobby: (id) => set((s) => ({
        customHobbies: s.customHobbies.filter((h) => h.id !== id)
      })),
      addHobbyActivity: (hobbyId, activity) => set((s) => ({
        customHobbies: s.customHobbies.map((h) => h.id === hobbyId ? {
          ...h, activities: [...h.activities, { id: generateId(), createdAt: new Date().toISOString(), ...activity }]
        } : h)
      })),
      deleteHobbyActivity: (hobbyId, activityId) => set((s) => ({
        customHobbies: s.customHobbies.map((h) => h.id === hobbyId ? {
          ...h, activities: h.activities.filter(a => a.id !== activityId)
        } : h)
      })),
    }),
    { name: 'hobbies-store' }
  )
);
