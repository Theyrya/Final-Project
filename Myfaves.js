// Import the storedStudios array from yourstudios.js
import { storedStudios } from "./yourstudios.js";

// Array of default studio objects
const defaultStudios = [
    {
        name: "Bow Valley Recording Studio",
        address: "345 - 6 Avenue SE, Calgary, AB T2G 4V1",
        price: "$50 per hour",
        image: "studio1.jpg",
        area: "120 sq. meters",
        type: "Recording Studio",
        capacity: "10 individuals",
        parking: "Yes",
        transport: "Yes",
        availability: "Available",
        rental: "Hourly"
    },
    {
        name: "Modern Art Space",
        address: "321 Art Lane, New York, NY",
        price: "$300 per day",
        image: "studio9.jpg",
        area: "110 sq. meters",
        type: "Art Studio",
        capacity: "6 individuals",
        parking: "No",
        transport: "Yes",
        availability: "Available",
        rental: "Daily"
    }
];

// Combine defaultStudios and storedStudios into a single array
const allStudios = [...defaultStudios, ...storedStudios];

// Function to render studios
function renderStudios(allStudios, containerId) {
    const studioList = document.getElementById(containerId);
    if (studioList) {
        studioList.innerHTML = allStudios.map(studio => `
            <div class="studio" data-name="${studio.name}">
                <img src="${studio.image}" alt="Studio Image">
                <h3>${studio.name}</h3>
                <p><strong>Address:</strong> ${studio.address}</p>
                <p><strong>Area:</strong> ${studio.area}</p>
                <p><strong>Type:</strong> ${studio.type}</p>
                <p><strong>Capacity:</strong> ${studio.capacity}</p>
                <p><strong>Parking:</strong> ${studio.parking}</p>
                <p><strong>Public Transport:</strong> ${studio.transport}</p>
                <p><strong>Availability:</strong> ${studio.availability}</p>
                <p><strong>Rental Term:</strong> ${studio.rental}</p>
                <p><strong>Price:</strong> ${studio.price}</p>
                <button class="fav-btn" onclick="addToFavesFromElement(this)">❤️ Add to My Faves</button>
            </div>
        `).join("");
    }
}
document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("settingsModal");
    const settingsIcon = document.querySelector('a[href="#settings"]');
    const closeBtn = document.querySelector(".close-btn");

    // Ensure modal is hidden on page load
    modal.style.display = "none";

    // Function to open the modal
    function openModal(event) {
        event.preventDefault(); // Prevent default link behavior
        modal.style.display = "flex"; // Show the modal
    }

    // Function to close the modal
    function closeModal() {
        modal.style.display = "none"; // Hide the modal
    }

    // Event listener for settings icon
    if (settingsIcon) {
        settingsIcon.addEventListener("click", openModal);
    }

    // Event listener for close button
    if (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
    }

    // Close modal when clicking outside of it
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });
});

// Function to filter studios based on search input
function filterStudios(searchTerm) {
    const terms = searchTerm.toLowerCase().split(" ").filter(t => t); // Split search term into words
    const filteredStudios = allStudios.filter(studio => {
        const dataString = `${studio.name} ${studio.type} ${studio.address} ${studio.availability}`.toLowerCase();
        return terms.every(term => dataString.includes(term)); // Check if all terms are present
    });
    renderStudios(filteredStudios, "studioList");
}

// Function to sort studios
function sortStudios(criteria) {
    let sortedStudios = [...allStudios];

    switch (criteria) {
        case "price":
            sortedStudios.sort((a, b) => parseInt(a.price.replace(/\D/g, '')) - parseInt(b.price.replace(/\D/g, '')));
            break;
        case "capacity":
            sortedStudios.sort((a, b) => parseInt(a.capacity) - parseInt(b.capacity));
            break;
        default:
            break;
    }

    renderStudios(sortedStudios, "studioList");
}

// Function to show a blinking notification
function showNotification(message) {
    const notification = document.getElementById("notification");

    // Show notification with updated message
    notification.style.display = "block";
    notification.style.opacity = "1";
    notification.textContent = message;

    // Clear previous timeout to prevent flickering issues
    if (notification.timeout) {
        clearTimeout(notification.timeout);
    }

    // Hide after 2 seconds
    notification.timeout = setTimeout(() => {
        notification.style.opacity = "0";
        setTimeout(() => {
            notification.style.display = "none";
        }, 500);
    }, 2000);
}

