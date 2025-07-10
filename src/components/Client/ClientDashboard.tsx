import React, { useState } from 'react';
import ClientSidebar from './ClientSidebar';
import ClientHeader from './ClientHeader';
import ClientOverview from './ClientOverview';
import ClientServices from './ClientServices';
import ClientPurchase from './ClientPurchase';
import ClientProjects from './ClientProjects';
import ClientReports from './ClientReports';
import ClientBilling from './ClientBilling';
import ClientSettings from './ClientSettings';
import ClientSupport from './ClientSupport';

const ClientDashboard: React.FC = () => {
  const [activeModule, setActiveModule] = useState('overview');

  const handleModuleChange = (module: string) => {
    setActiveModule(module);
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'overview':
        return <ClientOverview />;
      case 'services':
        return <ClientServices />;
      case 'purchase':
        return <ClientPurchase />;
      case 'projects':
        return <ClientProjects />;
      case 'reports':
        return <ClientReports />;
      case 'billing':
        return <ClientBilling />;
      case 'settings':
        return <ClientSettings />;
      case 'support':
        return <ClientSupport />;
      default:
        return <ClientOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <ClientSidebar activeModule={activeModule} onModuleChange={handleModuleChange} />
      <ClientHeader currentModule={activeModule} />
      <main className="transition-all duration-300 lg:ml-56 xl:ml-64">
        {renderModule()}
      </main>
    </div>
  );
};

export default ClientDashboard;