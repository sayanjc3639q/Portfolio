document.addEventListener('DOMContentLoaded', () => {
    // Select the placeholder elements
    const postTitleEl = document.getElementById('post-title');
    const postMetaEl = document.getElementById('post-meta');
    const postImageEl = document.getElementById('post-image');
    const postBodyEl = document.getElementById('post-body');

    // 1. Get the post ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        postTitleEl.textContent = 'Post not found!';
        postBodyEl.textContent = 'No post ID was provided in the URL.';
        return;
    }

    // 2. Fetch all blog posts
    async function fetchAndDisplayPost() {
        try {
            const response = await fetch('../../../blogs.json');
            if (!response.ok) throw new Error('Could not fetch blog data.');
            
            const posts = await response.json();
            
            // 3. Find the correct post by its ID
            // Note: postId from URL is a string, post.id is a number, so we use ==
            const post = posts.find(p => p.id == postId);

            if (post) {
                // 4. Populate the page with the post's data
                document.title = `${post.title} - Sayan's Blog`; // Update the browser tab title
                postTitleEl.textContent = post.title;

                // Format the date
                const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                });
                
                // Populate meta info
                postMetaEl.innerHTML = `
                    <span class="date"><i class="fas fa-calendar-alt"></i> ${formattedDate}</span>
                    <span class="tag tag-${post.category.toLowerCase()}">${post.category}</span>
                `;

                // Set image and alt text
                postImageEl.src = `${post.thumbnailUrl}`;
                postImageEl.alt = post.title;

                // To make paragraphs, we'll split the content by newlines and wrap each in a <p> tag
                const paragraphs = post.content.split('\n').map(p => `<p>${p}</p>`).join('');
                postBodyEl.innerHTML = paragraphs;
                
            } else {
                postTitleEl.textContent = 'Post Not Found';
                postBodyEl.innerHTML = '<p>Sorry, we could not find the post you were looking for.</p>';
            }
        } catch (error) {
            console.error('Error fetching post:', error);
            postTitleEl.textContent = 'Error Loading Post';
            postBodyEl.innerHTML = '<p>There was an error trying to load the content. Please try again later.</p>';
        }
    }

    fetchAndDisplayPost();
});