// Add to Favorites
async function addToFavorites(id) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) {
      alert('Please log in to add to favorites.');
      window.location.href = 'login.html';
      return;
  }
  
  try {
      const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
              studioId: id, 
              userEmail: currentUser.email 
          })
      });
      
      const data = await response.json();
      
      if (data.success) {
          alert('Added to favorites!');
      } else {
          alert(data.message || 'Failed to add to favorites');
      }
  } catch (error) {
      console.error('Add favorite error:', error);
      alert('Failed to add to favorites. Please try again.');
  }
}

// Remove from Favorites
// Remove from Favorites - Updated version
async function removeFromFavorites(id) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Please log in to manage favorites.');
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const response = await fetch('/api/favorites', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                studioId: id, 
                userEmail: currentUser.email 
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Removed from favorites!');
            renderFavorites();
        } else {
            alert(data.message || 'Failed to remove from favorites');
        }
    } catch (error) {
        console.error('Remove favorite error:', error);
        alert('Failed to remove from favorites. Please try again.');
    }
  }

// Render Favorites
async function renderFavorites() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) return;
  
  try {
      const favoritesResponse = await fetch(`/api/favorites/${currentUser.email}`);
      const favorites = await favoritesResponse.json();
      
      const studiosResponse = await fetch('/api/studios');
      const studios = await studiosResponse.json();
      
      const favoritesList = document.getElementById('favorites-list');
      if (!favoritesList) return;
      
      // Get studio IDs from favorites
      const favoriteStudioIds = favorites.map(f => f.studioId);
      
      // Filter studios to only include favorited ones
      const favoriteStudios = studios.filter(studio => favoriteStudioIds.includes(studio.id));
      
      if (favoriteStudios.length === 0) {
          favoritesList.innerHTML = '<p>No favorites added yet.</p>';
      } else {
          favoritesList.innerHTML = favoriteStudios.map(studio => `
              <div class="studio-card">
                  <h3>${studio.name}</h3>
                  <p>${studio.address}</p>
                  <p>Rent: $${studio.rent}/hr</p>
                  <p>Area: ${studio.area}m square</p>
                  <p>Type: ${studio.type}</p>
                  <p>Capacity: ${studio.capacity}</p>
                  <p>Parking: ${studio.parking}</p>
                  <p>Public Transportation: ${studio.publicTransport}</p>
                  <p>Available: ${studio.availability}</p>
                  <p>Rental Term: ${studio.rentalTerm}</p>
                  <button onclick="bookStudio(${studio.id})">Book</button>
                  <button onclick="removeFromFavorites(${studio.id})">Remove from Favorites</button>
              </div>
          `).join('');
      }
  } catch (error) {
      console.error('Error fetching favorites:', error);
      alert('Failed to load favorites. Please try again.');
  }
}