// Function to add a studio to favorites
function addToFavesFromElement(button) {
    const studioDiv = button.closest('.studio');
    const studioName = studioDiv.getAttribute("data-name");

    // Find the studio object from the allStudios array
    const studio = allStudios.find(s => s.name === studioName);

    if (!studio) return;

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    // Check if the studio is already in favorites
    const isAlreadyAdded = favorites.some(fav => fav.name === studio.name);
    if (!isAlreadyAdded) {
        favorites.push(studio); // Store the full studio object
        localStorage.setItem("favorites", JSON.stringify(favorites));
        showNotification("✅ Added to My Faves!");
    } else {
        showNotification("⚠️ This studio is already in your favorites!");
    }
}

// Function to remove a studio from favorites
function removeFromFaves(name) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    const updatedFavorites = favorites.filter(fav => fav.name !== name);

    if (updatedFavorites.length < favorites.length) {
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
        showNotification("❌ Removed from My Faves!");
        displayFavorites();
    }
}

// Function to display favorite studios on Myfaves.html
function displayFavorites() {
    const favoritesContainer = document.getElementById("favoritesContainer");
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.length === 0) {
        favoritesContainer.innerHTML = "<p>No favorites added yet.</p>";
    } else {
        favoritesContainer.innerHTML = favorites.map(studio => `
            <div class="favorite-studio">
                <img src="${studio.image}" alt="Studio Image">
                <h3>${studio.name}</h3>
                <p><strong>Address:</strong> ${studio.address}</p>
                <p><strong>Area:</strong> ${studio.area}</p>
                <p><strong>Type:</strong> ${studio.type}</p>
                <p><strong>Capacity:</strong> ${studio.capacity}</p>
                <p><strong>Parking:</strong> ${studio.parking}</p>
                <p><strong>Public Transport:</strong> ${studio.transport}</p>
                <p><strong>Availability:</strong> ${studio.availability}</p>
                <p><strong>Rental Term:</strong> ${studio.rental}</p>
                <p><strong>Price:</strong> ${studio.price}</p>
                <button class="remove-btn" onclick="removeFromFaves('${studio.name}')">❌ Remove</button>
                <button class="book-btn" onclick="BookNow('${studio.name}')">Book</button>
            </div>
        `).join("");
    }
}

// Function to book a studio
function BookNow(studioName) {
    const studio = allStudios.find(s => s.name === studioName);
    if (!studio) return;

    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    if (bookings.some(b => b.name === studio.name)) {
        showNotification("⚠️ This studio is already booked!");
        return;
    }

    bookings.push(studio);
    localStorage.setItem("bookings", JSON.stringify(bookings));
    showNotification("✅ Studio booked successfully!");
}

// Function to display bookings
function displayBookings() {
    const bookingsContainer = document.getElementById("bookingsContainer");
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    if (bookings.length === 0) {
        bookingsContainer.innerHTML = "<p>No bookings made yet.</p>";
    } else {
        bookingsContainer.innerHTML = bookings.map(studio => `
            <div class="booked-studio">
                <img src="${studio.image}" alt="Studio Image">
                <h3>${studio.name}</h3>
                <p><strong>Address:</strong> ${studio.address}</p>
                <p><strong>Type:</strong> ${studio.type}</p>
                <p><strong>Rental Term:</strong> ${studio.rental}</p>
                <p><strong>Price:</strong> ${studio.price}</p>
                <button class="remove-btn" onclick="cancelBooking('${studio.name}')">❌ Cancel Booking</button>
            </div>
        `).join("");
    }
}

// Function to cancel a booking
function cancelBooking(name) {
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const updatedBookings = bookings.filter(studio => studio.name !== name);

    if (updatedBookings.length < bookings.length) {
        localStorage.setItem("bookings", JSON.stringify(updatedBookings));
        showNotification("❌ Booking canceled!");
        displayBookings();
    }
}

// Event listeners for home.html
document.addEventListener("DOMContentLoaded", function () {
    const searchBox = document.getElementById("searchBox");
    const sortOptions = document.getElementById("sortOptions");

    if (searchBox) {
        searchBox.addEventListener("input", (event) => {
            const searchTerm = event.target.value.trim();
            filterStudios(searchTerm);
        });
    }

    if (sortOptions) {
        sortOptions.addEventListener("change", function () {
            sortStudios(this.value);
        });
    }

    // Render studios on home.html
    if (window.location.pathname.includes("home.html")) {
        renderStudios(allStudios, "studioList");
    }

    // Display favorites on Myfaves.html
    if (window.location.pathname.includes("Myfaves.html")) {
        displayFavorites();
    }

    // Display bookings on Mybook.html
    if (window.location.pathname.includes("Mybook.html")) {
        displayBookings();
    }
});