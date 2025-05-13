document.querySelector("#signup").addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('username2').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password2').value;

  try {
    const response = await fetch('http://localhost:6969/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    const result = await response.json();
    if (result.success) {
      console.log(result.message);
      window.location.href= '/frontend/components/login_signup.html'
    } else {
      console.log('Signup failed:', result.error || 'Unknown error');
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
});
