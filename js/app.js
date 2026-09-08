/*==================================================
            VVCMS APP.JS
            Vidya Vision Classes
==================================================*/

// ==========================================
// SELECT ELEMENTS
// ==========================================

const navbar = document.querySelector("header");
const menuBtn = document.querySelector(".mobile-menu");
const navLinks = document.querySelector(".nav-links");
const topBtn = document.getElementById("topBtn");

// ==========================================
// MOBILE MENU
// ==========================================

if (menuBtn) {

    menuBtn.addEventListener("click", () => {

        navLinks.classList.toggle("showMenu");

    });

}

// ==========================================
// STICKY HEADER EFFECT
// ==========================================

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {

        navbar.style.boxShadow =
            "0 12px 30px rgba(0,0,0,.12)";

    }

    else {

        navbar.style.boxShadow =
            "0 2px 15px rgba(0,0,0,.08)";

    }

});

// ==========================================
// BACK TO TOP BUTTON
// ==========================================

if (topBtn) {

    topBtn.style.display = "none";

    window.addEventListener("scroll", () => {

        if (window.scrollY > 400) {

            topBtn.style.display = "block";

        }

        else {

            topBtn.style.display = "none";

        }

    });

    topBtn.onclick = () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    };

}

// ==========================================
// SMOOTH NAVIGATION
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function (e) {

        const target = document.querySelector(

            this.getAttribute("href")

        );

        if (!target) return;

        e.preventDefault();

        target.scrollIntoView({

            behavior: "smooth"

        });

        if (navLinks) {

            navLinks.classList.remove("showMenu");

        }

    });

});

// ==========================================
// ACTIVE MENU
// ==========================================

const sections = document.querySelectorAll("section");

const navItems = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const top = section.offsetTop - 150;

        if (pageYOffset >= top) {

            current = section.getAttribute("id");

        }

    });

    navItems.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {

            link.classList.add("active");

        }

    });

});

// ==========================================
// ANIMATED COUNTERS
// ==========================================

const counters = document.querySelectorAll(

    ".stat-card h2,.achievement-card h1"

);

function animateCounter(counter){

    const text = counter.innerText;

    const number = parseInt(text);

    if(isNaN(number)) return;

    const plus = text.includes("+") ? "+" : "";
    const percent = text.includes("%") ? "%" : "";

    const duration = 2000;

    const start = performance.now();

    function update(currentTime){

        const elapsed = currentTime - start;

        const progress = Math.min(elapsed / duration, 1);

        const value = Math.floor(progress * number);

        counter.innerText = value + percent + plus;

        if(progress < 1){

            requestAnimationFrame(update);

        }

        else{

            counter.innerText = text;

        }

    }

    requestAnimationFrame(update);

}
const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            animateCounter(

                entry.target

            );

            observer.unobserve(entry.target);

        }

    });

}, {

    threshold: 0.5

});

counters.forEach(counter => {

    observer.observe(counter);

});

// ==========================================
// SCROLL REVEAL
// ==========================================

const revealItems = document.querySelectorAll(

    ".card,.course-card,.teacher-card,.achievement-card,.contact-card,.topper-card"

);

const revealObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.style.opacity = "1";

            entry.target.style.transform =

                "translateY(0px)";

        }

    });

}, {

    threshold: 0.2

});

revealItems.forEach(item => {

    item.style.opacity = "0";

    item.style.transform =

        "translateY(40px)";

    item.style.transition =

        ".8s ease";

    revealObserver.observe(item);

});

// ==========================================
// CONTACT FORM
// ==========================================

const form = document.querySelector("form");

if (form) {

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        alert(

            "Thank you for contacting Vidya Vision Classes! We will get back to you soon."

        );

        form.reset();

    });

}

// ==========================================
// CURRENT YEAR IN FOOTER
// ==========================================

const year = new Date().getFullYear();

const copyright = document.querySelector(

    ".copyright"

);

if (copyright) {

    copyright.innerHTML =

        `© ${year} Vidya Vision Classes. All Rights Reserved.<br><br>Designed & Developed by <strong>Samraddh</strong>`;

}

console.log(
    "VVCMS Loaded Successfully 🚀"
);