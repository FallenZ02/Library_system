// Logout function
function logout() {
    window.location.href = "index.html";
}

// Update dashboard counters dynamically
function updateBookStats() {
    const books = getBooks();
    const total = books.length;
    const available = books.filter(b => b.status === "Available").length;
    const borrowed = books.filter(b => b.status === "Borrowed").length;

    document.getElementById("totalBooks").textContent = total;
    document.getElementById("availableBooks").textContent = available;
    document.getElementById("borrowedBooks").textContent = borrowed;

    renderBooksChart(); // <-- update chart
}


let booksChart; // Global chart instance

function renderBooksChart() {
    const books = getBooks();
    const available = books.filter(b => b.status === "Available").length;
    const borrowed = books.filter(b => b.status === "Borrowed").length;

    const ctx = document.getElementById("booksChart").getContext("2d");

    if (booksChart) booksChart.destroy();

    booksChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Available", "Borrowed"],
            datasets: [{
                data: [available, borrowed],
                backgroundColor: ["#28a745", "#dc3545"], // green/red
                borderColor: "#ffffff", // white border for style
                borderWidth: 3,
                hoverOffset: 15, // slice pops out slightly on hover
            }]
        },
        options: {
            cutout: "70%", // makes it a thinner, modern doughnut
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        padding: 20,
                        boxWidth: 15,
                        font: { size: 12, weight: "bold" }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw} books`;
                        }
                    }
                }
            }
        }
    });
}


// Initial render on dashboard load
document.addEventListener("DOMContentLoaded", () => {
    updateBookStats();
});

// Listen to localStorage changes (updates from admin_books page)
window.addEventListener("storage", (event) => {
    if (event.key === "libraryBooks") {
        updateBookStats();
    }
});
