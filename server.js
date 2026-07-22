const express = require("express");
const path = require("path");

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

// Temporary database
let blogs = [];

// Home Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Add Blog Page
app.get("/add-blog", (req, res) => {
    res.sendFile(path.join(__dirname, "add-blog.html"));
});

// Get All Blogs API
app.get("/blogs", (req, res) => {
    res.json(blogs);
});

// Add Blog API
app.post("/blogs", (req, res) => {

    const { title, author, category, content } = req.body;

    const newBlog = {
        id: Date.now(),
        title,
        author,
        category,
        content
    };

    blogs.push(newBlog);

    res.status(201).json({
        message: "Blog Added Successfully",
        blog: newBlog
    });

});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});