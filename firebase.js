import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAARjP1Q7v2TUKfduR1qnwwlrBSAX0kXBQ",
  authDomain: "animeverse-7817e.firebaseapp.com",
  projectId: "animeverse-7817e",
  storageBucket: "animeverse-7817e.firebasestorage.app",
  messagingSenderId: "1014549663659",
  appId: "1:1014549663659:web:f50a326ae1306df81d4cee"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);