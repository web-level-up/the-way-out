function clickNav() {
    let root = document.getElementById("root");
    let navButton = document.getElementById("nav-button");
    let sidebar = document.getElementById("sidebar");
    let navButtonImg = document.getElementById("nav-button-img");
    // let mainContent = document.getElementById("root");

    if (sidebar.style.width === "20vw") {
        // navButton.style.display = "block";
        sidebar.style.width = "0";
        // navButtonImg.src = "css/images/right-chevron.png";
        // mainContent.style.marginLeft = "0";
        navButtonImg.style.transform = "none";
        root.style.gridTemplateAreas = '"sidebar nav-button content"';
        root.style.gridTemplateColumns = "0 5vw 95vw";
    } else {
        // navButton.style.display = "none";
        sidebar.style.width = "20vw";
        navButtonImg.style.transform = "rotate(180deg)";
        root.style.gridTemplateColumns = "20vw 5vw 75vw";
        root.style.gridTemplateAreas = '"sidebar nav-button content"';
        // mainContent.style.marginLeft = "25em";
    }
}