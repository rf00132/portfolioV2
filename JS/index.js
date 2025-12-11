const glitchText = document.querySelectorAll('.glitch, .layers');

console.log(glitchText.length);
glitchText.forEach(element => {
    element.style.animationDelay = Math.random() * 3 + 's';
    element.setAttribute("data-text", element.innerText);
    element.innerHTML = "<span>" + element.innerHTML + "</span>";
});

const menuButton = document.querySelector('#menu-button');
const navBar = document.querySelector('.nav-bar');
let menuOpen = false;

menuButton.addEventListener('click', toggleMenu);
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
    console.log(window.innerWidth);
    if(window.innerWidth < 800) return;
    navBar.style = "";
    menuOpen = false;
}