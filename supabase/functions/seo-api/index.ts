import { serve } from "npm:http/server";

// API key for the SEO service
const API_KEY = Deno.env.get('SEO_API_KEY') || 'demo_key_for_testing';
const API_BASE_URL = 'https://api.default-application.com/v1/default-application_10799181';

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
    const path = url.pathname.split('/').pop();
    const domain = url.searchParams.get('domain');
    const targetUrl = url.searchParams.get('url');

    if (!domain && !targetUrl) {
      return new Response(
        JSON.stringify({ error: 'Domain or URL parameter is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    let endpoint = '';
    let params = new URLSearchParams();

    // Set up the appropriate endpoint based on the requested path
    switch (path) {
      case 'onpage-analyze':
        endpoint = '/onpage-seo';
        params.append('domain', domain || '');
        break;
      case 'speed-data':
        endpoint = '/loading-speed';
        params.append('url', targetUrl || domain || '');
        break;
      case 'domain-data':
        endpoint = '/domain-data';
        params.append('domain', domain || '');
        break;
      case 'backlinks':
        endpoint = '/backlinks';
        params.append('domain', domain || '');
        break;
      case 'url-backlinks':
        endpoint = '/url-backlinks';
        params.append('url', targetUrl || '');
        break;
      case 'new-backlinks':
        endpoint = '/new-backlinks';
        params.append('domain', domain || '');
        break;
      case 'poor-backlinks':
        endpoint = '/poor-backlinks';
        params.append('domain', domain || '');
        break;
      case 'referral-domains':
        endpoint = '/referral-domains';
        params.append('domain', domain || '');
        break;
      case 'top-keywords':
        endpoint = '/top-keywords';
        params.append('domain', domain || '');
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

    // Make the API request
    const apiUrl = `${API_BASE_URL}${endpoint}?${params.toString()}`;
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'X-API-ID': 'default-application_10799181',
      },
    });

    // Check if the response is successful
    if (!response.ok) {
      console.error(`API request failed with status ${response.status}`);
      return new Response(
        JSON.stringify({ 
          error: `API request failed with status ${response.status}`,
          message: 'The SEO API service returned an error',
          endpoint: endpoint
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    let data;
    try {
      data = await response.json();
    } catch (error) {
      console.error('Error parsing API response:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to parse API response' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Return the API response
    return new Response(
      JSON.stringify(data),
      {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error processing SEO API request:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred processing your request',
        apiUrl: API_BASE_URL,
        apiKeyPresent: !!API_KEY
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});