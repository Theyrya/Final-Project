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
    const currentUser = getCurrentUser();
    if (!currentUser) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }
  
  // Helper function to initialize page
  function initPage() {
    const currentUser = getCurrentUser();
    if (!currentUser && !['login.html', 'signup.html'].includes(window.location.pathname.split('/').pop())) {
      window.location.href = 'login.html';
    }
  }
  
  // Initialize page on load
  document.addEventListener('DOMContentLoaded', initPage);