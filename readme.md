# PostHub — Full-Stack Blogging Platform

A modern full-stack blogging platform built using **Node.js, Express.js, MongoDB Atlas, and Vanilla JavaScript**. Users can create, edit, delete, and explore blog posts through a clean, responsive interface powered by a RESTful API.

## Live Demo

[https://posthub-4ah7.onrender.com/](https://posthub-4ah7.onrender.com/)

---

# Features

* Modern landing page
* Create new blog posts
* Read full blogs in a modal
* Edit existing blogs
* Delete blogs
* Categorized blog cards
* Latest blogs section
* Toast notifications
* Responsive user interface
* Helmet security middleware
* CORS enabled
* MongoDB Atlas cloud database
* Deployed on Render

---

# Tech Stack

### Frontend

* HTML5
* CSS3
* Vanilla JavaScript

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

### Deployment

* Render

### Other Packages

* Helmet
* CORS

---

# Installation

Clone the repository

```bash
git clone https://github.com/maneaadityaa18/CodoMax-Intern.git
```

Move into the project

```bash
cd CodoMax-Intern
```

Install dependencies

```bash
npm install
```

Start the server

```bash
npm start
```

The application runs at:

```text
http://localhost:3000
```

---

# Environment Variables

Create a `.env` file and add:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

If `MONGODB_URI` is not provided, the project uses a local MongoDB instance.

---

# API Endpoints

| Method | Endpoint         | Description         |
| ------ | ---------------- | ------------------- |
| GET    | `/api/health`    | Health check        |
| GET    | `/api/blogs`     | Fetch all blogs     |
| GET    | `/api/blogs/:id` | Fetch a single blog |
| POST   | `/api/blogs`     | Create a new blog   |
| PUT    | `/api/blogs/:id` | Update a blog       |
| DELETE | `/api/blogs/:id` | Delete a blog       |

---
# Frontend Functionality

* Fetches blogs from the REST API
* Displays latest blogs on the homepage
* Displays all blogs on the Blogs page
* Creates new blog posts
* Updates existing blog posts
* Deletes blog posts
* Opens blog content in a Read More modal
* Displays toast notifications for user actions
* Dynamically renders blog cards using the Fetch API

---

# Security

* Helmet middleware for HTTP security headers
* CORS configuration
* Server-side validation
* RESTful API architecture

---

# Deployment

* Backend hosted on Render
* Database hosted on MongoDB Atlas

---

# Future Scope

* Image upload support for blog posts
* Mobile-first responsive design improvements
* User authentication and authorization
* Rich text editor for blog writing
* Search and filter by title or category
* Pagination for large numbers of blog posts
* Tags and categories management
* Like, comment, and bookmark functionality
* User profiles and personal dashboards
* Social media sharing
* Email notifications
* Performance optimization through lazy loading and caching

---

# Author

**Aditya Mane**

GitHub: [https://github.com/maneaadityaa18](https://github.com/maneaadityaa18)

---

# License

This project was developed as part of the **CodoMax Digital Solutions Full Stack Web Development Internship** and is intended for educational and portfolio purposes.

This version is cleaner and closer to what you'll typically see on professional GitHub repositories.
