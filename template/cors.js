    // Set CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*', // allow any origin
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', // Allow these HTTP methods
        'Access-Control-Allow-Headers': 'Content-Type', // Allow these headers
      };
    
      // Handle preflight requests (OPTIONS)
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          headers: corsHeaders,
        });
      }