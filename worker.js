addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
  });
  
  async function handleRequest(request) {
    const url = new URL(request.url);
    const path = url.pathname;
  
    if (path === '/signup' && request.method === 'POST') {
      // Handle sign-up
      const { email, password } = await request.json();
      // Store user data in KV (for demo purposes, avoid storing plain passwords)
      await USERS.put(email, JSON.stringify({ password, bio: '' }));
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }
  
    if (path === '/login' && request.method === 'POST') {
      // Handle login
      const { email, password } = await request.json();
      const user = await USERS.get(email);
      if (user) {
        const userData = JSON.parse(user);
        if (userData.password === password) {
          return new Response(JSON.stringify({ success: true, bio: userData.bio }), { status: 200 });
        }
      }
      return new Response(JSON.stringify({ success: false }), { status: 401 });
    }
  
    if (path === '/update-bio' && request.method === 'POST') {
      // Update bio
      const { email, bio } = await request.json();
      const user = await USERS.get(email);
      if (user) {
        const userData = JSON.parse(user);
        userData.bio = bio;
        await USERS.put(email, JSON.stringify(userData));
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }
      return new Response(JSON.stringify({ success: false }), { status: 404 });
    }
  
    return new Response('Not Found', { status: 404 });
  }