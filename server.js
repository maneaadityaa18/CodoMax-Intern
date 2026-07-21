const express = require("express");
// Create an instance of the Express application(imports express library and creates an instance of the Express application)

const app = express(); //creates express application instance

app.get("/", (req, res) => {
    res.send("Hello World! Day 1 as a CODO Max Intern"); // creates a route for the root URL ("/") that responds with "Hello World!" when accessed
});

app.listen(3000, () => {
    console.log("🚀 Server is running on http://localhost:3000");
}); // starts the server and listens on port 3000, logging a message to the console when the server is running