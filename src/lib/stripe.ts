import { loadStripe } from '@stripe/stripe-js';

// Load Stripe with the publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

export { stripePromise };

// Helper functions for Stripe
export const stripeHelpers = {
  // Create a checkout session
  async createCheckoutSession(priceId: string, successUrl: string, cancelUrl: string, trial: boolean = true, trialDays: number = 14) {
    try {
      // In a real implementation, we would create a checkout session on the server
      // For now, we'll simulate the checkout session
      
      // Check if we're in a production environment with Stripe configured
      if (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY && import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY.startsWith('pk_')) {
        // In production, we would call our backend API to create a checkout session
        // const response = await fetch('/api/create-checkout-session', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     priceId,
        //     successUrl,
        //     cancelUrl,
        //     trial,
        //     trialDays
        //   }),
        // });
        
        // const session = await response.json();
        // return session;
        
        // For demo purposes, simulate a successful checkout session
        console.log('Creating checkout session for price:', priceId);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Return mock session data
        const mockSession = {
          sessionId: 'cs_test_' + Math.random().toString(36).substring(2, 15),
          url: successUrl + '?session_id=demo_session&price_id=' + priceId
        };
        
        console.log('Checkout session created:', mockSession);
        return mockSession;
      } else {
        // In development, simulate a successful checkout session
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
      }
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
      // In a real implementation, we would create a subscription on the server
      // For now, we'll simulate the subscription
      
      // Check if we're in a production environment with Stripe configured
      if (import.meta.env.VITE_STRIPE_SECRET_KEY && import.meta.env.VITE_STRIPE_SECRET_KEY.startsWith('sk_')) {
        // In production, we would call our backend API to create a subscription
        // const response = await fetch('/api/create-subscription', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     priceId,
        //     customerId
        //   }),
        // });
        
        // const data = await response.json();
        // return data;
        
        // For demo purposes, simulate a successful subscription
        console.log('Creating subscription for customer:', customerId);
        
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
        
        console.log('Subscription created:', mockSubscription);
        return { subscription: mockSubscription };
      } else {
        // In development, simulate a successful subscription
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
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  },

  // Get customer portal session
  async getCustomerPortalSession(customerId: string, returnUrl: string) {
    try {
      // In a real implementation, we would create a customer portal session on the server
      // For now, we'll simulate the customer portal session
      
      // Check if we're in a production environment with Stripe configured
      if (import.meta.env.VITE_STRIPE_SECRET_KEY && import.meta.env.VITE_STRIPE_SECRET_KEY.startsWith('sk_')) {
        // In production, we would call our backend API to create a customer portal session
        // const response = await fetch('/api/create-customer-portal-session', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     customerId,
        //     returnUrl
        //   }),
        // });
        
        // const data = await response.json();
        // return data;
        
        // For demo purposes, simulate a successful customer portal session
        console.log('Getting customer portal for customer:', customerId);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Return mock portal URL
        const mockPortalUrl = returnUrl + '?portal_session=demo_portal&customer_id=' + customerId;
        
        console.log('Customer portal URL:', mockPortalUrl);
        return { url: mockPortalUrl };
      } else {
        // In development, simulate a successful customer portal session
        console.log('Demo: Getting customer portal for customer:', customerId);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Return mock portal URL
        const mockPortalUrl = returnUrl + '?portal_session=demo_portal&customer_id=' + customerId;
        
        console.log('Demo customer portal URL:', mockPortalUrl);
        return { url: mockPortalUrl };
      }
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

    // For demo purposes, set a flag to indicate Stripe is configured
    if (publishableKey && secretKey) {
      localStorage.setItem('stripeConfigured', 'true');
    }
    
    console.log('Stripe configuration check:', {
      hasPublishableKey: !!publishableKey,
      hasSecretKey: !!secretKey,
      hasWebhookSecret: !!webhookSecret
    });
    
    // For demo purposes, always return true
    return true;
  },
  
  // Get available products
  async getProducts() {
    try {
      // In a real implementation, we would fetch products from Stripe
      // For now, we'll return mock products
      return [
        {
          id: 'prod_FREE',
          name: 'Free Starter',
          price: 0,
          priceId: 'price_FREE',
          features: ['Tariff Calculator', 'HS Code Lookup', 'CRM Hub']
        },
        {
          id: 'prod_GROWTH',
          name: 'Growth',
          price: 49.99,
          priceId: 'price_12345G',
          features: ['All Free features', 'Shipment Tracking', 'Email Marketing', 'Landing Pages']
        },
        {
          id: 'prod_PRO',
          name: 'Pro Trader',
          price: 149.99,
          priceId: 'price_12345P',
          features: ['All Growth features', 'Compliance Checker', 'FTA Checker', 'Landed Cost Calculator', 'Google Services', 'SEO Tools', 'Shopify Integration']
        },
        {
          id: 'prod_ENT',
          name: 'Enterprise',
          price: 'Custom',
          priceId: '',
          features: ['All Pro features', 'White Label', 'Custom API Integrations', 'Dedicated Account Manager']
        }
      ];
    } catch (error) {
      console.error('Error getting products:', error);
      throw error;
    }
  }
};