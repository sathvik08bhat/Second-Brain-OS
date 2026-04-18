import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '../utils/helpers';

export const useAcademicStore = create(
  persist(
    (set, get) => ({
      subjects: [],
      exams: [],
      assignments: [],
      attendance: [],
      timetable: [],
      studySessions: [],
      resources: [],
      googleDriveConnected: false,
      currentSemester: 1,

      setCurrentSemester: (sem) => set({ currentSemester: sem }),
      setGoogleDriveConnected: (val) => set({ googleDriveConnected: val }),

      // ── Resources ──
      addResource: (resource) => {
        const id = generateId();
        set((state) => ({ resources: [...state.resources, { id, createdAt: new Date().toISOString(), type: 'link', ...resource }] }));
        return id;
      },
      updateResource: (id, updates) => set((state) => ({
        resources: state.resources.map((r) => r.id === id ? { ...r, ...updates } : r),
      })),
      deleteResource: (id) => set((state) => ({
        resources: state.resources.filter((r) => r.id !== id),
      })),

      // ── Subjects ──
      addSubject: (subject) => {
        const id = generateId();
        const newSubject = { id, createdAt: new Date().toISOString(), ...subject };
        set((state) => ({ subjects: [...state.subjects, newSubject] }));
        return id;
      },
      updateSubject: (id, updates) => set((state) => ({
        subjects: state.subjects.map((s) => s.id === id ? { ...s, ...updates } : s),
      })),
      deleteSubject: (id) => set((state) => ({
        subjects: state.subjects.filter((s) => s.id !== id),
        exams: state.exams.filter((e) => e.subjectId !== id),
        assignments: state.assignments.filter((a) => a.subjectId !== id),
        attendance: state.attendance.filter((a) => a.subjectId !== id),
      })),
      getSubjectsBySemester: (sem) => get().subjects.filter((s) => s.semester === sem),

      // ── Exams ──
      addExam: (exam) => {
        const id = generateId();
        set((state) => ({ exams: [...state.exams, { id, createdAt: new Date().toISOString(), ...exam }] }));
        return id;
      },
      updateExam: (id, updates) => set((state) => ({
        exams: state.exams.map((e) => e.id === id ? { ...e, ...updates } : e),
      })),
      deleteExam: (id) => set((state) => ({
        exams: state.exams.filter((e) => e.id !== id),
      })),

      // ── Assignments ──
      addAssignment: (assignment) => {
        const id = generateId();
        set((state) => ({ assignments: [...state.assignments, { id, createdAt: new Date().toISOString(), ...assignment }] }));
        return id;
      },
      updateAssignment: (id, updates) => set((state) => ({
        assignments: state.assignments.map((a) => a.id === id ? { ...a, ...updates } : a),
      })),
      deleteAssignment: (id) => set((state) => ({
        assignments: state.assignments.filter((a) => a.id !== id),
      })),

      // ── Attendance ──
      addAttendance: (record) => {
        const id = generateId();
        set((state) => ({ attendance: [...state.attendance, { id, createdAt: new Date().toISOString(), ...record }] }));
        return id;
      },
      updateAttendance: (id, updates) => set((state) => ({
        attendance: state.attendance.map((a) => a.id === id ? { ...a, ...updates } : a),
      })),
      deleteAttendance: (id) => set((state) => ({
        attendance: state.attendance.filter((a) => a.id !== id),
      })),

      markAttendance: (subjectId, date, status) => {
        const existing = get().attendance.find(
          (a) => a.subjectId === subjectId && a.date === date
        );
        if (existing) {
          set((state) => ({
            attendance: state.attendance.map((a) =>
              a.id === existing.id ? { ...a, status } : a
            ),
          }));
        } else {
          const id = generateId();
          set((state) => ({
            attendance: [...state.attendance, { id, subjectId, date, status, createdAt: new Date().toISOString() }],
          }));
        }
      },

      getAttendanceStats: (subjectId) => {
        const records = get().attendance.filter((a) => a.subjectId === subjectId);
        const present = records.filter((r) => r.status === 'present').length;
        const total = records.length;
        return { present, absent: total - present, total, percentage: total ? Math.round((present / total) * 100) : 0 };
      },

      // ── Timetable ──
      addTimetableSlot: (slot) => {
        const id = generateId();
        set((state) => ({ timetable: [...state.timetable, { id, ...slot }] }));
      },
      deleteTimetableSlot: (id) => set((state) => ({
        timetable: state.timetable.filter((s) => s.id !== id),
      })),

      // ── Study Sessions ──
      addStudySession: (session) => {
        const id = generateId();
        set((state) => ({ studySessions: [...state.studySessions, { id, createdAt: new Date().toISOString(), ...session }] }));
      },
    }),
    { name: 'academic-store' }
  )
);
