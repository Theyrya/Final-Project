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

    const studio = {
        name: studioDiv.querySelector('h3').innerText,
        address: studioDiv.querySelector('p:nth-of-type(1)').innerText.replace("Address: ", ""),
        area: studioDiv.querySelector('p:nth-of-type(2)').innerText.replace("Area: ", ""),
        type: studioDiv.querySelector('p:nth-of-type(3)').innerText.replace("Type: ", ""),
        capacity: studioDiv.querySelector('p:nth-of-type(4)').innerText.replace("Capacity: ", ""),
        parking: studioDiv.querySelector('p:nth-of-type(5)').innerText.replace("Parking: ", ""),
        transport: studioDiv.querySelector('p:nth-of-type(6)').innerText.replace("Public Transport: ", ""),
        availability: studioDiv.querySelector('p:nth-of-type(7)').innerText.replace("Availability: ", ""),
        rental: studioDiv.querySelector('p:nth-of-type(8)').innerText.replace("Rental Term: ", ""),
        price: studioDiv.querySelector('p:nth-of-type(9)').innerText.replace("Price: ", ""),
        image: studioDiv.querySelector('img').src,
    };

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    const isAlreadyAdded = favorites.some(fav => fav.name === studio.name);
    if (!isAlreadyAdded) {
        favorites.push(studio);
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
