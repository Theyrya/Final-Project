// Helper function to make API calls
async function apiCall(endpoint, method = 'GET', data = null) {
  const options = {
      method,
      headers: {
          'Content-Type': 'application/json',
      },
  };

  if (data) {
      options.body = JSON.stringify(data);
  }

  try {
      const response = await fetch(`/api/${endpoint}`, options);
      if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
      }
      return await response.json();
  } catch (error) {
      console.error('API call error:', error);
      throw error;
  }
}

// Helper function to check if user is logged in
function checkAuth() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) {
      window.location.href = 'login.html';
      return false;
  }
  return true;
}

// Helper function to initialize page
function initPage() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const currentPage = window.location.pathname.split('/').pop();
  
  if (!currentUser && !['login.html', 'signup.html'].includes(currentPage)) {
      window.location.href = 'login.html';
  }
  
  // Update profile form if on profile page
  if (currentUser && currentPage === 'profile.html') {
      document.getElementById('profile-name').value = currentUser.name || '';
      document.getElementById('profile-email').value = currentUser.email || '';
      document.getElementById('profile-phone').value = currentUser.phone || '';
      document.getElementById('profile-role').value = currentUser.role || 'Not Assigned';
  }
}

// Initialize page on load
document.addEventListener('DOMContentLoaded', initPage);

// Show owner contact modal
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