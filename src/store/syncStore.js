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
import { usePlacementStore } from './placementStore';
import { useStartupStore } from './startupStore';
import { useTaskStore } from './taskStore';
import { useTravelStore } from './travelStore';
import { useVaultStore } from './vaultStore';

export const allStores = {
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
  placement: usePlacementStore,
  startup: useStartupStore,
  travel: useTravelStore,
  vault: useVaultStore,
};

// Extract only serializable data from a store state (strip functions)
function extractData(storeState) {
  const data = {};
  for (const [key, value] of Object.entries(storeState)) {
    if (typeof value !== 'function') {
      data[key] = value;
    }
  }
  return data;
}

// Collect all store data for syncing
function collectAllStoreData() {
  const payload = {};
  for (const [name, store] of Object.entries(allStores)) {
    payload[name] = extractData(store.getState());
  }
  // Add a timestamp so we can see when data was last written
  payload._lastUpdated = new Date().toISOString();
  return payload;
}

export const useSyncStore = create((set, get) => ({
  isSyncing: false,
  lastSynced: null,
  syncError: null,
  syncLog: [], // visible log of recent sync actions

  addLog: (msg) => {
    const entry = `[${new Date().toLocaleTimeString()}] ${msg}`;
    console.log('[SYNC]', msg);
    set((s) => ({ syncLog: [...s.syncLog.slice(-19), entry] }));
  },

  pullFromCloud: async (userEmail) => {
    const { addLog } = get();
    if (!userEmail) {
      addLog('PULL SKIPPED: no userEmail');
      return;
    }
    addLog(`PULL START for ${userEmail}`);
    set({ isSyncing: true, syncError: null });
    try {
      const docRef = doc(db, 'users', userEmail);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const storeKeys = Object.keys(allStores);
        const foundKeys = storeKeys.filter(k => data[k]);
        addLog(`PULL GOT ${foundKeys.length}/${storeKeys.length} stores from cloud`);

        // Apply cloud data to local stores
        isHydratingFromCloud = true;
        for (const key of foundKeys) {
          allStores[key].setState(data[key]);
        }
        setTimeout(() => { isHydratingFromCloud = false; }, 500);

        set({ lastSynced: Date.now() });
        addLog('PULL SUCCESS');
      } else {
        addLog('PULL: No cloud document found. Pushing local data to initialize.');
        await get().pushToCloud(userEmail);
      }
    } catch (e) {
      addLog(`PULL ERROR: ${e.message}`);
      set({ syncError: e.message });
    } finally {
      set({ isSyncing: false });
    }
  },

  pushToCloud: async (userEmail) => {
    const { addLog } = get();
    if (!userEmail) {
      addLog('PUSH SKIPPED: no userEmail');
      return;
    }
    set({ isSyncing: true, syncError: null });
    try {
      const payload = collectAllStoreData();
      const docRef = doc(db, 'users', userEmail);
      await setDoc(docRef, payload); // Full overwrite, not merge
      set({ lastSynced: Date.now() });
      addLog(`PUSH SUCCESS to ${userEmail}`);
    } catch (e) {
      addLog(`PUSH ERROR: ${e.message}`);
      set({ syncError: e.message });
    } finally {
      set({ isSyncing: false });
    }
  },

  // Force push from current device — useful for debugging
  forcePush: async (userEmail) => {
    const { addLog } = get();
    addLog('FORCE PUSH triggered');
    await get().pushToCloud(userEmail);
  },

  // Force pull to current device — useful for debugging
  forcePull: async (userEmail) => {
    const { addLog } = get();
    addLog('FORCE PULL triggered');
    await get().pullFromCloud(userEmail);
  },
}));

// ── Auto-sync Module ──
let syncInitialized = false;
let isHydratingFromCloud = false;
let unsubSnapshot = null;

export const initAutoSync = (googleStoreHook) => {
  const log = (msg) => useSyncStore.getState().addLog(msg);
  const email = googleStoreHook.getState().userEmail;

  // Reset if we're re-initializing (e.g. login/logout)
  if (unsubSnapshot) {
    unsubSnapshot();
    unsubSnapshot = null;
  }
  syncInitialized = false;

  if (!email) {
    log('AUTO-SYNC ABORTED: no email in googleStore');
    return;
  }

  if (syncInitialized) return;
  syncInitialized = true;

  log(`AUTO-SYNC INIT for ${email}`);

  // ── 1. Subscribe to local store changes → push to cloud ──
  let debounceTimeout;
  const handleLocalChange = () => {
    if (isHydratingFromCloud) return;
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      const currentEmail = googleStoreHook.getState().userEmail;
      if (currentEmail) {
        useSyncStore.getState().pushToCloud(currentEmail);
      }
    }, 500);
  };

  Object.entries(allStores).forEach(([name, store]) => {
    store.subscribe(() => {
      handleLocalChange();
    });
  });
  log('Subscribed to all local stores');

  // ── 2. Listen to remote changes → pull to local ──
  try {
    unsubSnapshot = onSnapshot(doc(db, 'users', email), (docSnap) => {
      if (!docSnap.exists()) {
        log('SNAPSHOT: no document exists yet');
        return;
      }

      // Ignore if WE just pushed (prevents echo)
      if (useSyncStore.getState().isSyncing) return;

      const data = docSnap.data();
      log('SNAPSHOT: received remote update');

      isHydratingFromCloud = true;
      Object.keys(allStores).forEach((key) => {
        if (data[key]) {
          allStores[key].setState(data[key]);
        }
      });

      setTimeout(() => {
        isHydratingFromCloud = false;
        useSyncStore.setState({ lastSynced: Date.now() });
        log('SNAPSHOT: applied remote data');
      }, 500);
    }, (error) => {
      log(`SNAPSHOT ERROR: ${error.message}`);
    });
    log('Real-time listener active');
  } catch (e) {
    log(`SNAPSHOT SETUP ERROR: ${e.message}`);
  }
};
