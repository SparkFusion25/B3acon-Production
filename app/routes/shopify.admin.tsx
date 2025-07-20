import React from 'react';
import { LoaderFunction, redirect, json } from '@remix-run/node';
import ShopifyAdmin from '../../src/components/Shopify/ShopifyAdmin';
import { ShopifyAuthProvider } from '../../src/contexts/ShopifyAuthContext';

export const loader: LoaderFunction = async ({ request }) => {
  // Admin authentication check - requires enterprise access
  const url = new URL(request.url);
  
  // Check if user has admin/enterprise access
  // In production, this would verify enterprise subscription
  // and admin role from server-side session
  
  // For now, allow access and let React component handle auth
  return json({ adminAccess: true });
};

export default function ShopifyAdminRoute() {
  return (
    <ShopifyAuthProvider>
      <ShopifyAdmin />
    </ShopifyAuthProvider>
  );
}