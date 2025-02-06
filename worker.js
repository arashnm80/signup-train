addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
  });
  
  async function handleRequest(request) {
    const url = new URL(request.url);
    const path = url.pathname;
  
    // Set CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*', // Allow requests from your frontend
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', // Allow these HTTP methods
      'Access-Control-Allow-Headers': 'Content-Type', // Allow these headers
    };
  
    // Handle preflight requests (OPTIONS)
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
      });
    }
  
    if (path === '/signup' && request.method === 'POST') {
      // Handle sign-up
      const { email, password } = await request.json();
      // check if user already exists
      const user = await USERS.get(email);
      if (user){
        return new Response(JSON.stringify({ success: false }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 401,
          });
      }
      // Store user data in KV (for demo purposes, avoid storing plain passwords)
      await USERS.put(email, JSON.stringify({ password, bio: '' }));
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  
    if (path === '/login' && request.method === 'POST') {
      // Handle login
      const { email, password } = await request.json();
      const user = await USERS.get(email);
      if (user) {
        const userData = JSON.parse(user);
        if (userData.password === password) {
          return new Response(JSON.stringify({ success: true, bio: userData.bio }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }
      return new Response(JSON.stringify({ success: false }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }
  
    if (path === '/update-bio' && request.method === 'POST') {
      // Update bio
      const { email, bio } = await request.json();
      const user = await USERS.get(email);
      if (user) {
        const userData = JSON.parse(user);
        userData.bio = bio;
        await USERS.put(email, JSON.stringify(userData));
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({ success: false }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }
  
    return new Response('Not Found', {
      headers: corsHeaders,
      status: 404,
    });
  }