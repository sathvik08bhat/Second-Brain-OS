import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBWZI2ZBP5oyikt6PdRN-PugpL1i31N0Q0",
  authDomain: "second-brain-os-b90d4.firebaseapp.com",
  projectId: "second-brain-os-b90d4",
  storageBucket: "second-brain-os-b90d4.firebasestorage.app",
  messagingSenderId: "371427254316",
  appId: "1:371427254316:web:78a3536607ff998d417189",
  measurementId: "G-6L1CYV08ZJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  try {
    const d = doc(db, 'users', 'test@test.com');
    console.log('Attempting write...');
    await setDoc(d, { test: 1 }, { merge: true });
    console.log("Write success!");
    console.log('Attempting read...');
    const snap = await getDoc(d);
    console.log("Read success!", snap.data());
  } catch (e) {
    console.error("Firebase Error:", e.message);
  }
}
test();
