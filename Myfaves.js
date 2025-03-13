// Array of studio objects
const studios = [
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
        name: "Urban Art Loft",
        address: "123 Main St, Vancouver, BC",
        price: "$120 per day",
        image: "studio2.jpg",
        area: "85 sq. meters",
        type: "Art Studio",
        capacity: "5 individuals",
        parking: "No",
        transport: "Yes",
        availability: "Not Available",
        rental: "Daily"
    },
    {
        name: "Creative Dance Hub",
        address: "789 Dance Ave, Toronto, ON",
        price: "$700 per week",
        image: "studio3.jpg",
        area: "150 sq. meters",
        type: "Dance Studio",
        capacity: "20 individuals",
        parking: "Yes",
        transport: "Yes",
        availability: "Available",
        rental: "Weekly"
    },
    {
        name: "Downtown Music Haven",
        address: "555 Sound St, Montreal, QC",
        price: "$2500 per month",
        image: "studio4.jpg",
        area: "100 sq. meters",
        type: "Rehearsal Space",
        capacity: "15 individuals",
        parking: "No",
        transport: "Yes",
        availability: "Available",
        rental: "Monthly"
    },
    {
        name: "Film Production Hub",
        address: "910 Movie Blvd, Edmonton, AB",
        price: "$500 per day",
        image: "studio5.jpg",
        area: "200 sq. meters",
        type: "Film Studio",
        capacity: "30 individuals",
        parking: "Yes",
        transport: "No",
        availability: "Not Available",
        rental: "Daily"
    },
    {
        name: "Acting Rehearsal Loft",
        address: "777 Drama Ln, Ottawa, ON",
        price: "$80 per hour",
        image: "studio6.jpg",
        area: "110 sq. meters",
        type: "Rehearsal Space",
        capacity: "12 individuals",
        parking: "No",
        transport: "Yes",
        availability: "Available",
        rental: "Hourly"
    },
    {
        name: "Sunset Photography Studio",
        address: "456 Sunset Blvd, Los Angeles, CA",
        price: "$150 per hour",
        image: "studio7.jpg",
        area: "90 sq. meters",
        type: "Photography Studio",
        capacity: "8 individuals",
        parking: "Yes",
        transport: "Yes",
        availability: "Available",
        rental: "Hourly"
    },
    {
        name: "Golden Records Studio",
        address: "789 Music Ave, Nashville, TN",
        price: "$200 per hour",
        image: "studio8.jpg",
        area: "130 sq. meters",
        type: "Recording Studio",
        capacity: "12 individuals",
        parking: "Yes",
        transport: "No",
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

// Function to render studios
function renderStudios(filteredStudios = studios) {
    const studioList = document.getElementById("studioList");
    if (studioList) {
        studioList.innerHTML = filteredStudios.map(studio => `
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

// Function to filter studios based on search input
function filterStudios(searchTerm) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    const filteredStudios = studios.filter(studio => {
        // Convert all properties to lowercase for case-insensitive search
        const name = studio.name.toLowerCase();
        const type = studio.type.toLowerCase();
        const address = studio.address.toLowerCase();
        const availability = studio.availability.toLowerCase(); // Availability is already a string

        // Check if the search term matches the exact availability value
        const isAvailabilityMatch = availability === lowerCaseSearchTerm;

        return (
            name.includes(lowerCaseSearchTerm) ||
            type.includes(lowerCaseSearchTerm) ||
            address.includes(lowerCaseSearchTerm) ||
            isAvailabilityMatch // Exact match for availability
        );
    });

    renderStudios(filteredStudios);
}

// Add event listener to the search box
const searchBox = document.getElementById("searchBox");
if (searchBox) {
    searchBox.addEventListener("input", (event) => {
        const searchTerm = event.target.value.trim();
        filterStudios(searchTerm);
    });
}

// Render studios on page load (only on Home.html)
if (window.location.pathname.includes("Home.html")) {
    renderStudios();
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

    // Find the studio object from the studios array
    const studio = studios.find(s => s.name === studioName);

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

// Display favorites when Myfaves.html page loads
if (window.location.pathname.includes("Myfaves.html")) {
    displayFavorites();
}

// Function to clear all favorites
function clearFavorites() {
    localStorage.removeItem("favorites");
    showNotification("⚠️ All favorites have been cleared!");
    displayFavorites();
}

document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("settingsModal");
    const closeBtn = document.querySelector(".close-btn");
    const themeToggle = document.getElementById("themeToggle");

    // Ensure modal is hidden on page load
    modal.style.display = "none";

    // Load theme preference from localStorage
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        themeToggle.textContent = "Enable Light Mode";
    }

    // Function to open modal
    function Settings(event) {
        event.preventDefault(); // Prevents the page from reloading
        modal.style.display = "flex";
    }

    // Function to close modal
    function CloseSettings() {
        modal.style.display = "none";
    }

    // Attach event listeners
    closeBtn.addEventListener("click", CloseSettings);

    // Close modal when clicking outside
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            CloseSettings();
        }
    });

    // Theme Toggle Function
    themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");

        // Check if dark mode is active
        if (document.body.classList.contains("dark-mode")) {
            themeToggle.textContent = "Enable Light Mode";
            localStorage.setItem("theme", "dark"); // Save preference
        } else {
            themeToggle.textContent = "Enable Dark Mode";
            localStorage.setItem("theme", "light"); // Save preference
        }
    });

    // Assign the Settings function to the settings icon
    document.querySelector('a[href="#settings"]').addEventListener("click", Settings);
});

// Booking 
// Function to book a studio
function BookNow(studioName) {
    // Find the studio object from the studios array
    const studio = studios.find(s => s.name === studioName);

    if (!studio) return;

    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    // Check if the studio is already booked
    const isAlreadyBooked = bookings.some(booked => booked.name === studio.name);
    if (!isAlreadyBooked) {
        bookings.push(studio); // Store the full studio object
        localStorage.setItem("bookings", JSON.stringify(bookings));
        showNotification("✅ Studio booked successfully!");
    } else {
        showNotification("⚠️ This studio is already booked!");
    }
}

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

// Display bookings when MyBookings.html page loads
if (window.location.pathname.includes("Mybook.html")) {
    displayBookings();
}

function cancelBooking(name) {
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const updatedBookings = bookings.filter(studio => studio.name !== name);

    if (updatedBookings.length < bookings.length) {
        localStorage.setItem("bookings", JSON.stringify(updatedBookings));
        showNotification("❌ Booking canceled!");
        displayBookings();
    }
}

