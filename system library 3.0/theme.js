// Simple theme toggle - no conflicts
(function() {
    // Apply saved theme immediately (before DOM loads to prevent flash)
    const savedTheme = localStorage.getItem("adminTheme") || "light";
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Wait for DOM to be ready
    window.addEventListener('DOMContentLoaded', function() {
        const themeButton = document.getElementById("themeToggle");
        const themeIcon = document.getElementById("themeIcon");
        
        // Apply initial theme
        applyTheme(savedTheme);
        
        // Add click handler if button exists
        if (themeButton) {
            themeButton.addEventListener("click", function() {
                const currentTheme = document.body.classList.contains("dark-mode") ? "dark" : "light";
                const newTheme = currentTheme === "dark" ? "light" : "dark";
                applyTheme(newTheme);
            });
        }
    });
    
    function applyTheme(theme) {
        const body = document.body;
        const icon = document.getElementById("themeIcon");
        
        if (theme === "dark") {
            body.classList.remove("light-mode");
            body.classList.add("dark-mode");
            if (icon) icon.className = "bi bi-sun-fill fs-5";
        } else {
            body.classList.remove("dark-mode");
            body.classList.add("light-mode");
            if (icon) icon.className = "bi bi-moon-fill fs-5";
        }
        
        // Save preference
        localStorage.setItem("adminTheme", theme);
    }
})();