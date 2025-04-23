//          F
//          R
//          O
//          N
//          T
//          E
//          N
//          D


// Initialize data in localStorage if it doesn't exist
if (!localStorage.getItem('users')) {
  localStorage.setItem('users', JSON.stringify([]));
}
if (!localStorage.getItem('studios')) {
  // Add two sample studios
  const sampleStudios = [
    
  ];
  localStorage.setItem('studios', JSON.stringify(sampleStudios));
  console.log('Sample studios added to localStorage:', sampleStudios); // Debugging
}
if (!localStorage.getItem('favorites')) {
  localStorage.setItem('favorites', JSON.stringify([]));
}


// Helper functions to get and set data
const getUsers = () => JSON.parse(localStorage.getItem('users'));
const setUsers = (users) => localStorage.setItem('users', JSON.stringify(users));

const getStudios = () => JSON.parse(localStorage.getItem('studios'));
const setStudios = (studios) => localStorage.setItem('studios', JSON.stringify(studios));

const getFavorites = () => JSON.parse(localStorage.getItem('favorites'));
const setFavorites = (favorites) => localStorage.setItem('favorites', JSON.stringify(favorites));

const getCurrentUser = () => JSON.parse(localStorage.getItem('currentUser'));
const setCurrentUser = (user) => localStorage.setItem('currentUser', JSON.stringify(user));


// 2. Safe Auth Check (improved)
function checkAuthStatus(requiredRole) {
  // Delay check until full page load
  if (document.readyState !== 'complete') {
    setTimeout(() => checkAuthStatus(requiredRole), 100);
    return;
  }

  const user = getCurrentUser();
  const currentPage = window.location.pathname.split('/').pop();
  
  // Skip auth check on login/signup pages
  if (['login.html', 'signup.html'].includes(currentPage)) {
    return;
  }

  // No user logged in - redirect to login
  if (!user) {
    if (currentPage !== 'login.html') {
      window.location.href = 'login.html';
    }
    return;
  }

  // Verify user exists in database
  const users = getUsers();
  const userExists = users.some(u => u.email === user.email);
  
  if (!userExists) {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
    return;
  }

  // Role-based routing
  if (requiredRole && user.role !== requiredRole) {
    const targetPage = user.role === 'owner' 
      ? 'owner-dashboard.html' 
      : 'index.html';
    
    if (currentPage !== targetPage) {
      window.location.href = targetPage;
    }
  }
}



  // Signup Form Submission
  document.getElementById('signup-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
  
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-phone').value;
    const role = document.getElementById('signup-role').value;

    if (!name || !email || !phone || !role) {
      alert('Please fill all fields');
      return;
    }
  
    const users = getUsers();
    const userExists = users.some(user => user.email === email);
  
    if (userExists) {
      alert('User already exists. Please log in.');
      return;
    }
  
    const newUser = { name, email, phone, role };
    users.push(newUser);
    setUsers(users);
    setCurrentUser(newUser); // Set current user session
  

    if (role === 'owner') {
      window.location.href = 'owner-dashboard.html';
    } else {
      window.location.href = 'index.html';
    }
  });



// Login form submission
if (document.getElementById('login-form')) {
  document.getElementById('login-form').addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(u => u.email === email);

      if (user) {
          // Store the logged-in user in localStorage
          localStorage.setItem('currentUser', JSON.stringify(user));

          // Immediate role-based redirection
          if (user.role === 'owner') {
              window.location.href = 'owner-dashboard.html';
          } else if (user.role === 'renter') {
              window.location.href = 'index.html';
          } else {
              document.getElementById('error-msg').textContent = 'Invalid role. Please contact support.';
          }
      } else {
          document.getElementById('error-msg').textContent = 'No account found with this email. Please sign up.';
      }
  });
}





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
  const owner = getCurrentUser().email; // Get the logged-in owner's email

  const newStudio = {
    id: Date.now(), // Unique ID for the studio
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

  console.log('New Studio Added:', newStudio); // Debugging
  console.log('Updated Studios:', studios); // Debugging

  alert('Studio added successfully!');
  renderOwnedStudios(); // Re-render the owned studios list
}





