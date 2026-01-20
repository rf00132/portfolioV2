//todo: absolute position settings menu is not scrollable, look into reorganising the html and css so it is
//todo: make cookie pop up and saving cookies for longer optional


const perSecondUpgrade = document.querySelector("#points-per-second");
const perClickUpgrade = document.querySelector("#points-per-click");
const multiplierUpgrade = document.querySelector("#points-multiplier");
const scrollUpgrade = document.querySelector("#points-scroll");
const movementUpgrade = document.querySelector("#points-movement");
const perButtonClick = document.querySelector("#points-per-button-click");
//const gamesUnlock = document.querySelector("#games-page-unlock");
const reset = document.querySelector("#points-reset");

const upgradeRatio = 0.1;
const shopRatio = 0.3;
let scrolled = false;
let moved = false;

let totalPointsGained = 0;
let points = 0;
let pointsPerSecond = 0;
let pointsPerClick = 0;
let pointsMultiplier = 0;
let pointsPerButtonClick = 0;
let pointsScroll = 0;
let pointMove = 0;
let resetPoints = 0;

let shopCosts = {
    pointsPerSecond: 20,
    pointsPerClick: 10,
    pointsMultiplier: 100,
    pointsScroll: 50,
    pointsMovement: 30,
    pointsButtonClick: 40,
    bbMoreLives: 400,
    bbMorePowerups: 400,
    snakeMoreFood: 400,
    snakeMoreSpeed: 400
};

let unlocks = {
    bbMorePowerups: false,
    bbMoreLives: false,
    snakeMoreFood: false,
    snakeMoreSpeed: false
}

let gamesPage = false;

let cookies = true;

let idleInterval;
let scrollInterval;
let movementInterval;

let pointsDisplay;
let pointsPerSecondDisplay;
let pointsPerClickDisplay;
let unlockedReset = false;
let resetting = false;

// Function to save a value to a cookie
function setCookie(name, value) {
    let expires = "";
    if (cookies) {
        const days = 30;
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

        try{
            const savedUnlocks = getUnlocks();
            if(savedUnlocks !== null){
                unlocks = savedUnlocks;
            }
        } catch (error) {
            console.error("Error loading unlocks:", error);
        }

        try {
            const savedTotalPoints = parseInt(getTotalPoints());
            if (savedTotalPoints !== null && savedTotalPoints > 0) {
                totalPointsGained = savedTotalPoints;
            }
        } catch (error) {
            console.error("Error loading total points:", error);
        }

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
            const savedResetPoints = parseInt(getResetPoints());
            if (savedResetPoints !== null && savedResetPoints > 0) {
                resetPoints = savedResetPoints;
            }
        } catch (error) {
            console.error("Error loading reset points:", error);
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
                if(resetting) {
                    resetting = false;
                    return;
                }
                addPoints(pointsPerClick * pointsMultiplier);
            } catch (error) {
                console.error("Error adding points:", error);
            }
        });

        document.addEventListener("mousemove", () => moved = true);

        idleInterval = setInterval(addIdlePoints, 1000);
        scrollInterval = setInterval(addScrollPoints, 1000);
        movementInterval = setInterval(addMovementPoints, 100);
    } catch (error) {
        console.error("Error in gameOnLoad:", error);
    }
}

function startReset(){
    if(totalPointsGained < 1000000) return;
    resetPoints += (totalPointsGained/1000000).toFixed();

    clearInterval(idleInterval);
    clearInterval(scrollInterval);
    clearInterval(movementInterval);
    pointsScroll = 0;
    setPointsScroll();
    pointsPerSecond = 0;
    savePointsPerSecond();
    pointsPerClick = 1;
    savePointsPerClick();
    pointsMultiplier = 1;
    savePointsMultiplier();
    pointsPerButtonClick = 0;
    setPointsPerButtonClick();
    pointMove = 0;
    setPointsMovement();
    shopCosts = {
        pointsPerSecond: 20,
        pointsPerClick: 10,
        pointsMultiplier: 100,
        pointsScroll: 50,
        pointsMovement: 30,
        pointsButtonClick: 40,
        bbMoreLives: 400,
        bbMorePowerups: 400,
        snakeMoreFood: 400,
        snakeMoreSpeed: 400
    };
    totalPointsGained = 0;
    points = 0;
    savePoints();
    UpdateDisplay()
    idleInterval = setInterval(addIdlePoints, 1000);
    scrollInterval = setInterval(addScrollPoints, 1000);
    movementInterval = setInterval(addMovementPoints, 100);
    reset.style = "display: none;";
    unlocks = {
        bbMorePowerups: false,
        bbMoreLives: false,
        snakeMoreFood: false,
        snakeMoreSpeed: false
    }
    setUnlocks();
    setShopCosts();
    setUpShop();
    setResetPoints();


    resetting = true;
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
    addPoints(pointMove * pointsMultiplier/10);
    moved = false;
}
function savePoints() {
    setCookie('points', points);
    setCookie('totalPoints', totalPointsGained)
}

