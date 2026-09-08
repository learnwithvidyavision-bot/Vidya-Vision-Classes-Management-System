/* =========================================================
   VVCMS DASHBOARD.JS
   Vidya Vision Classes Management System
   Dashboard Module
   Part 1 / 8

   Features
   ----------
   • Firebase Initialization
   • Authentication
   • Loader
   • DOM Elements
   • Global Variables
   • Firestore References

========================================================= */

"use strict";

/* =========================================================
   FIREBASE IMPORTS
========================================================= */

import { initializeApp } from
"https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {

    getFirestore,

    collection,

    doc,

    addDoc,

    updateDoc,

    deleteDoc,

    getDocs,

    getDoc,

    onSnapshot,

    query,

    where,

    orderBy,

    limit,

    serverTimestamp

} from
"https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


/* =========================================================
   FIREBASE CONFIG
========================================================= */

const firebaseConfig = {

    apiKey:
        "YOUR_API_KEY",

    authDomain:
        "YOUR_PROJECT.firebaseapp.com",

    projectId:
        "YOUR_PROJECT_ID",

    storageBucket:
        "YOUR_PROJECT.appspot.com",

    messagingSenderId:
        "YOUR_SENDER_ID",

    appId:
        "YOUR_APP_ID"

};


/* =========================================================
   INITIALIZE FIREBASE
========================================================= */

const app =
    initializeApp(firebaseConfig);

const db =
    getFirestore(app);


/* =========================================================
   SESSION AUTHENTICATION
========================================================= */

const isLoggedIn =
    sessionStorage.getItem("vvc_logged_in");

if (isLoggedIn !== "true") {

    window.location.href =
        "login.html";

    throw new Error(
        "Unauthorized Access"
    );

}


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let dashboardInitialized =
    false;

let currentTeacher =
    null;

let unsubscribeFunctions =
    [];

let currentGreeting =
    "";

let notificationCount =
    0;


/* =========================================================
   DOM ELEMENTS
========================================================= */

/* Loader */

const loader =
    document.getElementById("loader");


/* Greeting */

const greetingText =
    document.getElementById("greeting");

const currentTime =
    document.getElementById("currentTime");


/* Teacher */

const teacherName =
    document.getElementById("teacherName");

const teacherRole =
    document.getElementById("teacherRole");

const teacherAvatar =
    document.getElementById("teacherAvatar");


/* Dashboard Cards */

const totalStudentsCard =
    document.getElementById("studentCount");

const notesCard =
    document.getElementById("notesCount");

const testsCard =
    document.getElementById("testsCount");

const resultCard =
    document.getElementById("highestResult");


/* Containers */

const announcementContainer =
    document.getElementById("announcementContainer");

const taskContainer =
    document.getElementById("taskContainer");

const activityContainer =
    document.getElementById("activityContainer");

const scheduleContainer =
    document.getElementById("scheduleContainer");


/* Search */

const dashboardSearch =
    document.getElementById("dashboardSearch");


/* Notification */

const notificationButton =
    document.getElementById("notificationBtn");

const notificationBadge =
    document.getElementById("notificationBadge");


/* Logout */

const logoutButton =
    document.getElementById("logoutBtn");


/* Theme */

const themeToggle =
    document.getElementById("themeToggle");


/* =========================================================
   FIRESTORE COLLECTIONS
========================================================= */

const studentsCollection =
    collection(db, "students");

const notesCollection =
    collection(db, "notes");

const testsCollection =
    collection(db, "tests");

const resultsCollection =
    collection(db, "results");

const announcementsCollection =
    collection(db, "announcements");

const tasksCollection =
    collection(db, "tasks");

const activityCollection =
    collection(db, "activity");

const scheduleCollection =
    collection(db, "schedule");

const settingsCollection =
    collection(db, "settings");


/* =========================================================
   LOADER
========================================================= */

function showLoader() {

    if (!loader) {

        return;

    }

    loader.style.display =
        "flex";

    loader.style.opacity =
        "1";

}


function hideLoader() {

    if (!loader) {

        return;

    }

    loader.style.opacity =
        "0";

    setTimeout(() => {

        loader.style.display =
            "none";

    }, 500);

}


/* =========================================================
   DASHBOARD STARTUP
========================================================= */

