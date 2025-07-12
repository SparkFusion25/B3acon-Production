import { loadStripe } from '@stripe/stripe-js';

// Load Stripe with the publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export { stripePromise };

// Helper functions for Stripe
export const stripeHelpers = {
  // Create a checkout session
  async createCheckoutSession(priceId: string, successUrl: string, cancelUrl: string) {
    try {
      // For demo purposes, simulate a successful checkout session
      console.log('Demo: Creating checkout session for price:', priceId);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock session data
      const mockSession = {
        sessionId: 'cs_test_' + Math.random().toString(36).substring(2, 15),
        url: successUrl + '?session_id=demo_session&price_id=' + priceId
      };
      
      console.log('Demo checkout session created:', mockSession);
      return mockSession;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      // Return a fallback mock session
      return {
        sessionId: 'cs_demo_fallback',
        url: successUrl + '?demo=true&price_id=' + priceId
      };
    }
  },

  // Create a subscription
  async createSubscription(priceId: string, customerId: string) {
    try {
      console.log('Demo: Creating subscription for customer:', customerId);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock subscription data
      const mockSubscription = {
        id: 'sub_' + Math.random().toString(36).substring(2, 15),
        status: 'active',
        customer: customerId,
        items: {
          data: [{ price: { id: priceId } }]
        }
      };
      
      console.log('Demo subscription created:', mockSubscription);
      return { subscription: mockSubscription };
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  },

  // Get customer portal session
  async getCustomerPortalSession(customerId: string, returnUrl: string) {
    try {
      console.log('Demo: Getting customer portal for customer:', customerId);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock portal URL
      const mockPortalUrl = returnUrl + '?portal_session=demo_portal&customer_id=' + customerId;
      
      console.log('Demo customer portal URL:', mockPortalUrl);
      return { url: mockPortalUrl };
    } catch (error) {
      console.error('Error getting customer portal session:', error);
      throw error;
    }
  },
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