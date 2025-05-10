function clickNav() {
    let baseGamePage = document.getElementById("base-game-page");
    let sidebar = document.getElementById("sidebar");
    let navButtonImg = document.getElementById("nav-button-img");

    if (sidebar.style.width === "20vw") {
        sidebar.style.width = "0";
        navButtonImg.style.transform = "none";
        baseGamePage.style.gridTemplateAreas = '"sidebar nav-button content"';
        baseGamePage.style.gridTemplateColumns = "0 5vw 95vw";
    } else {
        sidebar.style.width = "20vw";
        navButtonImg.style.transform = "rotate(180deg)";
        baseGamePage.style.gridTemplateColumns = "20vw 5vw 75vw";
        baseGamePage.style.gridTemplateAreas = '"sidebar nav-button content"';
    }
}