window.addEventListener(
    "load",
    () => {

        showLoader();

        setTimeout(() => {

            hideLoader();

        }, 1000);

    }
);


/* =========================================================
   END OF PART 1
   Part 2:
   • Utility Functions
   • escapeHTML()
   • formatDate()
   • Greeting Engine
   • Live Clock
   • Helper Functions
========================================================= */
/* =========================================================
   UTILITY FUNCTIONS
========================================================= */

/*
------------------------------------------------------------
Escapes HTML to prevent XSS attacks
------------------------------------------------------------
*/

function escapeHTML(value) {

    return String(value ?? "")

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/*
------------------------------------------------------------
Format Date
Example:
12 Aug 2026
------------------------------------------------------------
*/

function formatDate(timestamp) {

    if (!timestamp) {

        return "--";

    }

    let date;

    if (timestamp.toDate) {

        date = timestamp.toDate();

    }

    else {

        date = new Date(timestamp);

    }

    return date.toLocaleDateString(

        "en-IN",

        {

            day: "numeric",

            month: "short",

            year: "numeric"

        }

    );

}


/*
------------------------------------------------------------
Format Time
Example:
08:35 PM
------------------------------------------------------------
*/

function formatTime(date = new Date()) {

    return date.toLocaleTimeString(

        "en-IN",

        {

            hour: "2-digit",

            minute: "2-digit"

        }

    );

}


/*
------------------------------------------------------------
Get Greeting
------------------------------------------------------------
*/

function getGreeting() {

    const hour =
        new Date().getHours();

    if (hour < 12) {

        return "Good Morning";

    }

    if (hour < 17) {

        return "Good Afternoon";

    }

    if (hour < 21) {

        return "Good Evening";

    }

    return "Good Night";

}


/*
------------------------------------------------------------
Generate Initials
------------------------------------------------------------
*/

function getInitials(name) {

    if (!name) {

        return "VVC";

    }

    return name

        .trim()

        .split(/\s+/)

        .map(word => word.charAt(0))

        .join("")

        .substring(0, 2)

        .toUpperCase();

}


/*
------------------------------------------------------------
Random ID
------------------------------------------------------------
*/

function generateID() {

    return Date.now().toString(36)

        + Math.random()

        .toString(36)

        .substring(2, 8);

}


/*
------------------------------------------------------------
Show Notification Badge
------------------------------------------------------------
*/

function updateNotificationBadge() {

    if (!notificationBadge) {

        return;

    }

    if (notificationCount <= 0) {

        notificationBadge.style.display =
            "none";

        return;

    }

    notificationBadge.style.display =
        "flex";

    notificationBadge.textContent =
        notificationCount;

}


/* =========================================================
   LIVE CLOCK
========================================================= */

function updateClock() {

    if (!currentTime) {

        return;

    }

    currentTime.textContent =
        formatTime();

}

updateClock();

setInterval(

    updateClock,

    1000

);


/* =========================================================
   GREETING
========================================================= */

function updateGreeting() {

    const greeting =
        getGreeting();

    if (

        greeting === currentGreeting

    ) {

        return;

    }

    currentGreeting =
        greeting;

    if (

        greetingText

    ) {

        greetingText.textContent =
            greeting;

    }

}

updateGreeting();

setInterval(

    updateGreeting,

    60000

);


/* =========================================================
   TEACHER PROFILE
========================================================= */

function loadTeacherProfile() {

    const savedProfile =

        JSON.parse(

            localStorage.getItem(

                "vvc_teacher"

            )

        );


    if (!savedProfile) {

        return;

    }

    currentTeacher =
        savedProfile;


    if (teacherName) {

        teacherName.textContent =
            escapeHTML(

                savedProfile.name

            );

    }


    if (teacherRole) {

        teacherRole.textContent =
            escapeHTML(

                savedProfile.role

                || "Teacher"

            );

    }


    if (teacherAvatar) {

        teacherAvatar.textContent =

            getInitials(

                savedProfile.name

            );

    }

}


/* =========================================================
   EMPTY STATE
========================================================= */

function createEmptyState(

    icon,

    title,

    subtitle

) {

    return `

        <div class="empty-state">

            <i class="${icon}"></i>

            <h3>

                ${escapeHTML(title)}

            </h3>

            <p>

                ${escapeHTML(subtitle)}

            </p>

        </div>

    `;

}


/* =========================================================
   LOADING STATE
========================================================= */

function createLoadingState() {

    return `

        <div class="loading-state">

            Loading...

        </div>

    `;

}


/* =========================================================
   FIRESTORE LISTENER REGISTRY
========================================================= */

function registerListener(unsubscribe) {

    if (

        typeof unsubscribe === "function"

    ) {

        unsubscribeFunctions.push(

            unsubscribe

        );

    }

}


function removeAllListeners() {

    unsubscribeFunctions.forEach(

        unsubscribe => {

            try {

                unsubscribe();

            }

            catch (error) {

                console.error(

                    error

                );

            }

        }

    );

    unsubscribeFunctions = [];

}


/* =========================================================
   END OF PART 2

   Part 3:
   • Dashboard Statistics
   • Student Count
   • Notes Count
   • Tests Count
   • Highest Result
   • Firestore Realtime Listeners
========================================================= */
/* =========================================================
   DASHBOARD STATISTICS
========================================================= */

/*
------------------------------------------------------------
Student Count
------------------------------------------------------------
*/

function loadStudentCount() {

    if (!totalStudentsCard) {

        return;

    }

    totalStudentsCard.textContent = "...";

    const unsubscribe = onSnapshot(

        studentsCollection,

        snapshot => {

            totalStudentsCard.textContent =
                snapshot.size;

        },

        error => {

            console.error(
                "Student Count Error:",
                error
            );

            totalStudentsCard.textContent = "--";

        }

    );

    registerListener(unsubscribe);

}


/*
------------------------------------------------------------
Notes Count
------------------------------------------------------------
*/

function loadNotesCount() {

    if (!notesCard) {

        return;

    }

    notesCard.textContent = "...";

    const unsubscribe = onSnapshot(

        notesCollection,

        snapshot => {

            notesCard.textContent =
                snapshot.size;

        },

        error => {

            console.error(
                "Notes Count Error:",
                error
            );

            notesCard.textContent = "--";

        }

    );

    registerListener(unsubscribe);

}


/*
------------------------------------------------------------
Tests Count
------------------------------------------------------------
*/

function loadTestsCount() {

    if (!testsCard) {

        return;

    }

    testsCard.textContent = "...";

    const unsubscribe = onSnapshot(

        testsCollection,

        snapshot => {

            testsCard.textContent =
                snapshot.size;

        },

        error => {

            console.error(
                "Tests Count Error:",
                error
            );

            testsCard.textContent = "--";

        }

    );

    registerListener(unsubscribe);

}


/*
------------------------------------------------------------
Highest Result
------------------------------------------------------------
*/

function loadHighestResult() {

    if (!resultCard) {

        return;

    }

    resultCard.textContent = "...";

    const highestQuery = query(

        resultsCollection,

        orderBy(

            "percentage",

            "desc"

        ),

        limit(1)

    );

    const unsubscribe = onSnapshot(

        highestQuery,

        snapshot => {

            if (

                snapshot.empty

            ) {

                resultCard.textContent =
                    "--";

                return;

            }

            const result =
                snapshot.docs[0].data();

            resultCard.textContent =

                `${Number(

                    result.percentage || 0

                ).toFixed(1)}%`;

        },

        error => {

            console.error(

                "Highest Result Error:",

                error

            );

            resultCard.textContent =
                "--";

        }

    );

    registerListener(unsubscribe);

}


/* =========================================================
   DASHBOARD SUMMARY
========================================================= */

function loadDashboardSummary() {

    loadStudentCount();

    loadNotesCount();

    loadTestsCount();

    loadHighestResult();

}


/* =========================================================
   CARD ANIMATION
========================================================= */

function animateCards() {

    const cards = document.querySelectorAll(

        ".dashboard-card"

    );

    cards.forEach(

        (

            card,

            index

        ) => {

            card.style.opacity = "0";

            card.style.transform =
                "translateY(25px)";

            setTimeout(() => {

                card.style.transition =
                    "all .45s ease";

                card.style.opacity = "1";

                card.style.transform =
                    "translateY(0)";

            }, index * 120);

        }

    );

}


/* =========================================================
   REFRESH STATISTICS
========================================================= */

function refreshStatistics() {

    /*
       Firestore realtime listeners
       automatically update.

       This function simply refreshes
       animations if required.
    */

    animateCards();

}


/* =========================================================
   CONNECTION STATUS
========================================================= */

window.addEventListener(

    "online",

    () => {

        console.log(

            "Internet Connected"

        );

    }

);


window.addEventListener(

    "offline",

    () => {

        console.warn(

            "Internet Disconnected"

        );

    }

);


/* =========================================================
   INITIALIZE DASHBOARD CARDS
========================================================= */

function initializeDashboardCards() {

    loadDashboardSummary();

    animateCards();

}


/* =========================================================
   END OF PART 3

   Part 4:
   • Announcements Module
   • Add Announcement
   • Delete Announcement
   • Realtime Firestore
   • Announcement Rendering
========================================================= */
/* =========================================================
   ANNOUNCEMENTS MODULE
========================================================= */

/*
------------------------------------------------------------
Load Announcements (Realtime)
------------------------------------------------------------
*/

function loadAnnouncements() {

    if (!announcementContainer) {

        return;

    }

    announcementContainer.innerHTML =
        createLoadingState();

    const announcementsQuery = query(

        announcementsCollection,

        orderBy(

            "createdAt",

            "desc"

        ),

        limit(10)

    );

    const unsubscribe = onSnapshot(

        announcementsQuery,

        snapshot => {

            if (snapshot.empty) {

                announcementContainer.innerHTML =

                    createEmptyState(

                        "fa-solid fa-bullhorn",

                        "No Announcements",

                        "Create your first announcement."

                    );

                notificationCount = 0;

                updateNotificationBadge();

                return;

            }

            let html = "";

            snapshot.forEach(docSnapshot => {

                const data =
                    docSnapshot.data();

                html += `

                    <div
                        class="announcement-card"
                        data-id="${docSnapshot.id}"
                    >

                        <div class="announcement-header">

                            <h3>

                                ${escapeHTML(
                                    data.title || "Untitled"
                                )}

                            </h3>

                            <button
                                class="delete-announcement"
                                data-id="${docSnapshot.id}"
                                title="Delete"
                            >

                                <i class="fa-solid fa-trash"></i>

                            </button>

                        </div>

                        <p>

                            ${escapeHTML(
                                data.message || ""
                            )}

                        </p>

                        <small>

                            ${formatDate(
                                data.createdAt
                            )}

                        </small>

                    </div>

                `;

            });

            announcementContainer.innerHTML =
                html;

            notificationCount =
                snapshot.size;

            updateNotificationBadge();

        },

        error => {

            console.error(

                "Announcements Error:",

                error

            );

            announcementContainer.innerHTML =

                createEmptyState(

                    "fa-solid fa-circle-exclamation",

                    "Unable to Load",

                    "Please try again later."

                );

        }

    );

    registerListener(unsubscribe);

}


/* =========================================================
   ADD ANNOUNCEMENT
========================================================= */

async function addAnnouncement() {

    const title = prompt(

        "Announcement Title"

    );

    if (!title) {

        return;

    }

    const message = prompt(

        "Announcement Message"

    );

    if (!message) {

        return;

    }

    try {

        await addDoc(

            announcementsCollection,

            {

                title:
                    title.trim(),

                message:
                    message.trim(),

                createdAt:
                    serverTimestamp()

            }

        );

        console.log(

            "Announcement Added"

        );

    }

    catch (error) {

        console.error(

            "Announcement Error:",

            error

        );

        alert(

            "Unable to create announcement."

        );

    }

}


/* =========================================================
   DELETE ANNOUNCEMENT
========================================================= */

async function deleteAnnouncement(id) {

    const confirmed = confirm(

        "Delete this announcement?"

    );

    if (!confirmed) {

        return;

    }

    try {

        await deleteDoc(

            doc(

                db,

                "announcements",

                id

            )

        );

        console.log(

            "Announcement Deleted"

        );

    }

    catch (error) {

        console.error(

            "Delete Failed:",

            error

        );

        alert(

            "Unable to delete announcement."

        );

    }

}


/* =========================================================
   ANNOUNCEMENT EVENTS
========================================================= */

if (announcementContainer) {

    announcementContainer.addEventListener(

        "click",

        event => {

            const deleteButton =
                event.target.closest(

                    ".delete-announcement"

                );

            if (!deleteButton) {

                return;

            }

            deleteAnnouncement(

                deleteButton.dataset.id

            );

        }

    );

}


/* =========================================================
   ADD ANNOUNCEMENT BUTTON
========================================================= */

const addAnnouncementButton =

    document.getElementById(

        "addAnnouncementBtn"

    );

if (addAnnouncementButton) {

    addAnnouncementButton.addEventListener(

        "click",

        addAnnouncement

    );

}


/* =========================================================
   END OF PART 4

   Part 5:
   • Tasks Module
   • Add Task
   • Complete Task
   • Delete Task
   • Firestore Realtime Sync
========================================================= */
/* =========================================================
   TASKS MODULE
========================================================= */

/*
------------------------------------------------------------
Load Tasks (Realtime)
------------------------------------------------------------
*/

function loadTasks() {

    if (!taskContainer) {

        return;

    }

    taskContainer.innerHTML =
        createLoadingState();

    const tasksQuery = query(

        tasksCollection,

        orderBy(

            "createdAt",

            "desc"

        ),

        limit(20)

    );

    const unsubscribe = onSnapshot(

        tasksQuery,

        snapshot => {

            if (snapshot.empty) {

                taskContainer.innerHTML =

                    createEmptyState(

                        "fa-solid fa-list-check",

                        "No Tasks",

                        "Create your first task."

                    );

                return;

            }

            let html = "";

            snapshot.forEach(documentItem => {

                const task =
                    documentItem.data();

                html += `

                    <div
                        class="task-card ${task.completed ? "completed" : ""}"
                        data-id="${documentItem.id}"
                    >

                        <div class="task-left">

                            <button
                                class="task-complete-btn"
                                data-id="${documentItem.id}"
                                title="Toggle Complete"
                            >

                                <i class="fa-solid ${task.completed
                                    ? "fa-circle-check"
                                    : "fa-circle"}"></i>

                            </button>

                            <div>

                                <h3>

                                    ${escapeHTML(
                                        task.title || "Untitled Task"
                                    )}

                                </h3>

                                <small>

                                    ${formatDate(
                                        task.createdAt
                                    )}

                                </small>

                            </div>

                        </div>

                        <button
                            class="task-delete-btn"
                            data-id="${documentItem.id}"
                            title="Delete Task"
                        >

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </div>

                `;

            });

            taskContainer.innerHTML =
                html;

        },

        error => {

            console.error(

                "Tasks Error:",

                error

            );

            taskContainer.innerHTML =

                createEmptyState(

                    "fa-solid fa-circle-exclamation",

                    "Unable to Load Tasks",

                    "Please try again later."

                );

        }

    );

    registerListener(unsubscribe);

}


/* =========================================================
   ADD TASK
========================================================= */

async function addTask() {

    const title = prompt(

        "Enter Task Title"

    );

    if (!title) {

        return;

    }

    try {

        await addDoc(

            tasksCollection,

            {

                title:
                    title.trim(),

                completed:
                    false,

                createdAt:
                    serverTimestamp()

            }

        );

        console.log(

            "Task Added"

        );

    }

    catch (error) {

        console.error(

            "Task Creation Failed:",

            error

        );

        alert(

            "Unable to create task."

        );

    }

}


/* =========================================================
   TOGGLE TASK STATUS
========================================================= */

async function toggleTask(id) {

    try {

        const reference = doc(

            db,

            "tasks",

            id

        );

        const snapshot =
            await getDoc(reference);

        if (!snapshot.exists()) {

            return;

        }

        const task =
            snapshot.data();

        await updateDoc(

            reference,

            {

                completed:
                    !task.completed

            }

        );

    }

    catch (error) {

        console.error(

            "Task Update Failed:",

            error

        );

    }

}


/* =========================================================
   DELETE TASK
========================================================= */

async function deleteTask(id) {

    const confirmed = confirm(

        "Delete this task?"

    );

    if (!confirmed) {

        return;

    }

    try {

        await deleteDoc(

            doc(

                db,

                "tasks",

                id

            )

        );

    }

    catch (error) {

        console.error(

            "Task Delete Failed:",

            error

        );

        alert(

            "Unable to delete task."

        );

    }

}


/* =========================================================
   TASK EVENTS
========================================================= */

if (taskContainer) {

    taskContainer.addEventListener(

        "click",

        event => {

            const completeButton =
                event.target.closest(

                    ".task-complete-btn"

                );

            if (completeButton) {

                toggleTask(

                    completeButton.dataset.id

                );

                return;

            }

            const deleteButton =
                event.target.closest(

                    ".task-delete-btn"

                );

            if (deleteButton) {

                deleteTask(

                    deleteButton.dataset.id

                );

            }

        }

    );

}


/* =========================================================
   ADD TASK BUTTON
========================================================= */

const addTaskButton =
    document.getElementById(

        "addTaskBtn"

    );

if (addTaskButton) {

    addTaskButton.addEventListener(

        "click",

        addTask

    );

}


/* =========================================================
   END OF PART 5

   Part 6:
   • Recent Activity
   • Today's Schedule
   • Dashboard Search
   • Notifications
   • Realtime Firestore Integration
========================================================= */
/* =========================================================
   RECENT ACTIVITY MODULE
========================================================= */

/*
------------------------------------------------------------
Load Recent Activity (Realtime)
------------------------------------------------------------
*/

function loadRecentActivity() {

    if (!activityContainer) {

        return;

    }

    activityContainer.innerHTML =
        createLoadingState();

    const activityQuery = query(

        activityCollection,

        orderBy(

            "createdAt",

            "desc"

        ),

        limit(10)

    );

    const unsubscribe = onSnapshot(

        activityQuery,

        snapshot => {

            if (snapshot.empty) {

                activityContainer.innerHTML =

                    createEmptyState(

                        "fa-solid fa-clock-rotate-left",

                        "No Activity",

                        "Recent activity will appear here."

                    );

                return;

            }

            let html = "";

            snapshot.forEach(documentItem => {

                const activity =
                    documentItem.data();

                html += `

                    <div class="activity-card">

                        <div class="activity-icon">

                            <i class="${escapeHTML(

                                activity.icon ||

                                "fa-solid fa-circle"

                            )}"></i>

                        </div>

                        <div class="activity-content">

                            <h4>

                                ${escapeHTML(

                                    activity.title ||

                                    "Activity"

                                )}

                            </h4>

                            <p>

                                ${escapeHTML(

                                    activity.description ||

                                    ""

                                )}

                            </p>

                            <small>

                                ${formatDate(

                                    activity.createdAt

                                )}

                            </small>

                        </div>

                    </div>

                `;

            });

            activityContainer.innerHTML =
                html;

        },

        error => {

            console.error(

                "Activity Error:",

                error

            );

            activityContainer.innerHTML =

                createEmptyState(

                    "fa-solid fa-circle-exclamation",

                    "Unable to Load",

                    "Please try again."

                );

        }

    );

    registerListener(unsubscribe);

}


/* =========================================================
   TODAY'S SCHEDULE
========================================================= */

function loadTodaySchedule() {

    if (!scheduleContainer) {

        return;

    }

    scheduleContainer.innerHTML =
        createLoadingState();

    const scheduleQuery = query(

        scheduleCollection,

        orderBy(

            "time",

            "asc"

        ),

        limit(20)

    );

    const unsubscribe = onSnapshot(

        scheduleQuery,

        snapshot => {

            if (snapshot.empty) {

                scheduleContainer.innerHTML =

                    createEmptyState(

                        "fa-solid fa-calendar-day",

                        "No Schedule",

                        "No classes scheduled today."

                    );

                return;

            }

            let html = "";

            snapshot.forEach(documentItem => {

                const schedule =
                    documentItem.data();

                html += `

                    <div class="schedule-card">

                        <div>

                            <h4>

                                ${escapeHTML(

                                    schedule.subject ||

                                    "Class"

                                )}

                            </h4>

                            <p>

                                ${escapeHTML(

                                    schedule.class ||

                                    ""

                                )}

                            </p>

                        </div>

                        <span>

                            ${escapeHTML(

                                schedule.time ||

                                "--:--"

                            )}

                        </span>

                    </div>

                `;

            });

            scheduleContainer.innerHTML =
                html;

        },

        error => {

            console.error(

                "Schedule Error:",

                error

            );

            scheduleContainer.innerHTML =

                createEmptyState(

                    "fa-solid fa-circle-exclamation",

                    "Unable to Load",

                    "Please try again."

                );

        }

    );

    registerListener(unsubscribe);

}


/* =========================================================
   DASHBOARD SEARCH
========================================================= */

function performDashboardSearch(keyword) {

    const cards = document.querySelectorAll(

        ".dashboard-card, .announcement-card, .task-card, .activity-card, .schedule-card"

    );

    const queryText =
        keyword.trim().toLowerCase();

    cards.forEach(card => {

        const content =
            card.textContent.toLowerCase();

        card.style.display =

            content.includes(queryText)

                ? ""

                : "none";

    });

}


if (dashboardSearch) {

    dashboardSearch.addEventListener(

        "input",

        event => {

            performDashboardSearch(

                event.target.value

            );

        }

    );

}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function showNotifications() {

    alert(

        `You have ${notificationCount} notification${notificationCount === 1 ? "" : "s"}.`

    );

}


if (notificationButton) {

    notificationButton.addEventListener(

        "click",

        showNotifications

    );

}


/* =========================================================
   LOAD DASHBOARD CONTENT
========================================================= */

function loadDashboardContent() {

    loadAnnouncements();

    loadTasks();

    loadRecentActivity();

    loadTodaySchedule();

}


/* =========================================================
   END OF PART 6

   Part 7:
   • Dark Mode
   • Settings Sync
   • Logout
   • UI Interactions
   • Keyboard Shortcuts
========================================================= */
/* =========================================================
   SETTINGS & DARK MODE
========================================================= */

/*
------------------------------------------------------------
Load Theme Preference
------------------------------------------------------------
*/

function loadTheme() {

    const darkModeEnabled =

        localStorage.getItem(

            "vvc_dark_mode"

        ) === "true";

    document.body.classList.toggle(

        "dark-mode",

        darkModeEnabled

    );

    if (themeToggle) {

        themeToggle.innerHTML =

            darkModeEnabled

                ? `<i class="fa-solid fa-sun"></i>`

                : `<i class="fa-solid fa-moon"></i>`;

    }

}


/*
------------------------------------------------------------
Toggle Theme
------------------------------------------------------------
*/

function toggleTheme() {

    const enabled =

        !document.body.classList.contains(

            "dark-mode"

        );

    document.body.classList.toggle(

        "dark-mode",

        enabled

    );

    localStorage.setItem(

        "vvc_dark_mode",

        enabled

    );

    loadTheme();

}


/* =========================================================
   SETTINGS SYNC
========================================================= */

async function loadSettings() {

    try {

        const snapshot =

            await getDocs(

                settingsCollection

            );

        if (snapshot.empty) {

            return;

        }

        snapshot.forEach(documentItem => {

            const settings =

                documentItem.data();

            if (

                settings.darkMode === true

            ) {

                localStorage.setItem(

                    "vvc_dark_mode",

                    "true"

                );

            }

        });

        loadTheme();

    }

    catch (error) {

        console.error(

            "Settings Error:",

            error

        );

    }

}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

    const confirmed = confirm(

        "Are you sure you want to logout?"

    );

    if (!confirmed) {

        return;

    }

    /*
       Remove Firestore listeners
    */

    removeAllListeners();

    /*
       Clear session
    */

    sessionStorage.removeItem(

        "vvc_logged_in"

    );

    sessionStorage.removeItem(

        "vvc_teacher"

    );

    /*
       Redirect
    */

    window.location.replace(

        "login.html"

    );

}


