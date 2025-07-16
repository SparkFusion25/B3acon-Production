import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'

// Add global error handler to catch and log timer-related errors
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  
  // Check if it's a timer-related error
  if (event.error && event.error.message && event.error.message.includes('_onTimeout')) {
    console.error('Timer error detected. This might be caused by a setTimeout issue.');
    event.preventDefault(); // Prevent the error from bubbling up
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <Toaster position="top-right" />
      <App />
    </AuthProvider>
  </StrictMode>,
)