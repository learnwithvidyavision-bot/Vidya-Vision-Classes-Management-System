/*==================================================*
 * VVCMS FIRESTORE.JS
 * Firebase Database Layer
 * Vidya Vision Classes
 *==================================================*/

import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    updateDoc,
    deleteDoc,
    doc,
    setDoc,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

/*==================================================*
                COLLECTIONS
*==================================================*/

const STUDENTS = "students";
const ATTENDANCE = "attendance";
const NOTES = "notes";
const TESTS = "tests";
const RESULTS = "results";
const PARENTS = "parents";
const SETTINGS = "settings";

/*==================================================*
                GENERIC FUNCTIONS
*==================================================*/

// Create
export async function create(collectionName, data){

    data.createdAt = serverTimestamp();

    const docRef = await addDoc(
        collection(db, collectionName),
        data
    );

    return docRef.id;
}

// Read All
export async function read(collectionName){

    const q = query(
        collection(db, collectionName),
        orderBy("createdAt","desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc=>({

        id:doc.id,

        ...doc.data()

    }));

}

// Read One
export async function readOne(collectionName,id){

    const snapshot = await getDoc(

        doc(db,collectionName,id)

    );

    if(snapshot.exists()){

        return {

            id:snapshot.id,

            ...snapshot.data()

        };

    }

    return null;

}

// Update
export async function update(collectionName,id,data){

    await updateDoc(

        doc(db,collectionName,id),

        data

    );

}

// Delete
export async function remove(collectionName,id){

    await deleteDoc(

        doc(db,collectionName,id)

    );

}

// Settings
export async function saveSettings(data){

    await setDoc(

        doc(db,SETTINGS,"config"),

        data

    );

}

/*==================================================*
                STUDENTS
*==================================================*/

export const addStudent=(data)=>create(STUDENTS,data);

export const getStudents=()=>read(STUDENTS);

export const getStudent=(id)=>readOne(STUDENTS,id);

export const updateStudent=(id,data)=>update(STUDENTS,id,data);

export const deleteStudent=(id)=>remove(STUDENTS,id);

/*==================================================*
                ATTENDANCE
*==================================================*/

export const addAttendance=(data)=>create(ATTENDANCE,data);

export const getAttendance=()=>read(ATTENDANCE);

export const updateAttendance=(id,data)=>update(ATTENDANCE,id,data);

export const deleteAttendance=(id)=>remove(ATTENDANCE,id);

/*==================================================*
                NOTES
*==================================================*/

export const addNote=(data)=>create(NOTES,data);

export const getNotes=()=>read(NOTES);

export const updateNote=(id,data)=>update(NOTES,id,data);

export const deleteNote=(id)=>remove(NOTES,id);

/*==================================================*
                TESTS
*==================================================*/

export const addTest=(data)=>create(TESTS,data);

export const getTests=()=>read(TESTS);

export const updateTest=(id,data)=>update(TESTS,id,data);

export const deleteTest=(id)=>remove(TESTS,id);

/*==================================================*
                RESULTS
*==================================================*/

export const addResult=(data)=>create(RESULTS,data);

export const getResults=()=>read(RESULTS);

export const updateResult=(id,data)=>update(RESULTS,id,data);

export const deleteResult=(id)=>remove(RESULTS,id);

/*==================================================*
                PARENTS
*==================================================*/

export const addParent=(data)=>create(PARENTS,data);

export const getParents=()=>read(PARENTS);

export const updateParent=(id,data)=>update(PARENTS,id,data);

export const deleteParent=(id)=>remove(PARENTS,id);

/*==================================================*
                SETTINGS
*==================================================*/

export {

    saveSettings

};

console.log("Firestore Module Loaded Successfully 🚀");