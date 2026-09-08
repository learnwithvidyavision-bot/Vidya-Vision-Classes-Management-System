/* ==================================================
   VVCMS PARENTS.JS
   Vidya Vision Classes
   ================================================== */


/* ==================================================
   SESSION CHECK
   ================================================== */

if (sessionStorage.getItem("vvc_logged_in") !== "true") {
    window.location.href = "login.html";
}


/* ==================================================
   LOADER
   ================================================== */

window.addEventListener("load", () => {

    const loader = document.getElementById("loader");

    if (loader) {

        setTimeout(() => {

            loader.style.opacity = "0";

            setTimeout(() => {
                loader.style.display = "none";
            }, 500);

        }, 1200);

    }

});


/* ==================================================
   ELEMENTS
   ================================================== */

const parentBody = document.getElementById("parentBody");

const emptyState = document.getElementById("emptyState");

const addParentBtn = document.getElementById("addParentBtn");

const emptyAddParentBtn = document.getElementById("emptyAddParentBtn");

const parentModal = document.getElementById("parentModal");

const closeModal = document.getElementById("closeModal");

const parentForm = document.getElementById("parentForm");

const searchParents = document.getElementById("searchParents");

const relationFilter = document.getElementById("relationFilter");

const classFilter = document.getElementById("classFilter");

const parentStudent = document.getElementById("parentStudent");

const parentName = document.getElementById("parentName");

const parentRelation = document.getElementById("parentRelation");

const parentPhone = document.getElementById("parentPhone");

const parentEmail = document.getElementById("parentEmail");

const tableContainer = document.querySelector(".table-container");

const totalParents = document.getElementById("totalParents");

const totalFathers = document.getElementById("totalFathers");

const totalMothers = document.getElementById("totalMothers");

const totalGuardians = document.getElementById("totalGuardians");


/* ==================================================
   DATA
   ================================================== */

const students =
    JSON.parse(localStorage.getItem("vvc_students")) || [];


let parents =
    JSON.parse(localStorage.getItem("vvc_parents")) || [];


/* ==================================================
   SAVE PARENTS
   ================================================== */

function saveParents() {

    localStorage.setItem(
        "vvc_parents",
        JSON.stringify(parents)
    );

}


/* ==================================================
   UPDATE SUMMARY CARDS
   ================================================== */

function updateSummary() {

    totalParents.textContent = parents.length;

    totalFathers.textContent =
        parents.filter(parent => parent.relation === "Father").length;

    totalMothers.textContent =
        parents.filter(parent => parent.relation === "Mother").length;

    totalGuardians.textContent =
        parents.filter(parent => parent.relation === "Guardian").length;

}


/* ==================================================
   POPULATE STUDENT DROPDOWN
   ================================================== */

function populateStudents() {

    parentStudent.innerHTML = "";


    if (students.length === 0) {

        parentStudent.innerHTML = `
            <option value="">
                No students added yet
            </option>
        `;

        return;

    }


    students.forEach(student => {

        const option = document.createElement("option");

        option.value = student.id;

        option.textContent =
            `${student.name} (Class ${student.className})`;

        parentStudent.appendChild(option);

    });

}


populateStudents();


/* ==================================================
   OPEN MODAL
   ================================================== */

function openParentModal() {

    if (students.length === 0) {

        alert(
            "Please add students first from the Students module."
        );

        return;

    }


    parentForm.reset();

    parentModal.style.display = "flex";

    document.body.style.overflow = "hidden";

    setTimeout(() => {

        parentName.focus();

    }, 100);

}


/* ==================================================
   CLOSE MODAL
   ================================================== */

function closeParentModal() {

    parentModal.style.display = "none";

    document.body.style.overflow = "";

    parentForm.reset();

}


/* ==================================================
   OPEN MODAL BUTTONS
   ================================================== */

addParentBtn.addEventListener(
    "click",
    openParentModal
);


emptyAddParentBtn.addEventListener(
    "click",
    openParentModal
);


/* ==================================================
   CLOSE MODAL BUTTON
   ================================================== */

closeModal.addEventListener(
    "click",
    closeParentModal
);


/* ==================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
   ================================================== */

parentModal.addEventListener(
    "click",
    (event) => {

        if (event.target === parentModal) {

            closeParentModal();

        }

    }
);


/* ==================================================
   CLOSE MODAL WITH ESCAPE KEY
   ================================================== */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            parentModal.style.display === "flex"
        ) {

            closeParentModal();

        }

    }
);


/* ==================================================
   ADD PARENT
   ================================================== */

parentForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        /* ------------------------------
           GET SELECTED STUDENT
           ------------------------------ */

        const studentId =
            parentStudent.value;


        const student =
            students.find(
                student =>
                    String(student.id) ===
                    String(studentId)
            );


        if (!student) {

            alert(
                "Please select a valid student."
            );

            return;

        }


        /* ------------------------------
           PHONE VALIDATION
           ------------------------------ */

        const phone =
            parentPhone.value.trim();


        if (!/^\d{10}$/.test(phone)) {

            alert(
                "Please enter a valid 10-digit phone number."
            );

            parentPhone.focus();

            return;

        }


        /* ------------------------------
           CREATE PARENT OBJECT
           ------------------------------ */

        const parent = {

            id: Date.now(),

            name:
                parentName.value.trim(),

            studentId:
                student.id,

            studentName:
                student.name,

            className:
                `Class ${student.className}`,

            relation:
                parentRelation.value,

            phone:
                phone,

            email:
                parentEmail.value.trim()

        };


        /* ------------------------------
           SAVE PARENT
           ------------------------------ */

        parents.push(parent);

        saveParents();

        updateSummary();

        renderParents();

        closeParentModal();


        console.log(
            "Parent contact added successfully."
        );

    }
);


