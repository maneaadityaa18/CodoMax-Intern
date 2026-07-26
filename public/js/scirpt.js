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

        const title = escapeHtml(post.title || 'Untitled Blog');
        const author = escapeHtml(post.author || 'Anonymous');
        const category = escapeHtml(post.category || 'New');
        const content = escapeHtml(post.content || 'No content available yet.');

        return `
            <article class="card">
                <p class="card-badge">${category}</p>
                <h3>${title}</h3>
                <p class="author">By ${author} • ${escapeHtml(date)}</p>
                <p>${content}</p>
                <button
                    type="button"
                    class="text-link read-more-btn"
                    data-title="${title}"
                    data-author="${author}"
                    data-date="${escapeHtml(date)}"
                    data-category="${category}"
                    data-content="${content}"
                >
                    Read More
                </button>
            </article>
        `;
    }).join('');
}

function openBlogModal(post) {
    const existing = document.querySelector('.modal-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
        <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
            <button type="button" class="modal-close" aria-label="Close blog post">×</button>
            <p class="card-badge">${escapeHtml(post.category || 'Featured')}</p>
            <h3 id="modalTitle">${escapeHtml(post.title || 'Untitled Blog')}</h3>
            <p class="author">By ${escapeHtml(post.author || 'Anonymous')} • ${escapeHtml(post.date || '')}</p>
            <div class="modal-body">${escapeHtml(post.content || 'No content available yet.').replace(/\n/g, '<br>')}</div>
        </div>
    `;

    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
        overlay.classList.add('active');
    });

    const closeButton = overlay.querySelector('.modal-close');
    closeButton.addEventListener('click', closeBlogModal);

    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            closeBlogModal();
        }
    });
}

function closeBlogModal() {
    const overlay = document.querySelector('.modal-overlay');
    if (!overlay) return;

    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 220);
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

    const blogCards = document.getElementById('blogCards');

    if (blogCards) {
        blogCards.addEventListener('click', (event) => {
            const button = event.target.closest('.read-more-btn');
            if (!button) return;

            event.preventDefault();

            openBlogModal({
                title: button.dataset.title || 'Untitled Blog',
                author: button.dataset.author || 'Anonymous',
                date: button.dataset.date || '',
                category: button.dataset.category || 'Featured',
                content: button.dataset.content || 'No content available yet.'
            });
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeBlogModal();
        }
    });

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
