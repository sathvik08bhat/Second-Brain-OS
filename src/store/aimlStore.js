import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '../utils/helpers';

// Pre-populated ML roadmap categories
const DEFAULT_ROADMAP = [
  {
    id: 'math-foundations',
    category: 'Math Foundations',
    color: '#8b5cf6',
    topics: [
      { id: 'linear-algebra', name: 'Linear Algebra', status: 'not-started', notes: '', resources: [], deadline: null },
      { id: 'probability', name: 'Probability & Statistics', status: 'not-started', notes: '', resources: [], deadline: null },
      { id: 'calculus', name: 'Calculus (Multivariate)', status: 'not-started', notes: '', resources: [], deadline: null },
      { id: 'optimization', name: 'Optimization Theory', status: 'not-started', notes: '', resources: [], deadline: null },
    ]
  },
  {
    id: 'ml-basics',
    category: 'ML Fundamentals',
    color: '#3b82f6',
    topics: [
      { id: 'supervised', name: 'Supervised Learning', status: 'not-started', notes: '', resources: [], deadline: null },
      { id: 'unsupervised', name: 'Unsupervised Learning', status: 'not-started', notes: '', resources: [], deadline: null },
      { id: 'regression', name: 'Regression Models', status: 'not-started', notes: '', resources: [], deadline: null },
      { id: 'classification', name: 'Classification Models', status: 'not-started', notes: '', resources: [], deadline: null },
      { id: 'evaluation', name: 'Model Evaluation & Metrics', status: 'not-started', notes: '', resources: [], deadline: null },
      { id: 'feature-eng', name: 'Feature Engineering', status: 'not-started', notes: '', resources: [], deadline: null },
    ]
  },
  {
    id: 'deep-learning',
    category: 'Deep Learning',
    color: '#ef4444',
    topics: [
      { id: 'neural-nets', name: 'Neural Networks Basics', status: 'not-started', notes: '', resources: [], deadline: null },
      { id: 'cnn', name: 'CNNs (Convolutional)', status: 'not-started', notes: '', resources: [], deadline: null },
      { id: 'rnn', name: 'RNNs & LSTMs', status: 'not-started', notes: '', resources: [], deadline: null },
      { id: 'transformers', name: 'Transformers & Attention', status: 'not-started', notes: '', resources: [], deadline: null },
      { id: 'gans', name: 'GANs', status: 'not-started', notes: '', resources: [], deadline: null },
      { id: 'autoencoders', name: 'Autoencoders', status: 'not-started', notes: '', resources: [], deadline: null },
    ]
  },
  {
    id: 'nlp',
    category: 'NLP',
    color: '#10b981',
    topics: [
      { id: 'text-preprocess', name: 'Text Preprocessing', status: 'not-started', notes: '', resources: [], deadline: null },
      { id: 'word-embeddings', name: 'Word Embeddings', status: 'not-started', notes: '', resources: [], deadline: null },
      { id: 'language-models', name: 'Language Models', status: 'not-started', notes: '', resources: [], deadline: null },
      { id: 'llms', name: 'LLMs & Fine-tuning', status: 'not-started', notes: '', resources: [], deadline: null },
      { id: 'rag', name: 'RAG Systems', status: 'not-started', notes: '', resources: [], deadline: null },
    ]
  },
  {
    id: 'cv',
    category: 'Computer Vision',
    color: '#f59e0b',
    topics: [
      { id: 'image-basics', name: 'Image Processing', status: 'not-started', notes: '', resources: [], deadline: null },
      { id: 'object-detection', name: 'Object Detection', status: 'not-started', notes: '', resources: [], deadline: null },
      { id: 'segmentation', name: 'Image Segmentation', status: 'not-started', notes: '', resources: [], deadline: null },
      { id: 'image-gen', name: 'Image Generation', status: 'not-started', notes: '', resources: [], deadline: null },
    ]
  },
  {
    id: 'mlops',
    category: 'MLOps & Deployment',
    color: '#06b6d4',
    topics: [
      { id: 'experiment-tracking', name: 'Experiment Tracking (W&B, MLflow)', status: 'not-started', notes: '', resources: [], deadline: null },
      { id: 'model-serving', name: 'Model Serving & APIs', status: 'not-started', notes: '', resources: [], deadline: null },
      { id: 'docker-ml', name: 'Docker for ML', status: 'not-started', notes: '', resources: [], deadline: null },
      { id: 'cloud-ml', name: 'Cloud ML (AWS/GCP)', status: 'not-started', notes: '', resources: [], deadline: null },
    ]
  },
];

export const TOPIC_STATUS = {
  'not-started': { label: 'Not Started', color: '#64748b' },
  'learning': { label: 'Learning', color: '#f59e0b' },
  'confident': { label: 'Confident', color: '#3b82f6' },
  'mastered': { label: 'Mastered', color: '#10b981' },
};

