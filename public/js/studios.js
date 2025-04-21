


// Add Studio
async function addStudio(event) {
  event.preventDefault();
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) {
      alert('Please log in first');
      return;
  }
  
  const studio = {
      name: document.getElementById('studio-name').value,
      address: document.getElementById('studio-address').value,
      area: parseInt(document.getElementById('studio-area').value),
      type: document.getElementById('studio-type').value,
      capacity: parseInt(document.getElementById('studio-capacity').value),
      parking: document.getElementById('studio-parking').checked,
      publicTransport: document.getElementById('studio-public-transport').checked,
      availability: document.getElementById('studio-availability').checked,
      rentalTerm: document.getElementById('studio-rental-term').value,
      rent: parseInt(document.getElementById('studio-rent').value),
      owner: currentUser.email
  };
  
  try {
      const response = await fetch('/api/studios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(studio)
      });
      
      const data = await response.json();
      
      if (data.success) {
          alert('Studio added successfully!');
          renderOwnedStudios();
          document.getElementById('studio-form').reset();
      } else {
          alert('Failed to add studio');
      }
  } catch (error) {
      console.error('Add studio error:', error);
      alert('Failed to add studio. Please try again.');
  }
}

// Edit Studio
let editingStudioId = null;

function editStudio(id) {
  const studioList = document.getElementById('owned-studios');
  const studioCard = studioList.querySelector(`[data-id="${id}"]`);
  if (!studioCard) return;
  
  const studio = JSON.parse(studioCard.dataset.studio);
  editingStudioId = id;
  
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
}

// Update Studio
async function updateStudio(event) {
  event.preventDefault();
  
  const updatedStudio = {
      name: document.getElementById('edit-studio-name').value,
      address: document.getElementById('edit-studio-address').value,
      area: parseInt(document.getElementById('edit-studio-area').value),
      type: document.getElementById('edit-studio-type').value,
      capacity: parseInt(document.getElementById('edit-studio-capacity').value),
      parking: document.getElementById('edit-studio-parking').checked,
      publicTransport: document.getElementById('edit-studio-public-transport').checked,
      availability: document.getElementById('edit-studio-availability').checked,
      rentalTerm: document.getElementById('edit-studio-rental-term').value,
      rent: parseInt(document.getElementById('edit-studio-rent').value)
  };
  
  try {
      const response = await fetch(`/api/studios/${editingStudioId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedStudio)
      });
      
      const data = await response.json();
      
      if (data.success) {
          alert('Studio updated successfully!');
          document.getElementById('edit-form').style.display = 'none';
          renderOwnedStudios();
      } else {
          alert('Failed to update studio');
      }
  } catch (error) {
      console.error('Update studio error:', error);
      alert('Failed to update studio. Please try again.');
  }
}

// Delete Studio
async function deleteStudio(id) {
    console.log('Attempting to delete studio with ID:', id);
    if (!confirm('Are you sure you want to delete this studio?')) return;
    
    try {
        const response = await fetch(`/api/studios/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);
        
        if (data.success) {
            alert('Studio deleted successfully!');
            renderOwnedStudios();
        } else {
            alert('Failed to delete studio: ' + (data.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Delete studio error:', error);
        alert('Failed to delete studio. Please try again.');
    }
  }

// Render Owned Studios
async function renderOwnedStudios() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) return;
  
  try {
      const response = await fetch(`/api/studios/owner/${currentUser.email}`);
      const studios = await response.json();
      
      const studioList = document.getElementById('owned-studios');
      studioList.innerHTML = studios.map(studio => `
          <div class="studio-card" data-id="${studio.id}" data-studio='${JSON.stringify(studio)}'>
              <h3>${studio.name}</h3>
              <p>Address: ${studio.address}</p>
              <p>Area: ${studio.area} sqm</p>
              <p>Type: ${studio.type}</p>
              <p>Capacity: ${studio.capacity} people</p>
              <p>Parking: ${studio.parking ? 'Yes' : 'No'}</p>
              <p>Public Transport: ${studio.publicTransport ? 'Yes' : 'No'}</p>
              <p>Availability: ${studio.availability ? 'Available' : 'Not Available'}</p>
              <p>Rental Term: ${studio.rentalTerm}</p>
              <p>Rent: $${studio.rent} per ${studio.rentalTerm}</p>
              <button onclick="editStudio(${studio.id})">Edit</button>
              <button onclick="deleteStudio(${studio.id})">Delete</button>
          </div>
      `).join('');
  } catch (error) {
      console.error('Error fetching studios:', error);
      alert('Failed to load studios. Please try again.');
  }
}

// Render Studios on Homepage
async function renderStudios() {
  try {
      const response = await fetch('/api/studios');
      const studios = await response.json();
      
      const studioList = document.getElementById('studio-list');
      if (!studioList) return;
      
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
              <p>Rent: $${studio.rent} per ${studio.rentalTerm}</p>
              <button onclick="addToFavorites(${studio.id})">Add to Favorites</button>
              <button onclick="bookStudio(${studio.id})">Book</button>
          </div>
      `).join('');
  } catch (error) {
      console.error('Error fetching studios:', error);
      alert('Failed to load studios. Please try again.');
  }
}

function cancelEdit() {
    const editForm = document.getElementById('edit-form');
    const addForm = document.getElementById('studio-form');
    
    editForm.style.display = 'none';
    document.getElementById('edit-studio-form').reset();
  }
  
  // Make sure the function is available globally
  window.cancelEdit = cancelEdit;