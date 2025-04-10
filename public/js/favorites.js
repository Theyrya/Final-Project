// Initialize favorites data in localStorage if it doesn't exist
if (!localStorage.getItem('favorites')) {
    localStorage.setItem('favorites', JSON.stringify([]));
  }
  
  const getFavorites = () => JSON.parse(localStorage.getItem('favorites'));
  const setFavorites = (favorites) => localStorage.setItem('favorites', JSON.stringify(favorites));
  
  // Add to Favorites
  function addToFavorites(id) {
    const favorites = getFavorites();
    if (!favorites.includes(id)) {
      favorites.push(id);
      setFavorites(favorites);
      alert('Added to favorites!');
    } else {
      alert('This studio is already in your favorites.');
    }
  }
  
  // Remove from Favorites
  function removeFromFavorites(id) {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter(favId => favId !== id);
    setFavorites(updatedFavorites);
    renderFavorites();
    alert('Removed from favorites!');
  }
  
  // Render Favorites
  function renderFavorites() {
    const favorites = getFavorites();
    const studios = getStudios().filter(studio => favorites.includes(studio.id));
    const favoritesList = document.getElementById('favorites-list');
    
    if (favoritesList) {
      if (studios.length === 0) {
        favoritesList.innerHTML = '<p>No favorites added yet.</p>';
      } else {
        favoritesList.innerHTML = studios.map(studio => `
          <div class="studio-card">
            <h3>${studio.name}</h3>
            <p>${studio.address}</p>
            <p>Rent: $${studio.rent}/hr</p>
            <button onclick="removeFromFavorites(${studio.id})">Remove from Favorites</button>
          </div>
        `).join('');
      }
    }
  }