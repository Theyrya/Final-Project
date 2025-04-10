// Initialize auth data in localStorage if it doesn't exist
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
  }
  
  const getUsers = () => JSON.parse(localStorage.getItem('users'));
  const setUsers = (users) => localStorage.setItem('users', JSON.stringify(users));
  const getCurrentUser = () => JSON.parse(localStorage.getItem('currentUser'));
  const setCurrentUser = (user) => localStorage.setItem('currentUser', JSON.stringify(user));
  
  // Login Form Submission
  document.getElementById('login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const users = getUsers();
    const user = users.find(user => user.email === email);
  
    if (user) {
      setCurrentUser(user);
      alert('Login successful!');
      if (user.role === 'owner') {
        window.location.href = 'owner-dashboard.html';
      } else {
        window.location.href = 'index.html';
      }
    } else {
      alert('User not found. Please sign up.');
    }
  });
  
  // Signup Form Submission
  document.getElementById('signup-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-phone').value;
    const role = document.getElementById('signup-role').value;
  
    const users = getUsers();
    const userExists = users.some(user => user.email === email);
  
    if (userExists) {
      alert('User already exists. Please log in.');
      return;
    }
  
    const newUser = { name, email, phone, role };
    users.push(newUser);
    setUsers(users);
    setCurrentUser(newUser);
  
    alert('Signup successful!');
    if (role === 'owner') {
      window.location.href = 'owner-dashboard.html';
    } else {
      window.location.href = 'index.html';
    }
  });
  
  // Profile Form Submission
  document.getElementById('profile-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('profile-name').value;
    const email = document.getElementById('profile-email').value;
    const phone = document.getElementById('profile-phone').value;
  
    const users = getUsers();
    const currentUser = getCurrentUser();
    const userIndex = users.findIndex(user => user.email === currentUser.email);
  
    if (userIndex !== -1) {
      users[userIndex].name = name;
      users[userIndex].email = email;
      users[userIndex].phone = phone;
      setUsers(users);
      setCurrentUser(users[userIndex]);
      alert('Profile updated successfully!');
    } else {
      alert('User not found.');
    }
  });
  
  // Logout
  document.getElementById('logout')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
  });