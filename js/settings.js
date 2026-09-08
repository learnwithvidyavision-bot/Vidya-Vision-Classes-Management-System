/* ==================================================
   VVCMS SETTINGS.JS
   Vidya Vision Classes
   ================================================== */


/* ==================================================
   SESSION CHECK
   ================================================== */

if (
    sessionStorage.getItem("vvc_logged_in") !== "true"
) {

    window.location.href = "login.html";

}


/* ==================================================
   ELEMENTS
   ================================================== */

const profileForm =
    document.getElementById("profileForm");


const credentialsForm =
    document.getElementById("credentialsForm");


const darkModeToggle =
    document.getElementById("darkModeToggle");


const clearDataBtn =
    document.getElementById("clearDataBtn");


const togglePassword =
    document.getElementById("togglePassword");


const newPassword =
    document.getElementById("newPassword");


const teacherName =
    document.getElementById("teacherName");


const teacherRole =
    document.getElementById("teacherRole");


const instituteName =
    document.getElementById("instituteName");


const newUsername =
    document.getElementById("newUsername");


/* ==================================================
   LOADER
   ================================================== */

window.addEventListener(
    "load",
    () => {

        const loader =
            document.getElementById("loader");


        if (loader) {

            setTimeout(
                () => {

                    loader.style.opacity = "0";


                    setTimeout(
                        () => {

                            loader.style.display =
                                "none";

                        },
                        500
                    );

                },
                1200
            );

        }

    }
);


/* ==================================================
   LOAD SAVED PROFILE
   ================================================== */

const defaultProfile = {

    name:
        "Himanshu Gupta",

    role:
        "Founder",

    institute:
        "Vidya Vision Classes"

};


const savedProfile =

    JSON.parse(
        localStorage.getItem(
            "vvc_profile"
        )
    ) || defaultProfile;



teacherName.value =
    savedProfile.name || defaultProfile.name;


teacherRole.value =
    savedProfile.role || defaultProfile.role;


instituteName.value =
    savedProfile.institute ||
    defaultProfile.institute;


/* ==================================================
   SAVE PROFILE
   ================================================== */

profileForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        const profile = {

            name:
                teacherName.value.trim(),

            role:
                teacherRole.value.trim(),

            institute:
                instituteName.value.trim()

        };


        if (
            !profile.name ||
            !profile.role ||
            !profile.institute
        ) {

            alert(
                "Please fill in all profile fields."
            );

            return;

        }


        localStorage.setItem(

            "vvc_profile",

            JSON.stringify(profile)

        );


        alert(
            "Profile updated successfully!"
        );


        console.log(
            "Profile updated successfully."
        );

    }
);


/* ==================================================
   TOGGLE PASSWORD VISIBILITY
   ================================================== */

if (togglePassword) {

    togglePassword.addEventListener(
        "click",
        () => {


            if (
                newPassword.type ===
                "password"
            ) {

                newPassword.type =
                    "text";


                togglePassword.innerHTML =
                    '<i class="fa-solid fa-eye-slash"></i>';


                togglePassword.setAttribute(
                    "aria-label",
                    "Hide password"
                );

            } else {

                newPassword.type =
                    "password";


                togglePassword.innerHTML =
                    '<i class="fa-solid fa-eye"></i>';


                togglePassword.setAttribute(
                    "aria-label",
                    "Show password"
                );

            }

        }
    );

}


/* ==================================================
   UPDATE LOGIN CREDENTIALS
   ================================================== */

credentialsForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        const username =
            newUsername.value.trim();


        const password =
            newPassword.value.trim();


        /* ------------------------------
           VALIDATION
           ------------------------------ */

        if (
            !username &&
            !password
        ) {

            alert(
                "Enter a new username or password to update."
            );

            return;

        }


        /* ------------------------------
           LOAD CURRENT CREDENTIALS
           ------------------------------ */

        const credentials =

            JSON.parse(
                localStorage.getItem(
                    "vvc_credentials"
                )
            ) || {};


        /* ------------------------------
           UPDATE USERNAME
           ------------------------------ */

        if (username) {

            credentials.username =
                username;

        }


        /* ------------------------------
           UPDATE PASSWORD
           ------------------------------ */

        if (password) {

            credentials.password =
                password;

        }


        /* ------------------------------
           SAVE
           ------------------------------ */

        localStorage.setItem(

            "vvc_credentials",

            JSON.stringify(credentials)

        );


        alert(
            "Login credentials updated successfully. Your new details will be used the next time you log in."
        );


        credentialsForm.reset();


        newPassword.type =
            "password";


        togglePassword.innerHTML =
            '<i class="fa-solid fa-eye"></i>';


        togglePassword.setAttribute(
            "aria-label",
            "Show password"
        );


        console.log(
            "Login credentials updated successfully."
        );

    }
);


/* ==================================================
   DARK MODE
   ================================================== */

const darkModeSaved =

    localStorage.getItem(
        "vvc_dark_mode"
    ) === "true";


darkModeToggle.checked =
    darkModeSaved;


if (darkModeSaved) {

    document.body.classList.add(
        "dark-mode"
    );

}


/* ==================================================
   DARK MODE CHANGE
   ================================================== */

darkModeToggle.addEventListener(
    "change",
    () => {


        const isDarkMode =
            darkModeToggle.checked;


        localStorage.setItem(

            "vvc_dark_mode",

            isDarkMode

        );


        document.body.classList.toggle(

            "dark-mode",

            isDarkMode

        );


        console.log(

            `Dark Mode: ${
                isDarkMode
                    ? "Enabled"
                    : "Disabled"
            }`

        );

    }
);


/* ==================================================
   CLEAR ALL DATA
   ================================================== */

clearDataBtn.addEventListener(
    "click",
    () => {


        const confirmClear =

            confirm(

                "WARNING!\n\n" +

                "This will permanently delete all students, attendance, notes, tests, results, and parent records stored on this device.\n\n" +

                "This action cannot be undone.\n\n" +

                "Are you sure you want to continue?"

            );


        if (!confirmClear) {

            return;

        }


        /* ------------------------------
           SECOND CONFIRMATION
           ------------------------------ */

        const finalConfirm =

            confirm(

                "Final confirmation:\n\n" +

                "All VVCMS academic data will be permanently deleted.\n\n" +

                "Click OK to permanently clear the data."

            );


        if (!finalConfirm) {

            return;

        }


        /* ------------------------------
           DATA KEYS
           ------------------------------ */

        const keysToRemove = [

            "vvc_students",

            "vvc_attendance",

            "vvc_notes",

            "vvc_tests",

            "vvc_results",

            "vvc_parents"

        ];


        /* ------------------------------
           REMOVE DATA
           ------------------------------ */

        keysToRemove.forEach(

            key => {

                localStorage.removeItem(
                    key
                );

            }

        );


        alert(

            "All VVCMS academic data has been cleared successfully."

        );


        console.log(

            "All VVCMS academic data cleared."

        );

    }
);


/* ==================================================
   MODULE LOADED
   ================================================== */

console.log(
    "Settings Module Loaded Successfully 🚀"
);