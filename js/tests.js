/*==================================================*
* VVCMS TESTS.JS
* Vidya Vision Classes
*==================================================*/


// ==========================================
// SESSION CHECK
// ==========================================

if (
    sessionStorage.getItem("vvc_logged_in") !== "true"
) {

    window.location.href = "login.html";

}


// ==========================================
// ELEMENTS
// ==========================================

const loader =
    document.getElementById("loader");

const testModal =
    document.getElementById("testModal");

const addTestBtn =
    document.getElementById("addTestBtn");

const emptyAddTestBtn =
    document.getElementById("emptyAddTestBtn");

const closeModalBtn =
    document.getElementById("closeModal");

const testForm =
    document.getElementById("testForm");

const testBody =
    document.getElementById("testBody");

const tableContainer =
    document.getElementById("tableContainer");

const emptyState =
    document.getElementById("emptyState");

const searchTests =
    document.getElementById("searchTests");

const classFilter =
    document.getElementById("classFilter");

const statusFilter =
    document.getElementById("statusFilter");

const modalTitle =
    document.getElementById("modalTitle");

const saveButtonText =
    document.getElementById("saveButtonText");


// ==========================================
// SUMMARY ELEMENTS
// ==========================================

const totalTests =
    document.getElementById("totalTests");

const upcomingTests =
    document.getElementById("upcomingTests");

const completedTests =
    document.getElementById("completedTests");

const totalMarks =
    document.getElementById("totalMarks");


// ==========================================
// DATA
// ==========================================

let tests = JSON.parse(

    localStorage.getItem("vvc_tests")

) || [];


// ==========================================
// EDIT MODE
// ==========================================

let editingTestId = null;


// ==========================================
// SAVE TESTS
// ==========================================

function saveTests() {

    localStorage.setItem(

        "vvc_tests",

        JSON.stringify(tests)

    );

}


// ==========================================
// LOADER
// ==========================================

window.addEventListener(

    "load",

    () => {

        setTimeout(

            () => {

                if (!loader) return;

                loader.style.opacity = "0";

                setTimeout(

                    () => {

                        loader.style.display = "none";

                    },

                    500

                );

            },

            1200

        );

    }

);


// ==========================================
// DARK MODE
// ==========================================

function applyDarkMode() {

    const darkMode =
        localStorage.getItem(
            "vvc_dark_mode"
        ) === "true";

    document.body.classList.toggle(
        "dark-mode",
        darkMode
    );

}


applyDarkMode();


// Listen for dark mode changes
window.addEventListener(

    "storage",

    (event) => {

        if (
            event.key ===
            "vvc_dark_mode"
        ) {

            applyDarkMode();

        }

    }

);


// ==========================================
// PROFILE
// ==========================================

function loadProfile() {

    const profile = JSON.parse(

        localStorage.getItem(
            "vvc_profile"
        )

    ) || {

        name:
            "Himanshu Gupta",

        role:
            "Founder",

        institute:
            "Vidya Vision Classes"

    };


    const nameElement =
        document.getElementById(
            "teacherNameDisplay"
        );

    const roleElement =
        document.getElementById(
            "teacherRoleDisplay"
        );

    const initialsElement =
        document.getElementById(
            "profileInitials"
        );


    if (nameElement) {

        nameElement.textContent =
            profile.name;

    }


    if (roleElement) {

        roleElement.textContent =
            profile.role;

    }


    if (initialsElement) {

        const initials =
            profile.name

                .split(" ")

                .map(
                    word =>
                        word.charAt(0)
                )

                .join("")

                .substring(0, 3)

                .toUpperCase();


        initialsElement.textContent =
            initials || "VVC";

    }

}


loadProfile();


// ==========================================
// OPEN MODAL
// ==========================================

function openTestModal() {

    editingTestId = null;

    testForm.reset();

    modalTitle.textContent =
        "Add New Test";

    saveButtonText.textContent =
        "Save Test";

    testModal.style.display =
        "flex";

    document.body.style.overflow =
        "hidden";

}


addTestBtn.addEventListener(

    "click",

    openTestModal

);


emptyAddTestBtn.addEventListener(

    "click",

    openTestModal

);


// ==========================================
// CLOSE MODAL
// ==========================================

