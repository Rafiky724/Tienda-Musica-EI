// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth, setPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js"

import { getFirestore  } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js"

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDTETsRKuAfD0HKrFiIq_Eka7QAtPqvTaQ",
    authDomain: "bdatos-tiendau.firebaseapp.com",
    projectId: "bdatos-tiendau",
    storageBucket: "bdatos-tiendau.appspot.com",
    messagingSenderId: "533393384068",
    appId: "1:533393384068:web:f06b64e1313cd93a9e18d1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

setPersistence(auth, browserSessionPersistence);
export { auth };

export const db = getFirestore(app);