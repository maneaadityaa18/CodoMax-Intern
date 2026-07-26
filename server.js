const express = require("express");
const path = require("path");
const mongoose = require('mongoose');
const Blog = require('./models/blog');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the project root and public folder
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/css", express.static(path.join(__dirname, "public", "css")));
app.use("/js", express.static(path.join(__dirname, "public", "js")));
app.use(express.static(path.join(__dirname)));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Blog API is running' });
});

// Home Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Add Blog Page
app.get("/add-blog", (req, res) => {
    res.sendFile(path.join(__dirname, "add-blog.html"));
});

// API: Get all blogs (JSON)
app.get('/api/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
        .then(blogs => res.json(blogs))
        .catch(err => res.status(500).json({ error: 'Failed to fetch blogs', details: err.message }));
});

// API: Create a new blog (JSON)
app.post('/api/blogs', (req, res) => {
    const { title, author, category, content } = req.body;

    if (!title || !author || !category || !content) {
        return res.status(400).json({ error: 'Please provide title, author, category, and content' });
    }

    Blog.create({ title, author, category, content })
        .then(blog => res.status(201).json({ message: 'Blog Added Successfully', blog }))
        .catch(err => res.status(400).json({ error: 'Failed to create blog', details: err.message }));
});

// Get All Blogs API
app.get("/blogs", (req, res) => {
    Blog.find().sort({ createdAt: -1 })
        .then(blogs => res.json(blogs))
        .catch(err => res.status(500).json({ error: 'Failed to fetch blogs', details: err.message }));
});

// Add Blog API
app.post("/blogs", (req, res) => {

    const { title, author, category, content } = req.body;

    Blog.create({ title, author, category, content })
        .then(blog => res.status(201).json({ message: 'Blog Added Successfully', blog }))
        .catch(err => res.status(400).json({ error: 'Failed to create blog', details: err.message }));

});

// Connect to MongoDB and start server
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/codomax_blog';

mongoose.connect(MONGODB_URI)
    .then(async () => {
        // Create initial blog if none exists
        try {
            const count = await Blog.countDocuments();
            if (count === 0) {
                await Blog.create({
                    title: 'First Blog',
                    author: 'Admin',
                    category: 'General',
                    content: 'This is the first blog kindly ignore it.'
                });
            }
        } catch (err) {
            console.error('Error initializing first blog:', err.message);
        }

        app.listen(PORT, () => {
            console.log('MongoDB Connected  Server running on http://localhost:3000');
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    });