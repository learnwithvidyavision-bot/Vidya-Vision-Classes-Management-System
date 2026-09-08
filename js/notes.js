/* =========================================================
   VVCMS NOTES.JS
   Vidya Vision Classes
   Notes Management Module
========================================================= */

"use strict";


/* =========================================================
   LOGIN CHECK
========================================================= */

if (typeof checkLogin === "function") {

    checkLogin();

}


/* =========================================================
   LOADER
========================================================= */

window.addEventListener(
    "load",
    () => {

        if (
            typeof startLoader === "function"
        ) {

            startLoader();

        }

    }
);


/* =========================================================
   ELEMENTS
========================================================= */

const notesGrid =
    document.getElementById(
        "notesGrid"
    );


const emptyState =
    document.getElementById(
        "emptyState"
    );


const emptyStateText =
    document.getElementById(
        "emptyStateText"
    );


const addNoteBtn =
    document.getElementById(
        "addNoteBtn"
    );


const noteModal =
    document.getElementById(
        "noteModal"
    );


const closeModal =
    document.getElementById(
        "closeModal"
    );


const noteForm =
    document.getElementById(
        "noteForm"
    );


const searchNotes =
    document.getElementById(
        "searchNotes"
    );


const classFilter =
    document.getElementById(
        "classFilter"
    );


const subjectFilter =
    document.getElementById(
        "subjectFilter"
    );


const clearFiltersBtn =
    document.getElementById(
        "clearFiltersBtn"
    );


const resultCount =
    document.getElementById(
        "resultCount"
    );


const totalNotes =
    document.getElementById(
        "totalNotes"
    );


const totalClasses =
    document.getElementById(
        "totalClasses"
    );


const totalSubjects =
    document.getElementById(
        "totalSubjects"
    );


const modalTitle =
    document.getElementById(
        "modalTitle"
    );


const saveNoteBtn =
    document.getElementById(
        "saveNoteBtn"
    );


const profileName =
    document.getElementById(
        "profileName"
    );


const profileRole =
    document.getElementById(
        "profileRole"
    );


/* =========================================================
   DATA
========================================================= */

let notes =
    typeof loadData === "function"
        ? loadData("notes")
        : JSON.parse(
            localStorage.getItem(
                "vvc_notes"
            )
        ) || [];


let editingNoteId =
    null;


/* =========================================================
   SAVE NOTES
========================================================= */

function saveNotes() {

    if (
        typeof saveData === "function"
    ) {

        saveData(
            "notes",
            notes
        );

    }

    else {

        localStorage.setItem(
            "vvc_notes",
            JSON.stringify(
                notes
            )
        );

    }

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
   SAFE URL
========================================================= */

function getSafeURL(
    value
) {

    if (!value) {

        return "";

    }


    try {

        const url =
            new URL(
                value,
                window.location.href
            );


        if (
            url.protocol === "http:" ||
            url.protocol === "https:"
        ) {

            return url.href;

        }

    }

    catch (error) {

        return "";

    }


    return "";

}


/* =========================================================
   PROFILE
========================================================= */

function loadProfile() {

    const profile =
        JSON.parse(
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


    if (profileName) {

        profileName.textContent =
            profile.name ||
            "Himanshu Gupta";

    }


    if (profileRole) {

        profileRole.textContent =
            profile.role ||
            "Founder";

    }

}


loadProfile();


/* =========================================================
   MODAL
========================================================= */

function openAddModal() {

    editingNoteId =
        null;


    if (modalTitle) {

        modalTitle.textContent =
            "Add Note";

    }


    if (saveNoteBtn) {

        saveNoteBtn.innerHTML = `

            <i class="fa-solid fa-floppy-disk"></i>

            Save Note

        `;

    }


    if (noteForm) {

        noteForm.reset();

    }


    if (noteModal) {

        noteModal.style.display =
            "flex";

    }


    setTimeout(
        () => {

            const titleInput =
                document.getElementById(
                    "noteTitle"
                );


            if (titleInput) {

                titleInput.focus();

            }

        },
        100
    );

}


function closeNoteModal() {

    if (noteModal) {

        noteModal.style.display =
            "none";

    }


    editingNoteId =
        null;


    if (noteForm) {

        noteForm.reset();

    }

}


if (addNoteBtn) {

    addNoteBtn.addEventListener(
        "click",
        openAddModal
    );

}


if (closeModal) {

    closeModal.addEventListener(
        "click",
        closeNoteModal
    );

}


window.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            noteModal
        ) {

            closeNoteModal();

        }

    }
);


