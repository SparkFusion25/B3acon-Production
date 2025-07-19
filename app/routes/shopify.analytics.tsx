import React from 'react';
import { LoaderFunction, redirect, json } from '@remix-run/node';
import PremiumShopifyDashboard from '../../src/components/Shopify/PremiumShopifyDashboard';
import { ShopifyAuthProvider } from '../../src/contexts/ShopifyAuthContext';

export const loader: LoaderFunction = async ({ request }) => {
  // Analytics require pro+ subscription
  const url = new URL(request.url);
  
  // Check if user has pro or higher subscription
  // In production, this would verify subscription level
  
  return json({ 
    feature: 'analytics',
    requiredPlan: 'pro',
    authenticated: true 
  });
};

export default function ShopifyAnalytics() {
  return (
    <ShopifyAuthProvider>
      <PremiumShopifyDashboard />
    </ShopifyAuthProvider>
  );
}