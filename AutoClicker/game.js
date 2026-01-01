//todo: rebalance shop upgrade ratio formula
//todo: absolute position settings menu is not scrollable, look into reorganising the html and css so it is

const upgradeRatio = 0.1;
const shopRatio = 0.3;
let scrolled = false;
let moved = false;

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

document.querySelectorAll(".button").forEach(
    e => e.addEventListener("click", onButtonClick)
);

window.addEventListener("scroll", () => scrolled = true);

if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", gameOnLoad);
} else {
    gameOnLoad();
}

function gameOnLoad(){
    try {
        pointsDisplay = document.querySelectorAll(".points-display");
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
                addPoints(pointsPerClick * pointsMultiplier);
            } catch (error) {
                console.error("Error adding points:", error);
            }
        });

        document.addEventListener("mousemove", () => moved = true);

        setInterval(addIdlePoints, 1000);
        setInterval(addScrollPoints, 1000);
        setInterval(addMovementPoints, 1000);
    } catch (error) {
        console.error("Error in gameOnLoad:", error);
    }
}

function addIdlePoints(){
    try {
        if(pointsPerSecond === 0) return;
        addPoints(pointsPerSecond * pointsMultiplier);
    } catch (error) {
        console.error("Error in addIdlePoints:", error);
    }
}

function addScrollPoints(){
    if(pointsScroll === 0 || !scrolled) return;
    addPoints(pointsScroll * pointsMultiplier);
    scrolled = false;
}

function addMovementPoints(){
    if(pointMove === 0 || ! moved) return;
    addPoints(pointMove * pointsMultiplier);
    moved = false;
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
    pointsMultiplier +=  roundToDecimalPlaces(amount);
    savePointsMultiplier();
    incrementPointsPerClick(0);
    incrementPointsPerSecond(0);
}

function addPoints(amount) {
    try {
        points +=  amount;
        points = roundToDecimalPlaces(points);
        UpdateDisplay();
        if(amount !== 0) savePoints();
    } catch (error) {
        console.error("Error in addPoints:", error);
    }
}

//todo: simplify this and make it multipurpose
function UpdateDisplay() {
    let displayText;
    if(points < Math.pow(10, 3)) displayText = points.toFixed(2);
    else if (points < Math.pow(10, 7)) displayText = reduceAmountForDisplay(points, 3) + "k";
    else if (points < Math.pow(10, 10)) displayText = reduceAmountForDisplay(points, 6) + "m";
    else if (points < Math.pow(10, 13)) displayText = reduceAmountForDisplay(points, 9) + "b";
    else if (points < Math.pow(10, 16)) displayText = reduceAmountForDisplay(points, 12) + "t";
    else if (points < Math.pow(10, 19)) displayText = reduceAmountForDisplay(points, 15) + "q";
    else if (points < Math.pow(10, 22)) displayText = reduceAmountForDisplay(points, 18) + "Q";
    else if (points < Math.pow(10, 25)) displayText = reduceAmountForDisplay(points, 21) + "s";
    else if (points < Math.pow(10, 28)) displayText = reduceAmountForDisplay(points, 24) + "S";
    else if (points < Math.pow(10, 31)) displayText = reduceAmountForDisplay(points, 27) + "o";
    else if (points < Math.pow(10, 34)) displayText = reduceAmountForDisplay(points, 30) + "n";
    else if (points < Math.pow(10, 37)) displayText = reduceAmountForDisplay(points, 33) + "d";
    else displayText = "Lots";
    if (pointsDisplay) {
        pointsDisplay.forEach(
            e => {
                e.innerHTML = displayText;
                e.parentElement.setAttribute("data-text", displayText);
            }
        );
    } else {
        console.error("pointsDisplay is null or undefined");
    }
}

