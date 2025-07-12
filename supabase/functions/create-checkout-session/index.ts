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
    const { priceId, successUrl, cancelUrl } = await req.json();

    console.log('Creating checkout session with:', { priceId, successUrl, cancelUrl });

    if (!priceId || !successUrl || !cancelUrl) {
      return new Response(
        JSON.stringify({ error: 'Price ID, success URL, and cancel URL are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Create Checkout Session
    let session;
    try {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
      });
    } catch (stripeError) {
      console.error('Stripe error:', stripeError);
      
      // For demo purposes, create a mock session if Stripe key is invalid
      if (stripeSecretKey === 'sk_test_your_stripe_secret_key') {
        console.log('Using mock checkout session (demo mode)');
        session = {
          id: 'cs_test_' + Math.random().toString(36).substring(2, 15),
          url: successUrl + '?session_id=mock_session'
        };
      } else {
        throw stripeError;
      }
    }

    return new Response(JSON.stringify({ sessionId: session.id, url: session.url }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in create-checkout-session:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});