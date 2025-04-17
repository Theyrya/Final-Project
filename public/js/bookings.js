// Book Studio
async function bookStudio(id) {
  
  
  try {
      // First get studio details to show owner info
      const studioResponse = await fetch(`/api/studios/${id}`);
      const studioData = await studioResponse.json();
     
      if (!studioData.success) {
          alert('Studio not found');
          return;
      }
      
      const studio = studioData.studio;
      
      // Get owner details
      const ownerResponse = await fetch(`/api/users/current?email=${studio.owner}`);
      const ownerData = await ownerResponse.json();
      if (!ownerData.success) {
          alert('Owner information not found');
          return;
      }
      
      const owner = ownerData.user;
      // Show owner contact info
      try{
        await showOwnerContact(owner);
        
        const bookingResponse = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                studioId: id, 
                renterEmail: currentUser.email 
            })
        });
        
        const bookingData = await bookingResponse.json();
        
        if (bookingData.success) {
            alert('Booking successful!');
        } else {
            alert('Failed to create booking');
        }}
      catch{

      };
      
      // Create booking
  
  } catch (error) {
      console.error('Booking error:', error);
      alert('Booking failed. Please try again.');
  }
}

// Remove Booking
async function removeBooking(bookingId) {
  if (!confirm('Are you sure you want to cancel this booking?')) return;
  
  try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
          method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
          alert('Booking cancelled successfully!');
          renderBookings();
      } else {
          alert('Failed to cancel booking');
      }
  } catch (error) {
      console.error('Cancel booking error:', error);
      alert('Failed to cancel booking. Please try again.');
  }
}

// Render Bookings
async function renderBookings() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    try {
        const bookingsResponse = await fetch(`/api/bookings/user/${currentUser.email}`);
        const bookingsData = await bookingsResponse.json();
        
        if (!bookingsData.success) {
            document.getElementById('bookings-list').innerHTML = '<p>Error loading bookings</p>';
            return;
        }
        
        const studiosResponse = await fetch('/api/studios');
        const studiosData = await studiosResponse.json();
        
        const usersResponse = await fetch('/api/users');
        const usersData = await usersResponse.json();
        
        if (!studiosData.success || !usersData.success) {
            document.getElementById('bookings-list').innerHTML = '<p>Error loading data</p>';
            return;
        }
        
        const bookingsList = document.getElementById('bookings-list');
        const bookings = bookingsData.bookings;
        const studios = studiosData.studios;
        const users = usersData.users;
        
        // rest of the rendering code
    } catch (error) {
        console.error('Error fetching bookings:', error);
        document.getElementById('bookings-list').innerHTML = '<p>Failed to load bookings. Please try again.</p>';
    }
  }

  function showOwnerContact(owner) {
    const modal = document.getElementById('contactModal');
    const ownerName = document.getElementById('ownerName');
    const ownerPhone = document.getElementById('ownerPhone');
    const ownerEmail = document.getElementById('ownerEmail');
    
    ownerName.textContent = owner.name;
    ownerPhone.textContent = owner.phone || 'Not provided';
    ownerEmail.textContent = owner.email;
    ownerEmail.href = `mailto:${owner.email}`;
    
    modal.style.display = 'block';
    document.querySelector('.close-modal').onclick = function() {
        modal.style.display = 'none';
    };
    
    document.querySelector('.close-btn').onclick = function() {
        modal.style.display = 'none';
    };
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
  }