window.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape"
        ) {

            closeNoteModal();

        }

    }
);


/* =========================================================
   ADD / EDIT NOTE
========================================================= */

if (noteForm) {

    noteForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const title =
                document
                    .getElementById(
                        "noteTitle"
                    )
                    .value
                    .trim();


            const className =
                document
                    .getElementById(
                        "noteClass"
                    )
                    .value
                    .trim();


            const subject =
                document
                    .getElementById(
                        "noteSubject"
                    )
                    .value
                    .trim();


            const link =
                document
                    .getElementById(
                        "noteLink"
                    )
                    .value
                    .trim();


            const description =
                document
                    .getElementById(
                        "noteDescription"
                    )
                    .value
                    .trim();


            if (
                !title ||
                !className ||
                !subject
            ) {

                showMessage(
                    "Please fill all required fields."
                );

                return;

            }


            const safeLink =
                getSafeURL(
                    link
                );


            /* =========================================
               EDIT EXISTING NOTE
            ========================================= */

            if (
                editingNoteId !== null
            ) {

                const note =
                    notes.find(
                        item =>
                            String(
                                item.id
                            ) ===
                            String(
                                editingNoteId
                            )
                    );


                if (note) {

                    note.title =
                        title;

                    note.className =
                        className;

                    note.subject =
                        subject;

                    note.link =
                        safeLink;

                    note.description =
                        description;

                    note.updatedAt =
                        Date.now();

                }


                saveNotes();


                if (
                    typeof addActivity ===
                    "function"
                ) {

                    addActivity(
                        "Note Updated",
                        title
                    );

                }


                renderNotes();

                closeNoteModal();


                showMessage(
                    "Note updated successfully."
                );


                return;

            }


            /* =========================================
               CREATE NEW NOTE
            ========================================= */

            const note = {

                id:
                    Date.now(),

                title:
                    title,

                className:
                    className,

                subject:
                    subject,

                link:
                    safeLink,

                description:
                    description,

                createdAt:
                    Date.now()

            };


            notes.unshift(
                note
            );


            saveNotes();


            if (
                typeof addActivity ===
                "function"
            ) {

                addActivity(
                    "Note Uploaded",
                    title
                );

            }


            renderNotes();

            closeNoteModal();


            showMessage(
                "Note uploaded successfully."
            );

        }
    );

}


/* =========================================================
   FILTER OPTIONS
========================================================= */

function populateFilters() {

    if (
        !classFilter ||
        !subjectFilter
    ) {

        return;

    }


    const currentClass =
        classFilter.value;


    const currentSubject =
        subjectFilter.value;


    const classes =
        [
            ...new Set(
                notes
                    .map(
                        note =>
                            String(
                                note.className ||
                                ""
                            ).trim()
                    )
                    .filter(Boolean)
            )
        ]
        .sort(
            (a, b) =>
                a.localeCompare(
                    b,
                    undefined,
                    {
                        numeric: true
                    }
                )
        );


    const subjects =
        [
            ...new Set(
                notes
                    .map(
                        note =>
                            String(
                                note.subject ||
                                ""
                            ).trim()
                    )
                    .filter(Boolean)
            )
        ]
        .sort();


    classFilter.innerHTML = `

        <option value="all">

            All Classes

        </option>

    `;


    subjectFilter.innerHTML = `

        <option value="all">

            All Subjects

        </option>

    `;


    classes.forEach(
        className => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                className;


            option.textContent =
                `Class ${className}`;


            classFilter.appendChild(
                option
            );

        }
    );


    subjects.forEach(
        subject => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                subject;


            option.textContent =
                subject;


            subjectFilter.appendChild(
                option
            );

        }
    );


    if (
        classes.includes(
            currentClass
        )
    ) {

        classFilter.value =
            currentClass;

    }


    if (
        subjects.includes(
            currentSubject
        )
    ) {

        subjectFilter.value =
            currentSubject;

    }

}


