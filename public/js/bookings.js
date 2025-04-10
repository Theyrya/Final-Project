// Initialize bookings data in localStorage if it doesn't exist
if (!localStorage.getItem('bookings')) {
    localStorage.setItem('bookings', JSON.stringify([]));
  }
  
  const getBookings = () => JSON.parse(localStorage.getItem('bookings'));
  const setBookings = (bookings) => localStorage.setItem('bookings', JSON.stringify(bookings));
  
  // Book Studio
  function bookStudio(id) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      alert('Please log in to book a studio.');
      window.location.href = 'login.html';
      return;
    }
  
    const studio = getStudios().find(studio => studio.id === id);
    if (studio) {
      const owner = getUsers().find(user => user.email === studio.owner);
      if (owner) {
        alert(`Contact Owner:\nName: ${owner.name}\nEmail: ${owner.email}\nPhone: ${owner.phone}`);
      } else {
        alert('Owner information not found.');
        return;
      }
  
      const bookings = getBookings();
      bookings.push({ studioId: id, renterEmail: currentUser.email });
      setBookings(bookings);
      alert('Booking successful!');
    } else {
      alert('Studio not found.');
    }
  }
  
  // Remove Booking
  function removeBooking(bookingId) {
    const bookings = getBookings();
    const updatedBookings = bookings.filter(booking => booking.studioId !== bookingId);
    setBookings(updatedBookings);
    renderBookings();
    alert('Booking removed successfully!');
  }
  
  // Render Bookings
  function renderBookings() {
    const bookings = getBookings();
    const studios = getStudios();
    const bookingsList = document.getElementById('bookings-list');
  
    if (bookingsList) {
      if (bookings.length === 0) {
        bookingsList.innerHTML = '<p>No bookings found.</p>';
      } else {
        bookingsList.innerHTML = bookings.map(booking => {
          const studio = studios.find(studio => studio.id === booking.studioId);
          const owner = getUsers().find(user => user.email === studio.owner);
          return `
            <div class="booking-card">
              <h3>${studio.name}</h3>
              <p>${studio.address}</p>
              <p>Rent: $${studio.rent}/hr</p>
              <p>Owner: ${owner.name} (${owner.email})</p>
              <button onclick="removeBooking(${studio.id})">Remove Booking</button>
            </div>
          `;
        }).join('');
      }
    }
  }