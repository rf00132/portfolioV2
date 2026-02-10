// Inject cookie banner first so it can initialize before other UI
injectHTML("./htmlmodules/cookie.html",
    document.querySelector("#cookie-popup")
).then(() => {
    try { setupCookieConsent(); } catch (_) { /* no-op */ }
});

// Inject navigation
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
        // Hide spacer when menu is closed
        togglePageSpacer(false);
        menuOpen = false;
    } else {
        menuButton.innerText = "Close";
        navBar.setAttribute('style', 'display: flex;');
        // Show spacer when menu is open
        togglePageSpacer(true);
        menuOpen = true;
    }
}

// Ensures a blank spacer div exists that can fill remaining page space
let pageSpacer;
function ensurePageSpacer() {
    if (!pageSpacer) {
        pageSpacer = document.getElementById('page-spacer');
    }

    if (pageSpacer && !pageSpacer.dataset.bound) {
        pageSpacer.addEventListener('click', () => {
            // Clicking the spacer closes the menu
            if (menuOpen) toggleMenu();
        });
        pageSpacer.dataset.bound = 'true';
    }
    return pageSpacer;
}

function togglePageSpacer(show) {
    const el = ensurePageSpacer();
    if (!el) return;
    el.style.display = show ? 'block' : 'none';
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
        // Ensure the page spacer exists early
        ensurePageSpacer();

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
    // Ensure spacer is hidden on wide viewports
    document.querySelector("#page-spacer").style.display = 'none';
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

// ---- Cookie consent ----
function setupCookieConsent() {
    const KEY = 'cookieConsent';
    const container = document.querySelector('#cookie-popup');
    if (!container) return;

    const existingChoice = localStorage.getItem(KEY);
    if (existingChoice === 'accepted' || existingChoice === 'rejected') {
        container.innerHTML = '';
        return;
    }

    const banner = container.querySelector('.cookie-banner');
    if (!banner) return;

    const acceptBtn = banner.querySelector('#cookie-accept');
    const rejectBtn = banner.querySelector('#cookie-reject');

    const hide = () => {
        // Simple hide; could add animation classes here if desired
        container.innerHTML = '';
    };

    if (acceptBtn) acceptBtn.addEventListener('click', () => {
        localStorage.setItem(KEY, 'accepted');
        hide();
    });
    if (rejectBtn) rejectBtn.addEventListener('click', () => {
        localStorage.setItem(KEY, 'rejected');
        hide();
    });
}
// ---- End cookie consent ----




