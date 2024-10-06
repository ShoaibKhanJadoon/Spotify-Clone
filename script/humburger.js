document.querySelector(".humburger").addEventListener("click", e => {
    const sidebar = document.querySelector(".left");
    if (sidebar.style.left === "0%") {
        e.target.src="images/buttons/menuclose.png"
        sidebar.style.left = "-100%";  // Slide out (hide)
    } else {
        e.target.src="images/buttons/menu.png"
        sidebar.style.left = "0%";  // Slide in (show)
    }
});