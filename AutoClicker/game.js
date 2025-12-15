let points = 0;
let pointsPerSecond = 0;
let pointsPerClick = 0;

//Todo: make cookie pop up and cookies optional

let pointsDisplay;
let pointsPerSecondDisplay;
let pointsPerClickDisplay;

// Function to save a value to a cookie
function setCookie(name, value, days) {
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
        pointsDisplay = document.querySelector("#game-button");
        pointsPerSecondDisplay = document.querySelector("#pointsPerSecond");
        pointsPerClickDisplay = document.querySelector("#pointsPerClick");
        savePointsPerSecond();
        savePointsPerClick();
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
            if (savedPointsPerSecond !== null && savedPointsPerSecond > 0) {
                incrementPointsPerSecond(parseInt(savedPointsPerSecond));
            } else {
                pointsPerSecond = 0;
                savePointsPerSecond();
            }
        } catch (error) {
            console.error("Error loading points per second:", error);
        }

        try {
            const savedPointsPerClick = getPointsPerClick();
            if (savedPointsPerClick !== null && savedPointsPerClick > 0) {
                incrementPointsPerClick(parseInt(savedPointsPerClick) - 1);
            } else {
                pointsPerClick = 1;
                savePointsPerClick();
            }
        } catch (error) {
            console.error("Error loading points per click:", error);
        }

        incrementPointsPerClick(0);
        incrementPointsPerSecond(0);

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
    setCookie("pointsPerSecond", pointsPerSecond, 30);
}

function getPointsPerSecond() {
    return getCookie("pointsPerSecond");
}

function savePointsPerClick() {
    setCookie("pointsPerClick", pointsPerClick, 30);
}

function getPointsPerClick() {
    return getCookie("pointsPerClick");
}

function addPoints(amount) {
    try {
        points += amount;
        if (pointsDisplay) {
            pointsDisplay.innerHTML = points;
            pointsDisplay.setAttribute("data-text", points);
        } else {
            console.error("pointsDisplay is null or undefined");
        }
        savePoints();
    } catch (error) {
        console.error("Error in addPoints:", error);
    }
}


function incrementPointsPerSecond(amount){
    try {
        pointsPerSecond += amount;
        if (pointsPerSecondDisplay) {
            console.log(pointsPerSecond);
            pointsPerSecondDisplay.innerHTML = pointsPerSecond + "/s";
        } else {
            console.error("pointsPerSecondDisplay is null or undefined");
        }
        savePointsPerSecond();
    } catch (error) {
        console.error("Error in incrementPointsPerSecond:", error);
    }
}

function incrementPointsPerClick(amount){
    try {
        pointsPerClick += amount;
        if (pointsPerClickDisplay) {
            pointsPerClickDisplay.innerHTML = pointsPerClick + "/c";
        } else {
            console.error("pointsPerClickDisplay is null or undefined");
        }
        savePointsPerClick();
    } catch (error) {
        console.error("Error in incrementPointsPerClick:", error);
    }
}