/* =========================================================
   UI INTERACTIONS
========================================================= */

/*
------------------------------------------------------------
Theme Button
------------------------------------------------------------
*/

if (themeToggle) {

    themeToggle.addEventListener(

        "click",

        toggleTheme

    );

}


/*
------------------------------------------------------------
Logout Button
------------------------------------------------------------
*/

if (logoutButton) {

    logoutButton.addEventListener(

        "click",

        logout

    );

}


/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

document.addEventListener(

    "keydown",

    event => {

        /*
        Ctrl + K
        Focus Search
        */

        if (

            event.ctrlKey &&

            event.key.toLowerCase() === "k"

        ) {

            event.preventDefault();

            dashboardSearch?.focus();

        }

        /*
        Ctrl + Shift + D
        Toggle Dark Mode
        */

        if (

            event.ctrlKey &&

            event.shiftKey &&

            event.key.toLowerCase() === "d"

        ) {

            event.preventDefault();

            toggleTheme();

        }

        /*
        Escape
        Remove Search
        */

        if (

            event.key === "Escape"

        ) {

            if (

                dashboardSearch

            ) {

                dashboardSearch.value = "";

                performDashboardSearch("");

                dashboardSearch.blur();

            }

        }

    }

);


/* =========================================================
   PAGE VISIBILITY
========================================================= */

