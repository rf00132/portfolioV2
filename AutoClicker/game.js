//todo: rebalance shop upgrade ratio formula
//todo: absolute position settings menu is not scrollable, look into reorganising the html and css so it is
//todo: cookies currently set to be session only
//todo: make cookie pop up and saving cookies for longer optional

const upgradeRatio = 0.1;
const shopRatio = 0.3;
let scrolled = false;
let moved = false;

let points = 0;
let pointsPerSecond = 0;
let pointsPerClick = 0;
let pointsMultiplier = 0;
let pointsPerButtonClick = 0;
let pointsScroll = 0;
let pointMove = 0;
let shopCosts = {
    pointsPerSecond: 40,
    pointsPerClick: 10,
    pointsMultiplier: 40,
    pointsScroll: 40,
    pointsMovement: 40,
    pointsButtonClick: 40
};

let gamesPage = false;

let cookies = true;

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
                incrementPointsPerSecond(0.1);
            }
        } catch (error) {
            console.error("Error loading points per second:", error);
        }

        try {
            const savedPointsPerClick = parseInt(getPointsPerClick());
            if (savedPointsPerClick !== null && savedPointsPerClick > 0) {
                incrementPointsPerClick(savedPointsPerClick);
            } else {
                incrementPointsPerClick(1);
            }
        } catch (error) {
            console.error("Error loading points per click:", error);
        }

        try{
            const savedPointsMultiplier = parseInt(getPointsMultiplier());
            if(savedPointsMultiplier !== null && savedPointsMultiplier > 0){
                incrementPointsMultiplier(savedPointsMultiplier);
            } else {
                incrementPointsMultiplier(1);
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

        try{
            const savedShopCosts = getShopCosts();
            if(savedShopCosts !== null){
                shopCosts = savedShopCosts;
            }
        } catch (error) {
            console.error("Error loading shop cost:", error);
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
    setCookie('points', points); // Save for 30 days
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

function getShopCosts(){
    return JSON.parse(getCookie("shopCosts"));
}

function setShopCosts(){
    setCookie("shopCosts", JSON.stringify(shopCosts));
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

function UpdateDisplay() {
    let displayText = formatNumber(points);
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
        pointsPerClick +=  roundToDecimalPlaces(amount, 2);
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

function incrementPointsMovement(){
    pointMove +=  0.1;
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
    console.log("upgrading points per second")
    if(points < cost) return;
    addPoints(-1 * cost);
    let upgradeAmount = pointsPerSecond * upgradeRatio;
    incrementPointsPerSecond(upgradeAmount > 0.1 ? upgradeAmount : 0.1);
    shopCosts.pointsPerSecond *= 1 + shopRatio;
    updatePerSecondShopItem();
}

function upgradePointsPerClick(){
    const cost = shopCosts.pointsPerClick;
    if(points < cost) return;
    addPoints(-1 * cost);
    let upgradeAmount = pointsPerClick * upgradeRatio;
    incrementPointsPerClick(upgradeAmount > 1 ? upgradeAmount : 1);
    shopCosts.pointsPerClick *= 1 + shopRatio;
    updateClickShopItem();
}

function upgradePointsMultiplier(){
    const cost = shopCosts.pointsMultiplier;
    if(points < cost) return;
    addPoints(-1 * cost);
    let upgradeAmount = pointsMultiplier * upgradeRatio;
    incrementPointsMultiplier(upgradeAmount > 0.1 ? upgradeAmount : 0.1);
    shopCosts.pointsMultiplier *= 1 + shopRatio;
    updateMultiplierShopItem();
}

function upgradePointsScroll(){
    const cost = shopCosts.pointsScroll;
    if(points < cost) return;
    addPoints(-1 * cost);
    let upgradeAmount = pointsScroll * upgradeRatio;
    incrementPointsScroll(upgradeAmount > 2 ? upgradeAmount : 2);
    shopCosts.pointsScroll *= 1 + shopRatio;
    updateScrollShopItem();
}

function upgradePointsMovement(){
    const cost = shopCosts.pointsMovement;
    if(points < cost) return;
    addPoints(-1 * cost);
    incrementPointsMovement();
    shopCosts.pointsMovement *= 1 + shopRatio;
    updateMovementShopItem();
}

function upgradePointsButtonClick(){
    const cost = shopCosts.pointsButtonClick;
    if(points < cost) return;
    addPoints(-1 * cost);
    let upgradeAmount = pointsPerButtonClick * upgradeRatio;
    incrementPointsPerButtonClick(upgradeAmount > 10 ? upgradeAmount : 10);
    shopCosts.pointsButtonClick *= 1 + shopRatio;
    updateButtonClickItem();
}

function unlockGames(){
    unlocks.games = true;
    gamesPage = true;
    document.querySelector("#games-page-unlock").disabled = true;
    updateCost(document.querySelector("#games-page-unlock"), "Sold Out");
}

function updateCost(element, cost){
    element.querySelector(".cost").innerHTML = formatNumber(cost);
    setShopCosts();
}


function updateAmount(element, amount){
    element.querySelector(".upgrade-amount").innerHTML =  formatNumber(amount);
}
function updateCurrentAmount(element, amount){
    element.querySelector(".current-amount").innerHTML = formatNumber(amount);
}

function roundToDecimalPlaces(numToRound, decimalPlaces = 1){
    return Math.round(numToRound * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
}

function reduceAmountForDisplay(amountToReduce, reduction){
    return roundToDecimalPlaces(amountToReduce, -1 * reduction)/Math.pow(10, reduction)
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


function setUpShop(){
    updatePerSecondShopItem();
    updateClickShopItem();
    updateButtonClickItem();
    updateMovementShopItem();
    updateScrollShopItem();
    updateMultiplierShopItem();
}

function updatePerSecondShopItem(){
    updateCost(perSecondUpgrade, shopCosts.pointsPerSecond);
    updateAmount(perSecondUpgrade, pointsPerSecond * upgradeRatio > 0.1 ? pointsPerSecond * upgradeRatio : 0.1);
    updateCurrentAmount(perSecondUpgrade, pointsPerSecond);
}

function updateClickShopItem(){
    updateCost(perClickUpgrade, shopCosts.pointsPerClick);
    updateAmount(perClickUpgrade, pointsPerClick * upgradeRatio > 1 ? pointsPerClick * upgradeRatio : 1);
    updateCurrentAmount(perClickUpgrade, pointsPerClick);
}

function updateButtonClickItem(){
    updateCost(perButtonClick, shopCosts.pointsButtonClick);
    updateAmount(perButtonClick, pointsPerButtonClick * upgradeRatio > 10 ? pointsPerButtonClick * upgradeRatio : 10);
    updateCurrentAmount(perButtonClick, pointsPerButtonClick);
}

function updateMovementShopItem(){
    updateCost(movementUpgrade, shopCosts.pointsMovement);
    updateAmount(movementUpgrade, pointMove * upgradeRatio > 1 ? pointMove * upgradeRatio : 1);
    updateCurrentAmount(movementUpgrade, pointMove);
}

function updateScrollShopItem(){
    updateCost(scrollUpgrade, shopCosts.pointsScroll);
    updateAmount(scrollUpgrade, pointsScroll * upgradeRatio > 2 ? pointsScroll * upgradeRatio : 2);
    updateCurrentAmount(scrollUpgrade, pointsScroll);
}

function updateMultiplierShopItem(){
    updateCost(multiplierUpgrade, shopCosts.pointsMultiplier);
    updateAmount(multiplierUpgrade, pointsMultiplier * upgradeRatio > 0.1 ? pointsMultiplier * upgradeRatio : 0.1);
    updateCurrentAmount(multiplierUpgrade, pointsMultiplier);
}



//todo: revamp save cookie to single cookie

function formatNumber(num) {
    let formattedNum;
    if(num < Math.pow(10, 3)) formattedNum = num.toFixed(1);
    else if (num < Math.pow(10, 7)) formattedNum = reduceAmountForDisplay(num, 3) + "k";
    else if (num < Math.pow(10, 10)) formattedNum = reduceAmountForDisplay(num, 6) + "m";
    else if (num < Math.pow(10, 13)) formattedNum = reduceAmountForDisplay(num, 9) + "b";
    else if (num < Math.pow(10, 16)) formattedNum = reduceAmountForDisplay(num, 12) + "t";
    else if (num < Math.pow(10, 19)) formattedNum = reduceAmountForDisplay(num, 15) + "q";
    else if (num < Math.pow(10, 22)) formattedNum = reduceAmountForDisplay(num, 18) + "Q";
    else if (num < Math.pow(10, 25)) formattedNum = reduceAmountForDisplay(num, 21) + "s";
    else if (num < Math.pow(10, 28)) formattedNum = reduceAmountForDisplay(num, 24) + "S";
    else if (num < Math.pow(10, 31)) formattedNum = reduceAmountForDisplay(num, 27) + "o";
    else if (num < Math.pow(10, 34)) formattedNum = reduceAmountForDisplay(num, 30) + "n";
    else if (num < Math.pow(10, 37)) formattedNum = reduceAmountForDisplay(num, 33) + "d";
    else formattedNum = "Lots";
    return formattedNum;
}
setUpShop();
document.querySelector('#menu-button').addEventListener('click', toggleMenu);