document.addEventListener("DOMContentLoaded", () => {
    const favButtons = document.querySelectorAll(".fav-btn");
    favButtons.forEach(button => {
        button.addEventListener("click", () => {
            button.innerText = "Added to Faves ❤️";
            button.style.background = "#4CAF50";
        });
    });


    
 });
