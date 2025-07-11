import { useAuth } from './contexts/AuthContext';
import LoginPage from './components/Auth/LoginPage';
import AgencyDashboard from './components/Agency/AgencyDashboard';
import ClientDashboard from './components/Client/ClientDashboard';
import LandingPage from './components/Landing/LandingPage';
import LandingPageEditor from './components/Agency/AgencyModules/LandingPageEditor';
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
            <LandingPageEditor /> : <Navigate to="/dashboard" />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;