/*==================================================
                VVCMS RESULTS.JS
            Vidya Vision Classes
==================================================*/

// ---- Session Check ----
if (sessionStorage.getItem("vvc_logged_in") !== "true") {
    window.location.href = "login.html";
}

// ---- Loader ----
window.addEventListener("load", () => {

    const loader = document.getElementById("loader");

    if(loader){

        setTimeout(()=>{

            loader.style.opacity="0";

            setTimeout(()=>{

                loader.style.display="none";

            },500);

        },1200);

    }

});

// ---- Elements ----
const resultBody = document.getElementById("resultBody");
const emptyState = document.getElementById("emptyState");

const addResultBtn = document.getElementById("addResultBtn");
const resultModal = document.getElementById("resultModal");
const closeModal = document.getElementById("closeModal");

const resultForm = document.getElementById("resultForm");

const resultStudent = document.getElementById("resultStudent");
const resultTestName = document.getElementById("resultTestName");

const searchResults = document.getElementById("searchResults");
const classFilter = document.getElementById("classFilter");
const resultFilter = document.getElementById("resultFilter");
const sortResults = document.getElementById("sortResults");

const totalResultsEl = document.getElementById("totalResults");
const highestResultEl = document.getElementById("highestResult");
const averageResultEl = document.getElementById("averageResult");
const passRateEl = document.getElementById("passRate");

// ---- Data ----
const students = JSON.parse(localStorage.getItem("vvc_students")) || [];
const tests = JSON.parse(localStorage.getItem("vvc_tests")) || [];

let results = JSON.parse(localStorage.getItem("vvc_results")) || [];

// ---- Save ----
function saveResults(){

    localStorage.setItem("vvc_results",JSON.stringify(results));

}

// ---- Student Dropdown ----
function populateStudents(){

    resultStudent.innerHTML='<option value="">Select Student</option>';

    students.forEach(student=>{

        resultStudent.innerHTML+=`

            <option value="${student.id}">

                ${student.name} (Class ${student.className})

            </option>

        `;

    });

}

// ---- Test Dropdown ----
function populateTests(){

    resultTestName.innerHTML='<option value="">Select Test</option>';

    tests.forEach(test=>{

        resultTestName.innerHTML+=`

            <option value="${test.name}">

                ${test.name}

            </option>

        `;

    });

}

populateStudents();
populateTests();

// ---- Modal ----
addResultBtn.onclick=()=>{

    if(students.length===0){

        alert("Please add students first.");

        return;

    }

    if(tests.length===0){

        alert("Please create a Test first.");

        return;

    }

    resultModal.style.display="flex";

};

closeModal.onclick=()=>{

    resultModal.style.display="none";

};

window.addEventListener("click",(e)=>{

    if(e.target===resultModal){

        resultModal.style.display="none";

    }

});

// ---- Add Result ----
resultForm.addEventListener("submit",(e)=>{

    e.preventDefault();

    const student=students.find(s=>String(s.id)===resultStudent.value);

    if(!student) return;

    const obtained=parseFloat(document.getElementById("marksObtained").value);

    const total=parseFloat(document.getElementById("totalMarks").value);

    if(total<=0 || obtained>total){

        alert("Invalid Marks!");

        return;

    }

    const percentage=Math.round((obtained/total)*100);

    let grade="F";

    if(percentage>=90) grade="A+";
    else if(percentage>=80) grade="A";
    else if(percentage>=70) grade="B+";
    else if(percentage>=60) grade="B";
    else if(percentage>=50) grade="C";
    else if(percentage>=40) grade="D";

    const status=percentage>=40?"PASS":"FAIL";

    const result={

        id:Date.now(),

        studentId:student.id,

        studentName:student.name,

        className:student.className,

        testName:resultTestName.value,

        obtained,

        total,

        percentage,

        grade,

        status

    };

    results.unshift(result);

    saveResults();

    renderResults();

    resultForm.reset();

    resultModal.style.display="none";

});

// ---- RENDER ----
function renderResults(){

    resultBody.innerHTML="";

    let filtered=[...results];

    // ---------- Search ----------
    const keyword=searchResults.value.toLowerCase();

    if(keyword){

        filtered=filtered.filter(r=>

            r.studentName.toLowerCase().includes(keyword) ||
            r.className.toLowerCase().includes(keyword) ||
            r.testName.toLowerCase().includes(keyword)

        );

    }

    // ---------- Class Filter ----------
    if(classFilter.value!=="all"){

        filtered=filtered.filter(r=>r.className===classFilter.value);

    }

    // ---------- PASS / FAIL ----------
    if(resultFilter.value!=="all"){

        filtered=filtered.filter(r=>r.status===resultFilter.value);

    }

    // ---------- Sorting ----------
    switch(sortResults.value){

        case "high":
            filtered.sort((a,b)=>b.percentage-a.percentage);
            break;

        case "low":
            filtered.sort((a,b)=>a.percentage-b.percentage);
            break;

        case "old":
            filtered.sort((a,b)=>a.id-b.id);
            break;

        default:
            filtered.sort((a,b)=>b.id-a.id);

    }

    if(filtered.length===0){

        emptyState.style.display="block";
        document.querySelector(".table-container").style.display="none";

        updateSummary();

        return;

    }

    emptyState.style.display="none";
    document.querySelector(".table-container").style.display="block";

    filtered.forEach(result=>{

        const resultClass=result.status==="PASS" ? "pass" : "fail";

        resultBody.innerHTML+=`

        <tr>

            <td>${result.studentName}</td>

            <td>${result.className}</td>

            <td>${result.testName}</td>

            <td>${result.obtained}</td>

            <td>${result.total}</td>

            <td>${result.percentage}%</td>

            <td>

                <span class="grade">

                    ${result.grade}

                </span>

            </td>

            <td>

                <span class="${resultClass}">

                    ${result.status}

                </span>

            </td>

            <td>

                <button class="delete-btn"

                    onclick="deleteResult(${result.id})">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

    updateSummary();

}

// ---------- Summary ----------

function updateSummary(){

    totalResultsEl.textContent=results.length;

    if(results.length===0){

        highestResultEl.textContent="0%";
        averageResultEl.textContent="0%";
        passRateEl.textContent="0%";

        return;

    }

    const highest=Math.max(...results.map(r=>r.percentage));

    const average=Math.round(

        results.reduce((sum,r)=>sum+r.percentage,0)

        /results.length

    );

    const passed=results.filter(r=>r.status==="PASS").length;

    const passRate=Math.round((passed/results.length)*100);

    highestResultEl.textContent=highest+"%";

    averageResultEl.textContent=average+"%";

    passRateEl.textContent=passRate+"%";

}

// ---------- Delete ----------

function deleteResult(id){

    if(confirm("Delete this result?")){

        results=results.filter(r=>r.id!==id);

        saveResults();

        renderResults();

    }

}

// ---------- Filters ----------

searchResults.addEventListener("keyup",renderResults);

classFilter.addEventListener("change",renderResults);

resultFilter.addEventListener("change",renderResults);

sortResults.addEventListener("change",renderResults);

// ---------- Initial Load ----------

renderResults();

console.log("Results Module Loaded Successfully 🚀");