const express = require("express");
const path = require("path");
const mongoose = require('mongoose');
const Blog = require('./models/blog');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/css", express.static(path.join(__dirname, "public", "css")));
app.use("/js", express.static(path.join(__dirname, "public", "js")));
app.use(express.static(path.join(__dirname)));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Blog API is running' });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/add-blog", (req, res) => {
    res.sendFile(path.join(__dirname, "addblog.html"));
});

app.get('/api/blogs/:id', (req, res) => {
    Blog.findById(req.params.id)
        .then(blog => {
            if (!blog) return res.status(404).json({ error: 'Blog not found' });
            res.json(blog);
        })
        .catch(err => res.status(500).json({ error: 'Failed to fetch blog', details: err.message }));
});

app.get('/api/blogs', (req, res) => {
    const limit = parseInt(req.query.limit, 10);
    const query = Blog.find().sort({ createdAt: -1 });

    if (!Number.isNaN(limit) && limit > 0) {
        query.limit(limit);
    }

    query.then(blogs => res.json(blogs))
        .catch(err => res.status(500).json({ error: 'Failed to fetch blogs', details: err.message }));
});

app.post('/api/blogs', (req, res) => {
    const { title, author, category, content } = req.body;

    if (!title || !author || !category || !content) {
        return res.status(400).json({ error: 'Please provide title, author, category, and content' });
    }

    Blog.create({ title, author, category, content })
        .then(blog => res.status(201).json({ message: 'Blog Added Successfully', blog }))
        .catch(err => res.status(400).json({ error: 'Failed to create blog', details: err.message }));
});

app.put('/api/blogs/:id', (req, res) => {
    const { title, author, category, content } = req.body;

    Blog.findByIdAndUpdate(req.params.id, { title, author, category, content }, { returnDocument: 'after' })
        .then(blog => {
            if (!blog) return res.status(404).json({ error: 'Blog not found' });
            res.json({ message: 'Blog Updated Successfully', blog });
        })
        .catch(err => res.status(400).json({ error: 'Failed to update blog', details: err.message }));
});

app.delete('/api/blogs/:id', (req, res) => {
    Blog.findByIdAndDelete(req.params.id)
        .then(blog => {
            if (!blog) return res.status(404).json({ error: 'Blog not found' });
            res.json({ message: 'Blog Deleted Successfully' });
        })
        .catch(err => res.status(500).json({ error: 'Failed to delete blog', details: err.message }));
});



app.get('/blogs', (req, res) => {
    res.sendFile(path.join(__dirname, 'blogs.html'));
});

app.get('/blogs.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'blogs.html'));
});

app.post("/blogs", (req, res) => {

    const { title, author, category, content } = req.body;

    Blog.create({ title, author, category, content })
        .then(blog => res.status(201).json({ message: 'Blog Added Successfully', blog }))
        .catch(err => res.status(400).json({ error: 'Failed to create blog', details: err.message }));

});

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/codomax_blog';

mongoose.connect(MONGODB_URI)
    .then(async () => {
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