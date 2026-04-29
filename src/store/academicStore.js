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
  orderBy,
  setDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export const useAcademicStore = create((set, get) => ({
  subjects: [],
  tasks: [],
  topics: [],
  activeEmail: null,
  isLoading: false,
  unsubscribes: [],

  // CGPA Tracker State
  academicProfile: {
    currentCGPA: 7.32,
    targetCGPA: 8.00,
    totalCreditsEarned: 73,
    lastSynced: '21 May 2025, 10:30 AM'
  },
  
  semesters: [
    { id: 1, label: 'Semester 1', status: 'Completed', sgpa: 7.18, credits: 24, cgpaAfterSem: 7.18 },
    { id: 2, label: 'Semester 2', status: 'Completed', sgpa: 7.56, credits: 25, cgpaAfterSem: 7.37 },
    { id: 3, label: 'Semester 3', status: 'Completed', sgpa: 7.22, credits: 24, cgpaAfterSem: 7.32 },
    { id: 4, label: 'Semester 4', status: 'In Progress', sgpa: null, credits: 24, cgpaAfterSem: null },
    { id: 5, label: 'Semester 5', status: 'Upcoming', sgpa: null, credits: 24, cgpaAfterSem: null },
    { id: 6, label: 'Semester 6', status: 'Upcoming', sgpa: null, credits: 24, cgpaAfterSem: null },
    { id: 7, label: 'Semester 7', status: 'Upcoming', sgpa: null, credits: 24, cgpaAfterSem: null },
    { id: 8, label: 'Semester 8', status: 'Upcoming', sgpa: null, credits: 24, cgpaAfterSem: null }
  ],

  // ── Sync Engine ──
  startRealtimeSync: (userEmail) => {
    if (!userEmail) return;
    set({ activeEmail: userEmail });
    get().unsubscribes.forEach(unsub => unsub());
    set({ isLoading: true });

    const subjectsRef = collection(db, 'users', userEmail, 'subjects');
    const unsubSubjects = onSnapshot(query(subjectsRef, orderBy('createdAt', 'desc')), (snapshot) => {
      set({ subjects: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })), isLoading: false });
    });

    const topicsRef = collection(db, 'users', userEmail, 'topics');
    const unsubTopics = onSnapshot(topicsRef, (snapshot) => {
      set({ topics: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) });
    });

    const metaRef = doc(db, 'users', userEmail, 'academicMeta', 'global');
    const unsubMeta = onSnapshot(metaRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        set({ 
          academicProfile: { ...get().academicProfile, ...data.profile },
          semesters: data.semesters || get().semesters
        });
      }
    });

    set({ unsubscribes: [unsubSubjects, unsubTopics, unsubMeta] });
  },

  stopRealtimeSync: () => {
    get().unsubscribes.forEach(unsub => unsub());
    set({ unsubscribes: [] });
  },

  // ── Actions ──
  updateTargetCGPA: async (val) => {
    const { activeEmail, academicProfile } = get();
    const newProfile = { ...academicProfile, targetCGPA: Number(val) };
    set({ academicProfile: newProfile });
    if (activeEmail) {
      await setDoc(doc(db, 'users', activeEmail, 'academicMeta', 'global'), { profile: newProfile }, { merge: true });
    }
  },

  syncFromPortal: async (credentials) => {
    set({ isLoading: true });
    // Simulate API call to /api/scrape-cgpa
    await new Promise(r => setTimeout(r, 2000));
    
    const mockResponse = {
      profile: {
        currentCGPA: 7.32,
        totalCreditsEarned: 73,
        lastSynced: new Date().toLocaleString()
      },
      semesters: [
        { id: 1, label: 'Semester 1', status: 'Completed', sgpa: 7.18, credits: 24, cgpaAfterSem: 7.18 },
        { id: 2, label: 'Semester 2', status: 'Completed', sgpa: 7.56, credits: 25, cgpaAfterSem: 7.37 },
        { id: 3, label: 'Semester 3', status: 'Completed', sgpa: 7.22, credits: 24, cgpaAfterSem: 7.32 },
        { id: 4, label: 'Semester 4', status: 'In Progress', sgpa: null, credits: 24, cgpaAfterSem: null },
        { id: 5, label: 'Semester 5', status: 'Upcoming', sgpa: null, credits: 24, cgpaAfterSem: null },
        { id: 6, label: 'Semester 6', status: 'Upcoming', sgpa: null, credits: 24, cgpaAfterSem: null },
        { id: 7, label: 'Semester 7', status: 'Upcoming', sgpa: null, credits: 24, cgpaAfterSem: null },
        { id: 8, label: 'Semester 8', status: 'Upcoming', sgpa: null, credits: 24, cgpaAfterSem: null }
      ]
    };

    set({ 
      academicProfile: { ...get().academicProfile, ...mockResponse.profile },
      semesters: mockResponse.semesters,
      isLoading: false 
    });

    const { activeEmail } = get();
    if (activeEmail) {
      await setDoc(doc(db, 'users', activeEmail, 'academicMeta', 'global'), mockResponse, { merge: true });
    }
  },

  addSubject: async (data) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    return await addDoc(collection(db, 'users', activeEmail, 'subjects'), {
      ...data,
      createdAt: serverTimestamp(),
      marks: { midsem: { scored: 0, max: 30 }, endsem: { scored: 0, max: 50 }, quiz: { scored: 0, max: 15 }, ta: { scored: 0, max: 5 } },
      attendance: []
    });
  },

  updateSubjectMarks: async (id, marks) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    await updateDoc(doc(db, 'users', activeEmail, 'subjects', id), { marks });
  },

  updateTopic: async (id, updates) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    await updateDoc(doc(db, 'users', activeEmail, 'topics', id), updates);
  },

  addTopic: async (data) => {
    const { activeEmail } = get();
    if (!activeEmail) return;
    await addDoc(collection(db, 'users', activeEmail, 'topics'), {
      ...data,
      masteryLevel: 0,
      status: 'pending',
      createdAt: serverTimestamp()
    });
  },

  // ── Global Selectors ──
  getAllPendingAssignments: () => {
    return get().subjects.flatMap(s => 
      (s.assignments || [])
        .filter(a => a.status !== 'completed')
        .map(a => ({ ...a, subjectId: s.id, subjectName: s.name }))
    );
  }
}));
