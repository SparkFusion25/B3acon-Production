import React, { useState } from 'react';
import AgencySidebar from './AgencySidebar';
import AgencyHeader from './AgencyHeader';
import AgencyOverview from './AgencyOverview';
import ClientManagement from './ClientManagement';
import TeamManagement from './TeamManagement';
import BillingOverview from './BillingOverview';
import PerformanceAnalytics from './PerformanceAnalytics';
import {
  CRMHub,
  GoogleServicesHub,
  SEOIntelligenceHub,
  SocialMediaCenter,
  ShopifyIntegration,
  CreativeStudio,
  WhiteLabelManagement,
  AffiliateMarketing,
  EmailMarketing,
  LandingPageBuilder,
  AdminDashboard,
  LeadProspectingTool
} from './AgencyModules/AgencyModules';
import { mockAgencyData } from '../../data/mockAgencyData';
import { toast } from 'react-hot-toast';

const AgencyDashboard: React.FC = () => {
  const [activeModule, setActiveModule] = useState('overview');
  
  console.log('AgencyDashboard rendering with activeModule:', activeModule);

  const handleModuleChange = (module: string) => {
    console.log('Module change requested:', module);
    setActiveModule(module);
    toast.success(`Navigated to ${module.charAt(0).toUpperCase() + module.slice(1)} module`);
  };

  const renderModule = () => {
    console.log('Rendering module:', activeModule);
    switch (activeModule) {
      case 'overview':
        return <AgencyOverview data={mockAgencyData.overview} />;
      case 'clients':
        return <ClientManagement clients={mockAgencyData.clients} />;
      case 'crm':
        return <CRMHub />;
      case 'team':
        return <TeamManagement team={mockAgencyData.team} />;
      case 'google':
        return <GoogleServicesHub />;
      case 'seo':
        return <SEOIntelligenceHub />;
      case 'social':
        return <SocialMediaCenter />;
      case 'shopify':
        return <ShopifyIntegration />;
      case 'creative':
        return <CreativeStudio />;
      case 'whitelabel':
        return <WhiteLabelManagement />;
      case 'affiliate':
        return <AffiliateMarketing />;
      case 'email':
        return <EmailMarketing />;
      case 'landing':
        return <LandingPageBuilder />;
      case 'billing':
        return <BillingOverview billing={mockAgencyData.billing} />;
      case 'analytics':
        return <PerformanceAnalytics analytics={mockAgencyData.analytics} />;
      case 'admin':
        return <AdminDashboard />;
      case 'prospecting':
        return <LeadProspectingTool />;
      default:
        return <AgencyOverview data={mockAgencyData.overview} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AgencySidebar activeModule={activeModule} onModuleChange={handleModuleChange} />
      <AgencyHeader currentModule={activeModule} />
      <main className="transition-all duration-300 lg:ml-56 xl:ml-64">
        {renderModule()}
      </main>
    </div>
  );
};

export default AgencyDashboard;