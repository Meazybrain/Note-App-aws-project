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

// Create a new note
app.post("/api/notes", async (req, res) => {
  const { title, content } = req.body;

  if (
    typeof title !== "string" ||
    typeof content !== "string" ||
    !title.trim() ||
    !content.trim()
  ) {
    return res.status(400).json({
      error: "Title and content are required"
    });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO notes (title, content) VALUES (?, ?)",
      [title.trim(), content.trim()]
    );

    res.status(201).json({
      message: "Note created successfully",
      id: result.insertId,
      title: title.trim(),
      content: content.trim()
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      error: "Failed to create note"
    });
  }
});


// Update an existing note
app.put("/api/notes/:id", async (req, res) => {
  const { title, content } = req.body;
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({
      error: "Invalid note ID"
    });
  }

  if (
    typeof title !== "string" ||
    typeof content !== "string" ||
    !title.trim() ||
    !content.trim()
  ) {
    return res.status(400).json({
      error: "Title and content are required"
    });
  }

  try {
    const [result] = await db.query(
      "UPDATE notes SET title = ?, content = ? WHERE id = ?",
      [title.trim(), content.trim(), id]
    );

    if (result.affectedRows === 0) {
      const [rows] = await db.query(
        "SELECT id FROM notes WHERE id = ?",
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          error: "Note not found"
        });
      }
    }

    res.json({
      message: "Note updated successfully",
      id,
      title: title.trim(),
      content: content.trim()
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      error: "Failed to update note"
    });
  }
});


// Delete an existing note
app.delete("/api/notes/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({
      error: "Invalid note ID"
    });
  }

  try {
    const [result] = await db.query(
      "DELETE FROM notes WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Note not found"
      });
    }

    res.json({
      message: "Note deleted successfully",
      id
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      error: "Failed to delete note"
    });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
