import { create } from 'zustand';
import { generateId } from '../utils/helpers';

export const useVaultStore = create((set) => ({
  isUnlocked: false,
  passwords: [],
  bankDetails: [],
  secureNotes: [],
  files: [],

  // Hard set the volatile state upon decryption
  unlockVault: (data) => set({
    isUnlocked: true,
    passwords: data.passwords || [],
    bankDetails: data.bankDetails || [],
    secureNotes: data.secureNotes || [],
    files: data.files || []
  }),

  // Wipe the volatile state from RAM
  lockVault: () => set({
    isUnlocked: false,
    passwords: [],
    bankDetails: [],
    secureNotes: [],
    files: []
  }),

  addPassword: (data) => set((state) => ({
    passwords: [...state.passwords, { id: generateId(), createdAt: new Date().toISOString(), ...data }]
  })),
  
  deletePassword: (id) => set((state) => ({
    passwords: state.passwords.filter((p) => p.id !== id)
  })),

  addBankDetail: (data) => set((state) => ({
    bankDetails: [...state.bankDetails, { id: generateId(), createdAt: new Date().toISOString(), ...data }]
  })),

  deleteBankDetail: (id) => set((state) => ({
    bankDetails: state.bankDetails.filter((b) => b.id !== id)
  })),

  addSecureNote: (data) => set((state) => ({
    secureNotes: [...state.secureNotes, { id: generateId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), title: data.title || 'Untitled', content: data.content || '' }]
  })),

  updateSecureNote: (id, content, title) => set((state) => ({
    secureNotes: state.secureNotes.map((n) => n.id === id ? { ...n, content: content !== undefined ? content : n.content, title: title !== undefined ? title : n.title, updatedAt: new Date().toISOString() } : n)
  })),

  deleteSecureNote: (id) => set((state) => ({
    secureNotes: state.secureNotes.filter((n) => n.id !== id)
  })),

  addFile: (data) => set((state) => ({
    files: [...state.files, { id: generateId(), createdAt: new Date().toISOString(), ...data }]
  })),

  deleteFile: (id) => set((state) => ({
    files: state.files.filter((f) => f.id !== id)
  }))
}));
