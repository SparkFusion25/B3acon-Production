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

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Main App Routes
const AppRoutes: React.FC = () => {
  const { isAuthenticated, userType } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<LoginPage initialMode="signup" />} />
        <Route path="/plans" element={<PlanSelectionPage viewOnly />} />
        <Route path="/integrations/shopify" element={<ShopifyIntegration />} />
        <Route path="/shopify" element={<ShopifyLanding />} />
        <Route path="/shopify/install" element={<ShopifyInstallation />} />
        <Route path="/shopify/dashboard" element={<ShopifyDashboard />} />
        <Route path="/shopify/admin" element={<ShopifyAdmin />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      {/* Protected Routes */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            {userType === 'agency' ? <AgencyDashboard /> : <ClientDashboard />}
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
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
      <Route path="/plans" element={<PlanSelectionPage />} />
      <Route path="/integrations/shopify" element={<ShopifyIntegration />} />
      <Route path="/shopify" element={<ShopifyLanding />} />
      <Route path="/shopify/install" element={<ShopifyInstallation />} />
      <Route path="/shopify/dashboard" element={<ShopifyDashboard />} />
      <Route path="/shopify/admin" element={<ShopifyAdmin />} />
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
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