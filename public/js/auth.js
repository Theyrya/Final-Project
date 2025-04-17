// Login Form Submission
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  
  try {
      const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (data.success) {
          localStorage.setItem('currentUser', JSON.stringify(data.user));
          alert('Login successful!');
          if (data.user.role === 'owner') {
              window.location.href = 'owner-dashboard.html';
          } else {
              window.location.href = 'index.html';
          }
      } else {
          alert(data.message || 'Login failed');
      }
  } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
  }
});

// Signup Form Submission
document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const phone = document.getElementById('signup-phone').value;
  const role = document.getElementById('signup-role').value;
  
  try {
      const response = await fetch('/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, role })
      });
      
      const data = await response.json();
      
      if (data.success) {
          localStorage.setItem('currentUser', JSON.stringify(data.user));
          alert('Signup successful!');
          if (role === 'owner') {
              window.location.href = 'owner-dashboard.html';
          } else {
              window.location.href = 'index.html';
          }
      } else {
          alert(data.message || 'Signup failed');
      }
  } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed. Please try again.');
  }
});

// Profile Form Submission
document.getElementById('profile-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('profile-name').value;
  const email = document.getElementById('profile-email').value;
  const phone = document.getElementById('profile-phone').value;
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  try {
      const response = await fetch(`/api/users/${currentUser.email}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, newEmail: email })
      });
      
      const data = await response.json();
      
      if (data.success) {
          localStorage.setItem('currentUser', JSON.stringify(data.user));
          alert('Profile updated successfully!');
      } else {
          alert(data.message || 'Profile update failed');
      }
  } catch (error) {
      console.error('Profile update error:', error);
      alert('Profile update failed. Please try again.');
  }
});

// Logout
document.getElementById('logout')?.addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
});