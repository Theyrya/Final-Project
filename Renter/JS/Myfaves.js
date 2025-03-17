<<<<<<< HEAD:Myfaves.js
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
=======
// Array of studio objects
const studios = [
    {
        name: "Urban Art Loft",
        address: "345 - 6 Avenue SE, Calgary, AB T2G 4V1",
        price: "$50 per hour",
        image: "../../Images/1.jpg",
        area: "120 sq. meters",
        type: "Recording Studio",
        capacity: "10 individuals",
        parking: "Yes",
        transport: "Yes",
        availability: "Available",
        rental: "Hourly"
    },
    {
        name: "Bow Valley Recording Studio",
        address: "123 Main St, Vancouver, BC",
        price: "$120 per day",
        image: "../../Images/2.jpg",
        area: "85 sq. meters",
        type: "Art Studio",
        capacity: "5 individuals",
        parking: "No",
        transport: "Yes",
        availability: "Not Available",
        rental: "Daily"
    },
    {
        name: "Creative Photo Hub",
        address: "789 Dance Ave, Toronto, ON",
        price: "$700 per week",
        image: "../../Images/3.jpg",
        area: "150 sq. meters",
        type: "Dance Studio",
        capacity: "20 individuals",
        parking: "Yes",
        transport: "Yes",
        availability: "Available",
        rental: "Weekly"
    },
    {
        name: "Downtown Haven",
        address: "555 Sound St, Montreal, QC",
        price: "$2500 per month",
        image: "../../Images/4.jpg",
        area: "100 sq. meters",
        type: "Rehearsal Space",
        capacity: "15 individuals",
        parking: "No",
        transport: "Yes",
        availability: "Available",
        rental: "Monthly"
    },
    {
        name: "Dance Hub",
        address: "910 Movie Blvd, Edmonton, AB",
        price: "$500 per day",
        image: "../../Images/5.jpg",
        area: "200 sq. meters",
        type: "Damce Studio",
        capacity: "30 individuals",
        parking: "Yes",
        transport: "No",
        availability: "Not Available",
        rental: "Daily"
    },
    {
        name: "Traditional class",
        address: "777 Drama Ln, Ottawa, ON",
        price: "$80 per hour",
        image: "../../Images/6.jpg",
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
        image: "../../Images/7.jpg",
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
        image: "../../Images/8.jpg",
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
        image: "../../Images/9.jpg",
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
    const terms = searchTerm.toLowerCase().split(" ").filter(t => t); // Split search term into words
    const filteredStudios = studios.filter(studio => {
        const dataString = `${studio.name} ${studio.type} ${studio.address} ${studio.availability}`.toLowerCase();
        return terms.every(term => dataString.includes(term)); // Check if all terms are present
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
    const studio = studios.find(s => s.name === studioName);
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
if (window.location.pathname.toLowerCase().includes("mybook.html")) {
    displayBookings();
}

function cancelBooking(name) {
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const updatedBookings = bookings.filter(studio => studio.name !== name);

    if (updatedBookings.length < bookings.length) {
        localStorage.setItem("bookings", JSON.stringify(updatedBookings));
        showNotification("❌ Booking canceled!");
        console.log("canceled booking for: " + name);
        displayBookings();

    }
}
function sortStudios(criteria) {
    let sortedStudios = [...studios];

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

    renderStudios(sortedStudios);
}























// owners js
document.addEventListener("DOMContentLoaded", function () {
    const formContainer = document.querySelector(".form-container");
    const addStudioBtn = document.querySelector(".add-btn");
    const closeFormBtn = document.getElementById("close-form");
    const studioForm = document.getElementById("studio-form");
    const studioList = document.querySelector(".studio-list");

    function ADDstudio() {
        if (!formContainer) return;
        formContainer.style.display = "block"; 
        document.body.classList.add("modal-open");
    }

    function closeForm() {
        if (!formContainer) return;
        formContainer.style.display = "none";
        document.body.classList.remove("modal-open");
        studioForm.reset();
    }

    // Event Listeners
    if (addStudioBtn) addStudioBtn.addEventListener("click", ADDstudio);
    if (closeFormBtn) closeFormBtn.addEventListener("click", closeForm);

    // Add studio form submission
    if (studioForm) {
        studioForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent page reload
            console.log("Form submitted"); // Debugging: Check if it runs

            // Get values
            const name = document.getElementById("studio-name").value.trim();
            const address = document.getElementById("studio-address").value.trim();
            const area = document.getElementById("studio-area").value.trim();
            const type = document.getElementById("studio-type").value.trim();
            const capacity = document.getElementById("studio-capacity").value.trim();
            const parking = document.getElementById("studio-parking").checked ? "Yes" : "No";
            const transport = document.getElementById("studio-transport").checked ? "Yes" : "No";
            const availability = document.getElementById("studio-availability").value.trim();
            const rental = document.getElementById("studio-rental").value.trim();
            const price = document.getElementById("studio-price").value.trim();
            // const image = document.getElementById("studio-image").value.trim() || "default.jpg"; // Default image

            if (!name || !address || !area || !type || !capacity || !availability || !rental || !price) {
                alert("Please fill in all required fields.");
                return;
            }

            // Create a new studio object
            const newStudio = {
                name,
                address,
                area,
                type,
                capacity,
                parking,
                transport,
                availability,
                rental,
                price
            };

            // Retrieve stored studios from local storage
            let storedStudios = JSON.parse(localStorage.getItem("studios")) || [];
            storedStudios.push(newStudio);
            localStorage.setItem("studios", JSON.stringify(storedStudios));

            console.log("New studio added:", newStudio);

            // Clear form and close modal
            closeForm();
            showNotification("✅ Studio added successfully!");

            // Reload studios if needed
            renderStudios(storedStudios);
            console.log(storedStudios);
s
        });
    }
});
>>>>>>> 071783185f5212e297f4b54a670b7477005e1195:Renter/JS/Myfaves.js
