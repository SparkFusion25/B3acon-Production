import { useState } from 'react';
import { DollarSign, CreditCard, FileText, TrendingUp, Download, CheckCircle, Plus, Minus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { stripeHelpers } from '../../lib/stripe';

interface Invoice {
  id: string;
  clientName: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  dueDate: string;
  issueDate: string;
  services: string[];
}

interface BillingData {
  monthlyRevenue: number;
  outstandingAmount: number;
  paidInvoices: number;
  pendingInvoices: number;
  recentInvoices: Invoice[];
}

interface BillingOverviewProps {
  billing: BillingData;
}

const BillingOverview = ({ billing }: BillingOverviewProps) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending' | 'overdue' | 'draft'>('all');
  const [activeTab, setActiveTab] = useState<'invoices' | 'plans' | 'addons'>('invoices');
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'growth' | 'pro'>('growth');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['landing_page_builder']);

  const handleManageSubscription = async () => {
    try {
      // In a real implementation, we would get the customer ID from the user's profile
      const customerId = 'cus_example123'; // Replace with actual customer ID
      
      // Get customer portal session
      const { url } = await stripeHelpers.getCustomerPortalSession(
        customerId,
        window.location.origin + '/billing'
      );
      
      // Redirect to customer portal
      window.location.href = url;
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast.error('Failed to open subscription management');
    }
  };

  const handleExportInvoices = () => {
    toast.success('Exporting invoices to CSV');
  };
  
  const handleCreateInvoice = () => {
    toast.success('Creating new invoice');
  };
  
  const handleViewInvoice = (invoiceId: string) => {
    toast.success(`Viewing invoice ${invoiceId}`);
  };
  
  const handleDownloadInvoice = (invoiceId: string) => {
    toast.success(`Downloading invoice ${invoiceId}`);
  };

  const handleUpdateSubscription = async () => {
    try {
      // In a real implementation, we would create a checkout session for the new subscription
      const planPrices = {
        starter: 'price_starter',
        growth: 'price_growth',
        pro: 'price_pro'
      };
      
      const priceId = planPrices[selectedPlan];
      
      // Create a checkout session
      const { sessionId, url } = await stripeHelpers.createCheckoutSession(
        priceId,
        `${window.location.origin}/billing/success`,
        `${window.location.origin}/billing/cancel`
      );
      
      // Redirect to Stripe Checkout
      window.location.href = url;
      
      toast.success(`Updating subscription to ${selectedPlan} plan with ${selectedAddons.length} add-ons`);
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast.error('Failed to update subscription');
    }
  };

  const filteredInvoices = billing.recentInvoices.filter(invoice => 
    filterStatus === 'all' || invoice.status === filterStatus
  );

  const getStatusColor = (status: string) => {
    const colors = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-red-100 text-red-800',
      draft: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const toggleAddon = (addon: string) => {
    if (selectedAddons.includes(addon)) {
      setSelectedAddons(selectedAddons.filter(a => a !== addon));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const calculateTotal = () => {
    const planPrices = {
      starter: 49,
      growth: 149,
      pro: 349
    };
    
    const addonPrices = {
      landing_page_builder: 29,
      white_label: 49,
      ai_assistant: 39,
      ppc_management: 59,
      extra_user: 19
    };
    
    const planPrice = planPrices[selectedPlan];
    const addonsTotal = selectedAddons.reduce((total, addon) => {
      return total + (addonPrices[addon as keyof typeof addonPrices] || 0);
    }, 0);
    
    return planPrice + addonsTotal;
  };

  const renderPlans = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Subscription Plans</h3>
        <button 
          onClick={handleUpdateSubscription}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
        >
          Update Plan
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Starter Plan */}
        <div 
          className={`bg-white rounded-xl shadow-sm border ${selectedPlan === 'starter' ? 'border-signal-blue ring-2 ring-signal-blue' : 'border-gray-200'} p-6 cursor-pointer hover:shadow-md transition-all`}
          onClick={() => setSelectedPlan('starter')}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Starter</h4>
              <p className="text-sm text-gray-600">For small businesses</p>
            </div>
            {selectedPlan === 'starter' && (
              <div className="w-6 h-6 bg-signal-blue rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <span className="text-3xl font-bold text-gray-900">$49</span>
            <span className="text-gray-600">/month</span>
          </div>
          
          <ul className="space-y-2 mb-6">
            <li className="flex items-center text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              <span>Basic CRM functionality</span>
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              <span>Up to 10 tracked keywords</span>
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              <span>1 user account</span>
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              <span>Basic SEO audit</span>
            </li>
          </ul>
        </div>
        
        {/* Growth Plan */}
        <div 
          className={`bg-white rounded-xl shadow-sm border ${selectedPlan === 'growth' ? 'border-signal-blue ring-2 ring-signal-blue' : 'border-gray-200'} p-6 cursor-pointer hover:shadow-md transition-all`}
          onClick={() => setSelectedPlan('growth')}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Growth</h4>
              <p className="text-sm text-gray-600">For growing businesses</p>
            </div>
            {selectedPlan === 'growth' && (
              <div className="w-6 h-6 bg-signal-blue rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <span className="text-3xl font-bold text-gray-900">$149</span>
            <span className="text-gray-600">/month</span>
          </div>
          
          <ul className="space-y-2 mb-6">
            <li className="flex items-center text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              <span>Full CRM functionality</span>
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              <span>Up to 50 tracked keywords</span>
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              <span>5 user accounts</span>
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              <span>Email marketing & social media</span>
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              <span>Full SEO reporting</span>
            </li>
          </ul>
        </div>
        
        {/* Pro Plan */}
        <div 
          className={`bg-white rounded-xl shadow-sm border ${selectedPlan === 'pro' ? 'border-signal-blue ring-2 ring-signal-blue' : 'border-gray-200'} p-6 cursor-pointer hover:shadow-md transition-all`}
          onClick={() => setSelectedPlan('pro')}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Pro</h4>
              <p className="text-sm text-gray-600">For agencies & enterprises</p>
            </div>
            {selectedPlan === 'pro' && (
              <div className="w-6 h-6 bg-signal-blue rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <span className="text-3xl font-bold text-gray-900">$349</span>
            <span className="text-gray-600">/month</span>
          </div>
          
          <ul className="space-y-2 mb-6">
            <li className="flex items-center text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              <span>Enterprise CRM functionality</span>
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              <span>Unlimited tracked keywords</span>
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              <span>Unlimited user accounts</span>
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              <span>All marketing tools included</span>
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              <span>White label included</span>
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              <span>API access</span>
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              <span>Priority support</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderAddons = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Add-On Services</h3>
        <button className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all">
          Update Add-Ons
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Landing Page Builder */}
        <div 
          className={`bg-white rounded-xl shadow-sm border ${selectedAddons.includes('landing_page_builder') ? 'border-signal-blue ring-2 ring-signal-blue' : 'border-gray-200'} p-6 cursor-pointer hover:shadow-md transition-all`}
          onClick={() => toggleAddon('landing_page_builder')}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Landing Page Builder</h4>
              <p className="text-sm text-gray-600">$29/month</p>
            </div>
            <div className={`w-6 h-6 ${selectedAddons.includes('landing_page_builder') ? 'bg-signal-blue' : 'bg-gray-200'} rounded-full flex items-center justify-center`}>
              {selectedAddons.includes('landing_page_builder') ? (
                <Minus className="w-4 h-4 text-white" />
              ) : (
                <Plus className="w-4 h-4 text-white" />
              )}
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">Create unlimited landing pages with our drag-and-drop builder. Includes templates, A/B testing, and conversion tracking.</p>
        </div>
        
        {/* White Label */}
        <div 
          className={`bg-white rounded-xl shadow-sm border ${selectedAddons.includes('white_label') ? 'border-signal-blue ring-2 ring-signal-blue' : 'border-gray-200'} p-6 cursor-pointer hover:shadow-md transition-all`}
          onClick={() => toggleAddon('white_label')}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">White Label Pack</h4>
              <p className="text-sm text-gray-600">$49/month</p>
            </div>
            <div className={`w-6 h-6 ${selectedAddons.includes('white_label') ? 'bg-signal-blue' : 'bg-gray-200'} rounded-full flex items-center justify-center`}>
              {selectedAddons.includes('white_label') ? (
                <Minus className="w-4 h-4 text-white" />
              ) : (
                <Plus className="w-4 h-4 text-white" />
              )}
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">Rebrand the platform with your logo, colors, and domain. Perfect for agencies serving clients.</p>
        </div>
        
        {/* AI Assistant */}
        <div 
          className={`bg-white rounded-xl shadow-sm border ${selectedAddons.includes('ai_assistant') ? 'border-signal-blue ring-2 ring-signal-blue' : 'border-gray-200'} p-6 cursor-pointer hover:shadow-md transition-all`}
          onClick={() => toggleAddon('ai_assistant')}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">AI Assistant</h4>
              <p className="text-sm text-gray-600">$39/month</p>
            </div>
            <div className={`w-6 h-6 ${selectedAddons.includes('ai_assistant') ? 'bg-signal-blue' : 'bg-gray-200'} rounded-full flex items-center justify-center`}>
              {selectedAddons.includes('ai_assistant') ? (
                <Minus className="w-4 h-4 text-white" />
              ) : (
                <Plus className="w-4 h-4 text-white" />
              )}
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">AI-powered content generation, keyword research, and marketing recommendations.</p>
        </div>
        
        {/* PPC Management */}
        <div 
          className={`bg-white rounded-xl shadow-sm border ${selectedAddons.includes('ppc_management') ? 'border-signal-blue ring-2 ring-signal-blue' : 'border-gray-200'} p-6 cursor-pointer hover:shadow-md transition-all`}
          onClick={() => toggleAddon('ppc_management')}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">PPC Management</h4>
              <p className="text-sm text-gray-600">$59/month</p>
            </div>
            <div className={`w-6 h-6 ${selectedAddons.includes('ppc_management') ? 'bg-signal-blue' : 'bg-gray-200'} rounded-full flex items-center justify-center`}>
              {selectedAddons.includes('ppc_management') ? (
                <Minus className="w-4 h-4 text-white" />
              ) : (
                <Plus className="w-4 h-4 text-white" />
              )}
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">Advanced PPC campaign management, bid optimization, and performance tracking.</p>
        </div>
        
        {/* Extra User */}
        <div 
          className={`bg-white rounded-xl shadow-sm border ${selectedAddons.includes('extra_user') ? 'border-signal-blue ring-2 ring-signal-blue' : 'border-gray-200'} p-6 cursor-pointer hover:shadow-md transition-all`}
          onClick={() => toggleAddon('extra_user')}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Extra User Seat</h4>
              <p className="text-sm text-gray-600">$19/month per user</p>
            </div>
            <div className={`w-6 h-6 ${selectedAddons.includes('extra_user') ? 'bg-signal-blue' : 'bg-gray-200'} rounded-full flex items-center justify-center`}>
              {selectedAddons.includes('extra_user') ? (
                <Minus className="w-4 h-4 text-white" />
              ) : (
                <Plus className="w-4 h-4 text-white" />
              )}
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">Add additional user seats to your plan. Each seat includes full access based on your subscription tier.</p>
        </div>
      </div>
      
      {/* Order Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h4>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <span className="font-medium text-gray-900">{selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan</span>
            <span className="font-medium text-gray-900">
              ${selectedPlan === 'starter' ? '49' : selectedPlan === 'growth' ? '149' : '349'}/month
            </span>
          </div>
          
          {selectedAddons.map(addon => (
            <div key={addon} className="flex justify-between items-center">
              <span className="text-gray-600">
                {addon === 'landing_page_builder' ? 'Landing Page Builder' : 
                 addon === 'white_label' ? 'White Label Pack' : 
                 addon === 'ai_assistant' ? 'AI Assistant' : 
                 addon === 'ppc_management' ? 'PPC Management' : 
                 addon === 'extra_user' ? 'Extra User Seat' : addon}
              </span>
              <span className="text-gray-600">
                ${addon === 'landing_page_builder' ? '29' : 
                  addon === 'white_label' ? '49' : 
                  addon === 'ai_assistant' ? '39' : 
                  addon === 'ppc_management' ? '59' : 
                  addon === 'extra_user' ? '19' : '0'}/month
              </span>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <span className="text-lg font-bold text-gray-900">Total</span>
          <span className="text-lg font-bold text-gray-900">${calculateTotal()}/month</span>
        </div>
        
        <button 
          onClick={handleUpdateSubscription}
          className="w-full mt-6 py-3 bg-gradient-to-r from-signal-blue to-beacon-orange text-white font-medium rounded-lg hover:shadow-lg transition-all"
        >
          Update Subscription
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Billing Overview</h2>
        <p className="text-gray-600">Track invoices, payments, and revenue</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-4 lg:space-x-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'invoices'
                ? 'border-signal-blue text-signal-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Invoices</span>
          </button>
          <button
            onClick={() => setActiveTab('plans')}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'plans'
                ? 'border-signal-blue text-signal-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Subscription Plans</span>
          </button>
          <button
            onClick={() => setActiveTab('addons')}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'addons'
                ? 'border-signal-blue text-signal-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Add-Ons</span>
          </button>
        </nav>
      </div>

      {activeTab === 'invoices' && (
        <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Monthly Revenue</h3>
            <div className="w-8 h-8 bg-gradient-to-r from-signal-blue to-blue-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            ${billing.monthlyRevenue.toLocaleString()}
          </div>
          <p className="text-sm text-green-600">↗ +18% this month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Outstanding</h3>
            <div className="w-8 h-8 bg-gradient-to-r from-beacon-orange to-orange-600 rounded-lg flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            ${billing.outstandingAmount.toLocaleString()}
          </div>
          <p className="text-sm text-yellow-600">Pending collection</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Paid Invoices</h3>
            <div className="w-8 h-8 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{billing.paidInvoices}</div>
          <p className="text-sm text-green-600">This month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Pending Invoices</h3>
            <div className="w-8 h-8 bg-gradient-to-r from-beacon-orange to-red-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{billing.pendingInvoices}</div>
          <p className="text-sm text-yellow-600">Awaiting payment</p>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
            >
              <option value="all">All Invoices</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleExportInvoices}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button 
              onClick={handleCreateInvoice}
              className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Create Invoice</span>
            </button>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Invoices</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Invoice ID</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Client</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Amount</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Issue Date</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Due Date</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <span className="font-mono text-sm text-gray-900">#{invoice.id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900">{invoice.clientName}</div>
                      <div className="text-sm text-gray-600">
                        {invoice.services.slice(0, 2).join(', ')}
                        {invoice.services.length > 2 && ` +${invoice.services.length - 2} more`}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-gray-900">${invoice.amount.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{invoice.issueDate}</td>
                  <td className="py-4 px-6 text-gray-600">{invoice.dueDate}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleViewInvoice(invoice.id)}
                        className="text-signal-blue hover:text-blue-700 text-sm font-medium"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handleDownloadInvoice(invoice.id)}
                        className="text-gray-400 hover:text-gray-600 text-sm font-medium"
                      >
                        Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredInvoices.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
          <p className="text-gray-600">Try adjusting your filter criteria</p>
        </div>
      )}
      </>
      )}
      
      {activeTab === 'plans' && renderPlans()}
      {activeTab === 'addons' && renderAddons()}
    </div>
  );
};

export default BillingOverview;