import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '../utils/helpers';

export const TASK_CATEGORIES = [
  'personal', 'academics', 'finance', 'fitness', 'startup',
  'gsoc', 'placements', 'club', 'mental-health', 'leadership', 'hobbies', 'other'
];

export const useTaskStore = create(
  persist(
    (set, get) => ({
      tasks: [],

      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, {
          id: generateId(),
          createdAt: new Date().toISOString(),
          completed: false,
          category: 'personal',
          priority: 'medium',
          dueDate: null,
          deadline: null,
          description: '',
          subtasks: [],
          linkedTransactionId: null,
          googleCalendarEventId: null,
          googleTaskId: null,
          tags: [],
          status: 'todo', // todo, in-progress, done
          ...task
        }]
      })),

      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
      })),

      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id)
      })),

      toggleTaskCompletion: (id) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? {
          ...t,
          completed: !t.completed,
          status: !t.completed ? 'done' : 'todo'
        } : t)
      })),

      // ── Subtasks ──
      addSubtask: (taskId, subtaskTitle) => set((state) => ({
        tasks: state.tasks.map(t => t.id === taskId ? {
          ...t,
          subtasks: [...(t.subtasks || []), { id: generateId(), title: subtaskTitle, completed: false }]
        } : t)
      })),

      toggleSubtask: (taskId, subtaskId) => set((state) => ({
        tasks: state.tasks.map(t => t.id === taskId ? {
          ...t,
          subtasks: (t.subtasks || []).map(st => st.id === subtaskId ? { ...st, completed: !st.completed } : st)
        } : t)
      })),

      deleteSubtask: (taskId, subtaskId) => set((state) => ({
        tasks: state.tasks.map(t => t.id === taskId ? {
          ...t,
          subtasks: (t.subtasks || []).filter(st => st.id !== subtaskId)
        } : t)
      })),

      // ── Filters ──
      getTasksByCategory: (category) => get().tasks.filter(t => t.category === category),
      getTasksByStatus: (status) => get().tasks.filter(t => t.status === status),
      getTasksByPriority: (priority) => get().tasks.filter(t => t.priority === priority),
      getPendingTasks: () => get().tasks.filter(t => !t.completed),
      getOverdueTasks: () => get().tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && !t.completed),
    }),
    { name: 'task-store' }
  )
);
