import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ShopifyLanding from './components/Shopify/ShopifyLanding';
import ShopifyDashboard from './components/Shopify/ShopifyDashboard';
import ShopifyInstallation from './components/Shopify/ShopifyInstallation';
import ShopifyAdmin from './components/Shopify/ShopifyAdmin';
import './index.css';

// Standalone Shopify App
const ShopifyApp: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Shopify App Routes */}
          <Route path="/" element={<ShopifyLanding />} />
          <Route path="/install" element={<ShopifyInstallation />} />
          <Route path="/dashboard" element={<ShopifyDashboard />} />
          <Route path="/admin" element={<ShopifyAdmin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
};

// Only render if this is the standalone Shopify app
if (window.location.hostname.includes('shopify-app') || window.location.pathname.startsWith('/shopify-app')) {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ShopifyApp />
    </React.StrictMode>,
  );
}

export default ShopifyApp;