const authForm = document.getElementById('auth-form');
const profileSection = document.getElementById('profile-section');
const publicProfileSection = document.getElementById('public-profile-section');
const bioInput = document.getElementById('bio');
const saveBioButton = document.getElementById('save-bio');
const publicBio = document.getElementById('public-bio');

let currentUser = null;

authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const response = await fetch('https://your-worker-url/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (data.success) {
    currentUser = email;
    authForm.style.display = 'none';
    profileSection.style.display = 'block';
    publicProfileSection.style.display = 'block';
    bioInput.value = data.bio || '';
    publicBio.textContent = data.bio || 'No bio yet.';
  } else {
    alert('Login failed. Please try again.');
  }
});

saveBioButton.addEventListener('click', async () => {
  const bio = bioInput.value;
  const response = await fetch('https://your-worker-url/update-bio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: currentUser, bio }),
  });

  const data = await response.json();
  if (data.success) {
    publicBio.textContent = bio;
    alert('Bio updated successfully!');
  } else {
    alert('Failed to update bio.');
  }
});