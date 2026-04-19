import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '../utils/helpers';

export const useVaultStore = create(
  persist(
    (set) => ({
      masterPin: null,
      passwords: [],
      bankDetails: [],
      privateNotes: '',

      setMasterPin: (pin) => set({ masterPin: pin }),

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

      updatePrivateNotes: (notes) => set({ privateNotes: notes })
    }),
    {
      name: 'vault-storage'
    }
  )
);
