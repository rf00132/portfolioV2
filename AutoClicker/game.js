let points = 0;
let pointsPerSecond = 0;
let pointsPerClick = 0;
let pointsMultiplier = 1;

let gamesPage = false;

let cookies = true;
//Todo: make cookie pop up and cookies optional

let pointsDisplay;
let pointsPerSecondDisplay;
let pointsPerClickDisplay;

// Function to save a value to a cookie
function setCookie(name, value, days) {
    if(!cookies) return;
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Function to get a value from a cookie
function getCookie(name) {
    if(!cookies) return;
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Function to delete a cookie
function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999; path=/';
}

if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", gameOnLoad);
} else {
    gameOnLoad();
}

function gameOnLoad(){
    try {
        pointsDisplay = document.querySelector("#points-display");
        pointsPerSecondDisplay = document.querySelector("#pointsPerSecond");
        pointsPerClickDisplay = document.querySelector("#pointsPerClick");
        try {
            const savedPoints = getPoints();
            if (savedPoints !== null && savedPoints > 0) {
                addPoints(parseInt(savedPoints));
            } else {
                points = 0;
                savePoints();
            }
        } catch (error) {
            console.error("Error loading points:", error);
        }

        try {
            const savedPointsPerSecond = getPointsPerSecond();
            if (savedPointsPerSecond !== null && parseInt(savedPointsPerSecond) > 0) {
                incrementPointsPerSecond(parseInt(savedPointsPerSecond));
            } else {
                incrementPointsPerSecond(0);
            }
        } catch (error) {
            console.error("Error loading points per second:", error);
        }

        try {
            const savedPointsPerClick = getPointsPerClick();
            if (savedPointsPerClick !== null && parseInt(savedPointsPerClick) > 0) {
                incrementPointsPerClick(parseInt(savedPointsPerClick));
            } else {
                incrementPointsPerSecond(1);
            }
        } catch (error) {
            console.error("Error loading points per click:", error);
        }

        document.addEventListener("click", () => {
            try {
                addPoints(pointsPerClick);
            } catch (error) {
                console.error("Error adding points:", error);
            }
        });

        setInterval(addIdlePoints, 1000);
    } catch (error) {
        console.error("Error in gameOnLoad:", error);
    }
}

function addIdlePoints(){
    try {
        if(pointsPerSecond === 0) return;
        addPoints(pointsPerSecond);
    } catch (error) {
        console.error("Error in addIdlePoints:", error);
    }
}




function savePoints() {
    setCookie('points', points, 30); // Save for 30 days
}

function getPoints() {
    return getCookie('points');
}

function savePointsPerSecond() {
    setCookie("pointsPerSecond", pointsPerSecond);
}

function getPointsPerSecond() {
    return getCookie("pointsPerSecond");
}

function savePointsPerClick() {
    setCookie("pointsPerClick", pointsPerClick);
}

function getPointsPerClick() {
    return getCookie("pointsPerClick");
}

function savePointsMultiplier() {
    setCookie("pointsMultiplier", pointsMultiplier);
}

function getPointsMultiplier() {
    return getCookie("pointsMultiplier");
}

function incrementPointsMultiplier(amount){
    pointsMultiplier += amount;
    savePointsMultiplier();
    incrementPointsPerClick(0);
    incrementPointsPerSecond(0);
}

function addPoints(amount) {
    try {
        points += amount;
        console.log();
        if (pointsDisplay) {
            pointsDisplay.innerHTML = points;
            pointsDisplay.parentElement.setAttribute("data-text", points);
        } else {
            console.error("pointsDisplay is null or undefined");
        }
        if(amount !== 0) savePoints();
    } catch (error) {
        console.error("Error in addPoints:", error);
    }
}


function incrementPointsPerSecond(amount){
    try {
        pointsPerSecond += amount;
        if (pointsPerSecondDisplay) {
            pointsPerSecondDisplay.innerHTML = pointsPerSecond*pointsMultiplier + "/s";
        } else {
            console.error("pointsPerSecondDisplay is null or undefined");
        }
        if(amount !== 0) savePointsPerSecond();
    } catch (error) {
        console.error("Error in incrementPointsPerSecond:", error);
    }
}

function incrementPointsPerClick(amount){
    try {
        pointsPerClick += amount;
        if (pointsPerClickDisplay) {
            pointsPerClickDisplay.innerHTML = pointsPerClick*pointsMultiplier + "/c";
        } else {
            console.error("pointsPerClickDisplay is null or undefined");
        }
        if(amount !== 0) savePointsPerClick();
    } catch (error) {
        console.error("Error in incrementPointsPerClick:", error);
    }
}

document.querySelector("#game-button").addEventListener("click", () => {
    const settings = document.querySelector(".game-settings-box");
    if(settings.style.display !== "block") {
        settings.style.display = "block";
    }
    else {
        settings.style.display = "none";
    }
})

const unlocks = {
    games: "false",
    rhythm: "false"
};

//todo: set up shop onclick functions
//todo: work on shop ui
//todo: fix game button at wide page widths
//todo: sticky nav bar
//todo: sticky game and menu buttons (along with menu bar)
