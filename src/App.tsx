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
      <Route path="/shopify/install" element={<PremiumShopifyInstallation />} />
      <Route path="/shopify/dashboard" element={<PremiumShopifyDashboard />} />
      <Route path="/shopify/admin" element={<ShopifyAdmin />} />
      
      {/* Legacy Routes for Testing */}
      <Route path="/shopify/legacy" element={<ShopifyLanding />} />
      <Route path="/shopify/legacy-dashboard" element={<ShopifyDashboard />} />
      <Route path="/shopify/legacy-install" element={<ShopifyInstallation />} />
      
      {/* Premium Auth Routes */}
      <Route path="/login" element={<PremiumLoginForm />} />
      <Route path="/signup" element={<PremiumSignupForm />} />
      
      {/* Plan Selection Route */}
      <Route path="/plans" element={<PlanSelectionPage viewOnly={!isAuthenticated} />} />
      
      {/* Legacy Auth Routes */}
      <Route path="/auth/legacy-login" element={<LoginPage />} />
      <Route path="/auth/legacy-signup" element={<LoginPage initialMode="signup" />} />

      {/* Conditional Routing Based on Authentication */}
      {!isAuthenticated ? (
        <Route path="*" element={<Navigate to="/login" replace />} />
      ) : (
        <>
          {/* Protected B3ACON Platform Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                {userType === 'agency' ? <AgencyDashboard /> : <ClientDashboard />}
              </ProtectedRoute>
            } 
          />
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