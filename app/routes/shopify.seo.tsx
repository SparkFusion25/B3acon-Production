import React from 'react';
import { LoaderFunction, redirect, json } from '@remix-run/node';
import PremiumShopifyDashboard from '../../src/components/Shopify/PremiumShopifyDashboard';
import { ShopifyAuthProvider } from '../../src/contexts/ShopifyAuthContext';

export const loader: LoaderFunction = async ({ request }) => {
  // SEO tools require starter+ subscription
  const url = new URL(request.url);
  
  // Check if user has starter or higher subscription
  // In production, this would verify subscription level
  
  return json({ 
    feature: 'seo-tools',
    requiredPlan: 'starter',
    authenticated: true 
  });
};

export default function ShopifySEO() {
  return (
    <ShopifyAuthProvider>
      <PremiumShopifyDashboard />
    </ShopifyAuthProvider>
  );
}