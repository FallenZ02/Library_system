// ===========================
// Local Storage Keys
// ===========================
const BOOKS_KEY = "libraryBooks";      // existing books key
const HISTORY_KEY = "libraryHistory";  // new history key

// ===========================
// Get & Save Functions
// ===========================
function getBooks() {
    let books = JSON.parse(localStorage.getItem(BOOKS_KEY));
    if (!books) {
        books = [
            { title: "Atomic Habits", author: "James Clear", status: "Available" },
            { title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", status: "Available" },
            { title: "The Pragmatic Programmer", author: "Andrew Hunt", status: "Available" }
        ];
        localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
    }
    return books;
}

function saveBooks(books) {
    localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
}

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

// ===========================
// Borrow Book Function
// ===========================
function borrowBook(index, borrowerName) {
    const books = getBooks();
    const book = books[index];

    if (book.status !== "Available") {
        alert("Book is already borrowed!");
        return;
    }

    book.status = "Borrowed";
    saveBooks(books);

    // Add to history
    const history = getHistory();
    history.push({
        title: book.title,
        author: book.author,
        action: "Borrowed",
        by: borrowerName || "Unknown",
        date: new Date().toLocaleString()
    });
    saveHistory(history);

    renderBooks();       // if on admin_books page
    renderHistory();     // if on admin_history page
}

// ===========================
// Return Book Function
// ===========================
function returnBook(index, borrowerName) {
    const books = getBooks();
    const book = books[index];

    if (book.status !== "Borrowed") {
        alert("Book is not borrowed!");
        return;
    }

    book.status = "Available";
    saveBooks(books);

    // Add to history
    const history = getHistory();
    history.push({
        title: book.title,
        author: book.author,
        action: "Returned",
        by: borrowerName || "Unknown",
        date: new Date().toLocaleString()
    });
    saveHistory(history);

    renderBooks();
    renderHistory();
}

// ===========================
// Render History Table
// ===========================
function renderHistory() {
    const tbody = document.querySelector("#historyTable tbody");
    if (!tbody) return;

    const history = getHistory();
    tbody.innerHTML = "";

    history.forEach((entry, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.title}</td>
            <td>${entry.author}</td>
            <td>${entry.action}</td>
            <td>${entry.by}</td>
            <td>${entry.date}</td>
        `;
        tbody.appendChild(tr);
    });
}

// ===========================
// Initial Render
// ===========================
document.addEventListener("DOMContentLoaded", () => {
    renderHistory();
});