export const useAimlStore = create(
  persist(
    (set, get) => ({
      // ── Roadmap ──
      roadmap: DEFAULT_ROADMAP,

      updateTopicStatus: (categoryId, topicId, status) => set((s) => ({
        roadmap: s.roadmap.map(cat =>
          cat.id === categoryId ? {
            ...cat,
            topics: cat.topics.map(t => t.id === topicId ? { ...t, status } : t)
          } : cat
        )
      })),

      updateTopicNotes: (categoryId, topicId, notes) => set((s) => ({
        roadmap: s.roadmap.map(cat =>
          cat.id === categoryId ? {
            ...cat,
            topics: cat.topics.map(t => t.id === topicId ? { ...t, notes } : t)
          } : cat
        )
      })),

      updateTopicDeadline: (categoryId, topicId, deadline) => set((s) => ({
        roadmap: s.roadmap.map(cat =>
          cat.id === categoryId ? {
            ...cat,
            topics: cat.topics.map(t => t.id === topicId ? { ...t, deadline } : t)
          } : cat
        )
      })),

      addCustomTopic: (categoryId, topic) => set((s) => ({
        roadmap: s.roadmap.map(cat =>
          cat.id === categoryId ? {
            ...cat,
            topics: [...cat.topics, { id: generateId(), status: 'not-started', notes: '', resources: [], deadline: null, ...topic }]
          } : cat
        )
      })),

      deleteTopic: (categoryId, topicId) => set((s) => ({
        roadmap: s.roadmap.map(cat =>
          cat.id === categoryId ? {
            ...cat,
            topics: cat.topics.filter(t => t.id !== topicId)
          } : cat
        )
      })),

      addCategory: (category) => set((s) => ({
        roadmap: [...s.roadmap, { id: generateId(), topics: [], ...category }]
      })),

      deleteCategory: (categoryId) => set((s) => ({
        roadmap: s.roadmap.filter(c => c.id !== categoryId)
      })),

      // ── Courses ──
      courses: [],

      addCourse: (course) => set((s) => ({
        courses: [...s.courses, {
          id: generateId(),
          createdAt: new Date().toISOString(),
          status: 'planned',
          progress: 0,
          deadline: null,
          googleCalendarEventId: null,
          ...course
        }]
      })),

      updateCourse: (id, u) => set((s) => ({
        courses: s.courses.map(c => c.id === id ? { ...c, ...u } : c)
      })),

      deleteCourse: (id) => set((s) => ({
        courses: s.courses.filter(c => c.id !== id)
      })),

      // ── Projects ──
      projects: [],

      addProject: (project) => set((s) => ({
        projects: [...s.projects, {
          id: generateId(),
          createdAt: new Date().toISOString(),
          status: 'ideation',
          deadline: null,
          googleCalendarEventId: null,
          ...project
        }]
      })),

      updateProject: (id, u) => set((s) => ({
        projects: s.projects.map(p => p.id === id ? { ...p, ...u } : p)
      })),

      deleteProject: (id) => set((s) => ({
        projects: s.projects.filter(p => p.id !== id)
      })),

      // ── Papers ──
      papers: [],

      addPaper: (paper) => set((s) => ({
        papers: [...s.papers, {
          id: generateId(),
          createdAt: new Date().toISOString(),
          readStatus: 'to-read',
          notes: '',
          tags: [],
          ...paper
        }]
      })),

      updatePaper: (id, u) => set((s) => ({
        papers: s.papers.map(p => p.id === id ? { ...p, ...u } : p)
      })),

      deletePaper: (id) => set((s) => ({
        papers: s.papers.filter(p => p.id !== id)
      })),

      // ── Study Log ──
      studyLogs: [],

      addStudyLog: (log) => set((s) => ({
        studyLogs: [...s.studyLogs, {
          id: generateId(),
          date: new Date().toISOString().split('T')[0],
          ...log
        }]
      })),

      deleteStudyLog: (id) => set((s) => ({
        studyLogs: s.studyLogs.filter(l => l.id !== id)
      })),

      // ── Computed ──
      getRoadmapProgress: () => {
        const roadmap = get().roadmap;
        const allTopics = roadmap.flatMap(c => c.topics);
        const mastered = allTopics.filter(t => t.status === 'mastered').length;
        const confident = allTopics.filter(t => t.status === 'confident').length;
        return {
          total: allTopics.length,
          mastered,
          confident,
          learning: allTopics.filter(t => t.status === 'learning').length,
          notStarted: allTopics.filter(t => t.status === 'not-started').length,
          progressPercent: allTopics.length > 0 ? Math.round(((mastered * 1 + confident * 0.7) / allTopics.length) * 100) : 0,
        };
      },
    }),
    { name: 'aiml-store' }
  )
);
