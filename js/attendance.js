/* =========================================================
   VVCMS ATTENDANCE.JS
   Vidya Vision Classes
   Attendance Management Module
   ========================================================= */

"use strict";


/* =========================================================
   SESSION CHECK
========================================================= */

if (
    sessionStorage.getItem("vvc_logged_in") !== "true"
) {

    window.location.href = "login.html";

}


/* =========================================================
   ELEMENTS
========================================================= */

const loader =
    document.getElementById("loader");

const attendanceBody =
    document.getElementById("attendanceBody");

const searchInput =
    document.getElementById("searchAttendance");

const saveBtn =
    document.getElementById("saveAttendanceBtn");

const totalStudentsElement =
    document.getElementById("totalStudents");

const presentCountElement =
    document.getElementById("presentCount");

const absentCountElement =
    document.getElementById("absentCount");

const attendancePercentElement =
    document.getElementById("attendancePercent");

const todayDateElement =
    document.getElementById("todayDate");

const currentTimeElement =
    document.getElementById("currentTime");

const bestAttendanceElement =
    document.getElementById("bestAttendance");

const emptyState =
    document.getElementById("emptyState");


/* =========================================================
   DATA
========================================================= */

let students = [];

let attendance =
    JSON.parse(
        localStorage.getItem("vvc_attendance")
    ) || {};


/* =========================================================
   GET TODAY'S LOCAL DATE
   Uses local timezone instead of UTC
========================================================= */

