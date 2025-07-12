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
    const { priceId, customerId } = await req.json();

    console.log('Creating subscription for:', { priceId, customerId });

    if (!priceId || !customerId) {
      return new Response(
        JSON.stringify({ error: 'Price ID and customer ID are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Create subscription
    let subscription;
    try {
      subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            price: priceId,
          },
        ],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });
    } catch (stripeError) {
      console.error('Stripe error:', stripeError);
      
      // For demo purposes, create a mock subscription if Stripe key is invalid
      if (stripeSecretKey === 'sk_test_your_stripe_secret_key') {
        console.log('Using mock subscription (demo mode)');
        subscription = {
          id: 'sub_' + Math.random().toString(36).substring(2, 15),
          status: 'active',
          customer: customerId,
          items: {
            data: [{ price: { id: priceId } }]
          }
        };
      } else {
        throw stripeError;
      }
    }

    return new Response(JSON.stringify({ subscription }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in create-subscription:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});