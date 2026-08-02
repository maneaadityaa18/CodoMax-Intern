## PostHub — Full-Stack Blogging App

A simple blog platform built with Node.js, Express, MongoDB, and vanilla HTML/CSS/JavaScript. It includes a modern landing page, blog list, create/edit form, and full CRUD support via a REST API.

---

## Key Features

- Home page with latest blog cards
- All blogs page for full blog listing
- Add blog page with publish form
- Edit blog support via `editId` query parameter
- Delete blog from card action menu
- Read More modal for full post content
- Toast notifications for operations
- Responsive UI with modern card layout
- Inline SVG favicon support

---

## Tech Stack

- Node.js / Express
- MongoDB / Mongoose
- Helmet for security headers
- CORS support
- Vanilla JS frontend
- CSS styling in style.css

---

## Project Structure

- server.js — Express server, page routes, REST API, MongoDB connection, initial seeding
- package.json — project scripts and dependencies
- blog.js — Mongoose schema for blog posts
- style.css — site styling
- scirpt.js — frontend logic for fetching, rendering, modal, edit/delete, toast, animations
- index.html — home page
- blogs.html — all blogs page
- addblog.html — create/edit blog page
- about.html — about page

---

## Setup

1. Install Node.js
2. Install MongoDB and ensure it is running
3. From project root:

```bash
npm install
```

---

## Run Locally

```bash
npm start
```

Default server: `http://localhost:3000`

---

## Environment

- `MONGODB_URI` — optional MongoDB connection string
- Default fallback: `mongodb://127.0.0.1:27017/codomax_blog`

---

## Server Routes

- `GET /` — serve index.html
- `GET /add-blog` — serve addblog.html
- `GET /blogs` and `GET /blogs.html` — serve blogs.html
- `GET /api/health` — health check
- `GET /api/blogs` — fetch all blogs, supports query `?limit=NUMBER`
- `GET /api/blogs/:id` — fetch a single blog
- `POST /api/blogs` — create a new blog
- `PUT /api/blogs/:id` — update a blog
- `DELETE /api/blogs/:id` — delete a blog

---

## Blog Schema

blog.js defines:

- `title` — required
- `author` — required
- `category`
- `content` — required
- `createdAt` — defaults to current date/time

---

## Frontend Behavior

- scirpt.js
  - fetches blogs from `/api/blogs`
  - renders cards in `#blogCards` and `#allBlogCards`
  - supports edit and delete actions
  - opens a modal for `Read More`
  - handles form submission on addblog.html
  - connects edit mode via `?editId=<blogId>`

- index.html
  - hero section
  - latest blogs preview
  - view more button links to all blogs

- blogs.html
  - lists all blogs
  - includes interactive card menu

- addblog.html
  - blog creation form
  - edit mode populates fields from API

---

## Notes

- The app seeds a default blog post if the database is empty
- Static assets are served from:
  - public
  - `/css`
  - `/js`
- package.json includes:
  - `start` → `node server.js`

---

## How to Use

1. Open `http://localhost:3000`
2. Publish a new story via `Write your own`
3. View all blogs at blogs.html
4. Use card menu to edit or delete posts
5. Click `Read More` to open the modal

---

## Improvements You Can Add

- validation and better error handling on the frontend
- pagination for blog list
- user authentication
- richer blog editor
- search and filter by category

---

This README is based on the current project files and routes found in the repository.