/* ==================================================
   GET FILTERED PARENTS
   ================================================== */

function getFilteredParents() {

    const keyword =
        searchParents.value
            .trim()
            .toLowerCase();


    const selectedRelation =
        relationFilter.value;


    const selectedClass =
        classFilter.value;


    return parents.filter(parent => {


        /* ------------------------------
           SEARCH FILTER
           ------------------------------ */

        const matchesSearch =

            !keyword ||

            parent.name
                .toLowerCase()
                .includes(keyword) ||

            parent.studentName
                .toLowerCase()
                .includes(keyword) ||

            parent.phone
                .toLowerCase()
                .includes(keyword) ||

            (parent.email &&
                parent.email
                    .toLowerCase()
                    .includes(keyword));


        /* ------------------------------
           RELATION FILTER
           ------------------------------ */

        const matchesRelation =

            selectedRelation === "all" ||

            parent.relation ===
                selectedRelation;


        /* ------------------------------
           CLASS FILTER
           ------------------------------ */

        const parentClass =
            parent.className ||
            getStudentClass(parent.studentId);


        const matchesClass =

            selectedClass === "all" ||

            parentClass ===
                selectedClass;


        return (
            matchesSearch &&
            matchesRelation &&
            matchesClass
        );

    });

}


/* ==================================================
   GET STUDENT CLASS
   ================================================== */

function getStudentClass(studentId) {

    const student =
        students.find(
            student =>
                String(student.id) ===
                String(studentId)
        );


    if (!student) {

        return "";

    }


    return `Class ${student.className}`;

}


/* ==================================================
   RENDER PARENTS
   ================================================== */

function renderParents() {

    parentBody.innerHTML = "";


    const filteredParents =
        getFilteredParents();


    /* ------------------------------
       NO RESULTS
       ------------------------------ */

    if (filteredParents.length === 0) {

        tableContainer.style.display = "none";

        emptyState.style.display = "block";


        const hasFilters =

            searchParents.value.trim() !== "" ||

            relationFilter.value !== "all" ||

            classFilter.value !== "all";


        if (hasFilters) {

            emptyState.querySelector("h2")
                .textContent =
                "No Matching Parent Contacts";


            emptyState.querySelector("p")
                .textContent =
                "Try changing your search or filters to find the parent or guardian contact you are looking for.";

            emptyAddParentBtn.style.display = "none";

        } else {

            emptyState.querySelector("h2")
                .textContent =
                "No Parent Contacts Yet";


            emptyState.querySelector("p")
                .textContent =
                "Add parent or guardian information to keep communication organized and connected with every student.";

            emptyAddParentBtn.style.display = "flex";

        }


        return;

    }


    /* ------------------------------
       SHOW TABLE
       ------------------------------ */

    tableContainer.style.display = "block";

    emptyState.style.display = "none";


    /* ------------------------------
       CREATE TABLE ROWS
       ------------------------------ */

    filteredParents.forEach(parent => {


        const studentClass =

            parent.className ||

            getStudentClass(
                parent.studentId
            );


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${escapeHTML(parent.name)}
            </td>

            <td>
                ${escapeHTML(parent.studentName)}
            </td>

            <td>
                ${escapeHTML(studentClass || "—")}
            </td>

            <td>
                ${escapeHTML(parent.relation)}
            </td>

            <td>
                ${escapeHTML(parent.phone)}
            </td>

            <td>
                ${
                    parent.email
                        ? escapeHTML(parent.email)
                        : "—"
                }
            </td>

            <td>

                <button
                    class="delete-btn"
                    type="button"
                    onclick="deleteParent(${parent.id})"
                    aria-label="Delete parent contact"
                    title="Delete Parent Contact"
                >

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        `;


        parentBody.appendChild(row);

    });

}


/* ==================================================
   DELETE PARENT
   ================================================== */

function deleteParent(id) {

    const parent =
        parents.find(
            parent =>
                parent.id === id
        );


    if (!parent) {

        return;

    }


    const confirmed =
        confirm(
            `Delete the parent contact for ${parent.studentName}?`
        );


    if (!confirmed) {

        return;

    }


    parents =
        parents.filter(
            parent =>
                parent.id !== id
        );


    saveParents();

    updateSummary();

    renderParents();


    console.log(
        "Parent contact deleted successfully."
    );

}


/* ==================================================
   SEARCH EVENT
   ================================================== */

searchParents.addEventListener(
    "input",
    renderParents
);


/* ==================================================
   RELATION FILTER EVENT
   ================================================== */

relationFilter.addEventListener(
    "change",
    renderParents
);


/* ==================================================
   CLASS FILTER EVENT
   ================================================== */

classFilter.addEventListener(
    "change",
    renderParents
);


/* ==================================================
   ESCAPE HTML
   Prevents HTML injection in table
   ================================================== */

function escapeHTML(value) {

    const div =
        document.createElement("div");


    div.textContent =
        value ?? "";


    return div.innerHTML;

}


/* ==================================================
   INITIAL LOAD
   ================================================== */

updateSummary();

renderParents();


console.log(
    "Parents Module Loaded Successfully 🚀"
);