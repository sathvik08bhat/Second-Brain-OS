import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '../utils/helpers';

export const useFitnessStore = create(
  persist(
    (set, get) => ({
      weightLogs: [],
      meals: [],
      workouts: [],
      cardioLogs: [],
      measurements: [],
      targetWeight: 75,
      currentWeight: 89,

      setTargetWeight: (w) => set({ targetWeight: w }),

      // Weight Logs
      addWeightLog: (w) => {
        set((s) => ({
          weightLogs: [...s.weightLogs, { id: generateId(), createdAt: new Date().toISOString(), ...w }],
          currentWeight: w.weight,
        }));
      },
      deleteWeightLog: (id) => set((s) => ({ weightLogs: s.weightLogs.filter((w) => w.id !== id) })),

      // Meals
      addMeal: (m) => set((s) => ({ meals: [...s.meals, { id: generateId(), createdAt: new Date().toISOString(), ...m }] })),
      updateMeal: (id, u) => set((s) => ({ meals: s.meals.map((m) => m.id === id ? { ...m, ...u } : m) })),
      deleteMeal: (id) => set((s) => ({ meals: s.meals.filter((m) => m.id !== id) })),

      getDailyCalories: (date) => {
        const meals = get().meals.filter((m) => m.date === date);
        return meals.reduce((sum, m) => sum + (m.calories || 0), 0);
      },

      getDailyMacros: (date) => {
        const meals = get().meals.filter((m) => m.date === date);
        return {
          protein: meals.reduce((sum, m) => sum + (m.protein || 0), 0),
          carbs: meals.reduce((sum, m) => sum + (m.carbs || 0), 0),
          fat: meals.reduce((sum, m) => sum + (m.fat || 0), 0),
        };
      },

      // Workouts
      addWorkout: (w) => set((s) => ({ workouts: [...s.workouts, { id: generateId(), createdAt: new Date().toISOString(), exercises: [], ...w }] })),
      updateWorkout: (id, u) => set((s) => ({ workouts: s.workouts.map((w) => w.id === id ? { ...w, ...u } : w) })),
      deleteWorkout: (id) => set((s) => ({ workouts: s.workouts.filter((w) => w.id !== id) })),

      // Cardio
      addCardio: (c) => set((s) => ({ cardioLogs: [...s.cardioLogs, { id: generateId(), createdAt: new Date().toISOString(), ...c }] })),
      updateCardio: (id, u) => set((s) => ({ cardioLogs: s.cardioLogs.map((c) => c.id === id ? { ...c, ...u } : c) })),
      deleteCardio: (id) => set((s) => ({ cardioLogs: s.cardioLogs.filter((c) => c.id !== id) })),

      // Measurements
      addMeasurement: (m) => set((s) => ({ measurements: [...s.measurements, { id: generateId(), createdAt: new Date().toISOString(), ...m }] })),
      deleteMeasurement: (id) => set((s) => ({ measurements: s.measurements.filter((m) => m.id !== id) })),
    }),
    { name: 'fitness-store' }
  )
);