function getTodayKey() {

    const now =
        new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            now.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


const todayKey =
    getTodayKey();


/* =========================================================
   INITIALIZE TODAY'S ATTENDANCE
========================================================= */

if (
    !attendance[todayKey] ||
    typeof attendance[todayKey] !== "object"
) {

    attendance[todayKey] = {};

}


/* =========================================================
   LOADER
========================================================= */

window.addEventListener(
    "load",
    () => {

        if (!loader) {

            return;

        }


        setTimeout(
            () => {

                loader.style.opacity =
                    "0";


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
);


/* =========================================================
   LOAD STUDENTS
========================================================= */

function loadStudents() {

    students =
        JSON.parse(
            localStorage.getItem(
                "vvc_students"
            )
        ) || [];


    /*
       Make sure every student has
       a valid attendance entry.
    */

    students.forEach(
        student => {

            if (
                attendance[todayKey][student.id] ===
                undefined
            ) {

                attendance[todayKey][student.id] =
                    "";

            }

        }
    );

}


/* =========================================================
   SAVE ATTENDANCE
========================================================= */

function saveAttendanceData() {

    localStorage.setItem(
        "vvc_attendance",
        JSON.stringify(
            attendance
        )
    );

}


/* =========================================================
   DARK MODE
========================================================= */

function loadDarkMode() {

    const darkModeEnabled =
        localStorage.getItem(
            "vvc_dark_mode"
        ) === "true";


    document.body.classList.toggle(
        "dark-mode",
        darkModeEnabled
    );

}


loadDarkMode();


/* =========================================================
   UPDATE DATE
========================================================= */

function updateDate() {

    if (!todayDateElement) {

        return;

    }


    const now =
        new Date();


    todayDateElement.textContent =
        now.toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

}


updateDate();


/* =========================================================
   UPDATE CLOCK
========================================================= */

function updateClock() {

    if (!currentTimeElement) {

        return;

    }


    const now =
        new Date();


    currentTimeElement.textContent =
        now.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );

}


updateClock();


setInterval(
    updateClock,
    1000
);


/* =========================================================
   GET INITIALS
========================================================= */

function getInitials(
    name
) {

    if (!name) {

        return "ST";

    }


    return name
        .trim()
        .split(/\s+/)
        .map(
            word =>
                word.charAt(0)
        )
        .join("")
        .substring(
            0,
            2
        )
        .toUpperCase();

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   GET FILTERED STUDENTS
========================================================= */

function getFilteredStudents() {

    const keyword =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    return students.filter(
        student => {

            const searchableText = [

                student.name,

                student.roll,

                student.className,

                student.phone

            ]
                .join(" ")
                .toLowerCase();


            return searchableText.includes(
                keyword
            );

        }
    );

}


/* =========================================================
   RENDER ATTENDANCE
========================================================= */

function renderAttendance() {

    if (!attendanceBody) {

        return;

    }


    attendanceBody.innerHTML =
        "";


    const filteredStudents =
        getFilteredStudents();


    /*
       NO STUDENTS
    */

    if (
        students.length === 0
    ) {

        if (emptyState) {

            emptyState.style.display =
                "block";

        }


        updateSummary();

        return;

    }


    /*
       NO SEARCH RESULTS
    */

    if (
        filteredStudents.length === 0
    ) {

        if (emptyState) {

            emptyState.style.display =
                "block";


            const title =
                emptyState.querySelector(
                    "h2"
                );


            const paragraph =
                emptyState.querySelector(
                    "p"
                );


            if (title) {

                title.textContent =
                    "No Matching Students";

            }


            if (paragraph) {

                paragraph.textContent =
                    "Try searching with another student name, roll number, or class.";

            }

        }


        updateSummary();

        return;

    }


    if (emptyState) {

        emptyState.style.display =
            "none";

    }


    /*
       RENDER STUDENT ROWS
    */

    filteredStudents.forEach(
        student => {

            const row =
                document.createElement(
                    "tr"
                );


            const initials =
                getInitials(
                    student.name
                );


            const status =
                attendance[todayKey][
                    student.id
                ] || "";


            row.innerHTML = `

                <td>

                    <div class="student-avatar">

                        ${initials}

                    </div>

                </td>


                <td>

                    ${escapeHTML(
                        student.roll
                    )}

                </td>


                <td>

                    ${escapeHTML(
                        student.name
                    )}

                </td>


                <td>

                    ${escapeHTML(
                        student.className
                    )}

                </td>


                <td>

                    <div class="attendance-actions">

                        <button
                            type="button"
                            class="present-btn ${
                                status === "Present"
                                    ? "active"
                                    : ""
                            }"
                            data-action="present"
                            data-id="${student.id}"
                        >

                            <i class="fa-solid fa-check"></i>

                            Present

                        </button>


                        <button
                            type="button"
                            class="absent-btn ${
                                status === "Absent"
                                    ? "active"
                                    : ""
                            }"
                            data-action="absent"
                            data-id="${student.id}"
                        >

                            <i class="fa-solid fa-xmark"></i>

                            Absent

                        </button>

                    </div>

                </td>

            `;


            attendanceBody.appendChild(
                row
            );

        }
    );


    updateSummary();

}


/* =========================================================
   MARK ATTENDANCE
========================================================= */

function markAttendance(
    studentId,
    status
) {

    /*
       Make sure today's object exists
    */

    if (
        !attendance[todayKey]
    ) {

        attendance[todayKey] =
            {};

    }


    /*
       Toggle status

       Clicking Present twice
       removes Present.

       Clicking Absent twice
       removes Absent.
    */

    const currentStatus =
        attendance[todayKey][
            studentId
        ];


    if (
        currentStatus === status
    ) {

        attendance[todayKey][
            studentId
        ] = "";

    }

    else {

        attendance[todayKey][
            studentId
        ] = status;

    }


    /*
       Save immediately
       so data isn't lost accidentally.
    */

    saveAttendanceData();


    renderAttendance();

}


/* =========================================================
   TABLE BUTTON EVENTS
========================================================= */

if (attendanceBody) {

    attendanceBody.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "button[data-action]"
                );


            if (!button) {

                return;

            }


            const studentId =
                button.dataset.id;


            const action =
                button.dataset.action;


            if (
                action === "present"
            ) {

                markAttendance(
                    studentId,
                    "Present"
                );

            }


            if (
                action === "absent"
            ) {

                markAttendance(
                    studentId,
                    "Absent"
                );

            }

        }
    );

}


/* =========================================================
   UPDATE SUMMARY
========================================================= */

function updateSummary() {

    let present =
        0;

    let absent =
        0;

    let unmarked =
        0;


    students.forEach(
        student => {

            const status =
                attendance[todayKey][
                    student.id
                ];


            if (
                status === "Present"
            ) {

                present++;

            }

            else if (
                status === "Absent"
            ) {

                absent++;

            }

            else {

                unmarked++;

            }

        }
    );


    const total =
        students.length;


    /*
       Attendance percentage
       is based on Present / Total
    */

    let percentage =
        0;


    if (
        total > 0
    ) {

        percentage =
            Math.round(
                (
                    present /
                    total
                ) * 100
            );

    }


    if (totalStudentsElement) {

        totalStudentsElement.textContent =
            total;

    }


    if (presentCountElement) {

        presentCountElement.textContent =
            present;

    }


    if (absentCountElement) {

        absentCountElement.textContent =
            absent;

    }


    if (attendancePercentElement) {

        attendancePercentElement.textContent =
            percentage + "%";

    }


    if (bestAttendanceElement) {

        bestAttendanceElement.textContent =
            percentage + "%";

    }

}


/* =========================================================
   SAVE BUTTON
========================================================= */

if (saveBtn) {

    saveBtn.addEventListener(
        "click",
        () => {

            saveAttendanceData();


            saveBtn.innerHTML = `

                <i class="fa-solid fa-check"></i>

                Saved

            `;


            setTimeout(
                () => {

                    saveBtn.innerHTML = `

                        <i class="fa-solid fa-floppy-disk"></i>

                        Save Attendance

                    `;

                },
                1800
            );


            console.log(
                "Attendance saved successfully."
            );

        }
    );

}


/* =========================================================
   SEARCH
========================================================= */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        () => {

            renderAttendance();

        }
    );

}


/* =========================================================
   REFRESH WHEN WINDOW GETS FOCUS
   Useful if a new student was added
   in the Students module.
========================================================= */

window.addEventListener(
    "focus",
    () => {

        const latestStudents =
            JSON.parse(
                localStorage.getItem(
                    "vvc_students"
                )
            ) || [];


        if (
            JSON.stringify(
                latestStudents
            ) !==
            JSON.stringify(
                students
            )
        ) {

            loadStudents();

            renderAttendance();

        }

    }
);


/* =========================================================
   STORAGE EVENT
   Updates Attendance if another tab
   changes Students or Attendance data.
========================================================= */

window.addEventListener(
    "storage",
    event => {

        if (
            event.key ===
            "vvc_students"
        ) {

            loadStudents();

            renderAttendance();

        }


        if (
            event.key ===
            "vvc_attendance"
        ) {

            attendance =
                JSON.parse(
                    event.newValue
                ) || {};


            if (
                !attendance[todayKey]
            ) {

                attendance[todayKey] =
                    {};

            }


            renderAttendance();

        }


        if (
            event.key ===
            "vvc_dark_mode"
        ) {

            loadDarkMode();

        }

    }
);


/* =========================================================
   INITIALIZE MODULE
========================================================= */

loadStudents();

renderAttendance();


console.log(
    "VVCMS Attendance Module Loaded Successfully 🚀"
);