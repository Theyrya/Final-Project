document.getElementById("settings-form").addEventListener("submit", function(event) {
    event.preventDefault();

    // Get form data
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const theme = document.getElementById("theme").value;

    // Basic validation
    if (username.trim() === "" || email.trim() === "") {
        displayMessage("Please fill in all fields.", "error");
        return;
    }

    // Simulate saving data (for example, via an API)
    setTimeout(() => {
        // Simulating a success response
        displayMessage("Settings updated successfully!", "success");
    }, 500);
});

// Show success or error messages
function displayMessage(message, type) {
    const messageElement = document.getElementById("message");
    messageElement.textContent = message;
    if (type === "success") {
        messageElement.style.color = "green";
    } else {
        messageElement.style.color = "red";
    }
}

// Handle Account Management Buttons
document.getElementById("change-email").addEventListener("click", function() {
    displayMessage("Email change is not implemented yet.", "info");
});
document.getElementById("change-username").addEventListener("click", function() {
    displayMessage("Username change is not implemented yet.", "info");
});

// Handle Help Section Buttons
document.getElementById("help-btn").addEventListener("click", function() {
    displayMessage("Contacting support is not implemented yet.", "info");
});
document.getElementById("faq-btn").addEventListener("click", function() {
    displayMessage("Redirecting to FAQ is not implemented yet.", "info");
});

// Handle Log Out/Delete Account Buttons
document.getElementById("logout-btn").addEventListener("click", function() {
    displayMessage("Log out feature is not implemented yet.", "info");
});
document.getElementById("delete-account-btn").addEventListener("click", function() {
    const confirmation = confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (confirmation) {
        displayMessage("Account deletion is not implemented yet.", "info");
    }
});
