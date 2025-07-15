import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCo6dXJwgAYyhAVywdaVfoUK8RJApNO3yo",
  authDomain: "jeweljunkie-518bf.firebaseapp.com",
  projectId: "jeweljunkie-518bf",
  storageBucket: "jeweljunkie-518bf.firebasestorage.app",
  messagingSenderId: "721712545236",
  appId: "1:721712545236:web:0b276cf6bd2c25603eea41",
  measurementId: "G-ZZEV3EZ5CH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;