import { create } from 'zustand';
import { 
  collection, 
  doc, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export const TASK_CATEGORIES = [
  'personal', 'academics', 'finance', 'fitness', 'startup',
  'gsoc', 'placements', 'club', 'mental-health', 'leadership', 'hobbies', 'other'
];

export const useTaskStore = create((set, get) => ({
  tasks: [],
  activeEmail: null,
  isLoading: false,
  unsubscribes: [],

  // ── Sync Engine ──
  startRealtimeSync: (userEmail) => {
    if (!userEmail) return;
    
    set({ activeEmail: userEmail });
    get().unsubscribes.forEach(unsub => unsub());
    set({ isLoading: true });

    const tasksRef = collection(db, 'users', userEmail, 'tasks');
    const q = query(tasksRef, orderBy('createdAt', 'desc'));
    
    const unsubTasks = onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      set({ tasks, isLoading: false });
    }, (error) => {
      console.error("Firestore Tasks Sync Error:", error);
      set({ isLoading: false });
    });

    set({ unsubscribes: [unsubTasks] });
    return unsubTasks;
  },

  stopRealtimeSync: () => {
    get().unsubscribes.forEach(unsub => unsub());
    set({ unsubscribes: [] });
  },

  // ── Actions ──
  addTask: async (taskData) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    const tasksRef = collection(db, 'users', activeEmail, 'tasks');
    await addDoc(tasksRef, {
      title: taskData.title || "Untitled Task",
      createdAt: serverTimestamp(),
      completed: false,
      category: taskData.category || 'personal',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      deadline: taskData.deadline || null,
      description: taskData.description || '',
      subtasks: [],
      linkedTransactionId: null,
      googleCalendarEventId: null,
      googleTaskId: null,
      tags: [],
      status: 'not_started',
      ...taskData
    });
  },

  updateTask: async (id, updates) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    const docRef = doc(db, 'users', activeEmail, 'tasks', id);
    await updateDoc(docRef, updates);
  },

  deleteTask: async (id) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    const docRef = doc(db, 'users', activeEmail, 'tasks', id);
    await deleteDoc(docRef);
  },

  toggleTaskCompletion: async (id) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    const task = get().tasks.find(t => t.id === id);
    if (!task) return;
    const newCompleted = !task.completed;
    await get().updateTask(id, {
      completed: newCompleted,
      status: newCompleted ? 'done' : 'not_started'
    });
  },

  addSubtask: async (taskId, subtaskTitle) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    const task = get().tasks.find(t => t.id === taskId);
    const newSubtask = { 
      id: Math.random().toString(36).substr(2, 9), 
      title: subtaskTitle, 
      completed: false 
    };
    await get().updateTask(taskId, {
      subtasks: [...(task.subtasks || []), newSubtask]
    });
  },

  toggleSubtask: async (taskId, subtaskId) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    const task = get().tasks.find(t => t.id === taskId);
    const newSubtasks = (task.subtasks || []).map(st => 
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    await get().updateTask(taskId, { subtasks: newSubtasks });
  },

  deleteSubtask: async (taskId, subtaskId) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    const task = get().tasks.find(t => t.id === taskId);
    const newSubtasks = (task.subtasks || []).filter(st => st.id !== subtaskId);
    await get().updateTask(taskId, { subtasks: newSubtasks });
  },

  // ── Selectors ──
  getTasksByCategory: (category) => get().tasks.filter(t => t.category === category),
  getPendingTasks: () => get().tasks.filter(t => !t.completed),
}));
