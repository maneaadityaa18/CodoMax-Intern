async function getPosts() {
    try {
        const response = await fetch("/api/blogs");
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

async function renderPosts() {
    const blogCards = document.getElementById('blogCards');

    if (!blogCards) return;

    const posts = await getPosts();

    if (!posts.length) {
        blogCards.innerHTML = '<div class="empty-state">No blogs yet. Be the first to publish one.</div>';
        return;
    }

    blogCards.innerHTML = posts.map((post) => {
        const date = new Date(post.createdAt).toLocaleDateString('en', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        return `
            <article class="card">
                <p class="card-badge">${escapeHtml(post.category || 'New')}</p>
                <h3>${escapeHtml(post.title)}</h3>
                <p class="author">By ${escapeHtml(post.author)} • ${escapeHtml(date)}</p>
                <p>${escapeHtml(post.content)}</p>
                <a href="#" class="text-link">Read More</a>
            </article>
        `;
    }).join('');
}

function showToast(message) {
    const existing = document.querySelector('.toast-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'toast-overlay';

    overlay.innerHTML = `
        <div class="toast">
            <h3>Blog Published!</h3>
            <p>${escapeHtml(message)}</p>
        </div>
    `;

    document.body.appendChild(overlay);

    setTimeout(() => {
        overlay.remove();
    }, 2200);
}

document.addEventListener('DOMContentLoaded', () => {
    renderPosts();

    const form = document.getElementById('blogForm');

    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const title = document.getElementById('title').value.trim();
        const author = document.getElementById('author').value.trim();
        const category = document.getElementById('category').value.trim();
        const content = document.getElementById('content').value.trim();

        if (!title || !author || !category || !content) {
            showToast('Please fill all fields before publishing your blog.');
            return;
        }

        const newPost = {
            title,
            author,
            category,
            content
        };

        try {
            const response = await fetch("/api/blogs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newPost)
            });

            if (response.ok) {
                showToast("Your blog has been published and added to the homepage.");

                form.reset();

                setTimeout(() => {
                    window.location.href = "/";
                }, 1500);
            }
        } catch (error) {
            console.error(error);
            showToast("Something went wrong.");
        }
    });
});
