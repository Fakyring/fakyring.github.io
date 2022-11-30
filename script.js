window.onload = function () {
    let container = document.querySelector(".container");
    let nav = document.getElementById("navigation");
    let arrow = document.getElementById("arrowUp");
    let burger_check = document.getElementById("menu");
    let mediaQuery = window.matchMedia('(min-width: 660px)');
    let items = document.querySelectorAll(".container a");
    let body = document.body;
    items = Array.from(items);
    //Set "changeInformationStatus" function to click event on images
    for (let i = 0; i < items.length; i++) {
        items[i].onclick = changeInformationStatus;
    }
    //Adding header and footer
    addElement("header");
    addElement("footer");

    function addElement(tag) {
        let xhr = new XMLHttpRequest();
        xhr.onload = function () {
            loadElement(xhr, tag);
        };
        xhr.open('GET', `/defaults/${tag}.html`);
        xhr.send(null);
    }

    function loadElement(xhr, tag) {
        document.getElementsByTagName(tag)[0].innerHTML = xhr.responseText;
        if (tag === "header") {
            nav = document.getElementById("navigation");
            burger_check = document.getElementById("menu");
            arrow = document.getElementById("arrowUp");
            //Shows arrow to the top of the page
            document.addEventListener('scroll', function () {
                isInViewport(nav) ? arrow.style.display = "none" : arrow.style.display = "block";
            });
            document.getElementById("site-name").innerHTML = document.title;
        }
    }

    //Hide burger menu if changed window size
    onresize = function () {
        if (mediaQuery.matches)
            burger_check.checked = false;
        if (body.offsetHeight >= window.innerHeight) {
            body.style.overflowY = "scroll";
        } else {
            body.style.overflowY = "hidden";
        }
    }

    //Hide burger menu and images info if clicked out of them
    onclick = function (e) {
        if (burger_check.checked === true)
            if (!e.target.classList.contains("bg_item")) {
                burger_check.checked = false;
            }
        if (!items.includes(e.target) && !items.includes(e.target.parentNode)) {
            for (let i = 0; i < items.length; i++) {
                items[i].classList.remove("hovered");
            }
        }
    }

    container.addEventListener("wheel", (e) => {
        if (!e.deltaY) {
            return;
        }
        container.scrollLeft += e.deltaY * 1.5;
    });
}

//Checks if main menu is in viewport
function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0
    );
}

function changeInformationStatus() {
    if (this.classList.contains("hovered"))
        this.classList.remove("hovered");
    else
        this.classList.add("hovered");
}

let map = {};
onkeydown = function (e) {
    if (e.key === "F") {
        let login = prompt("Логин");
        if (login === "admin")
            document.getElementsByClassName("hidden")[0].classList.remove("hidden");
    }
}