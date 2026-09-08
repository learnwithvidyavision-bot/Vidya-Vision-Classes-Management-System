/* =========================================================
   VVCMS STUDENTS.JS
   Vidya Vision Classes
   Student Management Module
   ========================================================= */

"use strict";

/* =========================================================
   SESSION CHECK
========================================================= */

if (sessionStorage.getItem("vvc_logged_in") !== "true") {
    window.location.href = "login.html";
}


/* =========================================================
   ELEMENTS
========================================================= */

const loader = document.getElementById("loader");

const modal = document.getElementById("studentModal");

const addBtn = document.getElementById("addStudentBtn");

const closeBtn = document.getElementById("closeModal");

const cancelBtn = document.getElementById("cancelStudentBtn");

const form = document.getElementById("studentForm");

const tableBody = document.getElementById("studentBody");

const emptyState = document.getElementById("emptyState");

const searchInput = document.getElementById("searchStudent");

const classFilter = document.getElementById("classFilter");

const feeFilter = document.getElementById("feeFilter");

const modalTitle = document.getElementById("modalTitle");

const saveStudentBtn = document.getElementById("saveStudentBtn");


/* =========================================================
   FORM ELEMENTS
========================================================= */

const studentNameInput =
    document.getElementById("studentName");

const rollNumberInput =
    document.getElementById("rollNumber");

const studentClassInput =
    document.getElementById("studentClass");

const studentPhoneInput =
    document.getElementById("studentPhone");

const feeStatusInput =
    document.getElementById("feeStatus");


/* =========================================================
   STATISTICS ELEMENTS
========================================================= */

const totalStudentsElement =
    document.getElementById("totalStudents");

const paidStudentsElement =
    document.getElementById("paidStudents");

const dueStudentsElement =
    document.getElementById("dueStudents");

const totalClassesElement =
    document.getElementById("totalClasses");


/* =========================================================
   DATA
========================================================= */

let students =
    JSON.parse(
        localStorage.getItem("vvc_students")
    ) || [];


/*
   Stores the ID of the student currently
   being edited.

   null = Add Mode
   number = Edit Mode
*/

let editingStudentId = null;


/* =========================================================
   LOADER
========================================================= */

window.addEventListener("load", () => {

    if (!loader) return;

    setTimeout(() => {

        loader.style.opacity = "0";

        setTimeout(() => {

            loader.style.display = "none";

        }, 500);

    }, 1200);

});


/* =========================================================
   DARK MODE
   Syncs with Settings Module
========================================================= */

function loadDarkMode() {

    const darkModeEnabled =
        localStorage.getItem("vvc_dark_mode") === "true";

    document.body.classList.toggle(
        "dark-mode",
        darkModeEnabled
    );

}


/* =========================================================
   SAVE STUDENTS
========================================================= */

function saveStudents() {

    localStorage.setItem(
        "vvc_students",
        JSON.stringify(students)
    );

}


/* =========================================================
   UPDATE STATISTICS
========================================================= */

function updateStatistics() {

    const total =
        students.length;

    const paid =
        students.filter(
            student =>
                student.fee === "Paid"
        ).length;

    const due =
        students.filter(
            student =>
                student.fee === "Due"
        ).length;

    const classes =
        new Set(
            students.map(
                student =>
                    student.className
            )
        );


    if (totalStudentsElement) {

        totalStudentsElement.textContent =
            total;

    }


    if (paidStudentsElement) {

        paidStudentsElement.textContent =
            paid;

    }


    if (dueStudentsElement) {

        dueStudentsElement.textContent =
            due;

    }


    if (totalClassesElement) {

        totalClassesElement.textContent =
            classes.size;

    }

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


    const selectedClass =
        classFilter
            ? classFilter.value
            : "all";


    const selectedFee =
        feeFilter
            ? feeFilter.value
            : "all";


    return students.filter(student => {

        const searchableText = [

            student.name,

            student.roll,

            student.className,

            student.phone,

            student.fee

        ]
            .join(" ")
            .toLowerCase();


        const matchesSearch =
            searchableText.includes(
                keyword
            );


        const matchesClass =
            selectedClass === "all" ||
            student.className === selectedClass;


        const matchesFee =
            selectedFee === "all" ||
            student.fee === selectedFee;


        return (
            matchesSearch &&
            matchesClass &&
            matchesFee
        );

    });

}


