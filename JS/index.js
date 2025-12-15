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


function onLoad(){
    if(loaded) return;
    menuButton = document.querySelector('#menu-button');
    navBar = document.querySelector('.nav-bar');
    menuButton.addEventListener('click', toggleMenu);
    injectHTML("./htmlmodules/head.html",
        document.querySelector("head")
    );
    injectHTML("./htmlmodules/footer.html",
        document.querySelector("footer")
    ).then(() =>
        loadScript("./AutoClicker/game.js")
    );

    loaded = true;
}
let menuButton;
let navBar;
let menuOpen = false;

window.onresize = removeMenuStyle;
function toggleMenu() {
    if(menuOpen){
        navBar.style.right = "-240px";
        menuOpen = false;
    } else {
        navBar.style.right = "0";
        menuOpen = true;
    }
}

function removeMenuStyle(){
    if(window.innerWidth < 800) return;
    navBar.style = "";
    menuOpen = false;
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

// Then use it after footer is loaded



