const MEMBERS_KEY = "libraryMembers";

// Get members from localStorage (initialize default if empty)
function getMembers() {
    let members = JSON.parse(localStorage.getItem(MEMBERS_KEY));
    if (!members) {
        members = [
            { name: "John Doe", email: "john@example.com", role: "Student" },
            { name: "Jane Smith", email: "jane@example.com", role: "Teacher" }
        ];
        localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
    }
    return members;
}

// Save members to localStorage
function saveMembers(members) {
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
    renderMembers();
}

// Logout
function logout() {
    window.location.href = "index.html";
}

// Render members table
function renderMembers() {
    const tbody = document.querySelector("#membersTable tbody");
    const members = getMembers();
    tbody.innerHTML = "";

    members.forEach((member, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${member.name}</td>
            <td>${member.email}</td>
            <td>${member.role}</td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick="editMember(${index})">
                    <i class="bi bi-pencil-square"></i> Edit
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteMember(${index})">
                    <i class="bi bi-trash"></i> Delete
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Add Member
document.getElementById("addMemberForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("memberName").value.trim();
    const email = document.getElementById("memberEmail").value.trim();
    const role = document.getElementById("memberRole").value.trim() || "Student";

    if (!name || !email) return;

    const members = getMembers();

    // Check for duplicate email
    if (members.some(m => m.email.toLowerCase() === email.toLowerCase())) {
        alert("This email is already registered!");
        return;
    }

    members.push({ name, email, role });
    saveMembers(members);
    this.reset();
});

// Edit Member
function editMember(index) {
    const members = getMembers();
    const member = members[index];

    const newName = prompt("Edit Full Name:", member.name);
    if (!newName) return;

    const newEmail = prompt("Edit Email:", member.email);
    if (!newEmail) return;

    const newRole = prompt("Edit Role:", member.role);
    if (!newRole) return;

    members[index] = { name: newName, email: newEmail, role: newRole };
    saveMembers(members);
}

// Delete Member
function deleteMember(index) {
    const members = getMembers();
    if (confirm(`Are you sure you want to delete "${members[index].name}"?`)) {
        members.splice(index, 1);
        saveMembers(members);
    }
}

// Initial render
document.addEventListener("DOMContentLoaded", renderMembers);
