document.addEventListener('DOMContentLoaded', () => {
    // --- 1. DOM Element Selectors ---
    // Variables are declared at the top so all functions can access them
    const projectsListContainer = document.getElementById('projects-list');
    const searchInput = document.getElementById('search-input');
    const difficultyFilter = document.getElementById('difficulty-filter');
    const typeFilter = document.getElementById('type-filter');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const filterToggleBtn = document.getElementById('filter-toggle-btn');
    const filtersContainer = document.querySelector('.filters-container');

    let allProjects = [];
    let fuse;

   // --- 2. Fetch and Display Projects ---
    async function fetchProjects() {
        try {
            const response = await fetch('../../projects.json');
            if (!response.ok) throw new Error('Network response was not ok');
            
            const projects = await response.json();
            allProjects = projects.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            initializeFuse(allProjects);
            
            // NEW: Check for search term in URL after loading projects
            checkForURLParams();

            // Finally, render the display based on current filters/search
            updateDisplay();

        } catch (error) {
            console.error('Failed to fetch projects:', error);
            projectsListContainer.innerHTML = '<p>Failed to load projects.</p>';
        }
    }

    // --- 3. Render Projects to the DOM (UPDATED) ---
    function renderProjects(projects) {
        projectsListContainer.innerHTML = ''; // Clear existing projects
        if (projects.length === 0) {
            projectsListContainer.innerHTML = '<p>No projects found matching your criteria.</p>';
            return;
        }

        projects.forEach(project => {
            // --- Helper logic for conditional buttons ---
            const visitSiteButton = (project.siteUrl && project.siteUrl !== '#')
                ? `<a href="${project.siteUrl}" class="btn btn-primary" target="_blank"><i class="fas fa-globe"></i> Visit Site</a>`
                : ''; // If no siteUrl, this will be an empty string

            // --- Helper logic for formatting the date ---
            const formattedDate = new Date(project.date).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });

            const projectCard = `
                <div class="project-list-card">
                    <div class="thumbnail">
                        <img src="${project.imageUrl}" alt="${project.title}">
                    </div>
                    <div class="content">
                        <h2 class="title">${project.title}</h2>

                        <div class="project-meta">
                            <span class="meta-date">
                                <i class="fas fa-calendar-alt"></i> ${formattedDate}
                            </span>
                            <span class="meta-difficulty difficulty-${project.difficulty.toLowerCase()}">
                                ${project.difficulty}
                            </span>
                        </div>

                        <p class="description">${project.description}</p>
                        <div class="card-buttons">
                            ${visitSiteButton}
                            <a href="${project.githubUrl}" class="btn btn-secondary" target="_blank"><span><i class="fab fa-github"></i> See Code</span></a>
                        </div>
                        <div class="project-stats">
                            <div class="stat"><i class="fas fa-eye"></i><span>${project.siteViews.toLocaleString()} Site Views</span></div>
                            <div class="stat"><i class="fas fa-code-branch"></i><span>${project.codeViews.toLocaleString()} Code Views</span></div>
                            <div class="stat">
                                <button class="like-btn" data-project-id="${project.id}">
                                    <i class="fas fa-heart"></i>
                                    <span class="like-count">${project.likes.toLocaleString()}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`;
            projectsListContainer.innerHTML += projectCard;
        });
    }

    // --- NEW: Check for URL Parameters ---
    function checkForURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchTerm = urlParams.get('search');

        if (searchTerm) {
            // If a search term exists in the URL, put it in the search bar
            searchInput.value = decodeURIComponent(searchTerm.replace(/\+/g, ' '));
        }
    }

    // --- 4. Initialize Fuzzy Search ---
    function initializeFuse(projects) {
        const options = { keys: ['title', 'description'], includeScore: true, threshold: 0.4, ignoreLocation: true };
        fuse = new Fuse(projects, options);
    }

    // --- 5. Handle Search and Filtering ---
    function updateDisplay() {
        let filteredProjects = [...allProjects];
        const difficulty = difficultyFilter.value;
        const type = typeFilter.value;

        if (difficulty !== 'all') filteredProjects = filteredProjects.filter(p => p.difficulty === difficulty);
        if (type !== 'all') filteredProjects = filteredProjects.filter(p => p.type === type);
        
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            const searchResults = fuse.search(searchTerm);
            const searchedAndFiltered = searchResults
                .map(result => result.item)
                .filter(item => filteredProjects.some(p => p.id === item.id));
            filteredProjects = searchedAndFiltered;
        }
        renderProjects(filteredProjects);
    }
    
    // --- 6. Event Listeners ---
    searchInput.addEventListener('input', updateDisplay);
    difficultyFilter.addEventListener('change', updateDisplay);
    typeFilter.addEventListener('change', updateDisplay);

    clearFiltersBtn.addEventListener('click', () => {
        searchInput.value = '';
        difficultyFilter.value = 'all';
        typeFilter.value = 'all';
        updateDisplay();
    });

    if (filterToggleBtn && filtersContainer) {
        filterToggleBtn.addEventListener('click', () => {
            filtersContainer.classList.toggle('filters-open');
        });
    }

    projectsListContainer.addEventListener('click', function(e) {
        const likeButton = e.target.closest('.like-btn');
        if (likeButton && !likeButton.classList.contains('liked')) {
            likeButton.classList.add('liked');
            const likeCountSpan = likeButton.querySelector('.like-count');
            let currentLikes = parseInt(likeCountSpan.textContent.replace(/,/g, ''), 10);
            currentLikes++;
            likeCountSpan.textContent = currentLikes.toLocaleString();
        }
    });

    // --- Initial Load ---
    fetchProjects();
});