import { loadStripe } from '@stripe/stripe-js';

// Load Stripe with the publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export { stripePromise };

// Helper functions for Stripe
export const stripeHelpers = {
  // Create a checkout session
  async createCheckoutSession(priceId: string, successUrl: string, cancelUrl: string) {
    try {
      console.log('Creating checkout session for price:', priceId);
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          priceId,
          successUrl,
          cancelUrl
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Stripe API error: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  },

  // Create a subscription
  async createSubscription(priceId: string, customerId: string) {
    try {
      console.log('Creating subscription for customer:', customerId);
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          priceId,
          customerId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Stripe API error: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  },

  // Get customer portal session
  async getCustomerPortalSession(customerId: string, returnUrl: string) {
    try {
      console.log('Getting customer portal for customer:', customerId);
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/customer-portal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          customerId,
          returnUrl
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Stripe API error: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting customer portal session:', error);
      throw error;
    }
  },

  // Check if Stripe is properly configured
  isConfigured() {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    const secretKey = import.meta.env.VITE_STRIPE_SECRET_KEY;
    const webhookSecret = import.meta.env.VITE_STRIPE_WEBHOOK_SECRET;
    
    console.log('Stripe configuration check:', {
      hasPublishableKey: !!publishableKey,
      hasSecretKey: !!secretKey,
      hasWebhookSecret: !!webhookSecret
    });
    
    return !!publishableKey && !!secretKey;
  }
};