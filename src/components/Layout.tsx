import React from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout min-h-screen bg-gray-50">
      <Navigation />
      <main className="main-content ml-0 md:ml-64 pt-20 pb-20 md:pt-6 md:pb-6 px-4 md:px-6 transition-all duration-300">
        {children}
      </main>
    </div>
  );
};

export default Layout;