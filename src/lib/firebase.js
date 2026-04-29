import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "second-brain-os-b90d4.firebaseapp.com",
  projectId: "second-brain-os-b90d4",
  storageBucket: "second-brain-os-b90d4.firebasestorage.app",
  messagingSenderId: "371427254316",
  appId: "1:371427254316:web:78a3536607ff998d417189",
  measurementId: "G-6L1CYV08ZJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore
export const db = getFirestore(app);
