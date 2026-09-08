/*==================================================*
 * VVCMS GUARDS.JS
 * Route Protection
 *==================================================*/

import {

    authListener

} from "./auth.js";


// ==========================================
// REQUIRE LOGIN
// ==========================================

export function requireLogin(){

    authListener(user=>{

        if(!user){

            window.location.href="login.html";

        }

    });

}


// ==========================================
// REDIRECT IF LOGGED IN
// ==========================================

export function redirectIfLoggedIn(){

    authListener(user=>{

        if(user){

            window.location.href="dashboard.html";

        }

    });

}