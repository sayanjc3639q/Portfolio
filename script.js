// Get all sections that have an ID defined and all navigation links
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-menu a");

// Add an event listener for scroll events
window.addEventListener("scroll", () => {
    // Get the current scroll position
    let currentScrollPos = window.pageYOffset;

    // Loop through the sections to find which one is currently in view
    sections.forEach(section => {
        // The top of the section, with an offset of 150px
        const sectionTop = section.offsetTop - 150;
        // The ID of the current section
        const sectionId = section.getAttribute("id");
        // The corresponding navigation link
        const correspondingNavLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

        if (correspondingNavLink) {
            // If the current scroll position is past the top of the section
            if (currentScrollPos >= sectionTop) {
                // Remove 'active' class from all links
                navLinks.forEach(link => link.classList.remove("active"));
                // Add 'active' class to the correct link
                correspondingNavLink.classList.add("active");
            }
        }
    });
});