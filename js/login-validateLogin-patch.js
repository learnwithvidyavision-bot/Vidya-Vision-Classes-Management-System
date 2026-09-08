/*==================================================
        UPDATED validateLogin() FUNCTION
   Replace your existing validateLogin() function
   in js/login.js with this version. Everything
   else in your login.js stays the same.
==================================================*/

function validateLogin(){

    const username=document.getElementById("username");
    const password=document.getElementById("password");
    const remember=document.getElementById("remember");
    const error=document.getElementById("errorMessage");
    const loginBtn=document.getElementById("loginBtn");

    const user=username.value.trim();
    const pass=password.value.trim();

    error.textContent="";

    /* Empty Username */

    if(user===""){

        error.textContent="Please enter your username.";

        username.focus();

        return;

    }

    /* Empty Password */

    if(pass===""){

        error.textContent="Please enter your password.";

        password.focus();

        return;

    }

    /* Load custom credentials from Settings page, fall back to defaults */

    const savedCreds = JSON.parse(localStorage.getItem("vvc_credentials")) || {};

    const validUsername = savedCreds.username || "founder.himanshu";
    const validPassword = savedCreds.password || "learn&earn";

    /* Correct Credentials */

    if(
        user===validUsername &&
        pass===validPassword
    ){

        /* Remember Username */

        if(remember.checked){

            localStorage.setItem(
                "vvc_username",
                user
            );

        }else{

            localStorage.removeItem(
                "vvc_username"
            );

        }

        /* Login Session */

        sessionStorage.setItem(
            "vvc_logged_in",
            "true"
        );

        /* Loading Button */

        loginBtn.disabled=true;

        loginBtn.innerHTML=
        '<i class="fa-solid fa-spinner fa-spin"></i> Logging In...';

        setTimeout(()=>{

            window.location.href="dashboard.html";

        },1500);

    }

    else{

        error.textContent=
        "Incorrect username or password.";

        password.value="";

        password.focus();

    }

}
