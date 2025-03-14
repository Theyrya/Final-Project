document.addEventListener("DOMContentLoaded", function () {
    // Get elements
    const formContainer = document.querySelector(".form-container");
    const addStudioBtn = document.querySelector(".add-btn");
    const closeFormBtn = document.getElementById("close-form");
    const studioList = document.querySelector(".studio-list");
    const studioForm = document.getElementById("studio-form");

    // Show form
    window.ADDstudio = function () {
        if (!formContainer) return;
        formContainer.style.display = "block"; // Show form
        document.body.classList.add("modal-open");
    };

    // Hide form
    function closeForm() {
        if (!formContainer) return;
        formContainer.style.display = "none";
        document.body.classList.remove("modal-open");
        studioForm.reset();
    }

    // Event Listeners
    if (addStudioBtn) addStudioBtn.addEventListener("click", ADDstudio);
    if (closeFormBtn) closeFormBtn.addEventListener("click", closeForm);

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

        // Create studio card
        const studioHTML = `
            <div class="studio">
                <img src="default_studio.jpg" alt="Studio Image">
                <h3>${name}</h3>
                <p><strong>Address:</strong> ${address}</p>
                <p><strong>Area:</strong> ${area} sq. meters</p>
                <p><strong>Type:</strong> ${type}</p>
                <p><strong>Capacity:</strong> ${capacity} individuals</p>
                <p><strong>Parking:</strong> ${parking}</p>
                <p><strong>Public Transport:</strong> ${transport}</p>
                <p><strong>Availability:</strong> ${availability}</p>
                <p><strong>Rental Term:</strong> ${rental}</p>
                <p><strong>Price:</strong> $${price} per hour</p>
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
                this.closest(".studio").remove();
            });
        });

        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", function () {
                alert("Edit functionality coming soon!");
            });
        });
    }

    addStudioEventListeners();
});