document.addEventListener(

    "visibilitychange",

    () => {

        if (

            document.visibilityState ===

            "visible"

        ) {

            updateClock();

            updateGreeting();

        }

    }

);


/* =========================================================
   BEFORE PAGE UNLOAD
========================================================= */

window.addEventListener(

    "beforeunload",

    () => {

        removeAllListeners();

    }

);


/* =========================================================
   END OF PART 7

   Part 8:
   • initializeDashboard()
   • Dashboard Startup
   • Final Event Registration
   • Production Cleanup
   • Console Banner
========================================================= */
/* =========================================================
   DASHBOARD INITIALIZATION
========================================================= */

async function initializeDashboard() {

    /*
    Prevent duplicate initialization
    */

    if (dashboardInitialized) {

        return;

    }

    dashboardInitialized = true;

    try {

        /*
        Show Loader
        */

        showLoader();

        /*
        Load User
        */

        loadTeacherProfile();

        /*
        Theme
        */

        loadTheme();

        await loadSettings();

        /*
        Greeting + Clock
        */

        updateGreeting();

        updateClock();

        /*
        Statistics
        */

        initializeDashboardCards();

        /*
        Dashboard Modules
        */

        loadDashboardContent();

        /*
        Notifications
        */

        updateNotificationBadge();

        /*
        Hide Loader
        */

        hideLoader();

        console.log(

            "Dashboard Initialized Successfully."

        );

    }

    catch (error) {

        console.error(

            "Dashboard Initialization Failed:",

            error

        );

        hideLoader();

        alert(

            "Unable to initialize dashboard. Please refresh the page."

        );

    }

}


