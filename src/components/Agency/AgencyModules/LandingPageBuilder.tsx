import React, { useState } from 'react';
import { Layout, Eye, Settings, BarChart3, Palette, Code, Smartphone, Monitor, Edit } from 'lucide-react';
import { toast } from 'react-hot-toast';

const LandingPageBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState('editor');
  const [selectedDevice, setSelectedDevice] = useState('desktop');
  
  const handleCreatePage = () => {
    toast.success('Creating new landing page');
  };
  
  const handleUploadTemplate = () => {
    toast.success('Uploading new template');
  };
  
  const handleSavePage = () => {
    toast.success('Saving page changes');
  };
  
  const handleExportReport = () => {
    toast.success('Exporting analytics report');
  };
  
  const handleEditPage = (pageId: number) => {
    toast.success(`Editing page #${pageId}`);
  };
  
  const handlePreviewPage = (pageId: number) => {
    toast.success(`Previewing page #${pageId}`);
  };
  
  const handleViewAnalytics = (pageId: number) => {
    toast.success(`Viewing analytics for page #${pageId}`);
  };
  
  const handleUseTemplate = (templateId: number) => {
    toast.success(`Using template #${templateId}`);
  };
  
  const handlePreviewTemplate = (templateId: number) => {
    toast.success(`Previewing template #${templateId}`);
  };

  const landingPages = [
    {
      id: 1,
      name: 'SaaS Product Launch',
      title: 'Revolutionary Project Management Tool',
      slug: 'saas-launch',
      status: 'published',
      client: 'TechCorp Solutions',
      template: 'SaaS Landing',
      analytics: {
        total_views: 12450,
        unique_visitors: 8900,
        conversions: 445,
        conversion_rate: 5.0,
        bounce_rate: 35.2
      },
      published_at: '2024-01-15'
    },
    {
      id: 2,
      name: 'E-commerce Store',
      title: 'Premium Fashion Collection',
      slug: 'fashion-store',
      status: 'draft',
      client: 'RetailMax Inc',
      template: 'E-commerce',
      analytics: {
        total_views: 0,
        unique_visitors: 0,
        conversions: 0,
        conversion_rate: 0,
        bounce_rate: 0
      },
      published_at: null
    },
    {
      id: 3,
      name: 'Agency Services',
      title: 'Digital Marketing Excellence',
      slug: 'agency-services',
      status: 'published',
      client: 'FinanceFlow',
      template: 'Agency',
      analytics: {
        total_views: 8900,
        unique_visitors: 6700,
        conversions: 234,
        conversion_rate: 3.5,
        bounce_rate: 42.1
      },
      published_at: '2024-01-10'
    }
  ];

  const templates = [
    {
      id: 1,
      name: 'SaaS Landing',
      category: 'saas',
      description: 'Perfect for software and app launches',
      thumbnail: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      is_premium: false,
      usage_count: 45,
      rating: 4.8
    },
    {
      id: 2,
      name: 'E-commerce Store',
      category: 'ecommerce',
      description: 'Optimized for online stores and products',
      thumbnail: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      is_premium: true,
      usage_count: 32,
      rating: 4.9
    },
    {
      id: 3,
      name: 'Agency Portfolio',
      category: 'agency',
      description: 'Showcase your agency services',
      thumbnail: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      is_premium: false,
      usage_count: 28,
      rating: 4.7
    },
    {
      id: 4,
      name: 'Event Landing',
      category: 'event',
      description: 'Perfect for conferences and events',
      thumbnail: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      is_premium: true,
      usage_count: 19,
      rating: 4.6
    }
  ];

  const pageElements = [
    { id: 'hero', name: 'Hero Section', icon: Layout, description: 'Main banner with headline and CTA' },
    { id: 'features', name: 'Features', icon: Settings, description: 'Highlight key features and benefits' },
    { id: 'testimonials', name: 'Testimonials', icon: Eye, description: 'Customer reviews and social proof' },
    { id: 'pricing', name: 'Pricing', icon: BarChart3, description: 'Pricing tables and plans' },
    { id: 'contact', name: 'Contact Form', icon: Palette, description: 'Lead capture and contact forms' },
    { id: 'footer', name: 'Footer', icon: Code, description: 'Footer with links and information' }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const renderPages = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Landing Pages</h3>
        <button 
          onClick={handleCreatePage}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Layout className="w-4 h-4 mr-2" />
          Create Page
        </button>
      </div>

      {/* Page Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-600">Total Pages</h4>
            <div className="w-8 h-8 bg-gradient-to-r from-signal-blue to-blue-600 rounded-lg flex items-center justify-center">
              <Layout className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{landingPages.length}</div>
          <p className="text-sm text-green-600">↗ +2 this month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-600">Total Views</h4>
            <div className="w-8 h-8 bg-gradient-to-r from-beacon-orange to-orange-600 rounded-lg flex items-center justify-center">
              <Eye className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {landingPages.reduce((sum, p) => sum + p.analytics.total_views, 0).toLocaleString()}
          </div>
          <p className="text-sm text-green-600">↗ +25% this month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-600">Total Conversions</h4>
            <div className="w-8 h-8 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {landingPages.reduce((sum, p) => sum + p.analytics.conversions, 0).toLocaleString()}
          </div>
          <p className="text-sm text-green-600">↗ +18% this month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-600">Avg Conversion Rate</h4>
            <div className="w-8 h-8 bg-gradient-to-r from-beacon-orange to-red-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {(landingPages.reduce((sum, p) => sum + p.analytics.conversion_rate, 0) / landingPages.length).toFixed(1)}%
          </div>
          <p className="text-sm text-green-600">↗ +1.2% this month</p>
        </div>
      </div>

      {/* Pages List */}
      <div className="space-y-4">
        {landingPages.map((page) => (
          <div key={page.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-lg flex items-center justify-center">
                  <Layout className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{page.name}</h4>
                  <p className="text-sm text-gray-600">{page.title}</p>
                  <p className="text-xs text-gray-500">Client: {page.client} • Template: {page.template}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(page.status)}`}>
                {page.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-4">
              <div>
                <span className="text-gray-600">Views:</span>
                <div className="font-medium text-gray-900">{page.analytics.total_views.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-600">Visitors:</span>
                <div className="font-medium text-gray-900">{page.analytics.unique_visitors.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-600">Conversions:</span>
                <div className="font-medium text-green-600">{page.analytics.conversions.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-600">Conv. Rate:</span>
                <div className="font-medium text-blue-600">{page.analytics.conversion_rate}%</div>
              </div>
              <div>
                <span className="text-gray-600">Bounce Rate:</span>
                <div className="font-medium text-orange-600">{page.analytics.bounce_rate}%</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                URL: <span className="font-mono text-blue-600">b3acon.com/{page.slug}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleEditPage(page.id)}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handlePreviewPage(page.id)}
                  className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                >
                  Preview
                </button>
                <button 
                  onClick={() => handleViewAnalytics(page.id)}
                  className="px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 transition-colors"
                >
                  Analytics
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Page Templates</h3>
        <button 
          onClick={handleUploadTemplate}
          className="px-4 py-2 bg-gradient-to-r from-beacon-orange to-orange-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Palette className="w-4 h-4 mr-2" />
          Upload Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="relative">
              <img
                src={template.thumbnail}
                alt={template.name}
                className="w-full h-48 object-cover"
              />
              {template.is_premium && (
                <span className="absolute top-2 right-2 px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">
                  Premium
                </span>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{template.name}</h4>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                  {template.category}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              
              <div className="flex items-center justify-between text-sm mb-3">
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-500">★</span>
                  <span className="font-medium text-gray-900">{template.rating}</span>
                </div>
                <span className="text-gray-600">{template.usage_count} uses</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleUseTemplate(template.id)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  Use Template
                </button>
                <button 
                  onClick={() => handlePreviewTemplate(template.id)}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition-colors"
                >
                  Preview
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBuilder = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Page Builder</h3>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button 
              onClick={() => setSelectedDevice('desktop')}
              className={`p-2 rounded ${selectedDevice === 'desktop' ? 'bg-white shadow-sm' : ''}`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setSelectedDevice('mobile')}
              className={`p-2 rounded ${selectedDevice === 'mobile' ? 'bg-white shadow-sm' : ''}`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
          <button 
            onClick={handleSavePage}
            className="px-4 py-2 bg-gradient-to-r from-signal-blue to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            Save Page
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Elements Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h4 className="font-medium text-gray-900 mb-4">Page Elements</h4>
          <div className="space-y-2">
            {pageElements.map((element) => {
              const Icon = element.icon;
              return (
                <div
                  key={element.id}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <Icon className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-900 text-sm">{element.name}</span>
                  </div>
                  <p className="text-xs text-gray-600">{element.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Canvas */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className={`mx-auto bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 ${
              selectedDevice === 'desktop' ? 'max-w-full h-96' : 'max-w-sm h-96'
            }`}>
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Layout className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Drag elements here to build your page</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Viewing: {selectedDevice === 'desktop' ? 'Desktop' : 'Mobile'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h4 className="font-medium text-gray-900 mb-4">Properties</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value="#ffffff"
                  className="w-8 h-8 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  value="#ffffff"
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value="#000000"
                  className="w-8 h-8 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  value="#000000"
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
              <select className="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                <option>12px</option>
                <option>14px</option>
                <option>16px</option>
                <option>18px</option>
                <option>24px</option>
                <option>32px</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Padding</label>
              <input
                type="range"
                min="0"
                max="50"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Page Analytics</h3>
        <button 
          onClick={handleExportReport}
          className="px-4 py-2 bg-gradient-to-r from-beacon-orange to-red-500 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-medium text-gray-900 mb-4">Performance Overview</h4>
          <div className="space-y-4">
            {landingPages.filter(p => p.status === 'published').map((page) => (
              <div key={page.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900">{page.name}</h5>
                  <span className="text-sm text-green-600">{page.analytics.conversion_rate}% CVR</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Views:</span>
                    <div className="font-medium text-gray-900">{page.analytics.total_views.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Visitors:</span>
                    <div className="font-medium text-gray-900">{page.analytics.unique_visitors.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Conversions:</span>
                    <div className="font-medium text-green-600">{page.analytics.conversions}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-medium text-gray-900 mb-4">Optimization Tips</h4>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h5 className="font-medium text-green-900 mb-2">High Performer</h5>
              <p className="text-sm text-green-800 mb-2">SaaS Product Launch</p>
              <p className="text-sm text-green-700">
                Excellent 5.0% conversion rate. Consider using this as a template for similar campaigns.
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h5 className="font-medium text-yellow-900 mb-2">Needs Improvement</h5>
              <p className="text-sm text-yellow-800 mb-2">Agency Services</p>
              <p className="text-sm text-yellow-700">
                High bounce rate (42.1%). Consider improving page load speed and above-the-fold content.
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h5 className="font-medium text-blue-900 mb-2">A/B Test Suggestion</h5>
              <p className="text-sm text-blue-800 mb-2">Test different headlines</p>
              <p className="text-sm text-blue-700">
                Try testing different value propositions in your hero sections to improve conversion rates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'pages', label: 'Pages', icon: Layout },
    { id: 'templates', label: 'Templates', icon: Palette },
    { id: 'builder', label: 'Builder', icon: Code },
    { id: 'editor', label: 'Landing Page Editor', icon: Edit },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Landing Page Builder</h2>
        <p className="text-gray-600">Create high-converting landing pages with drag-and-drop simplicity</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-4 lg:space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-signal-blue text-signal-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'pages' && renderPages()}
        {activeTab === 'templates' && renderTemplates()}
        {activeTab === 'builder' && renderBuilder()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'editor' && (
          <div className="text-center py-12">
            <Edit className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Landing Page Editor</h3>
            <p className="text-gray-600">Please wait while we load the editor...</p>
            <button 
              onClick={() => window.location.href = '/landing-editor'}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
            >
              Open Landing Page Editor
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPageBuilder;