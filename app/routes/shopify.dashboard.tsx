import React from 'react';
import { LoaderFunction, redirect, json } from '@remix-run/node';
import PremiumShopifyDashboard from '../../src/components/Shopify/PremiumShopifyDashboard';
import { ShopifyAuthProvider } from '../../src/contexts/ShopifyAuthContext';

export const loader: LoaderFunction = async ({ request }) => {
  // Authentication check for dashboard access
  const url = new URL(request.url);
  
  // Check if user has valid session/authentication
  // For now, we'll use the React context for authentication
  // In production, this would check server-side session
  
  return json({ authenticated: true });
};

export default function ShopifyDashboard() {
  return (
    <ShopifyAuthProvider>
      <PremiumShopifyDashboard />
    </ShopifyAuthProvider>
  );
}