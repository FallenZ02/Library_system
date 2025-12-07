// books.js

// LocalStorage key
const STORAGE_KEY = "libraryBooks";

// Get books from localStorage (initialize defaults if empty)
function getBooks() {
    let books = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!books) {
        books = [
            { title: "Atomic Habits", author: "James Clear", status: "Available" },
            { title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", status: "Available" },
            { title: "The Pragmatic Programmer", author: "Andrew Hunt", status: "Available" }
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    }
    return books;
}

// Save books to localStorage
function saveBooks(books) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}
