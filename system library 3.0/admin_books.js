// admin_books.js

// Logout function
function logout() {
    window.location.href = "index.html";
}

// ===========================
// History Integration
// ===========================
const HISTORY_KEY = "libraryHistory";

function getHistory() {
    let history = JSON.parse(localStorage.getItem(HISTORY_KEY));
    if (!history) {
        history = [];
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }
    return history;
}

function saveHistory(history) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function logToHistory(book, action, borrower = "Admin") {
    const history = getHistory();
    history.push({
        title: book.title,
        author: book.author,
        action: action,
        by: borrower,
        date: new Date().toLocaleString()
    });
    saveHistory(history);
}

// ===========================
// Render Books
// ===========================
function renderBooks(searchText = "", statusFilter = "All") {
    const tbody = document.querySelector("#booksTable tbody");
    if (!tbody) return;

    const books = getBooks();
    tbody.innerHTML = "";

    // Filter books
    const filteredBooks = books.filter(book => {
        const matchesSearch =
            book.title.toLowerCase().includes(searchText) ||
            book.author.toLowerCase().includes(searchText);
        const matchesStatus = statusFilter === "All" || book.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    filteredBooks.forEach((book, index) => {
        const originalIndex = books.indexOf(book);
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.status}</td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick="editBook(${originalIndex})">
                    <i class="bi bi-pencil-square"></i> Edit
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteBook(${originalIndex})">
                    <i class="bi bi-trash"></i> Delete
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    if (typeof updateBookStats === 'function') {
        updateBookStats();
    }
}

// ===========================
// Add Book
// ===========================
document.getElementById("addBookForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const title = document.getElementById("bookTitle").value.trim();
    const author = document.getElementById("bookAuthor").value.trim();
    const status = document.getElementById("bookStatus").value || "Available";

    if (!title || !author) return;

    const books = getBooks();

    // Prevent duplicate
    if (books.some(b => b.title.toLowerCase() === title.toLowerCase() && b.author.toLowerCase() === author.toLowerCase())) {
        alert("This book already exists!");
        return;
    }

    books.push({ title, author, status });
    saveBooks(books);
    renderBooks();
    this.reset();
});

// ===========================
// Edit Book (with History)
// ===========================
function editBook(index) {
    const books = getBooks();
    const book = books[index];
    const oldStatus = book.status;

    const newTitle = prompt("Edit Title:", book.title);
    if (!newTitle) return;

    const newAuthor = prompt("Edit Author:", book.author);
    if (!newAuthor) return;

    const newStatus = prompt("Edit Status (Available/Borrowed):", book.status);
    if (!newStatus) return;

    // Update book
    books[index] = { title: newTitle, author: newAuthor, status: newStatus };
    saveBooks(books);

    // Log to history if status changed
    if (oldStatus !== newStatus) {
        if (newStatus === "Borrowed") {
            const borrower = prompt("Who borrowed this book?", "Unknown");
            logToHistory(books[index], "Borrowed", borrower || "Unknown");
        } else if (newStatus === "Available") {
            const borrower = prompt("Who returned this book?", "Unknown");
            logToHistory(books[index], "Returned", borrower || "Unknown");
        }
    }

    renderBooks();
}

// ===========================
// Delete Book
// ===========================
function deleteBook(index) {
    const books = getBooks();
    if (confirm(`Are you sure you want to delete "${books[index].title}"?`)) {
        books.splice(index, 1);
        saveBooks(books);
        renderBooks();
    }
}

// ===========================
// Filter & Search
// ===========================
document.getElementById("applyFilter").addEventListener("click", () => {
    const searchText = document.getElementById("searchInput").value.trim().toLowerCase();
    const statusFilter = document.getElementById("statusFilter").value;
    renderBooks(searchText, statusFilter);
});

// ===========================
// Initial Render
// ===========================
document.addEventListener("DOMContentLoaded", () => {
    renderBooks();
});

// Listen to localStorage changes from other tabs
window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) renderBooks();
});