const upgradeRatio = 0.1;
const shopRatio = 0.1;

let points = 0;
let pointsPerSecond = 0.1;
let pointsPerClick = 1;
let pointsMultiplier = 1;
let pointsPerButtonClick = 10;
let pointsScroll = 0;
let pointMove = 0;

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
            const savedPoints = parseInt(getPoints());
            if (savedPoints !== null && savedPoints > 0) {
                addPoints(savedPoints);
            } else {
                points = 0;
                savePoints();
            }
        } catch (error) {
            console.error("Error loading points:", error);
        }

        try {
            const savedPointsPerSecond = parseInt(getPointsPerSecond());
            if (savedPointsPerSecond !== null && savedPointsPerSecond > 0) {
                incrementPointsPerSecond(savedPointsPerSecond);
            } else {
                incrementPointsPerSecond(0);
            }
        } catch (error) {
            console.error("Error loading points per second:", error);
        }

        try {
            const savedPointsPerClick = parseInt(getPointsPerClick());
            if (savedPointsPerClick !== null && savedPointsPerClick > 0) {
                incrementPointsPerClick(savedPointsPerClick);
            } else {
                incrementPointsPerSecond(0);
            }
        } catch (error) {
            console.error("Error loading points per click:", error);
        }

        try{
            const savedPointsMultiplier = parseInt(getPointsMultiplier());
            if(savedPointsMultiplier !== null && savedPointsMultiplier > 0){
                incrementPointsMultiplier(savedPointsMultiplier);
            } else {
                incrementPointsMultiplier(0);
            }
        } catch (error) {
            console.error("Error loading points multiplier:", error);
        }

        try {
            const savedPointsPerButtonClick = parseInt(getPointsPerButtonClick());
            if (savedPointsPerButtonClick !== null && savedPointsPerButtonClick > 0) {
                incrementPointsPerButtonClick(savedPointsPerButtonClick);
            } else {
                incrementPointsPerButtonClick(0);
            }
        } catch (error) {
            console.error("Error loading points per button click:", error);
        }

        try{
            const savedPointsMovement = parseInt(getPointsMovement());
            if(savedPointsMovement !== null && savedPointsMovement > 0){
                incrementPointsMovement(savedPointsMovement);
            } else {
                incrementPointsMovement(0);
            }
        } catch (error) {
            console.error("Error loading points movement:", error);
        }

        try{
            const savedPointsScroll = parseInt(getPointsScroll());
            if(savedPointsScroll !== null && savedPointsScroll > 0){
                incrementPointsScroll(savedPointsScroll);
            } else {
                incrementPointsScroll(0);
            }
        } catch (error) {
            console.error("Error loading points scroll:", error);
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

function getPointsPerButtonClick() {
    return getCookie("pointsPerButtonClick");
}

function setPointsPerButtonClick() {
    setCookie("pointsPerButtonClick", pointsPerButtonClick);
}

function getPointsMovement() {
    return getCookie("pointsMovement");
}

function setPointsMovement(){
    setCookie("pointsMovement", pointMove);
}

function setPointsScroll(){
    setCookie("pointsScroll", pointsScroll);
}

function getPointsScroll(){
    return getCookie("pointsScroll");
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

function incrementPointsPerButtonClick(amount){
    pointsPerButtonClick += amount;
    setPointsPerButtonClick();
}

function incrementPointsMovement(amount){
    pointMove += amount;
    setPointsMovement();
}

function incrementPointsScroll(amount){
    pointsScroll += amount;
    setPointsScroll();
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

function onButtonClick(){
    addPoints(pointsPerButtonClick);
}

function upgradePointsPerSecond(){
    const cost = shopCosts.pointsPerSecond;
    if(pointsPerSecond < cost) return;
    addPoints(-cost);
    let upgradeAmount = pointsPerSecond * upgradeRatio;
    upgradeAmount = upgradeAmount > 10 ? upgradeAmount : 10;
    incrementPointsPerSecond(upgradeAmount);
    shopCosts.pointsPerSecond *= 1 + shopRatio;
    updateCost(document.querySelector("#points-per-second"), shopCosts.pointsPerSecond);
    updateAmount(document.querySelector("#points-per-second"), upgradeAmount);
}

function upgradePointsPerClick(){
    const cost = shopCosts.pointsPerClick;
    if(pointsPerClick < cost) return;
    addPoints(-cost);
    let upgradeAmount = pointsPerButtonClick * upgradeRatio;
    upgradeAmount = upgradeAmount > 10 ? upgradeAmount : 10;
    incrementPointsPerButtonClick(upgradeAmount);
    shopCosts.pointsPerClick *= 1 + shopRatio;
    updateCost(document.querySelector("#points-per-click"), shopCosts.pointsPerClick);
    updateAmount(document.querySelector("#points-per-click"), upgradeAmount);
}

function upgradePointsMultiplier(){
    const cost = shopCosts.pointsMultiplier;
    if(pointsMultiplier < cost) return;
    addPoints(-cost);
    let upgradeAmount = pointsMultiplier * upgradeRatio;
    upgradeAmount = upgradeAmount > 10 ? upgradeAmount : 10;
    incrementPointsMultiplier(upgradeAmount);
    shopCosts.pointsMultiplier *= 1 + shopRatio;
    updateAmount(document.querySelector("#points-multiplier"), upgradeAmount);
    updateCost(document.querySelector("#points-multiplier"), shopCosts.pointsMultiplier);
}

function upgradePointsScroll(){
    const cost = shopCosts.pointsScroll;
    if(pointsScroll < cost) return;
    addPoints(-cost);
    let upgradeAmount = pointsScroll * upgradeRatio;
    upgradeAmount = upgradeAmount > 2 ? upgradeAmount : 2;
    incrementPointsScroll(upgradeAmount);
    shopCosts.pointsScroll *= 1 + shopRatio;
    updateCost(document.querySelector("#points-scroll"), shopCosts.pointsScroll);
    updateAmount(document.querySelector("#points-scroll"), upgradeAmount);
}

function upgradePointsMovement(){
    const cost = shopCosts.pointsMovement;
    if(pointMove < cost) return;
    addPoints(-cost);
    let upgradeAmount = pointMove * upgradeRatio;
    upgradeAmount = upgradeAmount > 10 ? upgradeAmount : 10;
    incrementPointsMovement(upgradeAmount);
    shopCosts.pointsMovement *= 1 + shopRatio;
    updateCost(document.querySelector("#points-movement"), shopCosts.pointsMovement);
    updateAmount(document.querySelector("#points-movement"), upgradeAmount);
}

function upgradePointsButtonClick(){
    const cost = shopCosts.pointsButtonClick;
    if(points < cost) return;
    addPoints(-cost);
    let upgradeAmount = pointsPerButtonClick * upgradeRatio;
    upgradeAmount = upgradeAmount > 10 ? upgradeAmount : 10;
    incrementPointsPerButtonClick(upgradeAmount);
    shopCosts.pointsButtonClick *= 1 + shopRatio;
    updateCost(document.querySelector("#points-per-button-click"), shopCosts.pointsButtonClick);
    updateAmount(document.querySelector("#points-per-button-click"), upgradeAmount);
}

function unlockGames(){
    unlocks.games = true;
    gamesPage = true;
    document.querySelector("#games-page-unlock").disabled = true;
    updateCost(document.querySelector("#games-page-unlock"), "Sold Out");
}

function updateCost(element, cost){
    element.querySelector(".cost").innerHTML = cost;
}


function updateAmount(element, amount){
    element.querySelector(".upgrade-amount").innerHTML = amount;
}

document.querySelector("#points-per-second").addEventListener("click", upgradePointsPerSecond);
document.querySelector("#points-per-click").addEventListener("click", upgradePointsPerClick);
document.querySelector("#points-multiplier").addEventListener("click", upgradePointsMultiplier);
document.querySelector("#points-scroll").addEventListener("click", upgradePointsScroll);
document.querySelector("#points-movement").addEventListener("click", upgradePointsMovement);
document.querySelector("#points-button-click").addEventListener("click", upgradePointsButtonClick);
document.querySelector("#games-page-unlock").addEventListener("click", unlockGames);

const shopCosts = {
    pointsPerSecond: 40,
    pointsPerClick: 10,
    pointsMultiplier: 40,
    pointsScroll: 40,
    pointsMovement: 40,
    pointsButtonClick: 40
};

//todo: set up shop onclick upgrade functions
//todo: work on shop ui
//todo: fix game button at wide page widths
//todo: sticky nav bar
//todo: sticky game and menu buttons (along with menu bar)
//todo: disable
