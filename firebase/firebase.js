/*==================================================*
 * VVCMS FIREBASE
 * Vidya Vision Classes
 *==================================================*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const firebaseConfig = {

   apiKey: "AIzaSyC0yiorscrHdx_8Ristr90VVlXCK4okHfo",

    authDomain: "vidya-vision-classes.firebaseapp.com",

    projectId: "vidya-vision-classes",

    storageBucket: "vidya-vision-classes.firebasestorage.app",

    messagingSenderId: "12515189944",

    appId: "1:12515189944:web:421d2ab2ee375533bac04d"

};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

export { app, auth, db };

export default app;