/* =========================================================
   GET INITIALS
========================================================= */

function getInitials(name) {

    if (!name) return "ST";


    return name
        .trim()
        .split(/\s+/)
        .map(word => word.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase();

}


/* =========================================================
   RENDER STUDENTS
========================================================= */

function renderStudents() {

    if (!tableBody) return;


    tableBody.innerHTML = "";


    const filteredStudents =
        getFilteredStudents();


    /*
       No Students at all
    */

    if (students.length === 0) {

        if (emptyState) {

            emptyState.style.display =
                "block";

            emptyState.querySelector("h2")
                .textContent =
                "No Students Yet";

            emptyState.querySelector("p")
                .textContent =
                "Add your first student to get started.";

        }


        updateStatistics();

        return;

    }


    /*
       Students exist, but filters
       returned no results
    */

    if (filteredStudents.length === 0) {

        if (emptyState) {

            emptyState.style.display =
                "block";

            emptyState.querySelector("h2")
                .textContent =
                "No Matching Students";

            emptyState.querySelector("p")
                .textContent =
                "Try changing your search or filters.";

        }


        updateStatistics();

        return;

    }


    /*
       Students found
    */

    if (emptyState) {

        emptyState.style.display =
            "none";

    }


    filteredStudents.forEach(student => {

        const row =
            document.createElement("tr");


        const initials =
            getInitials(
                student.name
            );


        row.innerHTML = `

            <td>

                <div class="student-info">

                    <div class="student-avatar">

                        ${initials}

                    </div>

                    <strong>

                        ${escapeHTML(
                            student.name
                        )}

                    </strong>

                </div>

            </td>


            <td>

                ${escapeHTML(
                    student.roll
                )}

            </td>


            <td>

                ${escapeHTML(
                    student.className
                )}

            </td>


            <td>

                ${escapeHTML(
                    student.phone
                )}

            </td>


            <td>

                <span class="${
                    student.fee === "Paid"
                        ? "paid"
                        : "due"
                }">

                    ${escapeHTML(
                        student.fee
                    )}

                </span>

            </td>


            <td>

                <button
                    class="edit-btn"
                    type="button"
                    data-action="edit"
                    data-id="${student.id}"
                    title="Edit Student"
                >

                    <i class="fa-solid fa-pen"></i>

                </button>


                <button
                    class="delete-btn"
                    type="button"
                    data-action="delete"
                    data-id="${student.id}"
                    title="Delete Student"
                >

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });


    updateStatistics();

}


/* =========================================================
   ESCAPE HTML
   Prevents HTML injection in displayed data
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   OPEN ADD MODAL
========================================================= */

function openAddModal() {

    editingStudentId = null;


    if (modalTitle) {

        modalTitle.textContent =
            "Add New Student";

    }


    if (saveStudentBtn) {

        saveStudentBtn.innerHTML = `

            <i class="fa-solid fa-floppy-disk"></i>

            Save Student

        `;

    }


    form.reset();


    if (modal) {

        modal.style.display =
            "flex";

    }


    document.body.classList.add(
        "modal-open"
    );


    setTimeout(() => {

        studentNameInput?.focus();

    }, 100);

}


/* =========================================================
   OPEN EDIT MODAL
========================================================= */

function editStudent(id) {

    const student =
        students.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!student) {

        alert(
            "Student record not found."
        );

        return;

    }


    editingStudentId =
        student.id;


    studentNameInput.value =
        student.name || "";


    rollNumberInput.value =
        student.roll || "";


    studentClassInput.value =
        student.className || "";


    studentPhoneInput.value =
        student.phone || "";


    feeStatusInput.value =
        student.fee || "Paid";


    if (modalTitle) {

        modalTitle.textContent =
            "Edit Student";

    }


    if (saveStudentBtn) {

        saveStudentBtn.innerHTML = `

            <i class="fa-solid fa-floppy-disk"></i>

            Update Student

        `;

    }


    if (modal) {

        modal.style.display =
            "flex";

    }


    document.body.classList.add(
        "modal-open"
    );


    setTimeout(() => {

        studentNameInput?.focus();

    }, 100);

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeStudentModal() {

    if (modal) {

        modal.style.display =
            "none";

    }


    document.body.classList.remove(
        "modal-open"
    );


    editingStudentId =
        null;


    form.reset();


    if (modalTitle) {

        modalTitle.textContent =
            "Add New Student";

    }


    if (saveStudentBtn) {

        saveStudentBtn.innerHTML = `

            <i class="fa-solid fa-floppy-disk"></i>

            Save Student

        `;

    }

}


/* =========================================================
   ADD STUDENT BUTTON
========================================================= */

if (addBtn) {

    addBtn.addEventListener(
        "click",
        openAddModal
    );

}


/* =========================================================
   CLOSE BUTTON
========================================================= */

if (closeBtn) {

    closeBtn.addEventListener(
        "click",
        closeStudentModal
    );

}


/* =========================================================
   CANCEL BUTTON
========================================================= */

if (cancelBtn) {

    cancelBtn.addEventListener(
        "click",
        closeStudentModal
    );

}


/* =========================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
========================================================= */

if (modal) {

    modal.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {

                closeStudentModal();

            }

        }
    );

}


/* =========================================================
   ESC KEY CLOSES MODAL
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            modal &&
            modal.style.display === "flex"
        ) {

            closeStudentModal();

        }

    }
);


/* =========================================================
   SAVE / UPDATE STUDENT
========================================================= */

if (form) {

    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const name =
                studentNameInput.value.trim();


            const roll =
                rollNumberInput.value.trim();


            const className =
                studentClassInput.value;


            const phone =
                studentPhoneInput.value.trim();


            const fee =
                feeStatusInput.value;


            /*
               Basic validation
            */

            if (
                !name ||
                !roll ||
                !className ||
                !phone ||
                !fee
            ) {

                alert(
                    "Please fill in all required fields."
                );

                return;

            }


            /*
               Phone validation
            */

            if (
                !/^\d{10}$/.test(phone)
            ) {

                alert(
                    "Please enter a valid 10-digit phone number."
                );

                studentPhoneInput.focus();

                return;

            }


            /*
               EDIT MODE
            */

            if (
                editingStudentId !== null
            ) {

                const index =
                    students.findIndex(
                        student =>
                            String(student.id) ===
                            String(editingStudentId)
                    );


                if (index !== -1) {

                    students[index] = {

                        ...students[index],

                        name,

                        roll,

                        className,

                        phone,

                        fee

                    };

                }

            }


            /*
               ADD MODE
            */

            else {

                const newStudent = {

                    id:
                        Date.now(),

                    name,

                    roll,

                    className,

                    phone,

                    fee

                };


                students.push(
                    newStudent
                );

            }


            /*
               Save and refresh
            */

            saveStudents();

            renderStudents();

            closeStudentModal();


            console.log(
                "Student saved successfully."
            );

        }
    );

}


/* =========================================================
   DELETE STUDENT
========================================================= */

function deleteStudent(id) {

    const student =
        students.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!student) {

        return;

    }


    const confirmed =
        confirm(
            `Delete ${student.name} from the student records?`
        );


    if (!confirmed) {

        return;

    }


    students =
        students.filter(
            student =>
                String(student.id) !==
                String(id)
        );


    saveStudents();

    renderStudents();


    console.log(
        "Student deleted successfully."
    );

}


/* =========================================================
   TABLE ACTIONS
   Event Delegation
========================================================= */

if (tableBody) {

    tableBody.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "button[data-action]"
                );


            if (!button) {

                return;

            }


            const action =
                button.dataset.action;


            const id =
                button.dataset.id;


            if (action === "edit") {

                editStudent(id);

            }


            if (action === "delete") {

                deleteStudent(id);

            }

        }
    );

}


/* =========================================================
   SEARCH
========================================================= */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        renderStudents
    );

}


/* =========================================================
   CLASS FILTER
========================================================= */

if (classFilter) {

    classFilter.addEventListener(
        "change",
        renderStudents
    );

}


/* =========================================================
   FEE FILTER
========================================================= */

if (feeFilter) {

    feeFilter.addEventListener(
        "change",
        renderStudents
    );

}


/* =========================================================
   INITIALIZE
========================================================= */

loadDarkMode();

renderStudents();


console.log(
    "Students Module Loaded Successfully 🚀"
);