const glitchText = document.querySelectorAll('.glitch, .layers');

console.log(glitchText.length);
glitchText.forEach(element => {
    element.style.animationDelay = Math.random() * 3 + 's';
    element.setAttribute("data-text", element.innerText);
    element.innerHTML = "<span>" + element.innerHTML + "</span>";
});