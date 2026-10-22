
const form = document.getElementById("note-form");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const formHeading = document.getElementById("form-heading");
const notesList = document.getElementById("notes-list");
const status = document.getElementById("status");
const refreshBtn = document.getElementById("refresh-btn");

let editingId = null;

function showStatus(message) {
    status.textContent = message;
}

function resetForm() {
    editingId = null;
    form.reset();
    formHeading.textContent = "Create a Note";
    submitBtn.textContent = "Save Note";
    cancelBtn.hidden = true;
}

async function loadNotes() {
    notesList.replaceChildren();

    const loading = document.createElement("p");
    loading.className = "empty-state";
    loading.textContent = "Loading your notes...";
    notesList.appendChild(loading);

    try {
        const response = await fetch("/api/notes");

        if (!response.ok) {
            throw new Error("Could not load notes.");
        }

        const notes = await response.json();
        notesList.replaceChildren();

        if (notes.length === 0) {
            const empty = document.createElement("p");
            empty.className = "empty-state";
            empty.textContent = "No notes yet. Create your first note above.";
            notesList.appendChild(empty);
            return;
        }

        notes.forEach((note) => {
            const card = document.createElement("article");
            card.className = "note-card";

            const heading = document.createElement("h3");
            heading.textContent = note.title;

            const content = document.createElement("p");
            content.textContent = note.content;

            const date = document.createElement("p");
            date.className = "note-date";
            date.textContent = `Created: ${new Date(note.created_at).toLocaleString()}`;

            const actions = document.createElement("div");
            actions.className = "note-actions";

            const editBtn = document.createElement("button");
            editBtn.type = "button";
            editBtn.className = "secondary";
            editBtn.textContent = "Edit";

            editBtn.addEventListener("click", () => {
                editingId = note.id;
                titleInput.value = note.title;
                contentInput.value = note.content;
                formHeading.textContent = "Edit Note";
                submitBtn.textContent = "Update Note";
                cancelBtn.hidden = false;
                titleInput.focus();
                showStatus(`Editing note #${note.id}`);
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.type = "button";
            deleteBtn.className = "danger";
            deleteBtn.textContent = "Delete";

            deleteBtn.addEventListener("click", async () => {
                if (!confirm(`Delete "${note.title}"? This cannot be undone.`)) {
                    return;
                }

                deleteBtn.disabled = true;

                try {
                    const response = await fetch(`/api/notes/${note.id}`, {
                        method: "DELETE"
                    });

                    if (!response.ok) {
                        throw new Error("Could not delete this note.");
                    }

                    if (editingId === note.id) {
                        resetForm();
                    }

                    showStatus("Note deleted successfully.");
                    await loadNotes();
                } catch (error) {
                    showStatus(error.message);
                    deleteBtn.disabled = false;
                }
            });

            actions.append(editBtn, deleteBtn);
            card.append(heading, content, date, actions);
            notesList.appendChild(card);
        });
    } catch (error) {
        notesList.replaceChildren();

        const message = document.createElement("p");
        message.className = "empty-state";
        message.textContent = "Unable to load notes. Check your connection and try refreshing.";
        notesList.appendChild(message);

        showStatus(error.message);
    }
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {
        showStatus("Please enter both a title and content.");
        return;
    }

    submitBtn.disabled = true;
    showStatus(editingId === null ? "Saving note..." : "Updating note...");

    try {
        const url = editingId === null
            ? "/api/notes"
            : `/api/notes/${editingId}`;

        const method = editingId === null ? "POST" : "PUT";

        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, content })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "The operation failed.");
        }

        showStatus(editingId === null
            ? "Note created successfully."
            : "Note updated successfully.");

        resetForm();
        await loadNotes();
    } catch (error) {
        showStatus(error.message);
    } finally {
        submitBtn.disabled = false;
    }
});

cancelBtn.addEventListener("click", () => {
    resetForm();
    showStatus("Editing cancelled.");
});

refreshBtn.addEventListener("click", loadNotes);

loadNotes();