let editingStudioId = null; // Track the studio being edited

// Edit Studio
function editStudio(id) {
  const studios = getStudios();
  const studio = studios.find(studio => studio.id === id);

  if (studio) {
    // Populate the edit form with the studio's current details
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

    // Show the edit form
    document.getElementById('edit-form').style.display = 'block';

    // Track the studio being edited
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
    // Update the studio details
    studios[studioIndex].name = name;
    studios[studioIndex].address = address;
    studios[studioIndex].area = parseInt(area);
    studios[studioIndex].type = type;
    studios[studioIndex].capacity = parseInt(capacity);
    studios[studioIndex].parking = parking;
    studios[studioIndex].publicTransport = publicTransport;
    studios[studioIndex].availability = availability;
    studios[studioIndex].rentalTerm = rentalTerm;
    studios[studioIndex].rent = parseInt(rent);

    // Save the updated studios array to localStorage
    setStudios(studios);

    // Hide the edit form
    document.getElementById('edit-form').style.display = 'none';

    // Re-render the owned studios list
    renderOwnedStudios();

    // Re-render the studios on the homepage (if open)
    if (window.location.pathname.endsWith('index.html')) {
      renderStudios();
    }

    alert('Studio updated successfully!');
  } else {
    alert('Studio not found.');
  }
}




// Cancel Edit
function cancelEdit() {
  document.getElementById('edit-form').style.display = 'none';
  editingStudioId = null; // Reset the editing studio ID
}





  
  // Render Studios on Homepage
