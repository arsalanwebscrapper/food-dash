import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableNetwork } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBWCnV_6CG7SsVC_lmHZUif5LekkSV06Xk",
  authDomain: "foodpanda-8a673.firebaseapp.com",
  databaseURL: "https://foodpanda-8a673-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "foodpanda-8a673",
  storageBucket: "foodpanda-8a673.firebasestorage.app",
  messagingSenderId: "256873811580",
  appId: "1:256873811580:web:c25c911d1fba598e7383f9",
  measurementId: "G-5JDZ56CJEN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const realtimeDb = getDatabase(app);

// Enable network for better connectivity
enableNetwork(db).catch(console.error);

export default app;