/* =========================================================
   REFRESH DASHBOARD
========================================================= */

async function refreshDashboard() {

    try {

        /*
        Remove previous listeners
        */

        removeAllListeners();

        /*
        Reset Notification Counter
        */

        notificationCount = 0;

        updateNotificationBadge();

        /*
        Reload Data
        */

        initializeDashboardCards();

        loadDashboardContent();

        console.log(

            "Dashboard Refreshed."

        );

    }

    catch (error) {

        console.error(

            "Refresh Error:",

            error

        );

    }

}


/* =========================================================
   AUTO REFRESH
========================================================= */

/*
Refresh dashboard every
5 minutes
*/

setInterval(

    refreshDashboard,

    300000

);


/* =========================================================
   WINDOW EVENTS
========================================================= */

window.addEventListener(

    "focus",

    () => {

        updateClock();

        updateGreeting();

    }

);


window.addEventListener(

    "online",

    () => {

        console.log(

            "Internet Connected"

        );

        refreshDashboard();

    }

);


window.addEventListener(

    "offline",

    () => {

        console.warn(

            "Internet Disconnected"

        );

    }

);


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(

    "DOMContentLoaded",

    initializeDashboard

);


/* =========================================================
   CLEANUP
========================================================= */

window.addEventListener(

    "beforeunload",

    () => {

        removeAllListeners();

    }

);


/* =========================================================
   DEVELOPMENT LOG
========================================================= */

console.log(

`
==========================================================
   Vidya Vision Classes Management System

   Dashboard Module Loaded Successfully

   Version : 2.0.0
   Status  : Production Ready

   Features
   -----------------------------------------------
   ✔ Firebase Firestore
   ✔ Realtime Dashboard
   ✔ Statistics
   ✔ Announcements
   ✔ Tasks
   ✔ Activity Feed
   ✔ Schedule
   ✔ Notifications
   ✔ Search
   ✔ Dark Theme
   ✔ Keyboard Shortcuts
   ✔ Loader
   ✔ Auto Refresh
==========================================================
`
);


/* =========================================================
   EXPORTS
   (Optional for future ES Modules)
========================================================= */

export {

    refreshDashboard,

    initializeDashboard,

    updateGreeting,

    updateClock,

    escapeHTML,

    formatDate,

    formatTime

};


/* =========================================================
   END OF FILE

   VVCMS DASHBOARD.JS
   Version 2.0.0

   Total Parts : 8
   Status      : Production Ready

========================================================= */