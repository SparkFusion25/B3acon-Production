import { useAuth } from './contexts/AuthContext';
import LoginPage from './components/Auth/LoginPage';
import PlanSelectionPage from './components/PlanSelection/PlanSelectionPage';
import AgencyDashboard from './components/Agency/AgencyDashboard';
import ClientDashboard from './components/Client/ClientDashboard';
import LandingPage from './components/Landing/LandingPage';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const { isAuthenticated, userType, user } = useAuth();

  console.log('App render:', { isAuthenticated, userType, user });

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />}
        />
        <Route 
          path="/signup" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage initialMode="signup" />}
        />
        <Route 
          path="/agency/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage initialMode="agency" />}
        />
        <Route 
          path="/select-plan" 
          element={isAuthenticated ? <PlanSelectionPage /> : <Navigate to="/login" />}
        />
        <Route 
          path="/pricing" 
          element={<PlanSelectionPage viewOnly={true} />}
        />
        <Route 
          path="/demo" 
          element={<DemoPage />}
        />
        <Route 
          path="/platform-overview" 
          element={<PlatformOverviewPage />}
        />
        <Route 
          path="/dashboard" 
          element={
            !isAuthenticated ? <Navigate to="/login" /> : 
            userType === 'agency' || (user?.role && user.role !== 'client') ? 
            <AgencyDashboard /> : <ClientDashboard />
          } 
        />
        <Route 
          path="/landing-editor" 
          element={
            !isAuthenticated ? <Navigate to="/login" /> : 
            userType === 'agency' || (user?.role && user.role !== 'client') ? 
            <AgencyDashboard /> : <Navigate to="/dashboard" />
          } 
        />
      </Routes>
    </Router>
  );
}

// Simple placeholder pages for demo and platform overview
const DemoPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Book a Demo</h1>
      <p className="text-gray-600 mb-4">Fill out the form below to schedule a personalized demo of the B3ACON platform.</p>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
        <button type="submit" className="w-full py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all">
          Schedule Demo
        </button>
      </form>
    </div>
  </div>
);

const PlatformOverviewPage = () => (
  <div className="min-h-screen bg-gray-50 py-12 px-4">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-12">B3ACON Platform Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Global Commerce Tools</h2>
          <p className="text-gray-600 mb-4">Comprehensive suite of tools for international trade compliance and logistics.</p>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              <span>Tariff & Duty Calculator</span>
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              <span>HS Code Lookup</span>
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              <span>Shipment Tracking</span>
            </li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Marketing & CRM</h2>
          <p className="text-gray-600 mb-4">Powerful tools to manage clients, campaigns, and performance.</p>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              <span>Client Management</span>
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              <span>CRM Hub</span>
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              <span>Performance Analytics</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default App;