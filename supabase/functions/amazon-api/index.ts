import { serve } from "npm:http/server";

const RAPIDAPI_KEY = Deno.env.get('RAPIDAPI_KEY') || 'a44cbcb368msh36010935c100d19p190087jsnea195e47cb11';
const RAPIDAPI_HOST = 'real-time-amazon-data.p.rapidapi.com';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const endpoint = url.pathname.split('/').pop();
    
    // Get parameters from query string
    const params = Object.fromEntries(url.searchParams.entries());
    
    // Construct the RapidAPI URL based on the endpoint
    let rapidApiUrl = '';
    
    switch (endpoint) {
      case 'influencer-profile':
        rapidApiUrl = `https://real-time-amazon-data.p.rapidapi.com/influencer-profile?${new URLSearchParams(params).toString()}`;
        break;
      case 'product-search':
        rapidApiUrl = `https://real-time-amazon-data.p.rapidapi.com/search?${new URLSearchParams(params).toString()}`;
        break;
      case 'product-details':
        rapidApiUrl = `https://real-time-amazon-data.p.rapidapi.com/product-details?${new URLSearchParams(params).toString()}`;
        break;
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid endpoint' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
    }

    console.log(`Making request to: ${rapidApiUrl}`);
    
    // Make the request to RapidAPI
    const response = await fetch(rapidApiUrl, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': RAPIDAPI_KEY,
      },
    });

    // Check if the response is successful
    if (!response.ok) {
      console.error(`API request failed with status ${response.status}`);
      return new Response(
        JSON.stringify({ 
          error: `API request failed with status ${response.status}`,
          message: 'The Amazon API service returned an error',
          endpoint: endpoint
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Parse and return the API response
    const data = await response.json();
    
    return new Response(
      JSON.stringify(data),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error processing Amazon API request:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred processing your request',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});