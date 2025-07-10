import { loadStripe } from '@stripe/stripe-js';

// Load Stripe with the publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51Rj8q34FURD71tBcTVDxWZBc9IXI8Nj3fD62GfTTsUmfaNxtN7BmxqQ4bFHbgCX5jJCkVDLvRgOX5gwbrDTg8TF700SMllF0B5');

export { stripePromise };

// Helper functions for Stripe
export const stripeHelpers = {
  // Create a checkout session
  async createCheckoutSession(priceId: string, successUrl: string, cancelUrl: string) {
    try {
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

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting customer portal session:', error);
      throw error;
    }
  }
};