function closeTestModal() {

    testModal.style.display =
        "none";

    document.body.style.overflow =
        "";

    editingTestId = null;

    testForm.reset();

}


closeModalBtn.addEventListener(

    "click",

    closeTestModal

);


// Close when clicking outside

testModal.addEventListener(

    "click",

    (event) => {

        if (
            event.target ===
            testModal
        ) {

            closeTestModal();

        }

    }

);


// Close with Escape

document.addEventListener(

    "keydown",

    (event) => {

        if (
            event.key === "Escape" &&
            testModal.style.display ===
                "flex"
        ) {

            closeTestModal();

        }

    }

);


// ==========================================
// GET TEST STATUS
// ==========================================

function getTestStatus(test) {

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    const testDate =
        new Date(
            test.date + "T00:00:00"
        );


    if (
        testDate <
        today
    ) {

        return "Completed";

    }


    return "Upcoming";

}


// ==========================================
// SAVE / EDIT TEST
// ==========================================

testForm.addEventListener(

    "submit",

    (event) => {

        event.preventDefault();


        const name =
            document
                .getElementById(
                    "testName"
                )
                .value
                .trim();


        const subject =
            document
                .getElementById(
                    "testSubject"
                )
                .value
                .trim();


        const className =
            document
                .getElementById(
                    "testClass"
                )
                .value;


        const date =
            document
                .getElementById(
                    "testDate"
                )
                .value;


        const marks =
            Number(
                document
                    .getElementById(
                        "testMarks"
                    )
                    .value
            );


        const description =
            document
                .getElementById(
                    "testDescription"
                )
                .value
                .trim();


        if (
            !name ||
            !subject ||
            !className ||
            !date ||
            marks <= 0
        ) {

            alert(
                "Please fill all required fields correctly."
            );

            return;

        }


        // ======================================
        // EDIT EXISTING TEST
        // ======================================

        if (
            editingTestId !== null
        ) {

            const test =
                tests.find(

                    item =>
                        item.id ===
                        editingTestId

                );


            if (test) {

                test.name =
                    name;

                test.subject =
                    subject;

                test.className =
                    className;

                test.date =
                    date;

                test.marks =
                    marks;

                test.description =
                    description;

            }

        }


        // ======================================
        // CREATE NEW TEST
        // ======================================

        else {

            const newTest = {

                id:
                    Date.now(),

                name:
                    name,

                subject:
                    subject,

                className:
                    className,

                date:
                    date,

                marks:
                    marks,

                description:
                    description

            };


            tests.push(
                newTest
            );

        }


        saveTests();

        renderTests();

        updateSummary();

        closeTestModal();


        alert(

            editingTestId !== null

                ? "Test updated successfully!"

                : "Test created successfully!"

        );

    }

);


// ==========================================
// EDIT TEST
// ==========================================

function editTest(id) {

    const test =
        tests.find(

            item =>
                item.id === id

        );


    if (!test) {

        return;

    }


    editingTestId =
        id;


    document
        .getElementById(
            "testName"
        )
        .value =
        test.name;


    document
        .getElementById(
            "testSubject"
        )
        .value =
        test.subject;


    document
        .getElementById(
            "testClass"
        )
        .value =
        test.className;


    document
        .getElementById(
            "testDate"
        )
        .value =
        test.date;


    document
        .getElementById(
            "testMarks"
        )
        .value =
        test.marks;


    document
        .getElementById(
            "testDescription"
        )
        .value =
        test.description || "";


    modalTitle.textContent =
        "Edit Test";


    saveButtonText.textContent =
        "Update Test";


    testModal.style.display =
        "flex";


    document.body.style.overflow =
        "hidden";

}


// ==========================================
// DELETE TEST
// ==========================================

