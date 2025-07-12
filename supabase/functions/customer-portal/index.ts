import { serve } from "npm:http/server";
import Stripe from "npm:stripe@12.18.0";

const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY') || 'sk_test_your_stripe_secret_key';
const stripe = new Stripe(stripeSecretKey || '', {
  apiVersion: '2023-10-16',
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
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
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse request body
    const { customerId, returnUrl } = await req.json();

    console.log('Creating customer portal session for:', { customerId, returnUrl });

    if (!customerId || !returnUrl) {
      return new Response(
        JSON.stringify({ error: 'Customer ID and return URL are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Create customer portal session
    let session;
    try {
      session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });
    } catch (stripeError) {
      console.error('Stripe error:', stripeError);
      
      // For demo purposes, create a mock session if Stripe key is invalid
      if (stripeSecretKey === 'sk_test_your_stripe_secret_key') {
        console.log('Using mock customer portal session (demo mode)');
        session = {
          url: returnUrl + '?portal_session=mock_session'
        };
      } else {
        throw stripeError;
      }
    }

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in customer-portal:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});