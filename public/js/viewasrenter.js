let allStudios = []; // This will store all studios

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  loadAllStudios();
  setupEventListeners();
});

// Fetch all studios
async function loadAllStudios() {
  try {
    console.log('Attempting to fetch studios...'); // Debug log
    const response = await fetch('/api/studios', {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Response status:', response.status); // Debug log
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server responded with ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Received data:', data); // Debug log
    if (!Array.isArray(data)) {
      throw new Error('Received data is not an array');
    }

    allStudios = data;
    renderStudios(allStudios);
    
  } catch (error) {
    console.error('Detailed error:', error);
    alert(`Error loading studios: ${error.message}`);
  }
}

// Set up all event listeners
function setupEventListeners() {
  // Filter form submission
  document.getElementById('filter-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    filterStudios(); // Explicit call when form submits
  });

  // Clear filters button
  document.querySelector('#filter-form button[type="button"]')?.addEventListener('click', clearFilters);

  // Modal open/close
  document.getElementById('filter-modal-btn')?.addEventListener('click', openFilterModal);
  document.querySelector('.close')?.addEventListener('click', closeFilterModal);
}

// Main filter function - now called explicitly
function filterStudios() {
  if (allStudios.length === 0) {
    alert('Studios not loaded yet. Please wait...');
    return;
  }

  // Get filter values
  const availability = document.getElementById('filter-availability').value;
  const rentMin = parseFloat(document.getElementById('filter-rent-min').value) || 0;
  const rentMax = parseFloat(document.getElementById('filter-rent-max').value) || Infinity;
  const parking = document.getElementById('filter-parking').value;
  const publicTransport = document.getElementById('filter-public-transport').value;

  // Apply filters
  const filteredStudios = allStudios.filter(studio => {
    return (
      (availability === 'all' || 
       (availability === 'available' && studio.availability) || 
       (availability === 'not-available' && !studio.availability)) &&
      studio.rent >= rentMin &&
      studio.rent <= rentMax &&
      (parking === 'all' || 
       (parking === 'yes' && studio.parking) || 
       (parking === 'no' && !studio.parking)) &&
      (publicTransport === 'all' || 
       (publicTransport === 'yes' && studio.publicTransport) || 
       (publicTransport === 'no' && !studio.publicTransport))
    );
  });

  renderStudios(filteredStudios);
  closeFilterModal(); // Close modal after filtering
}

// Clear filters
function clearFilters() {
  document.getElementById('filter-availability').value = 'all';
  document.getElementById('filter-rent-min').value = '';
  document.getElementById('filter-rent-max').value = '';
  document.getElementById('filter-parking').value = 'all';
  document.getElementById('filter-public-transport').value = 'all';
  renderStudios(allStudios); // Show all studios
}

// Render studios to the page
function renderStudios(studios) {
  const studioList = document.getElementById('studio-list');
  
  if (!studios || studios.length === 0) {
    studioList.innerHTML = '<p>No studios found matching your filters.</p>';
    return;
  }

  studioList.innerHTML = studios.map(studio => `
    <div class="studio-card">
      <h3>${studio.name}</h3>
      <p>Address: ${studio.address}</p>
      <p>Rent: $${studio.rent}/hr</p>
      <p>Availability: ${studio.availability ? 'Available' : 'Not Available'}</p>
      
    </div>
  `).join('');
}


// Add this to your existing filters.js or create a new file
// Search function with debouncing
let searchTimeout;

document.getElementById('searchBox').addEventListener('input', (e) => {
    const searchTerm = e.target.value.trim();
    
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        if (searchTerm.length >= 2 || searchTerm.length === 0) {
            searchStudios(searchTerm);
        }
    }, 300); // 300ms delay
});

async function searchStudios(searchTerm) {
    const studioList = document.getElementById('studio-list');
    
    try {
        // Show loading state
        studioList.innerHTML = '<p>Searching studios...</p>';
        
        const response = await fetch(`/api/studios/search?q=${encodeURIComponent(searchTerm)}`);
        
        if (!response.ok) throw new Error('Search failed');
        
        const results = await response.json();
        renderStudios(results);
        
    } catch (error) {
        console.error('Search error:', error);
        // Fallback to client-side search if API fails
        const filtered = allStudios.filter(studio => 
            studio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            studio.address.toLowerCase().includes(searchTerm.toLowerCase())
        );
        renderStudios(filtered);
    }
}

// Modal functions
function openFilterModal() {
  document.getElementById('filter-modal').style.display = 'block';
}

function closeFilterModal() {
  document.getElementById('filter-modal').style.display = 'none';
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
  if (event.target === document.getElementById('filter-modal')) {
    closeFilterModal();
  }
});