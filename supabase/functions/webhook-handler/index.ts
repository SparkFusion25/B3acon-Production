import { serve } from 'npm:http/server';
import Stripe from 'npm:stripe@12.18.0';
import { createClient } from 'npm:@supabase/supabase-js@2.38.4';

const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const stripe = new Stripe(stripeSecretKey || '', {
  apiVersion: '2023-10-16',
});

const supabase = createClient(supabaseUrl || '', supabaseServiceKey || '');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

    // Get the signature from the headers
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return new Response(JSON.stringify({ error: 'Stripe signature missing' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get the raw body
    const body = await req.text();

    // Verify the webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret || '');
    } catch (err) {
      return new Response(JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        // Update the database with the subscription information
        const { error } = await supabase
          .from('subscriptions')
          .insert({
            customer_id: session.customer,
            subscription_id: session.subscription,
            status: 'active',
            metadata: session,
          });

        if (error) {
          console.error('Error inserting subscription:', error);
        }
        break;
      }
      case 'invoice.paid': {
        const invoice = event.data.object;
        // Update the subscription status
        const { error } = await supabase
          .from('subscriptions')
          .update({ status: 'active', last_payment_date: new Date().toISOString() })
          .eq('subscription_id', invoice.subscription);

        if (error) {
          console.error('Error updating subscription:', error);
        }
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        // Update the subscription status
        const { error } = await supabase
          .from('subscriptions')
          .update({ status: 'past_due' })
          .eq('subscription_id', invoice.subscription);

        if (error) {
          console.error('Error updating subscription:', error);
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        // Update the subscription status
        const { error } = await supabase
          .from('subscriptions')
          .update({ status: 'canceled', canceled_at: new Date().toISOString() })
          .eq('subscription_id', subscription.id);

        if (error) {
          console.error('Error updating subscription:', error);
        }
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});