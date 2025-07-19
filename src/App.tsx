import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './components/Auth/LoginPage';
import AgencyDashboard from './components/Agency/AgencyDashboard';
import ClientDashboard from './components/Client/ClientDashboard';
import PlanSelectionPage from './components/PlanSelection/PlanSelectionPage';
import ShopifyIntegration from './components/Integrations/ShopifyIntegration';
import ShopifyLanding from './components/Shopify/ShopifyLanding';
import ShopifyDashboard from './components/Shopify/ShopifyDashboard';
import ShopifyInstallation from './components/Shopify/ShopifyInstallation';
import ShopifyAdmin from './components/Shopify/ShopifyAdmin';
import PremiumShopifyLanding from './components/Shopify/PremiumShopifyLanding';
import PremiumShopifyDashboard from './components/Shopify/PremiumShopifyDashboard';
import PremiumShopifyInstallation from './components/Shopify/PremiumShopifyInstallation';
import ShopifyPremiumLogin from './components/Shopify/ShopifyPremiumLogin';

import SubscribePage from './components/Shopify/SubscribePage';
import { PremiumLoginForm, PremiumSignupForm } from './components/Premium/PremiumAuthLayout';
import PremiumDashboard from './components/Premium/PremiumDashboard';
import CRMDealsPage from './components/Premium/CRMDealsPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Main App Routes
const AppRoutes: React.FC = () => {
  const { isAuthenticated, userType } = useAuth();

  return (
    <Routes>
      {/* Public Shopify App Routes - Always Available */}
      <Route path="/shopify" element={<PremiumShopifyLanding />} />
      <Route path="/shopify/login" element={<ShopifyPremiumLogin />} />
      <Route path="/shopify/install" element={<PremiumShopifyInstallation />} />
      <Route path="/shopify/subscribe" element={<SubscribePage />} />
      <Route path="/shopify/dashboard" element={<PremiumShopifyDashboard />} />
      <Route path="/shopify/admin" element={<ShopifyAdmin />} />
      <Route path="/shopify/plans" element={<PlanSelectionPage viewOnly={true} />} />
      
      {/* Shopify SEO Tools Routes */}
      <Route path="/shopify/seo/website-analysis" element={<PremiumShopifyDashboard />} />
      <Route path="/shopify/seo/keyword-research" element={<PremiumShopifyDashboard />} />
      <Route path="/shopify/seo/competitor-analysis" element={<PremiumShopifyDashboard />} />
      <Route path="/shopify/seo/rank-tracking" element={<PremiumShopifyDashboard />} />
      <Route path="/shopify/seo/backlinks" element={<PremiumShopifyDashboard />} />
      <Route path="/shopify/seo/technical-audit" element={<PremiumShopifyDashboard />} />
      <Route path="/shopify/seo/content-optimizer" element={<PremiumShopifyDashboard />} />
      
      {/* Shopify Analytics Routes */}
      <Route path="/shopify/analytics/traffic" element={<PremiumShopifyDashboard />} />
      <Route path="/shopify/analytics/conversions" element={<PremiumShopifyDashboard />} />
      <Route path="/shopify/analytics/revenue" element={<PremiumShopifyDashboard />} />
      <Route path="/shopify/analytics/customers" element={<PremiumShopifyDashboard />} />
      <Route path="/shopify/analytics/products" element={<PremiumShopifyDashboard />} />
      
      {/* Shopify Automation Routes */}
      <Route path="/shopify/automation/email-campaigns" element={<PremiumShopifyDashboard />} />
      <Route path="/shopify/automation/abandoned-cart" element={<PremiumShopifyDashboard />} />
      <Route path="/shopify/automation/inventory-alerts" element={<PremiumShopifyDashboard />} />
      <Route path="/shopify/automation/price-rules" element={<PremiumShopifyDashboard />} />
      
      {/* Shopify Integrations Routes */}
      <Route path="/shopify/integrations/amazon" element={<PremiumShopifyDashboard />} />
      <Route path="/shopify/integrations/google-ads" element={<PremiumShopifyDashboard />} />
      <Route path="/shopify/integrations/facebook" element={<PremiumShopifyDashboard />} />
      <Route path="/shopify/integrations/klaviyo" element={<PremiumShopifyDashboard />} />
      <Route path="/shopify/integrations/mailchimp" element={<PremiumShopifyDashboard />} />
      
      {/* Shopify Plugins Routes */}
      <Route path="/shopify/plugins/popup-builder" element={<PremiumShopifyDashboard />} />
      <Route path="/shopify/plugins/review-manager" element={<PremiumShopifyDashboard />} />
      <Route path="/shopify/plugins/upsell-engine" element={<PremiumShopifyDashboard />} />
      <Route path="/shopify/plugins/social-proof" element={<PremiumShopifyDashboard />} />
      
      {/* Shopify Reports Routes */}
      <Route path="/shopify/reports/performance" element={<PremiumShopifyDashboard />} />
      <Route path="/shopify/reports/seo-audit" element={<PremiumShopifyDashboard />} />
      <Route path="/shopify/reports/competitor" element={<PremiumShopifyDashboard />} />
      <Route path="/shopify/reports/custom" element={<PremiumShopifyDashboard />} />
      
      {/* Shopify Support Routes */}
      <Route path="/shopify/support/help-center" element={<PremiumShopifyDashboard />} />
      <Route path="/shopify/support/contact" element={<PremiumShopifyDashboard />} />
      <Route path="/shopify/support/tutorials" element={<PremiumShopifyDashboard />} />
      <Route path="/shopify/support/community" element={<PremiumShopifyDashboard />} />
      
      {/* Shopify Settings Routes */}
      <Route path="/shopify/settings/account" element={<PremiumShopifyDashboard />} />
      <Route path="/shopify/settings/billing" element={<PremiumShopifyDashboard />} />
      <Route path="/shopify/settings/notifications" element={<PremiumShopifyDashboard />} />
      <Route path="/shopify/settings/api-keys" element={<PremiumShopifyDashboard />} />
      
             {/* Legacy Routes for Testing */}
       <Route path="/shopify/legacy" element={<ShopifyLanding />} />
       <Route path="/shopify/legacy-dashboard" element={<ShopifyDashboard />} />
       <Route path="/shopify/legacy-install" element={<ShopifyInstallation />} />
      
              {/* Premium Auth Routes */}
        <Route path="/login" element={<PremiumLoginForm />} />
        <Route path="/signup" element={<PremiumSignupForm />} />
        
        {/* Legacy Auth Routes */}
        <Route path="/auth/legacy-login" element={<LoginPage />} />
        <Route path="/auth/legacy-signup" element={<LoginPage initialMode="signup" />} />
      <Route path="/plans" element={<PlanSelectionPage viewOnly={!isAuthenticated} />} />

      {/* Root Route - Always redirect to main software login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Conditional Routing Based on Authentication */}
      {!isAuthenticated ? (
        <Route path="*" element={<Navigate to="/login" replace />} />
      ) : (
        <>
          {/* Premium Dashboard Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <PremiumDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/crm/deals" 
            element={
              <ProtectedRoute>
                <CRMDealsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Default Dashboard Route for Authenticated Users */}
          <Route 
            path="/main" 
            element={
              <ProtectedRoute>
                {userType === 'agency' ? <AgencyDashboard /> : <ClientDashboard />}
              </ProtectedRoute>
            } 
          />
          
          {/* Legacy Dashboard Routes */}
          <Route 
            path="/dashboard/legacy" 
            element={
              <ProtectedRoute>
                {userType === 'agency' ? <AgencyDashboard /> : <ClientDashboard />}
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/agency/*" 
            element={
              <ProtectedRoute>
                <AgencyDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/client/*" 
            element={
              <ProtectedRoute>
                <ClientDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* B3ACON Platform Shopify Integration */}
          <Route 
            path="/integrations/shopify" 
            element={
              <ProtectedRoute>
                <ShopifyIntegration />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;