/* =========================================================
   GET FILTERED NOTES
========================================================= */

function getFilteredNotes() {

    const keyword =
        searchNotes
            ? searchNotes.value
                .trim()
                .toLowerCase()
            : "";


    const selectedClass =
        classFilter
            ? classFilter.value
            : "all";


    const selectedSubject =
        subjectFilter
            ? subjectFilter.value
            : "all";


    return notes.filter(
        note => {

            const searchableText = [

                note.title,

                note.className,

                note.subject,

                note.description

            ]
                .join(" ")
                .toLowerCase();


            const matchesSearch =
                searchableText.includes(
                    keyword
                );


            const matchesClass =
                selectedClass === "all" ||
                String(
                    note.className
                ) ===
                selectedClass;


            const matchesSubject =
                selectedSubject === "all" ||
                String(
                    note.subject
                ) ===
                selectedSubject;


            return (
                matchesSearch &&
                matchesClass &&
                matchesSubject
            );

        }
    );

}


/* =========================================================
   RENDER NOTES
========================================================= */

function renderNotes() {

    if (!notesGrid) {

        return;

    }


    populateFilters();


    const filteredNotes =
        getFilteredNotes();


    notesGrid.innerHTML =
        "";


    /* =========================================
       SUMMARY
    ========================================= */

    updateSummary();


    if (resultCount) {

        resultCount.textContent =

            `${filteredNotes.length} ${
                filteredNotes.length === 1
                    ? "note"
                    : "notes"
            }`;

    }


    /* =========================================
       EMPTY STATE
    ========================================= */

    if (
        filteredNotes.length === 0
    ) {

        notesGrid.style.display =
            "none";


        if (emptyState) {

            emptyState.style.display =
                "block";

        }


        if (emptyStateText) {

            if (
                notes.length === 0
            ) {

                emptyStateText.textContent =
                    'Click "Add Note" to upload your first class note.';

            }

            else {

                emptyStateText.textContent =
                    "No notes match your current search or filters.";

            }

        }


        return;

    }


    if (emptyState) {

        emptyState.style.display =
            "none";

    }


    notesGrid.style.display =
        "grid";


    /* =========================================
       CREATE CARDS
    ========================================= */

    filteredNotes.forEach(
        note => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "note-card";


            const safeLink =
                getSafeURL(
                    note.link
                );


            card.innerHTML = `

                <div class="note-actions">

                    <button
                        type="button"
                        class="edit-btn"
                        data-id="${note.id}"
                        title="Edit Note"
                    >

                        <i class="fa-solid fa-pen"></i>

                    </button>


                    <button
                        type="button"
                        class="delete-btn"
                        data-id="${note.id}"
                        title="Delete Note"
                    >

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>


                <span class="note-tag">

                    Class ${escapeHTML(
                        note.className
                    )}

                    ·

                    ${escapeHTML(
                        note.subject
                    )}

                </span>


                <h3>

                    ${escapeHTML(
                        note.title
                    )}

                </h3>


                <p>

                    ${
                        note.description
                            ? escapeHTML(
                                note.description
                            )
                            : "No description added."
                    }

                </p>


                <div class="note-meta">

                    ${
                        safeLink

                            ? `

                                <a
                                    class="note-link"
                                    href="${escapeHTML(
                                        safeLink
                                    )}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >

                                    Open Note

                                    <i class="fa-solid fa-arrow-up-right-from-square"></i>

                                </a>

                            `

                            : `

                                <span class="note-no-link">

                                    <i class="fa-solid fa-link-slash"></i>

                                    No link attached

                                </span>

                            `
                    }

                </div>

            `;


            notesGrid.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   NOTE CARD ACTIONS
========================================================= */

if (notesGrid) {

    notesGrid.addEventListener(
        "click",
        event => {

            const editButton =
                event.target.closest(
                    ".edit-btn"
                );


            const deleteButton =
                event.target.closest(
                    ".delete-btn"
                );


            if (editButton) {

                editNote(
                    editButton.dataset.id
                );

                return;

            }


            if (deleteButton) {

                deleteNote(
                    deleteButton.dataset.id
                );

            }

        }
    );

}


