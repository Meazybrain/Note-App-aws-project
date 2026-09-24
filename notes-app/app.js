require("dotenv").config();

const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test API route
app.get("/api", (req, res) => {
  res.json({
    message: "Hello Meazy! Your API is working perfectly!"
  });
});

// Get all notes
app.get("/api/notes", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM notes ORDER BY created_at DESC"
    );

    res.json(rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      error: "Failed to fetch notes"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
