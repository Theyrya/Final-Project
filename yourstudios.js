import studios from "./Myfaves.js";

// Load studios from localStorage or use the default studios
let storedStudios = JSON.parse(localStorage.getItem("studios")) || studios;

document.addEventListener("DOMContentLoaded", function () {
    const formContainer = document.querySelector(".form-container");
    const addStudioBtn = document.querySelector(".add-btn");
    const closeFormBtn = document.getElementById("close-form");
    const studioList = document.querySelector(".studio-list");
    const studioForm = document.getElementById("studio-form");

    // Show form
    if (addStudioBtn) {
        addStudioBtn.addEventListener("click", function () {
            if (!formContainer) return;
            formContainer.style.display = "block"; // Show form
            document.body.classList.add("modal-open");
        });
    }

    // Hide form
    function closeForm() {
        if (!formContainer) return;
        formContainer.style.display = "none";
        document.body.classList.remove("modal-open");
        studioForm.reset();
    }

    // Event listener for close button
    if (closeFormBtn) {
        closeFormBtn.addEventListener("click", closeForm);
    }

    // Add studio
    studioForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Get values
        const name = document.getElementById("studio-name").value;
        const address = document.getElementById("studio-address").value;
        const area = document.getElementById("studio-area").value;
        const type = document.getElementById("studio-type").value;
        const capacity = document.getElementById("studio-capacity").value;
        const parking = document.getElementById("studio-parking").checked ? "Yes" : "No";
        const transport = document.getElementById("studio-transport").checked ? "Yes" : "No";
        const availability = document.getElementById("studio-availability").value;
        const rental = document.getElementById("studio-rental").value;
        const price = document.getElementById("studio-price").value;

        // Create a new studio object
        const newStudio = {
            name,
            address,
            price: `$${price} per ${rental.toLowerCase()}`,
            image: "default_studio.jpg", // Default image for new studios
            area: `${area} sq. meters`,
            type,
            capacity: `${capacity} individuals`,
            parking,
            transport,
            availability,
            rental
        };

        // Add the new studio to the storedStudios array
        storedStudios.push(newStudio);

        // Save the updated studios array to localStorage
        localStorage.setItem("studios", JSON.stringify(storedStudios));

        // Create studio card
        const studioHTML = `
            <div class="studio">
                <img src="${newStudio.image}" alt="Studio Image">
                <h3>${newStudio.name}</h3>
                <p><strong>Address:</strong> ${newStudio.address}</p>
                <p><strong>Area:</strong> ${newStudio.area}</p>
                <p><strong>Type:</strong> ${newStudio.type}</p>
                <p><strong>Capacity:</strong> ${newStudio.capacity}</p>
                <p><strong>Parking:</strong> ${newStudio.parking}</p>
                <p><strong>Public Transport:</strong> ${newStudio.transport}</p>
                <p><strong>Availability:</strong> ${newStudio.availability}</p>
                <p><strong>Rental Term:</strong> ${newStudio.rental}</p>
                <p><strong>Price:</strong> ${newStudio.price}</p>
                <div>
                    <button class="rem-btn">Remove</button>
                    <button class="edit-btn">Edit</button>
                </div>
            </div>
        `;

        // Append new studio
        studioList.insertAdjacentHTML("beforeend", studioHTML);

        // Close form
        closeForm();

        // Update event listeners for remove/edit buttons
        addStudioEventListeners();
    });

    // Add event listeners to remove/edit buttons
    function addStudioEventListeners() {
        document.querySelectorAll(".rem-btn").forEach(button => {
            button.addEventListener("click", function () {
                const studioName = this.closest(".studio").querySelector("h3").textContent;
                storedStudios = storedStudios.filter(studio => studio.name !== studioName);
                localStorage.setItem("studios", JSON.stringify(storedStudios));
                this.closest(".studio").remove();
            });
        });

        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", function () {
                alert("Edit functionality coming soon!");
            });
        });
    }

    // Load initial studios from the storedStudios array
    function loadStudios() {
        storedStudios.forEach(studio => {
            const studioHTML = `
                <div class="studio">
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
                    <div>
                        <button class="rem-btn">Remove</button>
                        <button class="edit-btn">Edit</button>
                    </div>
                </div>
            `;
            studioList.insertAdjacentHTML("beforeend", studioHTML);
        });

        // Add event listeners to initial studios
        addStudioEventListeners();
    }

    // Load studios when the page loads
    loadStudios();
});

// Export the storedStudios array so other files can import it
export default storedStudios;