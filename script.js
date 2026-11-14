// const greeting = document.getElementById("greeting")
// greeting.style.textAlign = "center"
// greeting.style.marginTop = "50px"
// const username = window.prompt("Hello! What's your name?", "Your_Name")
// greeting.textContent = "Welcome to my website, "+ username + ".  I am so glad you are here!" 


// Stacylyn Love Burnett Website
document.addEventListener("DOMContentLoaded", function () {
    // Find all navigation links
    const navLinks = document.querySelectorAll("nav a");
    //Add a click event to each link
    navLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            console.log("Navigation clicked:", link.textContent)
        })
    })
})

