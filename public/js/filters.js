// Filter Studios
function filterStudios() {
    const studios = getStudios();
    const availabilityFilter = document.getElementById('filter-availability').value;
    const rentMin = document.getElementById('filter-rent-min').value;
    const rentMax = document.getElementById('filter-rent-max').value;
    const parkingFilter = document.getElementById('filter-parking').value;
    const publicTransportFilter = document.getElementById('filter-public-transport').value;
  
    const filteredStudios = studios.filter(studio => {
      if (availabilityFilter === 'available' && !studio.availability) return false;
      if (availabilityFilter === 'not-available' && studio.availability) return false;
      if (rentMin && studio.rent < parseFloat(rentMin)) return false;
      if (rentMax && studio.rent > parseFloat(rentMax)) return false;
      if (parkingFilter === 'yes' && !studio.parking) return false;
      if (parkingFilter === 'no' && studio.parking) return false;
      if (publicTransportFilter === 'yes' && !studio.publicTransport) return false;
      if (publicTransportFilter === 'no' && studio.publicTransport) return false;
      return true;
    });
  
    renderFilteredStudios(filteredStudios);
  }
  
  // Render Filtered Studios
  function renderFilteredStudios(filteredStudios) {
    const studioList = document.getElementById('studio-list');
    studioList.innerHTML = filteredStudios.map(studio => `
      <div class="studio-card">
        <h3>${studio.name}</h3>
        <p>${studio.address}</p>
        <p>Rent: $${studio.rent}/hr</p>
        <p>Availability: ${studio.availability ? 'Available' : 'Not Available'}</p>
        <button onclick="addToFavorites(${studio.id})">Add to Favorites</button>
        <button onclick="bookStudio(${studio.id})">Book</button>
      </div>
    `).join('');
  }
  
  // Clear Filters
  function clearFilters() {
    document.getElementById('filter-availability').value = 'all';
    document.getElementById('filter-rent-min').value = '';
    document.getElementById('filter-rent-max').value = '';
    document.getElementById('filter-parking').value = 'all';
    document.getElementById('filter-public-transport').value = 'all';
    renderStudios();
  }
  
  // Open Filter Modal
  function openFilterModal() {
    const modal = document.getElementById('filter-modal');
    modal.style.display = 'block';
  }
  
  // Close Filter Modal
  function closeFilterModal() {
    const modal = document.getElementById('filter-modal');
    modal.style.display = 'none';
  }
  
  // Close modal if user clicks outside of it
  window.onclick = function(event) {
    const modal = document.getElementById('filter-modal');
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
  
  // Attach filter form submission
  document.getElementById('filter-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    filterStudios();
  });