function deleteTest(id) {

    const test =
        tests.find(

            item =>
                item.id === id

        );


    if (!test) {

        return;

    }


    const confirmed =
        confirm(

            `Delete "${test.name}"? This action cannot be undone.`

        );


    if (!confirmed) {

        return;

    }


    tests =
        tests.filter(

            item =>
                item.id !== id

        );


    saveTests();

    renderTests();

    updateSummary();

}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(dateString) {

    if (!dateString) {

        return "—";

    }


    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(

        "en-IN",

        {

            day:
                "2-digit",

            month:
                "short",

            year:
                "numeric"

        }

    );

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    return String(value)

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


// ==========================================
// FILTER TESTS
// ==========================================

function getFilteredTests() {

    const keyword =
        searchTests.value
            .trim()
            .toLowerCase();


    const selectedClass =
        classFilter.value;


    const selectedStatus =
        statusFilter.value;


    return tests.filter(

        test => {

            const status =
                getTestStatus(
                    test
                );


            const matchesSearch =

                !keyword ||

                test.name
                    .toLowerCase()
                    .includes(
                        keyword
                    ) ||

                test.subject
                    .toLowerCase()
                    .includes(
                        keyword
                    ) ||

                test.className
                    .toLowerCase()
                    .includes(
                        keyword
                    );


            const matchesClass =

                selectedClass ===
                    "all" ||

                test.className ===
                    selectedClass;


            const matchesStatus =

                selectedStatus ===
                    "all" ||

                status ===
                    selectedStatus;


            return (

                matchesSearch &&

                matchesClass &&

                matchesStatus

            );

        }

    );

}


// ==========================================
// RENDER TESTS
// ==========================================

function renderTests() {

    const filteredTests =
        getFilteredTests();


    testBody.innerHTML =
        "";


    if (
        filteredTests.length ===
        0
    ) {

        tableContainer.style.display =
            "none";

        emptyState.style.display =
            "block";

        return;

    }


    tableContainer.style.display =
        "block";

    emptyState.style.display =
        "none";


    // Sort by date

    filteredTests.sort(

        (a, b) =>

            new Date(
                a.date
            ) -

            new Date(
                b.date
            )

    );


    filteredTests.forEach(

        test => {

            const status =
                getTestStatus(
                    test
                );


            const statusClass =

                status ===
                    "Completed"

                    ? "status-completed"

                    : "status-upcoming";


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>

                    <strong>
                        ${escapeHTML(
                            test.name
                        )}
                    </strong>

                    ${
                        test.description

                            ? `<small class="description-text">
                                ${escapeHTML(
                                    test.description
                                )}
                               </small>`

                            : ""
                    }

                </td>


                <td>
                    ${escapeHTML(
                        test.subject
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        test.className
                    )}
                </td>


                <td>
                    ${formatDate(
                        test.date
                    )}
                </td>


                <td>
                    ${test.marks}
                </td>


                <td>

                    <span
                        class="status-badge
                        ${statusClass}"
                    >

                        ${status}

                    </span>

                </td>


                <td>

                    <button
                        class="edit-btn"
                        onclick="editTest(${test.id})"
                        title="Edit Test"
                    >

                        <i class="fa-solid fa-pen"></i>

                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteTest(${test.id})"
                        title="Delete Test"
                    >

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </td>

            `;


            testBody.appendChild(
                row
            );

        }

    );

}


// ==========================================
// UPDATE SUMMARY
// ==========================================

function updateSummary() {

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    let upcoming =
        0;

    let completed =
        0;

    let marks =
        0;


    tests.forEach(

        test => {

            marks +=
                Number(
                    test.marks
                ) || 0;


            const status =
                getTestStatus(
                    test
                );


            if (
                status ===
                "Upcoming"
            ) {

                upcoming++;

            }

            else {

                completed++;

            }

        }

    );


    totalTests.textContent =
        tests.length;


    upcomingTests.textContent =
        upcoming;


    completedTests.textContent =
        completed;


    totalMarks.textContent =
        marks;

}


// ==========================================
// SEARCH / FILTER EVENTS
// ==========================================

searchTests.addEventListener(

    "input",

    renderTests

);


classFilter.addEventListener(

    "change",

    renderTests

);


statusFilter.addEventListener(

    "change",

    renderTests

);


// ==========================================
// NOTIFICATION BUTTON
// ==========================================

const notificationBtn =
    document.getElementById(
        "notificationBtn"
    );


if (notificationBtn) {

    notificationBtn.addEventListener(

        "click",

        () => {

            alert(
                "You are all caught up! 🎉"
            );

        }

    );

}


// ==========================================
// INITIAL LOAD
// ==========================================

renderTests();

updateSummary();


console.log(

    "Tests Module Loaded Successfully 🚀"

);