document.addEventListener('DOMContentLoaded', function() {

    // --- Typewriter Effect --- (Keep existing code)
    const nameElement = document.getElementById('name-typewriter');
    const name = "Sayan"; // <<< CHANGE THIS TO YOUR NAME
    let index = 0;

    function typeWriter() {
        if (index < name.length) {
            nameElement.innerHTML += name.charAt(index);
            index++;
            setTimeout(typeWriter, 150); // Speed of typing in milliseconds
        }
    }
    setTimeout(typeWriter, 1000);

    // --- UPDATED: Looping Typewriter Effect (with safety check) ---
document.addEventListener('DOMContentLoaded', function() {
    const nameElement = document.getElementById('name-typewriter');
    
    // This 'if' statement is the fix. It checks if the element exists before running the code.
    if (nameElement) {
        const textToType = "Sayan"; // Your Name
        const typingSpeed = 150;
        const erasingSpeed = 100;
        const pauseAfterTyping = 12000;
        const pauseAfterErasing = 500;
        let charIndex = 0;

        function type() {
            if (charIndex < textToType.length) {
                nameElement.textContent += textToType.charAt(charIndex);
                charIndex++;
                setTimeout(type, typingSpeed);
            } else {
                setTimeout(erase, pauseAfterTyping);
            }
        }

        function erase() {
            if (charIndex > 0) {
                nameElement.textContent = textToType.substring(0, charIndex - 1);
                charIndex--;
                setTimeout(erase, erasingSpeed);
            } else {
                setTimeout(type, pauseAfterErasing);
            }
        }
        setTimeout(type, 1000);
    }

    });

    // --- Scroll Reveal Animation --- (Keep existing code)
    if (typeof ScrollReveal !== 'undefined') {
        const sr = ScrollReveal({
            distance: '50px',
            duration: 1500,
            easing: 'cubic-bezier(0.5, 0, 0, 1)',
            reset: false 
        });

        sr.reveal('.hero-title', { delay: 200, origin: 'top' });
        sr.reveal('.hero-subtitle', { delay: 400, origin: 'top' });
        sr.reveal('.btn-primary', { delay: 600, origin: 'bottom' });
        sr.reveal('.section-title', { delay: 200, origin: 'top' });
        sr.reveal('.project-card', { interval: 200, origin: 'bottom' });
        sr.reveal('.blog-card', { interval: 200, origin: 'bottom' });
        sr.reveal('.view-all-link', { delay: 300, origin: 'bottom' });

    } else {
        console.log('ScrollReveal library not loaded.');
    }


    // --- NEW: Hamburger Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

});

// --- UPDATED: Responsive Revolving Globe Initialization ---
document.addEventListener('DOMContentLoaded', function() {
    // Check if TagCanvas is loaded and the canvas exists
    if (window.TagCanvas && document.getElementById('globe-canvas')) {
        try {
            // --- Responsive Settings ---
            // Check the width of the window
            const isMobile = window.innerWidth < 768;

            // Set different options based on whether it's mobile or desktop
            const globeZoom = isMobile ? 1.4 : 1.0; // Zoom in more on mobile
            const iconTextHeight = isMobile ? 30 : 25; // Use slightly larger icons on mobile

            TagCanvas.Start('globe-canvas', 'tag-list', {
                // --- Styling ---
                textColour: null, 
                outlineColour: 'transparent',
                
                // --- Animation ---
                reverse: true,
                depth: 0.8,
                maxSpeed: 0.05,
                initial: [0.05, -0.01],

                // --- NEW: Responsive Zoom ---
                zoom: globeZoom, // Apply our responsive zoom level

                // --- Glow Effect ---
                shadow: '#fff',
                shadowBlur: 30,
                shadowOffset: [0, 0], 
                
                // --- Interactivity ---
                dragControl: false, // User interaction is disabled
                decel: 0.95, 
                
                // --- Performance & Sizing ---
                textHeight: iconTextHeight, // Apply our responsive text size
                textFont: '"Poppins", sans-serif',
                hideTags: false,
            });
        } catch (e) {
            // An error occurred, hide the container
            console.error('TagCanvas initialization failed:', e);
            document.getElementById('globe-container').style.display = 'none';
        }
    }

    
});

document.addEventListener('DOMContentLoaded', function() {
    
    // ... (all your existing code for typewriter, chatbot, copyright, etc.) ...


    // --- NEW: Animate Circular Skill Meters on About Page ---
    const skillMeters = document.querySelectorAll('.skill-meter');

    if (skillMeters.length > 0) {
        const skillObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const meter = entry.target;
                    const progressCircle = meter.querySelector('.skill-meter-fg');
                    const percentSpan = meter.querySelector('.skill-percent');
                    const targetPercent = parseInt(meter.getAttribute('data-percent'), 10);
                    
                    // The radius of the circle is 45, so circumference is 2 * pi * 45 = ~283
                    const circumference = 2 * Math.PI * 45;
                    const offset = circumference - (targetPercent / 100) * circumference;

                    // Animate the circle
                    progressCircle.style.strokeDashoffset = offset;

                    // Animate the number counting up
                    let currentPercent = 0;
                    const interval = setInterval(() => {
                        if (currentPercent >= targetPercent) {
                            clearInterval(interval);
                        } else {
                            currentPercent++;
                            percentSpan.textContent = `${currentPercent}%`;
                        }
                    }, 15); // Adjust speed of the count animation here

                    observer.unobserve(meter); // Animate only once
                }
            });
        }, { threshold: 0.5 });

        skillMeters.forEach(meter => {
            skillObserver.observe(meter);
        });
    }

    // --- You might want to add ScrollReveal for the new section titles ---
    if (typeof ScrollReveal !== 'undefined'){
        // ... your existing sr.reveal() calls ...
        ScrollReveal().reveal('#about-intro .about-text, #about-intro .about-image', { origin: 'bottom', distance: '50px', interval: 200 });
        ScrollReveal().reveal('#skills .skill-item', { origin: 'bottom', distance: '30px', interval: 100 });
        ScrollReveal().reveal('#academics .timeline-item', { origin: 'bottom', distance: '50px', interval: 200 });
        ScrollReveal().reveal('#collaboration-cta', { origin: 'bottom', distance: '50px' });
        // Inside the if (typeof ScrollReveal !== 'undefined') block...

// Find and replace the old journey reveal with this one:
        ScrollReveal().reveal('.timeline-event', { origin: 'bottom', distance: '50px', interval: 150, viewFactor: 0.2 });
    }

});

