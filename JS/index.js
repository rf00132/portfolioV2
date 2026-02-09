//todo: add in blank empty div that takes up the rest of the space of the page
// it can be given toggle menu as an event listener and that function can hide and show the blank div
//todo: seems like it is defaulting to dark mode everywhere, need to change


injectHTML("./htmlmodules/nav.html",
    document.querySelector("nav")
).then(() => console.log("Content loaded"));


// ---- Theme helpers ----
(function initTheme() {
    const dispatchThemeChange = () => {
        const detail = { theme: document.documentElement.dataset.theme };
        try {
            window.dispatchEvent(new CustomEvent('themechange', { detail }));
        } catch (_) {
            // Older browsers: fallback to plain Event
            const evt = document.createEvent && document.createEvent('Event');
            if (evt && evt.initEvent) {
                evt.initEvent('themechange', true, true);
                window.dispatchEvent(evt);
            }
        }
    };

    const applySystemTheme = () => {
        document.documentElement.dataset.theme =
            window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        dispatchThemeChange();
    };

    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') {
        document.documentElement.dataset.theme = saved;
        dispatchThemeChange();
    } else {
        applySystemTheme();
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (localStorage.getItem('theme') && localStorage.getItem('theme') !== 'system') return;

            applySystemTheme();
        });
    }

    window.setTheme = (theme) => {
        if (theme === 'light' || theme === 'dark') {
            localStorage.setItem('theme', theme);
            document.documentElement.dataset.theme = theme;
            dispatchThemeChange();
        } else {
            localStorage.setItem('theme', 'system');
            applySystemTheme();
        }
    };

    window.getTheme = () => localStorage.getItem('theme') || 'system';
})();

// ---- End theme helpers ----

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
        navBar.setAttribute('style', 'display: flex;');
        menuOpen = true;
    }
}

function onLoad(){
    if(loaded) return;
    injectHTML("./htmlmodules/game.html",
        document.querySelector("nav")
    ).then(() =>
        injectHTML("./htmlmodules/head.html",
            document.querySelector("head")
        )
    )
    .then(() => {
        menuButton = document.querySelector('#menu-button');
        navBar = document.querySelector('.nav-bar');
        menuButton.addEventListener('click', toggleMenu);

        // Theme toggle setup
        themeToggle = document.querySelector('#theme-toggle');
        if (!themeToggle) return;

        const updateThemeToggleLabel = () => {
            const nextLabel = document.documentElement.dataset.theme === 'dark' ? 'Light Mode' : 'Dark Mode';
            themeToggle.innerText = nextLabel;
            themeToggle.setAttribute('data-text', nextLabel);
        };
        // Keep the label in sync on load, on click, and whenever the system/browser theme changes
        updateThemeToggleLabel();
        window.addEventListener('themechange', updateThemeToggleLabel);
        themeToggle.addEventListener('click', () => {
            const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
            if (window.setTheme) {
                window.setTheme(next);
            } else {
                document.documentElement.dataset.theme = next;
            }
            updateThemeToggleLabel();
        });
    }).then(() => loadScript("./JS/idleGame.js"));
    loaded = true;
}
let menuButton;
let navBar;
let themeToggle;
let menuOpen = false;

window.onresize = removeMenuStyle;


function removeMenuStyle(){
    if(window.innerWidth < 1000) return;
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




