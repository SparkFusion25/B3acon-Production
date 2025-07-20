import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ShopifyLanding from './components/Shopify/ShopifyLanding';
import ShopifyDashboard from './components/Shopify/ShopifyDashboard';
import ShopifyInstallation from './components/Shopify/ShopifyInstallation';
import ShopifyAdmin from './components/Shopify/ShopifyAdmin';
import PremiumShopifyLanding from './components/Shopify/PremiumShopifyLanding';
import PremiumShopifyDashboard from './components/Shopify/PremiumShopifyDashboard';
import PremiumShopifyInstallation from './components/Shopify/PremiumShopifyInstallation';

// Main Shopify App Routes
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Premium Shopify App Routes - Main Implementation */}
      <Route path="/shopify" element={<PremiumShopifyLanding />} />
      <Route path="/shopify/install" element={<PremiumShopifyInstallation />} />
      <Route path="/shopify/dashboard" element={<PremiumShopifyDashboard />} />
      <Route path="/shopify/admin" element={<ShopifyAdmin />} />
      
      {/* Legacy Routes for Testing/Comparison */}
      <Route path="/shopify/legacy" element={<ShopifyLanding />} />
      <Route path="/shopify/legacy-dashboard" element={<ShopifyDashboard />} />
      <Route path="/shopify/legacy-install" element={<ShopifyInstallation />} />
      
      {/* Default Route - Redirect to main Shopify landing */}
      <Route path="/" element={<Navigate to="/shopify" replace />} />
      <Route path="*" element={<Navigate to="/shopify" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <AppRoutes />
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;