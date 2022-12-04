window.onload = async () => {
    let container = document.querySelector(".container");
    let nav = document.getElementById("navigation");
    let arrow = document.getElementById("arrowUp");
    let secret = document.getElementById("secret");
    let burger_check = document.getElementById("menu");
    let mediaQuery = window.matchMedia('(min-width: 660px)');
    let items = document.querySelectorAll(".container a");
    let body = document.body;
    items = Array.from(items);
    //Set "changeInformationStatus" function to click event on images
    for (let i = 0; i < items.length; i++) {
        items[i].onclick = changeInformationStatus;
    }

    //------------------------------Adding header and footer------------------------------
    addElement("header");
    addElement("footer");
    let counter = 0, secretCounter = 0;

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
        } else {
            secret = document.getElementById("secret");
            secret.onclick = function () {
                secretCounter++;
                if (secretCounter === 5) {
                    document.getElementsByClassName("hidden")[0].classList.remove("hidden");
                }
            }
        }
    }

    //------------------------------Rovers------------------------------
    let rovers = document.getElementsByClassName("rover");
    let information = document.getElementById("info");

    //Getting images from git repos
    let response = await fetch(
        "https://api.github.com/repos/Fakyring/fakyring.github.io/git/trees/master?recursive=1"
    );
    let imagesFiles;
    if (response.ok) {
        let files = await response.json();
        imagesFiles = files.tree.filter(function (e) {
            return e.path.includes("img");
        });
    }

    let images = document.querySelectorAll(".rover_images a img");
    let images_div = document.getElementById("rover_images");
    images_div.onscroll = function () {
        for (let i = 0; i < images.length; i++) {
            let bound = images[i].getBoundingClientRect();
            let parentBound = images_div.getBoundingClientRect();
            bound.left = bound.left - parentBound.left;
            if (bound.left > 0 && bound.left < images_div.offsetWidth) {
                counter = i;
                return;
            }
        }
    }

    //Scrolling images using halves of div
    images_div.onclick = function (e) {
        let center = this.offsetWidth / 2;
        if (e.offsetX < center) {
            counter--;
        } else if (e.offsetX > center) {
            counter++;
        }
        if (counter < 0) {
            counter = images.length - 1;
        } else if (counter >= images.length) {
            counter = 0;
        }
        images[counter].scrollIntoView();
    }

    //Adding images from git repos
    for (let i = 0; i < rovers.length; i++) {
        rovers[i].onclick = function () {
            counter = 0;
            let name = this.id;
            let rover_imgs = imagesFiles.filter(function (e) {
                return e.path.includes("rovers/" + name);
            });
            images_div.innerHTML = "";
            for (let j = 2; j < rover_imgs.length; j++) {
                let roverImg = document.createElement("img");
                let rover = document.createElement("a");
                roverImg.src = rover_imgs[j].path;
                rover.appendChild(roverImg);
                images_div.appendChild(rover);
            }
            let tmpA = document.createElement("a");
            let info = document.createElement("p");
            images_div.appendChild(tmpA);
            readTextFile(rover_imgs[1].path);
            images = document.querySelectorAll(".rover_images a img");
        }
    }
    rovers[0].click();

    function readTextFile(file) {
        let rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, false);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status === 0) {
                    let allText = rawFile.responseText;
                    information.innerHTML = allText;
                }
            }
        }
        rawFile.send(null);
    }

    //------------------------------Burger Menu------------------------------
    //Hide burger menu if changed window size
    onresize = function () {
        if (mediaQuery.matches)
            burger_check.checked = false;
    }

    //Hide burger menu and images info.txt if clicked out of them
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
        e.preventDefault();
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