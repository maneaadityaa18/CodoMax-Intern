async function getPosts(limit = null) {
    try {
        const url = limit ? `/api/blogs?limit=${encodeURIComponent(limit)}` : "/api/blogs";
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

function formatPostDate(createdAt) {
    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
        return 'Recently published';
    }

    return date.toLocaleString('en', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
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
    const blogCardsContainer = document.getElementById('blogCards') || document.getElementById('allBlogCards');

    if (!blogCardsContainer) return;

    const limit = Number(blogCardsContainer.dataset.limit || 0);
    const posts = await getPosts(limit > 0 ? limit : null);
    const visiblePosts = limit > 0 ? posts.slice(0, limit) : posts;

    if (!visiblePosts.length) {
        blogCardsContainer.innerHTML = '<div class="empty-state">No blogs yet. Be the first to publish one.</div>';
        return;
    }

    blogCardsContainer.innerHTML = visiblePosts.map((post) => {
        const date = formatPostDate(post.createdAt);

        const title = escapeHtml(post.title || 'Untitled Blog');
        const author = escapeHtml(post.author || 'Anonymous');
        const category = escapeHtml(post.category || 'New');
        const content = escapeHtml(post.content || 'No content available yet.');
        const safeDate = escapeHtml(date);

        return `
            <article class="card" data-blog-id="${post._id || ''}">
                <div class="card-header">
                    <p class="card-badge">${category}</p>
                    <div class="card-menu">
                        <button type="button" class="card-menu-toggle" aria-haspopup="true" aria-expanded="false" aria-label="Open card actions">⋯</button>
                        <div class="card-menu-list" aria-label="Card actions">
                            <button type="button" class="card-menu-item edit-card">Edit</button>
                            <button type="button" class="card-menu-item delete-card">Delete</button>
                        </div>
                    </div>
                </div>
                <h3>${title}</h3>
                <p class="author">By ${author} • ${safeDate}</p>
                <p class="card-text">${content}</p>
                <button
                    type="button"
                    class="text-link read-more-btn"
                    data-title="${title}"
                    data-author="${author}"
                    data-date="${safeDate}"
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

function closeAllCardMenus() {
    document.querySelectorAll('.card-menu.open').forEach((menu) => {
        const toggle = menu.querySelector('.card-menu-toggle');
        menu.classList.remove('open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
}

async function handleCardMenuAction(button) {
    const card = button.closest('.card');
    const blogId = card.dataset.blogId;
    const action = button.classList.contains('edit-card') ? 'edit' : 'delete';
    const title = card?.querySelector('h3')?.textContent?.trim() || 'Blog';

    if (action === 'edit') {
        window.location.href = `addblog.html?editId=${blogId}`;
    } else if (action === 'delete') {
        // Ask for confirmation before deleting
        if (confirm(`Are you sure you want to delete "${title}"?`)) {
            try {
                const response = await fetch(`/api/blogs/${blogId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    showToast(`🗑️ Blog deleted successfully!`, "Blog Deleted");
                    // Refresh the blog list
                    renderPosts();
                } else {
                    showToast("Failed to delete the blog. Please try again.");
                }
            } catch (error) {
                console.error("Error deleting blog:", error);
                showToast("An error occurred while deleting.");
            }
        }
    }

    closeAllCardMenus();
}

function showToast(message, title = "Blog Status") {
    const existing = document.querySelector('.toast-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'toast-overlay';

    overlay.innerHTML = `
        <div class="toast">
            <h3>${escapeHtml(title)}</h3>
            <p>${escapeHtml(message)}</p>
        </div>
    `;

    document.body.appendChild(overlay);

    setTimeout(() => {
        overlay.remove();
    }, 2200);
}


document.addEventListener('DOMContentLoaded', async () => {
    // Navigation & UI Elements
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    // Mobile Menu Toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    /*Profile Dropdown Toggle
    if (profileTrigger) {
        profileTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
        });
    }

    // Close dropdowns/menus when clicking outside*
    document.addEventListener('click', (e) => {
        if (profileDropdown && !profileDropdown.contains(e.target) && e.target !== profileTrigger) {
            profileDropdown.classList.remove('show');
        }
        if (navLinks && navLinks.classList.contains('active') && !navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });*/

    // ... existing initialization logic ...
    const blogCards = document.getElementById('blogCards');
    const allBlogCards = document.getElementById('allBlogCards');

    const form = document.getElementById('blogForm');
    
    // Check for editId in URL (for Edit Mode)
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('editId');

    if (blogCards || allBlogCards) {
        
        renderPosts();
        
        const cardsContainer = blogCards || allBlogCards;
        cardsContainer.addEventListener('click', (event) => {
            const toggleButton = event.target.closest('.card-menu-toggle');
            const menuAction = event.target.closest('.card-menu-item');
            const readMoreButton = event.target.closest('.read-more-btn');

            if (toggleButton) {
                const menu = toggleButton.closest('.card-menu');
                if (!menu) return;

                const isOpen = menu.classList.toggle('open');
                closeAllCardMenus();
                if (isOpen) {
                    menu.classList.add('open');
                    toggleButton.setAttribute('aria-expanded', 'true');
                } else {
                    menu.classList.remove('open');
                    toggleButton.setAttribute('aria-expanded', 'false');
                }
                return;
            }

            if (menuAction) {
                event.preventDefault();
                handleCardMenuAction(menuAction);
                return;
            }

            if (readMoreButton) {
                event.preventDefault();

                openBlogModal({
                    title: readMoreButton.dataset.title || 'Untitled Blog',
                    author: readMoreButton.dataset.author || 'Anonymous',
                    date: readMoreButton.dataset.date || '',
                    category: readMoreButton.dataset.category || 'Featured',
                    content: readMoreButton.dataset.content || 'No content available yet.'
                });
            }
        });

        document.addEventListener('click', (event) => {
            if (!event.target.closest('.card-menu')) {
                closeAllCardMenus();
            }
        });
    }

    // If Edit Mode is active, fetch and fill the form
    if (form && editId) {
        try {
            const response = await fetch(`/api/blogs/${editId}`);
            if (response.ok) {
                const blog = await response.json();

                document.getElementById('title').value = blog.title;
                document.getElementById('author').value = blog.author;
                document.getElementById('category').value = blog.category;
                document.getElementById('content').value = blog.content;

                const formHeading = document.querySelector('.form-intro h1');
                const submitButton = form.querySelector('button[type="submit"]');

                if (formHeading) {
                    formHeading.textContent = "Edit Your Story";
                }

                if (submitButton) {
                    submitButton.textContent = "Update Story";
                }
            }
        } catch (error) {
            console.error("Error fetching blog for edit:", error);
        }
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeBlogModal();
        }
    });

    if (form) {
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

            const postData = { title, author, category, content };

            try {
                let response;
                if (editId) {
                    // Update existing blog
                    response = await fetch(`/api/blogs/${editId}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(postData)
                    });
                } else {
                    // Create new blog
                    response = await fetch("/api/blogs", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(postData)
                    });
                }

                if (response.ok) {
                    if (editId) {
                        showToast("✅ Blog updated successfully!", "Success");
                    } else {
                        showToast("Your blog has been published and added to the homepage.", "Blog Published!");
                    }

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
    }
});
const textObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                textObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.2,
        rootMargin: "-50px"
    }
);

document.querySelectorAll(".blur-fade").forEach((element) => {
    textObserver.observe(element);
});