/* =========================================================
   EDIT NOTE
========================================================= */

function editNote(
    id
) {

    const note =
        notes.find(
            item =>
                String(
                    item.id
                ) ===
                String(
                    id
                )
        );


    if (!note) {

        return;

    }


    editingNoteId =
        note.id;


    document.getElementById(
        "noteTitle"
    ).value =
        note.title || "";


    document.getElementById(
        "noteClass"
    ).value =
        note.className || "";


    document.getElementById(
        "noteSubject"
    ).value =
        note.subject || "";


    document.getElementById(
        "noteLink"
    ).value =
        note.link || "";


    document.getElementById(
        "noteDescription"
    ).value =
        note.description || "";


    if (modalTitle) {

        modalTitle.textContent =
            "Edit Note";

    }


    if (saveNoteBtn) {

        saveNoteBtn.innerHTML = `

            <i class="fa-solid fa-pen"></i>

            Update Note

        `;

    }


    if (noteModal) {

        noteModal.style.display =
            "flex";

    }

}


/* =========================================================
   DELETE NOTE
========================================================= */

function deleteNote(
    id
) {

    const note =
        notes.find(
            item =>
                String(
                    item.id
                ) ===
                String(
                    id
                )
        );


    if (!note) {

        return;

    }


    const confirmed =
        confirm(
            `Delete "${note.title}"?`
        );


    if (!confirmed) {

        return;

    }


    notes =
        notes.filter(
            item =>
                String(
                    item.id
                ) !==
                String(
                    id
                )
        );


    saveNotes();


    if (
        typeof addActivity ===
        "function"
    ) {

        addActivity(
            "Note Deleted",
            note.title
        );

    }


    renderNotes();


    showMessage(
        "Note deleted successfully."
    );

}


/* =========================================================
   SEARCH
========================================================= */

if (searchNotes) {

    searchNotes.addEventListener(
        "input",
        () => {

            renderNotes();

        }
    );

}


/* =========================================================
   FILTERS
========================================================= */

if (classFilter) {

    classFilter.addEventListener(
        "change",
        () => {

            renderNotes();

        }
    );

}


if (subjectFilter) {

    subjectFilter.addEventListener(
        "change",
        () => {

            renderNotes();

        }
    );

}


/* =========================================================
   CLEAR FILTERS
========================================================= */

if (clearFiltersBtn) {

    clearFiltersBtn.addEventListener(
        "click",
        () => {

            if (searchNotes) {

                searchNotes.value =
                    "";

            }


            if (classFilter) {

                classFilter.value =
                    "all";

            }


            if (subjectFilter) {

                subjectFilter.value =
                    "all";

            }


            renderNotes();

        }
    );

}


/* =========================================================
   SUMMARY
========================================================= */

function updateSummary() {

    if (totalNotes) {

        totalNotes.textContent =
            notes.length;

    }


    const classes =
        new Set(
            notes.map(
                note =>
                    note.className
            )
        );


    const subjects =
        new Set(
            notes.map(
                note =>
                    note.subject
            )
        );


    if (totalClasses) {

        totalClasses.textContent =
            classes.size;

    }


    if (totalSubjects) {

        totalSubjects.textContent =
            subjects.size;

    }

}


/* =========================================================
   TOAST / MESSAGE
========================================================= */

function showMessage(
    message
) {

    if (
        typeof showToast ===
        "function"
    ) {

        showToast(
            message
        );

        return;

    }


    alert(
        message
    );

}


/* =========================================================
   STORAGE SYNC
========================================================= */

window.addEventListener(
    "storage",
    event => {

        if (
            event.key ===
            "vvc_notes"
        ) {

            notes =
                JSON.parse(
                    event.newValue
                ) || [];


            renderNotes();

        }


        if (
            event.key ===
            "vvc_profile"
        ) {

            loadProfile();

        }


        if (
            event.key ===
            "vvc_dark_mode"
        ) {

            document.body.classList.toggle(

                "dark-mode",

                event.newValue ===
                "true"

            );

        }

    }
);


/* =========================================================
   INITIAL LOAD
========================================================= */

renderNotes();


console.log(
    "Notes Module Loaded Successfully 🚀"
);