function incrementPointsPerSecond(amount){
    try {
        pointsPerSecond +=  roundToDecimalPlaces(amount);
        if (pointsPerSecondDisplay) {
            pointsPerSecondDisplay.innerHTML = (pointsPerSecond*pointsMultiplier).toFixed(1) + "/s";
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
        pointsPerClick +=  roundToDecimalPlaces(amount);
        if (pointsPerClickDisplay) {
            pointsPerClickDisplay.innerHTML = (pointsPerClick*pointsMultiplier).toFixed(0) + "/c";
        } else {
            console.error("pointsPerClickDisplay is null or undefined");
        }
        if(amount !== 0) savePointsPerClick();
    } catch (error) {
        console.error("Error in incrementPointsPerClick:", error);
    }
}

function incrementPointsPerButtonClick(amount){
    pointsPerButtonClick += roundToDecimalPlaces(amount);
    setPointsPerButtonClick();
}

function incrementPointsMovement(amount){
    pointMove +=  roundToDecimalPlaces(amount);
    setPointsMovement();
}

function incrementPointsScroll(amount){
    pointsScroll +=  roundToDecimalPlaces(amount);
    setPointsScroll();
}

document.querySelector("#game-button").addEventListener("click", displayStore);
document.querySelector("#game-bar-button").addEventListener("click", displayStore);

function displayStore(){
    const settings = document.querySelector(".game-settings-box");
    if(settings.style.display !== "block") {
        settings.style.display = "block";
    }
    else {
        settings.style.display = "none";
    }
}

const unlocks = {
    games: "false",
    rhythm: "false"
};

function onButtonClick(){
    addPoints(pointsPerButtonClick * pointsMultiplier);
}

function upgradePointsPerSecond(){
    const cost = shopCosts.pointsPerSecond;
    console.log("upgrding points per second")
    if(points < cost) return;
    addPoints(-cost);
    let upgradeAmount = pointsPerSecond * upgradeRatio;
    upgradeAmount = upgradeAmount > 0.1 ? upgradeAmount : 0.1;
    incrementPointsPerSecond(upgradeAmount);
    shopCosts.pointsPerSecond *= 1 + shopRatio;
    updateCost(document.querySelector("#points-per-second"), shopCosts.pointsPerSecond);
    updateAmount(document.querySelector("#points-per-second"), upgradeAmount);
}

function upgradePointsPerClick(){
    const cost = shopCosts.pointsPerClick;
    if(points < cost) return;
    addPoints(-cost);
    let upgradeAmount = pointsPerButtonClick * upgradeRatio;
    upgradeAmount = upgradeAmount > 1 ? upgradeAmount : 1;
    incrementPointsPerButtonClick(upgradeAmount);
    shopCosts.pointsPerClick *= 1 + shopRatio;
    updateCost(document.querySelector("#points-per-click"), shopCosts.pointsPerClick);
    updateAmount(document.querySelector("#points-per-click"), upgradeAmount);
}

function upgradePointsMultiplier(){
    const cost = shopCosts.pointsMultiplier;
    console.log(cost);
    if(points < cost) return;

    addPoints(-cost);
    let upgradeAmount = pointsMultiplier * upgradeRatio;
    upgradeAmount = upgradeAmount > 0.1 ? upgradeAmount : 0.1;
    incrementPointsMultiplier(upgradeAmount);
    shopCosts.pointsMultiplier *= 1 + shopRatio;
    updateAmount(document.querySelector("#points-multiplier"), upgradeAmount);
    updateCost(document.querySelector("#points-multiplier"), shopCosts.pointsMultiplier);
}

function upgradePointsScroll(){
    const cost = shopCosts.pointsScroll;
    if(points < cost) return;
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
    console.log("upgrading points movement")
    if(points < cost) return;
    addPoints(-cost);
    let upgradeAmount = pointMove * upgradeRatio;
    upgradeAmount = upgradeAmount > 1 ? upgradeAmount : 1;
    incrementPointsMovement(upgradeAmount);
    shopCosts.pointsMovement *= 1 + shopRatio;
    console.log("updating points movement figures")
    updateCost(document.querySelector("#points-movement"), shopCosts.pointsMovement);
    updateAmount(document.querySelector("#points-movement"), upgradeAmount);
}

//todo: this logic might need changing, amount
function upgradePointsButtonClick(){
    const cost = shopCosts.pointsButtonClick;
    if(points < cost) return;
    addPoints(-cost);
    let upgradeAmount = pointsPerButtonClick * upgradeRatio;
    upgradeAmount = upgradeAmount > 10 ? upgradeAmount : 10;
    incrementPointsPerButtonClick(upgradeAmount);
    //todo: this below line may need to be added to other functions
    upgradeAmount = upgradeAmount > 10 ? upgradeAmount : 10;
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
    element.querySelector(".cost").innerHTML = cost.toFixed(2);
}


function updateAmount(element, amount){
    console.log(element +", " + amount);
    element.querySelector(".upgrade-amount").innerHTML = amount.toFixed(2);
}

function roundToDecimalPlaces(numToRound, decimalPlaces = 2){
    return Math.round(numToRound * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
}

function reduceAmountForDisplay(amountToReduce, reduction){
    return roundToDecimalPlaces(points, -1 * reduction)/Math.pow(10, reduction)
}

const perSecondUpgrade = document.querySelector("#points-per-second");
const perClickUpgrade = document.querySelector("#points-per-click");
const multiplierUpgrade = document.querySelector("#points-multiplier");
const scrollUpgrade = document.querySelector("#points-scroll");
const movementUpgrade = document.querySelector("#points-movement");
const perButtonClick = document.querySelector("#points-per-button-click");
const gamesUnlock = document.querySelector("#games-page-unlock");


perSecondUpgrade.addEventListener("click", upgradePointsPerSecond);
perClickUpgrade.addEventListener("click", upgradePointsPerClick);
multiplierUpgrade.addEventListener("click", upgradePointsMultiplier);
scrollUpgrade.addEventListener("click", upgradePointsScroll);
movementUpgrade.addEventListener("click", upgradePointsMovement);
perButtonClick.addEventListener("click", upgradePointsButtonClick);
gamesUnlock.addEventListener("click", unlockGames);


//todo: refactor this into a function instead of repeating
function setUpShop(){
    updateCost(perSecondUpgrade, shopCosts.pointsPerSecond);
    updateAmount(perSecondUpgrade, pointsPerSecond * upgradeRatio > 0.1 ? pointsPerSecond * upgradeRatio : 0.1);

    updateCost(perClickUpgrade, shopCosts.pointsPerClick);
    updateAmount(perClickUpgrade, pointsPerClick * upgradeRatio > 1 ? pointsPerClick * upgradeRatio : 1);

    updateCost(perButtonClick, shopCosts.pointsButtonClick);
    updateAmount(perButtonClick, pointsPerButtonClick * upgradeRatio > 10 ? pointsPerButtonClick * upgradeRatio : 10);

    updateCost(movementUpgrade, shopCosts.pointsMovement);
    updateAmount(movementUpgrade, pointMove * upgradeRatio > 1 ? pointMove * upgradeRatio : 1);

    updateCost(scrollUpgrade, shopCosts.pointsScroll);
    updateAmount(scrollUpgrade, pointsScroll * upgradeRatio > 2 ? pointsScroll * upgradeRatio : 2);

    updateCost(multiplierUpgrade, shopCosts.pointsMultiplier);
    updateAmount(multiplierUpgrade, pointsMultiplier * upgradeRatio > 0.1 ? pointsMultiplier * upgradeRatio : 0.1);
}

const shopCosts = {
    pointsPerSecond: 40,
    pointsPerClick: 10,
    pointsMultiplier: 40,
    pointsScroll: 40,
    pointsMovement: 40,
    pointsButtonClick: 40
};

//todo: add in saving and loading for shop costs
//todo: revamp save cookie to single cookie
//todo: work on shop ui
//todo: disable option


setUpShop();