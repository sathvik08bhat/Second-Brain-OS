import { create } from 'zustand';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

import { useAcademicStore } from './academicStore';
import { useAimlStore } from './aimlStore';
import { useCatStore } from './catStore';
import { useClubStore } from './clubStore';
import { useDsaStore } from './dsaStore';
import { useFinanceStore } from './financeStore';
import { useFitnessStore } from './fitnessStore';
import { useGlobalStore } from './globalStore';
import { useGsocStore } from './gsocStore';
import { useHobbiesStore } from './hobbiesStore';
import { useLeadershipStore } from './leadershipStore';
import { useMentalHealthStore } from './mentalHealthStore';
import { usePersonalStore } from './personalStore';
import { usePlacementStore } from './placementStore';
import { useStartupStore } from './startupStore';
import { useTaskStore } from './taskStore';
import { useTravelStore } from './travelStore';
import { useVaultStore } from './vaultStore';

export const allStores = {
  academic: useAcademicStore,
  aiml: useAimlStore,
  cat: useCatStore,
  club: useClubStore,
  dsa: useDsaStore,
  finance: useFinanceStore,
  fitness: useFitnessStore,
  global: useGlobalStore,
  gsoc: useGsocStore,
  hobbies: useHobbiesStore,
  leadership: useLeadershipStore,
  mentalHealth: useMentalHealthStore,
  personal: usePersonalStore,
  placement: usePlacementStore,
  startup: useStartupStore,
  task: useTaskStore,
  travel: useTravelStore,
  vault: useVaultStore,
};

export const useSyncStore = create((set, get) => ({
  isSyncing: false,
  lastSynced: null,
  
  pullFromCloud: async (userEmail) => {
    if (!userEmail) return;
    set({ isSyncing: true });
    try {
      const docRef = doc(db, 'users', userEmail);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        Object.keys(allStores).forEach(key => {
          if (data[key]) {
            allStores[key].setState(data[key]);
          }
        });
        set({ lastSynced: Date.now() });
      } else {
        // If it doesn't exist, it means we should push our local state to initialize it
        get().pushToCloud(userEmail);
      }
    } catch (e) {
      console.error('Error pulling from cloud', e);
    } finally {
      set({ isSyncing: false });
    }
  },

  pushToCloud: async (userEmail) => {
    if (!userEmail) return;
    set({ isSyncing: true });
    try {
      const dataToSync = {};
      Object.keys(allStores).forEach(key => {
        dataToSync[key] = allStores[key].getState();
      });
      // Clone to remove non-serializable objects like functions
      const cleanedData = JSON.parse(JSON.stringify(dataToSync));
      
      const docRef = doc(db, 'users', userEmail);
      await setDoc(docRef, cleanedData, { merge: true });
      set({ lastSynced: Date.now() });
    } catch (e) {
      console.error('Error pushing to cloud', e);
    } finally {
      setTimeout(() => set({ isSyncing: false }), 500); // Small delay to show sync status in UI if needed
    }
  }
}));

// Setup automatic sync observer
let syncInitialized = false;
let isHydratingFromCloud = false;

export const initAutoSync = (googleStoreHook) => {
  if (syncInitialized) return;
  syncInitialized = true;
  
  let debounceTimeout;
  
  const handleStateChange = () => {
    if (isHydratingFromCloud) return; // Prevent loop: don't push if change came from cloud
    
    const email = googleStoreHook.getState().userEmail;
    if (!email) return;
    
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      useSyncStore.getState().pushToCloud(email);
    }, 300); // 300ms debounce for near-instant syncing
  };

  // Subscribing to all stores to capture local changes
  Object.values(allStores).forEach(store => {
    store.subscribe(() => {
        handleStateChange();
    });
  });

  // Listen to remote changes in real-time
  const email = googleStoreHook.getState().userEmail;
  if (email) {
    onSnapshot(doc(db, 'users', email), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        isHydratingFromCloud = true;
        
        Object.keys(allStores).forEach(key => {
          if (data[key]) {
            allStores[key].setState(data[key]);
          }
        });
        
        // Reset flag after Zustand state changes have settled
        setTimeout(() => {
            isHydratingFromCloud = false;
            useSyncStore.setState({ lastSynced: Date.now() });
        }, 1000);
      }
    });
  }
};
