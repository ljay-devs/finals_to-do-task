document.querySelector('#logform').addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent default form submission

  // Get input values
  const username = document.getElementById('username1').value;
  const password = document.getElementById('password').value;

  try {
    // Send login data via POST
    const response = await fetch('http://localhost:6969/login', {
      method: 'POST', // Make sure to use POST, not GET
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password }) // Send as JSON
    });

    const result = await response.json();

    // If login successful, store user ID securely
    if (result.success) {
      // Storing userId in localStorage or sessionStorage (instead of the URL)
      localStorage.setItem('userid', result.userId);
      window.location.href = '/frontend/components/dashboard.html'; // Redirect after login
    } else {
      document.getElementById('logfailed').textContent = 'Username or Password incorrect';
    }

  } catch (error) {
    console.error('An error occurred:', error);
  }
});
