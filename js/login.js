/*==================================================*
 * VVCMS LOGIN.JS
 * Firebase Authentication
 * Vidya Vision Classes
 *==================================================*/

import { login } from "../firebase/auth.js";

// ==========================================
// ELEMENTS
// ==========================================

const loginForm = document.getElementById("loginForm");

const emailInput = document.getElementById("username");

const passwordInput = document.getElementById("password");

const remember = document.getElementById("remember");

const loginBtn = document.getElementById("loginBtn");

const errorMessage = document.getElementById("errorMessage");

const togglePassword = document.getElementById("togglePassword");

const year = document.getElementById("year");

// ==========================================
// CURRENT YEAR
// ==========================================

if (year) {

    year.textContent = new Date().getFullYear();

}

// ==========================================
// REMEMBER EMAIL
// ==========================================

const savedEmail = localStorage.getItem("vvc_email");

if (savedEmail) {

    emailInput.value = savedEmail;

    remember.checked = true;

}

// ==========================================
// PASSWORD TOGGLE
// ==========================================

togglePassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        togglePassword.innerHTML =
            '<i class="fa-solid fa-eye-slash"></i>';

    }

    else {

        passwordInput.type = "password";

        togglePassword.innerHTML =
            '<i class="fa-solid fa-eye"></i>';

    }

});

// ==========================================
// LOGIN
// ==========================================

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    errorMessage.textContent = "";

    const email = emailInput.value.trim();

    const password = passwordInput.value.trim();

    if (email === "") {

        errorMessage.textContent =
            "Please enter your email.";

        emailInput.focus();

        return;

    }

    if (password === "") {

        errorMessage.textContent =
            "Please enter your password.";

        passwordInput.focus();

        return;

    }

    loginBtn.disabled = true;

    loginBtn.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Logging In...';

    try {

        await login(

            email,

            password

        );

        if (remember.checked) {

            localStorage.setItem(

                "vvc_email",

                email

            );

        }

        else {

            localStorage.removeItem(

                "vvc_email"

            );

        }

        sessionStorage.setItem(

            "vvc_logged_in",

            "true"

        );

        loginBtn.innerHTML =
            '<i class="fa-solid fa-check"></i> Login Successful';

        setTimeout(() => {

            window.location.href =
                "dashboard.html";

        }, 1000);

    }

    catch (error) {

        loginBtn.disabled = false;

        loginBtn.innerHTML =
            '<i class="fa-solid fa-right-to-bracket"></i> Login';

        passwordInput.value = "";

        passwordInput.focus();

        switch (error.code) {

            case "auth/invalid-email":

                errorMessage.textContent =
                    "Invalid email address.";

                break;

            case "auth/invalid-credential":

                errorMessage.textContent =
                    "Incorrect email or password.";

                break;

            case "auth/user-not-found":

                errorMessage.textContent =
                    "No account found.";

                break;

            case "auth/wrong-password":

                errorMessage.textContent =
                    "Incorrect password.";

                break;

            case "auth/too-many-requests":

                errorMessage.textContent =
                    "Too many login attempts. Please try again later.";

                break;

            case "auth/network-request-failed":

                errorMessage.textContent =
                    "Network error. Check your internet connection.";

                break;

            default:

                errorMessage.textContent =
                    error.message;

        }

    }

});

// ==========================================
// ENTER KEY SUPPORT
// ==========================================

passwordInput.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {

        loginForm.requestSubmit();

    }

});

// ==========================================
// TIME BASED BACKGROUND
// ==========================================

const hour = new Date().getHours();

document.body.classList.remove(

    "morning-theme",

    "afternoon-theme",

    "evening-theme",

    "night-theme"

);

if (hour >= 5 && hour < 12) {

    document.body.classList.add(

        "morning-theme"

    );

}

else if (hour >= 12 && hour < 17) {

    document.body.classList.add(

        "afternoon-theme"

    );

}

else if (hour >= 17 && hour < 20) {

    document.body.classList.add(

        "evening-theme"

    );

}

else {

    document.body.classList.add(

        "night-theme"

    );

}

console.log(

    "VVCMS Firebase Login Loaded Successfully 🚀"

);