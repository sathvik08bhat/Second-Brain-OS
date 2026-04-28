import { useEffect, useRef } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNoteStore } from '../store/noteStore';
import { useGoogleStore } from '../store/googleStore';

const COLLECTION = 'notes';
let debounceTimer = null;

/**
 * Custom hook that binds the noteStore to Firestore.
 * Pushes TipTap JSON output to the notes collection via debounced auto-save.
 * All reads/writes are scoped to the active user ID.
 */
export function useNotesSync() {
  const userEmail = useGoogleStore((s) => s.userEmail);
  const isAuthenticated = useGoogleStore((s) => s.isAuthenticated);
  const activeNoteId = useNoteStore((s) => s.activeNoteId);
  const activeContent = useNoteStore((s) => s.activeContent);
  const lastSaved = useNoteStore((s) => s.lastSaved);
  const prevSaved = useRef(lastSaved);

  useEffect(() => {
    // Only sync when lastSaved changes (i.e., the debounced save in noteStore fired)
    if (!isAuthenticated || !userEmail || !activeNoteId) return;
    if (prevSaved.current === lastSaved) return;
    prevSaved.current = lastSaved;

    // Debounce the Firestore write
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      try {
        const docRef = doc(db, COLLECTION, `${userEmail}_${activeNoteId}`);
        await setDoc(docRef, {
          userId: userEmail,
          noteId: activeNoteId,
          content: activeContent,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
        console.log('[NotesSync] Synced to Firestore:', activeNoteId);
      } catch (err) {
        console.error('[NotesSync] Sync error:', err);
      }
    }, 500);

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [lastSaved, isAuthenticated, userEmail, activeNoteId, activeContent]);
}
