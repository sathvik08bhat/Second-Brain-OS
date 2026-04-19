import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '../utils/helpers';

export const STARTUP_COLLECTIONS = {
  // Executive Board
  okrs: 'OKRs & Strategy',
  b2cMatrix: 'The B2C Matrix',
  companyWiki: 'Company Wiki',

  // Engineering & Product
  productRoadmap: 'Product Roadmap',
  tasks: 'Sprint Kanban', // previously 'tasks'
  bugTracker: 'Bug & Issue Tracker',
  architectureDB: 'Architecture & Systems',

  // Growth & Marketing
  gtmCampaigns: 'Go-To-Market Campaigns',
  assetLibrary: 'Content & Asset Library',
  userAcquisitionLogs: 'User Acquisition Log',

  // Sales & B2B Integration
  dealPipeline: 'Deal Pipeline',
  partnerDirectory: 'Partner Directory',

  // Operations & HR
  team: 'Team Roster & Access', // previously 'team'
  sopDB: 'Standard Operating Procedures',
  meetingNotes: 'Meeting Agendas & Notes',

  // Finance & Investor Relations
  capTable: 'Cap Table & Equity',
  finances: 'Runway & Burn Rate', // previously 'finances'
  investorPipeline: 'Investor Pitch Pipeline',
};

// Map collections to default column structures for the generic UI
export const DB_SCHEMAS = {
  okrs: [{ key: 'title', label: 'Objective', type: 'text' }, { key: 'status', label: 'Status', type: 'status' }, { key: 'progress', label: 'Progress (%)', type: 'number' }],
  b2cMatrix: [{ key: 'title', label: 'Idea', type: 'text' }, { key: 'demand', label: 'Demand', type: 'status' }, { key: 'supply', label: 'Supply', type: 'status' }, { key: 'verdict', label: 'Verdict', type: 'status' }],
  companyWiki: [{ key: 'title', label: 'Document', type: 'text' }, { key: 'category', label: 'Category', type: 'text' }, { key: 'url', label: 'Link', type: 'link' }],
  productRoadmap: [{ key: 'title', label: 'Epic', type: 'text' }, { key: 'quarter', label: 'Quarter', type: 'text' }, { key: 'status', label: 'Status', type: 'status' }],
  bugTracker: [{ key: 'title', label: 'Issue', type: 'text' }, { key: 'severity', label: 'Severity', type: 'status' }, { key: 'status', label: 'Status', type: 'status' }],
  architectureDB: [{ key: 'title', label: 'System', type: 'text' }, { key: 'type', label: 'Type', type: 'text' }, { key: 'url', label: 'Docs Link', type: 'link' }],
  gtmCampaigns: [{ key: 'title', label: 'Campaign', type: 'text' }, { key: 'budget', label: 'Budget ($)', type: 'number' }, { key: 'status', label: 'Status', type: 'status' }],
  assetLibrary: [{ key: 'title', label: 'Asset Name', type: 'text' }, { key: 'type', label: 'Type', type: 'text' }, { key: 'url', label: 'URL', type: 'link' }],
  userAcquisitionLogs: [{ key: 'title', label: 'Metric', type: 'text' }, { key: 'value', label: 'Value', type: 'number' }, { key: 'date', label: 'Date recorded', type: 'text' }],
  dealPipeline: [{ key: 'title', label: 'Client', type: 'text' }, { key: 'value', label: 'Deal Size ($)', type: 'number' }, { key: 'stage', label: 'Stage', type: 'status' }],
  partnerDirectory: [{ key: 'title', label: 'Partner', type: 'text' }, { key: 'type', label: 'Type', type: 'text' }, { key: 'contact', label: 'Contact Info', type: 'text' }],
  sopDB: [{ key: 'title', label: 'Process', type: 'text' }, { key: 'department', label: 'Department', type: 'text' }, { key: 'url', label: 'Document Link', type: 'link' }],
  meetingNotes: [{ key: 'title', label: 'Meeting', type: 'text' }, { key: 'date', label: 'Date', type: 'text' }, { key: 'actionItems', label: 'Action Items', type: 'text' }],
  capTable: [{ key: 'title', label: 'Entity/Person', type: 'text' }, { key: 'equity', label: 'Equity (%)', type: 'number' }, { key: 'shares', label: 'Shares', type: 'number' }],
  investorPipeline: [{ key: 'title', label: 'Investor/VC', type: 'text' }, { key: 'stage', label: 'Pitch Stage', type: 'status' }, { key: 'feedback', label: 'Feedback', type: 'text' }],
};

export const useStartupStore = create(
  persist(
    (set) => ({
      ideas: [], // Kept for legacy Ideas Lab if needed
      milestones: [],

      // Initialize all new DB arrays
      okrs: [],
      b2cMatrix: [],
      companyWiki: [],
      productRoadmap: [],
      tasks: [],
      bugTracker: [],
      architectureDB: [],
      gtmCampaigns: [],
      assetLibrary: [],
      userAcquisitionLogs: [],
      dealPipeline: [],
      partnerDirectory: [],
      team: [],
      sopDB: [],
      meetingNotes: [],
      capTable: [],
      finances: [],
      investorPipeline: [],

      // Legacy specific methods for specific UI components
      addIdea: (i) => set((s) => ({ ideas: [...s.ideas, { id: generateId(), createdAt: new Date().toISOString(), status: 'brainstorm', validationScore: 0, ...i }] })),
      updateIdea: (id, u) => set((s) => ({ ideas: s.ideas.map((i) => i.id === id ? { ...i, ...u } : i) })),
      deleteIdea: (id) => set((s) => ({ ideas: s.ideas.filter((i) => i.id !== id) })),

      addTask: (t) => set((s) => ({ tasks: [...s.tasks, { id: generateId(), createdAt: new Date().toISOString(), status: 'backlog', ...t }] })),
      updateTask: (id, u) => set((s) => ({ tasks: s.tasks.map((t) => t.id === id ? { ...t, ...u } : t) })),
      deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
      moveTask: (id, status) => set((s) => ({ tasks: s.tasks.map((t) => t.id === id ? { ...t, status } : t) })),

      addFinance: (f) => set((s) => ({ finances: [...s.finances, { id: generateId(), createdAt: new Date().toISOString(), ...f }] })),
      updateFinance: (id, u) => set((s) => ({ finances: s.finances.map((f) => f.id === id ? { ...f, ...u } : f) })),
      deleteFinance: (id) => set((s) => ({ finances: s.finances.filter((f) => f.id !== id) })),

      // ── Generic DB Methods (For all the new dynamic tables) ──
      addGenericItem: (collectionKey, item) => set((s) => ({
        [collectionKey]: [...(s[collectionKey] || []), { id: generateId(), createdAt: new Date().toISOString(), ...item }]
      })),
      
      updateGenericItem: (collectionKey, id, updates) => set((s) => ({
        [collectionKey]: (s[collectionKey] || []).map((item) => item.id === id ? { ...item, ...updates } : item)
      })),
      
      deleteGenericItem: (collectionKey, id) => set((s) => ({
        [collectionKey]: (s[collectionKey] || []).filter((item) => item.id !== id)
      })),

    }),
    { name: 'startup-store' }
  )
);