function getPoints() {
    return getCookie('points');
}

function getTotalPoints(){
    return getCookie('totalPoints');
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

function setResetPoints(){
    setCookie("resetPoints", resetPoints);
}

function getResetPoints(){
    return getCookie("resetPoints");
}

function setUnlocks(){
    setCookie("unlocks", JSON.stringify(unlocks));
}

function getUnlocks(){
    return JSON.parse(getCookie("unlocks"));
}

function incrementPointsMultiplier(amount = 0.1){
    pointsMultiplier +=  amount;
    savePointsMultiplier();
    incrementPointsPerClick(0);
    incrementPointsPerSecond(0);
}

function addPoints(amount) {
    try {
        let amountToAdd = amount;
        if(amountToAdd > 0) {
            amountToAdd *= (resetPoints > 0 ? 1 + (resetPoints - resetPoints/2 + resetPoints/3 - resetPoints/4) : 1);
            totalPointsGained += amountToAdd;
        }
        points +=  amountToAdd;
        points = roundToDecimalPlaces(points);
        UpdateDisplay();
        if(amount !== 0) savePoints();
        if(totalPointsGained >= 1000000 && !unlockedReset) {
            reset.style = "";
            unlockedReset = true;
        }
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
            //console.error("pointsPerSecondDisplay is null or undefined");
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
            //console.error("pointsPerClickDisplay is null or undefined");
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

function onButtonClick(){
    addPoints(pointsPerButtonClick * pointsMultiplier);
}

function upgradePointsPerSecond(){
    const cost = shopCosts.pointsPerSecond;
    if(points < cost) return;
    addPoints(-1 * cost);
    let upgradeAmount = pointsPerSecond * upgradeRatio;
    incrementPointsPerSecond(upgradeAmount > 1 ? upgradeAmount : 1);
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
    let upgradeAmount = pointMove * upgradeRatio;
    incrementPointsMovement(upgradeAmount > 10 ? upgradeAmount : 10);
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
    document.querySelector("#games-page-unlock").style.display = "none";
    updateCost(document.querySelector("#games-page-unlock"), "Sold Out");
}

function unlockBbMoreLives(){
    const cost = shopCosts.bbMoreLives;
    if(points < cost) return;
    console.log(cost);
    addPoints(-1 * cost);
    unlocks.bbMoreLives = true;
    document.querySelector("#bb-more-lives").disabled = true;
    document.querySelector("#bb-more-lives").style.display = "none";
    updateCost(document.querySelector("#bb-more-lives"), "Sold Out");
    setUnlocks();
}

function unlockBbMorePowerups(){
    const cost = shopCosts.bbMorePowerups;
    if(points < cost) return;
    console.log(cost);
    addPoints(-1 * cost);
    unlocks.bbMorePowerups = true;
    document.querySelector("#bb-faster-powerups").disabled = true;
    document.querySelector("#bb-faster-powerups").style.display = "none";
    updateCost(document.querySelector("#bb-faster-powerups"), "Sold Out");
    setUnlocks();
}

function unlockSnakeMoreFood(){
    const cost = shopCosts.snakeMoreFood;
    if(points < cost) return;
    console.log(cost);
    addPoints(-1 * cost);
    unlocks.snakeMoreFood = true;
    document.querySelector("#snake-faster-food").disabled = true;
    document.querySelector("#snake-faster-food").style.display = "none";
    updateCost(document.querySelector("#snake-faster-food"), "Sold Out");
    setUnlocks();
}

function unlockSnakeMoreSpeed(){
    const cost = shopCosts.snakeMoreSpeed;
    if(points < cost) return;
    console.log(cost);
    addPoints(-1 * cost);
    unlocks.snakeMoreSpeed = true;
    document.querySelector("#snake-more-speed").disabled = true;
    document.querySelector("#snake-more-speed").style.display = "none";
    updateCost(document.querySelector("#snake-more-speed"), "Sold Out");
    setUnlocks();
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
    return (roundToDecimalPlaces(amountToReduce, -1 * reduction)/Math.pow(10, reduction)).toFixed()
}

perSecondUpgrade.addEventListener("click", upgradePointsPerSecond);
perClickUpgrade.addEventListener("click", upgradePointsPerClick);
multiplierUpgrade.addEventListener("click", upgradePointsMultiplier);
scrollUpgrade.addEventListener("click", upgradePointsScroll);
movementUpgrade.addEventListener("click", upgradePointsMovement);
perButtonClick.addEventListener("click", upgradePointsButtonClick);
//gamesUnlock.addEventListener("click", unlockGames);
reset.addEventListener("click", startReset);
document.querySelector("#bb-more-lives").addEventListener("click", unlockBbMoreLives);
document.querySelector("#bb-faster-powerups").addEventListener("click", unlockBbMorePowerups);
document.querySelector("#snake-faster-food").addEventListener("click", unlockSnakeMoreFood);
document.querySelector("#snake-more-speed").addEventListener("click", unlockSnakeMoreSpeed);


function setUpShop(){
    updatePerSecondShopItem();
    updateClickShopItem();
    updateButtonClickItem();
    updateMovementShopItem();
    updateScrollShopItem();
    updateMultiplierShopItem();

    if(unlocks.bbMoreLives){
        document.querySelector("#bb-more-lives").disabled = true;
        document.querySelector("#bb-more-lives").style.display = "none";
        updateCost(document.querySelector("#bb-more-lives"), "Sold Out");
    } else{
        document.querySelector("#bb-more-lives").disabled = false;
        document.querySelector("#bb-more-lives").style.display = "block";
        updateCost(document.querySelector("#bb-more-lives"), shopCosts.bbMoreLives);
    }

    if(unlocks.bbMorePowerups){
        document.querySelector("#bb-faster-powerups").disabled = true;
        document.querySelector("#bb-faster-powerups").style.display = "none";
        updateCost(document.querySelector("#bb-faster-powerups"), "Sold Out");
    } else{
        document.querySelector("#bb-faster-powerups").disabled = false;
        document.querySelector("#bb-faster-powerups").style.display = "block";
        updateCost(document.querySelector("#bb-faster-powerups"), shopCosts.bbMorePowerups);
    }

    if(unlocks.snakeMoreFood){
        document.querySelector("#snake-faster-food").disabled = true;
        document.querySelector("#snake-faster-food").style.display = "none";
        updateCost(document.querySelector("#snake-faster-food"), "Sold Out");
    } else {
        document.querySelector("#snake-faster-food").disabled = false;
        document.querySelector("#snake-faster-food").style.display = "block";
        updateCost(document.querySelector("#snake-faster-food"), shopCosts.snakeMoreFood);
    }

    if(unlocks.snakeMoreSpeed){
        document.querySelector("#snake-more-speed").disabled = true;
        document.querySelector("#snake-more-speed").style.display = "none";
        updateCost(document.querySelector("#snake-more-speed"), "Sold Out");
    } else {
        document.querySelector("#snake-more-speed").disabled = false;
        document.querySelector("#snake-more-speed").style.display = "block";
        updateCost(document.querySelector("#snake-more-speed"), shopCosts.snakeMoreSpeed);
    }
}

function updatePerSecondShopItem(){
    updateCost(perSecondUpgrade, shopCosts.pointsPerSecond);
    updateAmount(perSecondUpgrade, pointsPerSecond * upgradeRatio > 1 ? pointsPerSecond * upgradeRatio : 1);
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

function formatNumber(num) {
    let formattedNum;
    if(num < Math.pow(10, 4)) formattedNum = num.toFixed(1);
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