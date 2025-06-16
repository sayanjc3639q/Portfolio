document.addEventListener('DOMContentLoaded', () => {
    const postsContainer = document.getElementById('blog-posts-container');
    const filterButtons = document.querySelectorAll('.filter-btn');

    let allPosts = [];

    // Fetch and render posts
    async function fetchPosts() {
        try {
            const response = await fetch('../../blogs.json');
            if (!response.ok) throw new Error('Failed to load blog posts.');
            
            const posts = await response.json();
            allPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
            renderPosts(allPosts);
        } catch (error) {
            console.error(error);
            postsContainer.innerHTML = '<p>Could not load posts at this time.</p>';
        }
    }

    // Render posts to the DOM
    function renderPosts(posts) {
        postsContainer.innerHTML = '';
        if (posts.length === 0) {
            postsContainer.innerHTML = '<p>No posts in this category yet.</p>';
            return;
        }

        posts.forEach(post => {
            const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });
            const excerpt = post.content.substring(0, 150);

            const postCard = `
                <div class="blog-list-card">
                    <div class="thumbnail">
                        <a href="posts/index.html?id=${post.id}">
                            <img src="${post.thumbnailUrl}" alt="${post.title}">
                        </a>
                    </div>
                    <div class="content">
                        <div class="meta">
                            <span class="date">${formattedDate}</span>
                            <span class="tag tag-${post.category.toLowerCase()}">${post.category}</span>
                        </div>
                        <h3 class="title">${post.title}</h3>
                        <p class="excerpt">${excerpt}</p>
                        <a href="posts/index.html?id=${post.id}" class="btn btn-secondary read-more-btn"><span>Read More</span></a>
                    </div>
                </div>
            `;
            postsContainer.innerHTML += postCard;
        });
    }

    // Handle filtering
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');

            // Update active state on buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            if (category === 'all') {
                renderPosts(allPosts);
            } else {
                const filteredPosts = allPosts.filter(post => post.category === category);
                renderPosts(filteredPosts);
            }
        });
    });

    // Initial load
    fetchPosts();
});