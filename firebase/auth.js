/*==================================================*
 * VVCMS AUTH.JS
 * Firebase Authentication Manager
 * Vidya Vision Classes
 *==================================================*/

import {
    auth
} from "./firebase.js";

import {

    signInWithEmailAndPassword,

    signOut,

    onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


// ==========================================
// LOGIN
// ==========================================

export async function login(email,password){

    return await signInWithEmailAndPassword(

        auth,

        email,

        password

    );

}


// ==========================================
// LOGOUT
// ==========================================

export async function logout(){

    return await signOut(auth);

}


// ==========================================
// CURRENT USER
// ==========================================

export function currentUser(){

    return auth.currentUser;

}


// ==========================================
// AUTH STATE
// ==========================================

export function authListener(callback){

    return onAuthStateChanged(

        auth,

        callback

    );

}