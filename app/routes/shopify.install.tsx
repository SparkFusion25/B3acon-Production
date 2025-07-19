import React from 'react';
import { LoaderFunction, redirect } from '@remix-run/node';
import PremiumShopifyInstallation from '../../src/components/Shopify/PremiumShopifyInstallation';

export const loader: LoaderFunction = async ({ request }) => {
  // Check if user is authenticated for installation flow
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  
  // Allow installation flow even without authentication
  // but track the referral parameters
  return null;
};

export default function ShopifyInstall() {
  return <PremiumShopifyInstallation />;
}