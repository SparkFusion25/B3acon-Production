import { useAuth } from './contexts/AuthContext';
import LoginPage from './components/Auth/LoginPage';
import AgencyDashboard from './components/Agency/AgencyDashboard';
import ClientDashboard from './components/Client/ClientDashboard';

function App() {
  const { isAuthenticated, userType, user } = useAuth();

  console.log('App render:', { isAuthenticated, userType, user });

  // Show login page if not authenticated
  if (!isAuthenticated || !user) {
    return <LoginPage />;
  }

  // Show appropriate dashboard based on user type and role
  if (userType === 'agency' || (user.role && user.role !== 'client')) {
    return <AgencyDashboard />;
  } else {
    return <ClientDashboard />;
  }
}

export default App;