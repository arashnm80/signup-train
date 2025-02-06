const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const profileSection = document.getElementById('profile-section');
const publicProfileSection = document.getElementById('public-profile-section');
const bioInput = document.getElementById('bio');
const saveBioButton = document.getElementById('save-bio');
const publicBio = document.getElementById('public-bio');

let currentUser = null;

// Helper function to make API requests
async function makeRequest(url, method, data) {
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}

// Handle Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const data = await makeRequest('https://late-snow-ccf0.arashnm80.workers.dev/login', 'POST', { email, password });

  if (data.success) {
    currentUser = email;
    document.getElementById('auth-section').style.display = 'none';
    profileSection.style.display = 'block';
    publicProfileSection.style.display = 'block';
    bioInput.value = data.bio || '';
    publicBio.textContent = data.bio || 'No bio yet.';
  } else {
    alert('Login failed. Please check your email and password.');
  }
});

// Handle Sign Up
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  const data = await makeRequest('https://late-snow-ccf0.arashnm80.workers.dev/signup', 'POST', { email, password });

  if (data.success) {
    alert('Sign-up successful! Please log in.');
    document.getElementById('signup-email').value = '';
    document.getElementById('signup-password').value = '';
  } else {
    alert('Sign-up failed. Please try again.');
  }
});

// Handle Bio Update
saveBioButton.addEventListener('click', async () => {
  const bio = bioInput.value;
  const data = await makeRequest('https://late-snow-ccf0.arashnm80.workers.dev/update-bio', 'POST', { email: currentUser, bio });

  if (data.success) {
    publicBio.textContent = bio;
    alert('Bio updated successfully!');
  } else {
    alert('Failed to update bio.');
  }
});