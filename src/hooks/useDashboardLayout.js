import { useEffect, useCallback, useRef } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useGoogleStore } from '../store/googleStore';

const COLLECTION = 'user_layouts';

/**
 * Custom hook that syncs react-grid-layout coordinates with Firestore.
 * Fetches layout on load, and updates Firestore when widgets are moved/resized.
 */
export function useDashboardLayout(layout, setLayout) {
  const userEmail = useGoogleStore((s) => s.userEmail);
  const isAuthenticated = useGoogleStore((s) => s.isAuthenticated);
  const hasFetched = useRef(false);

  // Fetch layout from Firestore on mount
  useEffect(() => {
    if (!isAuthenticated || !userEmail || hasFetched.current) return;

    const fetchLayout = async () => {
      try {
        const docRef = doc(db, COLLECTION, userEmail);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.layout && Array.isArray(data.layout)) {
            setLayout(data.layout);
            console.log('[DashboardLayout] Loaded from Firestore');
          }
        }
        hasFetched.current = true;
      } catch (err) {
        console.error('[DashboardLayout] Fetch error:', err);
      }
    };

    fetchLayout();
  }, [isAuthenticated, userEmail, setLayout]);

  // Save layout to Firestore when changed
  const saveLayout = useCallback(
    async (newLayout) => {
      setLayout(newLayout);

      if (!isAuthenticated || !userEmail) return;

      try {
        const docRef = doc(db, COLLECTION, userEmail);
        await setDoc(docRef, {
          layout: newLayout,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
        console.log('[DashboardLayout] Saved to Firestore');
      } catch (err) {
        console.error('[DashboardLayout] Save error:', err);
      }
    },
    [isAuthenticated, userEmail, setLayout]
  );

  return { saveLayout };
}
