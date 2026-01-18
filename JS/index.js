//todo: add in blank empty div that takes up the rest of the space of the page
// it can be given toggle menu as an event listener and that function can hide and show the blank div

injectHTML("./htmlmodules/nav.html",
    document.querySelector("nav")
);


let loaded = false;

const glitchText = document.querySelectorAll('.glitch, .layers');

glitchText.forEach(element => {
    element.style.animationDelay = Math.random() * 3 + 's';
    element.setAttribute("data-text", element.innerText);
    element.innerHTML = "<span>" + element.innerHTML + "</span>";
});

function toggleMenu() {
    if(menuOpen){
        menuButton.innerText = "Menu";
        navBar.setAttribute('style', '');
        menuOpen = false;
    } else {
        menuButton.innerText = "Close";
        navBar.setAttribute('style', 'right: 0 !important');
        menuOpen = true;
    }
}

function onLoad(){
    if(loaded) return;
    const resp = injectHTML("./htmlmodules/game.html",
        document.querySelector("nav")
    ).then(() =>
        injectHTML("./htmlmodules/head.html",
            document.querySelector("head")
        )
    )
    /*
    .then(() =>
    injectHTML("./htmlmodules/footer.html",
        document.querySelector("footer")
    )
    )*/
    .then(() => {
        menuButton = document.querySelector('#menu-button');
        navBar = document.querySelector('.nav-bar');
        menuButton.addEventListener('click', toggleMenu);
        return loadScript("./JS/idleGame.js");
    });
    loaded = true;
}
let menuButton;
let navBar;
let menuOpen = false;

window.onresize = removeMenuStyle;


function removeMenuStyle(){
    if(window.innerWidth < 800) return;
    navBar.style = "";
    menuOpen = false;
    menuButton.innerText = "Menu";
}


async function injectHTML(filePath,elem) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            return;
        }
        const text = await response.text();
        elem.innerHTML += text;
        onLoad();
    } catch (err) {
        console.error(err.message);
    }
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Script load error for ${src}`));
        document.head.appendChild(script);
    });
}




