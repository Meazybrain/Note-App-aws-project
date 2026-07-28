const express = require("express");

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static("public"));

// API Route
app.get("/api", (req, res) => {
    res.json({
        message: "Hello Meazy! Your API is working perfectly!"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
