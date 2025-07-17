import React, { useState } from 'react';
import AgencySidebar from './AgencySidebar';
import AgencyHeader from './AgencyHeader';
import ClientSwitcher from '../Layout/ClientSwitcher';
import AgencyOverview from './AgencyOverview';
import ClientManagement from './ClientManagement';
import TeamManagement from './TeamManagement';
import BillingOverview from './BillingOverview';
import PerformanceAnalytics from './PerformanceAnalytics';
import InteractiveGuide from '../Onboarding/InteractiveGuide';
import { HelpCircle } from 'lucide-react';
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
  LeadProspectingTool,
  GlobalCommerceHub,
  TariffCalculator,
  LandedCostEstimator,
  ComplianceChecker,
  FreightEstimator,
  ShipmentTracker,
  HSCodeFinder,
  FTAChecker
} from './AgencyModules/AgencyModules';
import { mockAgencyData } from '../../data/mockAgencyData';
import { toast } from 'react-hot-toast';

const AgencyDashboard: React.FC = () => {
  const [activeModule, setActiveModule] = useState('overview');
  const [showInteractiveGuide, setShowInteractiveGuide] = useState(false);
  
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
      case 'global-commerce':
        return <GlobalCommerceHub />;
      case 'tariff-calculator':
        return <TariffCalculator />;
      case 'compliance':
        return <ComplianceChecker />;
      case 'shipping':
        return <ShipmentTracker />;
      case 'hs-codes':
        return <HSCodeFinder />;
      default:
        return <AgencyOverview data={mockAgencyData.overview} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AgencySidebar 
        activeModule={activeModule} 
        onModuleChange={handleModuleChange} 
      />
      <div className="lg:ml-56 xl:ml-64">
        <AgencyHeader currentModule={activeModule} />
        <div className="px-4 lg:px-6 py-2 bg-white border-b border-gray-200 flex justify-between items-center">
          <button
            onClick={() => setShowInteractiveGuide(true)}
            className="flex items-center space-x-2 px-3 py-2 text-signal-blue hover:bg-blue-50 rounded-lg transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Setup Guide</span>
          </button>
          <ClientSwitcher />
        </div>
      </div>
      <main className="transition-all duration-300 lg:ml-56 xl:ml-64 p-4 lg:p-6 pt-16 md:pt-4">
        {renderModule()}
      </main>
      
      {/* Interactive Guide */}
      <InteractiveGuide 
        isOpen={showInteractiveGuide}
        onClose={() => setShowInteractiveGuide(false)}
      />
    </div>
  );
};

export default AgencyDashboard;