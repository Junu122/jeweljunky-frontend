import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyCo6dXJwgAYyhAVywdaVfoUK8RJApNO3yo",
  authDomain: "jeweljunkie-518bf.firebaseapp.com",
  projectId: "jeweljunkie-518bf",
  storageBucket: "jeweljunkie-518bf.firebasestorage.app",
  messagingSenderId: "721712545236",
  appId: "1:721712545236:web:1fd005ca8d6569d63eea41",
  measurementId: "G-YCS8PKJ107"
};



const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
