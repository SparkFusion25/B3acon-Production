import React from 'react';
import { LoaderFunction, redirect, json } from '@remix-run/node';
import PremiumShopifyDashboard from '../../src/components/Shopify/PremiumShopifyDashboard';
import { ShopifyAuthProvider } from '../../src/contexts/ShopifyAuthContext';

export const loader: LoaderFunction = async ({ request }) => {
  // Settings available for trial+ users
  const url = new URL(request.url);
  
  // Check if user has trial or higher subscription
  // In production, this would verify subscription level
  
  return json({ 
    feature: 'settings',
    requiredPlan: 'trial',
    authenticated: true 
  });
};

export default function ShopifySettings() {
  return (
    <ShopifyAuthProvider>
      <PremiumShopifyDashboard />
    </ShopifyAuthProvider>
  );
}