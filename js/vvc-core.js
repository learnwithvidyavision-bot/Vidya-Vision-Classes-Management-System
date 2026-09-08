/*==================================================
                VVC CORE.JS
          Vidya Vision Classes
              Version 1.0
==================================================*/

/*=========================================
            LOGIN CHECK
=========================================*/

function checkLogin(){

    if(sessionStorage.getItem("vvc_logged_in") !== "true"){

        window.location.href = "login.html";

    }

}

/*=========================================
            LOADER
=========================================*/

function startLoader(){

    const loader = document.getElementById("loader");

    const progress = document.querySelector(".loading-progress");

    if(progress){

        progress.style.transition = "width 2s linear";

        progress.style.width = "100%";

    }

    setTimeout(()=>{

        if(loader){

            loader.style.opacity = "0";

            loader.style.transition = ".5s";

            setTimeout(()=>{

                loader.style.display = "none";

            },500);

        }

    },2000);

}

/*=========================================
            LOCAL STORAGE
=========================================*/

function loadData(key){

    return JSON.parse(

        localStorage.getItem("vvc_" + key)

    ) || [];

}

function saveData(key,data){

    localStorage.setItem(

        "vvc_" + key,

        JSON.stringify(data)

    );

}

/*=========================================
            PROFILE
=========================================*/

function getProfile(){

    return JSON.parse(

        localStorage.getItem("vvc_profile")

    ) || {

        name:"Himanshu Gupta",

        role:"Founder",

        institute:"Vidya Vision Classes"

    };

}

function applyProfile(){

    const profile = getProfile();

    const name = document.querySelector(".teacher-profile h4");

    const role = document.querySelector(".teacher-profile small");

    if(name) name.textContent = profile.name;

    if(role) role.textContent = profile.role;

    window.vvcProfile = profile;

}

/*=========================================
            GREETING
=========================================*/

function updateGreeting(){

    const greeting = document.getElementById("greeting");

    if(!greeting) return;

    const firstName =

        window.vvcProfile.name.split(" ")[0];

    const hour = new Date().getHours();

    let text = "";

    if(hour < 12){

        text = "Good Morning";

    }

    else if(hour < 17){

        text = "Good Afternoon";

    }

    else{

        text = "Good Evening";

    }

    greeting.textContent =

        `${text}, ${firstName}!`;

}

/*=========================================
            PROFILE MENU
=========================================*/

function setupProfileMenu(){

    const profile = document.getElementById("profileMenu");

    const dropdown = document.getElementById("profileDropdown");

    const logout = document.getElementById("logoutBtn");

    const profileBtn = document.getElementById("profileBtn");

    const settingsBtn = document.getElementById("settingsBtn");

    if(!profile || !dropdown) return;

    profile.addEventListener("click",(e)=>{

        e.stopPropagation();

        dropdown.classList.toggle("show");

    });

    document.addEventListener("click",()=>{

        dropdown.classList.remove("show");

    });

    dropdown.addEventListener("click",(e)=>{

        e.stopPropagation();

    });

    if(profileBtn){

        profileBtn.onclick = ()=>{

            window.location.href="settings.html";

        };

    }

    if(settingsBtn){

        settingsBtn.onclick = ()=>{

            window.location.href="settings.html";

        };

    }

    if(logout){

        logout.onclick = ()=>{

            if(confirm(

                "Are you sure you want to logout?"

            )){

                sessionStorage.removeItem(

                    "vvc_logged_in"

                );

                window.location.href="login.html";

            }

        };

    }

}

/*=========================================
            ACTIVE SIDEBAR
=========================================*/

function setActiveSidebar(){

    const page =

        window.location.pathname

        .split("/")

        .pop();

    const map = {

        "dashboard.html":"navDashboard",

        "students.html":"navStudents",

        "attendance.html":"navAttendance",

        "notes.html":"navNotes",

        "tests.html":"navTests",

        "results.html":"navResults",

        "parents.html":"navParents",

        "settings.html":"navSettings"

    };

    const id = map[page];

    if(id){

        const link = document.getElementById(id);

        if(link){

            link.parentElement.classList.add(

                "active"

            );

        }

    }

}

/*=========================================
            DASHBOARD STATS
=========================================*/

function getDashboardStats(){

    const students = loadData("students");

    const notes = loadData("notes");

    const tests = loadData("tests");

    const results = loadData("results");

    let highest = 0;

    if(results.length){

        highest = Math.max(

            ...results.map(

                r=>r.percentage||0

            )

        );

    }

    return{

        students:students.length,

        notes:notes.length,

        tests:tests.length,

        highestResult:highest

    };

}

/*=========================================
            ACTIVITY
=========================================*/

function addActivity(title,description){

    const activities =

        loadData("activity");

    activities.unshift({

        title,

        description,

        time:new Date()

            .toLocaleString()

    });

    if(activities.length>20){

        activities.pop();

    }

    saveData("activity",activities);

}

/*=========================================
            TOAST
=========================================*/

function showToast(message){

    alert(message);

}

/*=========================================
            NOTIFICATIONS
=========================================*/

function showNotifications(){

    const activity =

        loadData("activity");

    if(activity.length===0){

        alert("No new notifications.");

        return;

    }

    let text = "";

    activity.slice(0,5).forEach(item=>{

        text +=

        "• "

        + item.title

        + "\n";

    });

    alert(text);

}

console.log(

"VVC Core Loaded Successfully 🚀"

);