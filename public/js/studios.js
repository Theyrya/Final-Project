// Initialize studios data in localStorage if it doesn't exist
if (!localStorage.getItem('studios')) {
    localStorage.setItem('studios', JSON.stringify([]));
  }
  
  const getStudios = () => JSON.parse(localStorage.getItem('studios'));
  const setStudios = (studios) => localStorage.setItem('studios', JSON.stringify(studios));
  
  // Add Studio
  function addStudio(event) {
    event.preventDefault();
  
    const name = document.getElementById('studio-name').value;
    const address = document.getElementById('studio-address').value;
    const area = document.getElementById('studio-area').value;
    const type = document.getElementById('studio-type').value;
    const capacity = document.getElementById('studio-capacity').value;
    const parking = document.getElementById('studio-parking').checked;
    const publicTransport = document.getElementById('studio-public-transport').checked;
    const availability = document.getElementById('studio-availability').checked;
    const rentalTerm = document.getElementById('studio-rental-term').value;
    const rent = document.getElementById('studio-rent').value;
    const owner = getCurrentUser().email;
  
    const newStudio = {
      id: Date.now(),
      name,
      address,
      area: parseInt(area),
      type,
      capacity: parseInt(capacity),
      parking,
      publicTransport,
      availability,
      rentalTerm,
      rent: parseInt(rent),
      owner
    };
  
    const studios = getStudios();
    studios.push(newStudio);
    setStudios(studios);
  
    alert('Studio added successfully!');
    renderOwnedStudios();
  }
  
  // Edit Studio
  let editingStudioId = null;
  
  function editStudio(id) {
    const studios = getStudios();
    const studio = studios.find(studio => studio.id === id);
  
    if (studio) {
      document.getElementById('edit-studio-name').value = studio.name;
      document.getElementById('edit-studio-address').value = studio.address;
      document.getElementById('edit-studio-area').value = studio.area;
      document.getElementById('edit-studio-type').value = studio.type;
      document.getElementById('edit-studio-capacity').value = studio.capacity;
      document.getElementById('edit-studio-parking').checked = studio.parking;
      document.getElementById('edit-studio-public-transport').checked = studio.publicTransport;
      document.getElementById('edit-studio-availability').checked = studio.availability;
      document.getElementById('edit-studio-rental-term').value = studio.rentalTerm;
      document.getElementById('edit-studio-rent').value = studio.rent;
  
      document.getElementById('edit-form').style.display = 'block';
      editingStudioId = id;
    }
  }
  
  // Update Studio
  function updateStudio(event) {
    event.preventDefault();
  
    const name = document.getElementById('edit-studio-name').value;
    const address = document.getElementById('edit-studio-address').value;
    const area = document.getElementById('edit-studio-area').value;
    const type = document.getElementById('edit-studio-type').value;
    const capacity = document.getElementById('edit-studio-capacity').value;
    const parking = document.getElementById('edit-studio-parking').checked;
    const publicTransport = document.getElementById('edit-studio-public-transport').checked;
    const availability = document.getElementById('edit-studio-availability').checked;
    const rentalTerm = document.getElementById('edit-studio-rental-term').value;
    const rent = document.getElementById('edit-studio-rent').value;
  
    const studios = getStudios();
    const studioIndex = studios.findIndex(studio => studio.id === editingStudioId);
  
    if (studioIndex !== -1) {
      studios[studioIndex] = {
        ...studios[studioIndex],
        name,
        address,
        area: parseInt(area),
        type,
        capacity: parseInt(capacity),
        parking,
        publicTransport,
        availability,
        rentalTerm,
        rent: parseInt(rent)
      };
  
      setStudios(studios);
      document.getElementById('edit-form').style.display = 'none';
      renderOwnedStudios();
      if (window.location.pathname.endsWith('index.html')) {
        renderStudios();
      }
      alert('Studio updated successfully!');
    } else {
      alert('Studio not found.');
    }
  }
  
  // Delete Studio
  function deleteStudio(id) {
    const studios = getStudios();
    const updatedStudios = studios.filter(studio => studio.id !== id);
    setStudios(updatedStudios);
    renderOwnedStudios();
    if (window.location.pathname.endsWith('index.html')) {
      renderStudios();
    }
    alert('Studio deleted successfully!');
  }
  
  // Cancel Edit
  function cancelEdit() {
    document.getElementById('edit-form').style.display = 'none';
    editingStudioId = null;
  }
  
  // Render Studios on Homepage
  function renderStudios() {
    const studios = getStudios();
    const studioList = document.getElementById('studio-list');
    
    studioList.innerHTML = studios.map(studio => `
      <div class="studio-card">
        <h3>${studio.name}</h3>
        <p>Address: ${studio.address}</p>
        <p>Area: ${studio.area} sqm</p>
        <p>Type: ${studio.type}</p>
        <p>Capacity: ${studio.capacity} people</p>
        <p>Parking: ${studio.parking ? 'Yes' : 'No'}</p>
        <p>Public Transport: ${studio.publicTransport ? 'Yes' : 'No'}</p>
        <p>Availability: ${studio.availability ? 'Available' : 'Not Available'}</p>
        <p>Rental Term: ${studio.rentalTerm}</p>
        <p>rent: $${studio.rent} per ${studio.rentalTerm}</p>
        <button onclick="addToFavorites(${studio.id})">Add to Favorites</button>
        <button onclick="bookStudio(${studio.id})">Book</button>
      </div>
    `).join('');
  }
  
  // Render Owned Studios
  function renderOwnedStudios() {
    const ownerEmail = getCurrentUser().email;
    const studios = getStudios().filter(studio => studio.owner === ownerEmail);
    const studioList = document.getElementById('owned-studios');
    
    studioList.innerHTML = studios.map(studio => `
      <div class="studio-card">
        <h3>${studio.name}</h3>
        <p>Address: ${studio.address}</p>
        <p>Area: ${studio.area} sqm</p>
        <p>Type: ${studio.type}</p>
        <p>Capacity: ${studio.capacity} people</p>
        <p>Parking: ${studio.parking ? 'Yes' : 'No'}</p>
        <p>Public Transport: ${studio.publicTransport ? 'Yes' : 'No'}</p>
        <p>Availability: ${studio.availability ? 'Available' : 'Not Available'}</p>
        <p>Rental Term: ${studio.rentalTerm}</p>
        <p>rent: $${studio.rent} per ${studio.rentalTerm}</p>
        <button onclick="editStudio(${studio.id})">Edit</button>
        <button onclick="deleteStudio(${studio.id})">Delete</button>
      </div>
    `).join('');
  }