function renderStudios() {
  const studios = getStudios();
  console.log('Studios fetched:', studios); // Debugging

  const studioList = document.getElementById('studio-list');
  if (!studioList) {
    console.error('studio-list element not found!'); // Debugging
    return;
  }

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
    </div>
  `).join('');
}






// Render Owned Studios
function renderOwnedStudios() {
  const ownerEmail = getCurrentUser().email; // Get the logged-in owner's email
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
  






// Add to Favorites
function addToFavorites(id)
 {
  const favorites = getFavorites();
  if (!favorites.includes(id)) {
    favorites.push(id);
    setFavorites(favorites);
    alert('Added to favorites!');
  } else {
    alert('This studio is already in your favorites.');
  }
  console.log('Updated Favorites:', favorites); // Debugging
 }
  



  function renderFavorites() {
    const favorites = getFavorites();
    const studios = getStudios();
    console.log('Favorites:', favorites); // Debugging
    console.log('Studios:', studios); // Debugging
  
    const favoritesList = document.getElementById('favorites-list');
    const favoriteStudios = studios.filter(studio => favorites.includes(studio.id));
  
    if (favoriteStudios.length === 0) {
      favoritesList.innerHTML = '<p>No favorites added yet.</p>';
    } else {
      favoritesList.innerHTML = favoriteStudios.map(studio => `
        <div class="studio-card">
          <h3>${studio.name}</h3>
          <p>${studio.address}</p>
          <p>Rent: $${studio.rent}/hr</p>
          <button onclick="bookStudio(${studio.id})">Book</button>
          <button onclick="removeFromFavorites(${studio.id})">Remove from Favorites</button>
        </div>
      `).join('');
    }
  }
  

  
// Remove from Favorites
function removeFromFavorites(id) {
  const favorites = getFavorites(); // Retrieve current favorites
  const updatedFavorites = favorites.filter(favoriteId => favoriteId !== id); // Remove the selected favorite
  setFavorites(updatedFavorites); // Update storage
  renderFavorites(); // Re-render the UI
}





  // Book Studio
  function bookStudio(id) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      alert('Please log in to book a studio.');
      window.location.href = 'login.html';
      return;
    }
  
    console.log('Current User:', currentUser); // Debugging
  

    function showOwnerContact(owner) {
      const modal = document.getElementById('contactModal');
      const ownerName = document.getElementById('ownerName');
      const ownerPhone = document.getElementById('ownerPhone');
      const ownerEmail = document.getElementById('ownerEmail');
      
      // Set owner information
      ownerName.textContent = owner.name;
      ownerPhone.textContent = owner.phone || 'Not provided';
      ownerEmail.textContent = owner.email;
      ownerEmail.href = `mailto:${owner.email}`;
      
      // Show modal
      modal.style.display = 'block';
      
      // Close modal handlers
      document.querySelector('.close-modal').onclick = function() {
        modal.style.display = 'none';
      };
      
      document.querySelector('.close-btn').onclick = function() {
        modal.style.display = 'none';
      };
      
      // Close when clicking outside modal
      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = 'none';
        }
      };
    }

    const studio = getStudios().find(studio => studio.id === id);
    if (studio) {
      console.log('Studio Found:', studio);
      const owner = getUsers().find(user => user.email === studio.owner);
        
      if (owner) {
        console.log('Owner Found:', owner);
        showOwnerContact(owner);
      } else {
        console.error('Owner not found for studio:', studio);
        // You could show a different modal for errors if you want
        showErrorModal('Owner information not found.');
      }
    }
  }







// Delete Studio
function deleteStudio(id) {
  const studios = getStudios();
  const updatedStudios = studios.filter(studio => studio.id !== id);
  setStudios(updatedStudios);

  console.log('Studio Deleted:', id); // Debugging
  console.log('Updated Studios:', updatedStudios); // Debugging

  // Re-render the owned studios list
  renderOwnedStudios();

  // Re-render the studios on the homepage (if open)
  if (window.location.pathname.endsWith('index.html')) {
    renderStudios();
  }

  alert('Studio deleted successfully!');
}









// Filter Studios
function filterStudios() {
  const studios = getStudios();

  // Get filter values
  const availabilityFilter = document.getElementById('filter-availability').value;
  const rentMin = document.getElementById('filter-rent-min').value;
  const rentMax = document.getElementById('filter-rent-max').value;
  const parkingFilter = document.getElementById('filter-parking').value;
  const publicTransportFilter = document.getElementById('filter-public-transport').value;

  // Apply filters
  const filteredStudios = studios.filter(studio => {
    // Availability filter
    if (availabilityFilter === 'available' && !studio.availability) return false;
    if (availabilityFilter === 'not-available' && studio.availability) return false;

    // Rent range filter
    if (rentMin && studio.rent < parseFloat(rentMin)) return false;
    if (rentMax && studio.rent > parseFloat(rentMax)) return false;

    // Parking filter
    if (parkingFilter === 'yes' && !studio.parking) return false;
    if (parkingFilter === 'no' && studio.parking) return false;

    // Public transport filter
    if (publicTransportFilter === 'yes' && !studio.publicTransport) return false;
    if (publicTransportFilter === 'no' && studio.publicTransport) return false;

    return true;
  });

  // Render filtered studios
  renderFilteredStudios(filteredStudios);

  // Close the filter modal after applying the filter
  closeFilterModal();
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

  // Render all studios
  renderStudios();
}

// Attach filter form submission
document.getElementById('filter-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  filterStudios();
});

// Toggle filter section visibility
function toggleFilterSection() {
  const filterSection = document.getElementById('filter-section');
  if (filterSection.style.display === 'none' || filterSection.style.display === '') {
    filterSection.style.display = 'block';
  } else {
    filterSection.style.display = 'none';
  }
}

// Open Filter Modal with animation
function openFilterModal() {
  const modal = document.getElementById('filter-modal');
  modal.style.display = 'block'; // Make modal visible
  setTimeout(() => {
    modal.style.opacity = '1'; // Set opacity to make modal fully visible with transition
  }, 10); // Slight delay for smooth transition effect
}

// Close Filter Modal with animation
function closeFilterModal() {
  const modal = document.getElementById('filter-modal');
  modal.style.opacity = '0'; // Fade out the modal
  setTimeout(() => {
    modal.style.display = 'none'; // Hide the modal completely after fade-out
  }, 500); // Delay to match the duration of the opacity transition
}

// Close modal if user clicks outside of it
window.onclick = function (event) {
  const modal = document.getElementById('filter-modal');
  if (event.target === modal) {
    closeFilterModal();
  }
};



// // Profile Page Script
// document.addEventListener('DOMContentLoaded', function () {
//   // ✅ Check if we are on the profile page
//   if (!document.getElementById('profile-form')) return;

//   // ✅ Retrieve the current user from localStorage
//   const currentUser = JSON.parse(localStorage.getItem('currentUser'));
//   console.log("Current User Data:", currentUser); // Debugging

//   // ✅ Redirect to login if no user is found
//   if (!currentUser || !currentUser.email) {
//       console.warn("No user found. Redirecting to login...");
//       window.location.href = 'login.html';
//       return;
//   }

//   // ✅ Populate profile fields
//   document.getElementById('profile-name').value = currentUser.name || '';
//   document.getElementById('profile-email').value = currentUser.email || '';
//   document.getElementById('profile-phone').value = currentUser.phone || '';
//   document.getElementById('profile-role').value = currentUser.role || 'Not Assigned';

//   // ✅ Make the role field read-only
//   document.getElementById('profile-role').readOnly = true;

//   // ✅ Set initial readonly state for editable fields
//   toggleEditMode(false);
//   document.querySelector('#profile-form button[type="submit"]').textContent = 'Edit Profile';

//   // ✅ Form submission handler
//   document.getElementById('profile-form').addEventListener('submit', function (e) {
//       e.preventDefault();
//       const submitBtn = document.querySelector('#profile-form button[type="submit"]');

//       if (submitBtn.textContent === 'Edit Profile') {
//           // Switch to edit mode
//           toggleEditMode(true);
//           submitBtn.textContent = 'Update Profile';
//       } else {
//           // Validate and save changes
//           if (validateAndSaveProfile(currentUser)) {
//               toggleEditMode(false);
//               submitBtn.textContent = 'Edit Profile';
//               alert('Profile updated successfully!');
//           }
//       }
//   });

//   // ✅ Logout functionality
//   document.getElementById('logout').addEventListener('click', function () {
//       localStorage.removeItem('currentUser'); // Remove session
//       window.location.href = 'login.html'; // Redirect to login
//   });
// });

// // 🔹 Toggle edit mode (only allows name, email, phone)
// function toggleEditMode(editMode) {
//   document.getElementById('profile-name').readOnly = !editMode;
//   document.getElementById('profile-email').readOnly = !editMode;
//   document.getElementById('profile-phone').readOnly = !editMode;

//   // Toggle the visibility of the mode change notice
//   const modeNotice = document.getElementById('mode-notice');
//   if (modeNotice) {
//       modeNotice.style.display = editMode ? 'block' : 'none';  // Show or hide notice based on editMode
//   }

//   // Toggle the visibility of the role change notice
//   const roleNotice = document.getElementById('role-notice');
//   if (roleNotice) {
//       roleNotice.style.display = editMode ? 'block' : 'none';  // Show or hide notice based on editMode
//   }
// }

// // 🔹 Validate and save profile changes
// function validateAndSaveProfile(currentUser) {
//   const newEmail = document.getElementById('profile-email').value.trim();
//   const newName = document.getElementById('profile-name').value.trim();
//   const newPhone = document.getElementById('profile-phone').value.trim();

//   // ✅ Email validation
//   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
//       alert('Please enter a valid email address');
//       return false;
//   }

//   // ✅ Check if email changed
//   if (newEmail !== currentUser.email) {
//       const users = JSON.parse(localStorage.getItem('users')) || [];
//       const emailExists = users.some(user => user.email === newEmail && user.email !== currentUser.email);

//       if (emailExists) {
//           alert('This email is already registered by another user');
//           return false;
//       }
//   }

//   // ✅ Update user data
//   const updatedUser = {
//       ...currentUser,
//       name: newName,
//       email: newEmail,
//       phone: newPhone
//   };

//   // ✅ Update storage
//   updateUserData(currentUser.email, updatedUser);
//   return true;
// }

// // 🔹 Update user data in all storage locations
// function updateUserData(oldEmail, updatedUser) {
//   // Update current user
//   localStorage.setItem('currentUser', JSON.stringify(updatedUser));

//   // Update in users array
//   const users = JSON.parse(localStorage.getItem('users')) || [];
//   const updatedUsers = users.map(user => user.email === oldEmail ? updatedUser : user);
//   localStorage.setItem('users', JSON.stringify(updatedUsers));
// }



document.addEventListener('DOMContentLoaded', async function () {
  // Check if we're on the profile page
  if (!document.getElementById('profile-form')) return;

  // Debugging localStorage
  console.log('Current localStorage:', localStorage);

  // Get current user from localStorage
  let currentUser;
  try {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.email) {
      throw new Error('No user logged in');
    }
  } catch (error) {
    console.error('Error getting current user:', error);
    window.location.href = 'login.html';
    return;
  }

  // Load profile data
  try {
    console.log('Fetching profile for:', currentUser.email);
    const response = await fetch(`/api/users/current?email=${encodeURIComponent(currentUser.email)}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch profile');
    }

    const { user } = await response.json();
    console.log('Received user data:', user);

    if (!user) throw new Error('User data not found');

    // Update localStorage with fresh data
    localStorage.setItem('currentUser', JSON.stringify(user));
    currentUser = user;

    // Populate form fields
    document.getElementById('profile-name').value = user.name || '';
    document.getElementById('profile-email').value = user.email || '';
    document.getElementById('profile-phone').value = user.phone || '';
    document.getElementById('profile-role').value = user.role || 'Not Assigned';

    // Set initial state
    document.getElementById('profile-role').readOnly = true;
    toggleEditMode(false);
    document.querySelector('#profile-form button[type="submit"]').textContent = 'Edit Profile';

  } catch (error) {
    console.error('Profile load error:', error);
    alert(`Error: ${error.message}`);
    window.location.href = 'login.html';
    return;
  }

  // Form submission handler
  document.getElementById('profile-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const submitBtn = document.querySelector('#profile-form button[type="submit"]');

    if (submitBtn.textContent === 'Edit Profile') {
      toggleEditMode(true);
      submitBtn.textContent = 'Update Profile';
      return;
    }

    try {
      const updates = {
        name: document.getElementById('profile-name').value.trim(),
        email: document.getElementById('profile-email').value.trim(),
        phone: document.getElementById('profile-phone').value.trim()
      };

      // Validate email
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Validate phone (10 digits)
      if (!/^\d{10}$/.test(updates.phone)) {
        throw new Error('Please enter a 10-digit phone number');
      }

      console.log('Sending update:', updates);
      const response = await fetch(`/api/users/${encodeURIComponent(currentUser.email)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: updates.name,
          phone: updates.phone,
          newEmail: updates.email !== currentUser.email ? updates.email : undefined
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Update failed');
      }

      const { user: updatedUser } = await response.json();
      console.log('Update successful:', updatedUser);

      // Update local storage
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      currentUser = updatedUser;

      toggleEditMode(false);
      submitBtn.textContent = 'Edit Profile';
      alert('Profile updated successfully!');

    } catch (error) {
      console.error('Update error:', error);
      alert(`Update failed: ${error.message}`);
    }
  });

  // Logout functionality
  document.getElementById('logout').addEventListener('click', function (e) {
    e.preventDefault();
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
  });
});

function toggleEditMode(editMode) {
  document.getElementById('profile-name').readOnly = !editMode;
  document.getElementById('profile-email').readOnly = !editMode;
  document.getElementById('profile-phone').readOnly = !editMode;

  const notices = document.querySelectorAll('#mode-notice, #role-notice');
  notices.forEach(notice => {
    if (notice) notice.style.display = editMode ? 'block' : 'none';
  });
}




  // Logout
  document.getElementById('logout')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
  });