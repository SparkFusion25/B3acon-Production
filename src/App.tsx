import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Import all page components
import Dashboard from './components/Dashboard/Dashboard';
import SEOTools from './components/SEOTools';
import LiveTracking from './components/LiveTracking';
import CRM from './components/CRM';
import Prospecting from './components/Prospecting';
import AffiliateSystem from './components/AffiliateSystem';
import AdminPanel from './components/AdminPanel';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected routes with layout */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/seo-tools" element={
              <ProtectedRoute>
                <Layout>
                  <SEOTools />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/live-tracking" element={
              <ProtectedRoute>
                <Layout>
                  <LiveTracking />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/crm" element={
              <ProtectedRoute>
                <Layout>
                  <CRM />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/prospecting" element={
              <ProtectedRoute>
                <Layout>
                  <Prospecting />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/affiliate-system" element={
              <ProtectedRoute>
                <Layout>
                  <AffiliateSystem />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/admin" element={
              <ProtectedRoute>
                <Layout>
                  <AdminPanel />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Redirect any unknown routes to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;