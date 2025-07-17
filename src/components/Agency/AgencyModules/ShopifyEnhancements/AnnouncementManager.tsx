import React, { useState } from 'react';
import { Megaphone, Calendar, Clock, Globe, Palette, Play, Pause, BarChart3, Eye, MousePointer, Zap, Settings } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface AnnouncementBanner {
  id: string;
  name: string;
  message: string;
  status: 'active' | 'paused' | 'scheduled' | 'expired';
  type: 'sale' | 'holiday' | 'shipping' | 'product-launch' | 'custom';
  design: {
    backgroundColor: string;
    textColor: string;
    fontSize: 'small' | 'medium' | 'large';
    animation: 'none' | 'slide' | 'fade' | 'bounce' | 'pulse';
    position: 'top' | 'bottom';
  };
  scheduling: {
    startDate: string;
    endDate: string;
    timezone: string;
    recurring?: boolean;
    recurringPattern?: 'daily' | 'weekly' | 'monthly';
  };
  targeting: {
    pages: string[];
    countries: string[];
    devices: string[];
    newVisitors?: boolean;
    returningVisitors?: boolean;
  };
  actions: {
    type: 'link' | 'discount' | 'none';
    value?: string;
    discountCode?: string;
  };
  analytics: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
  };
}

interface HolidayEvent {
  name: string;
  date: string;
  type: 'holiday' | 'shopping-event' | 'seasonal';
  template?: string;
}

const AnnouncementManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('banners');
  const [banners, setBanners] = useState<AnnouncementBanner[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<AnnouncementBanner | null>(null);

  // Pre-defined holiday templates
  const holidayTemplates: HolidayEvent[] = [
    { name: 'Black Friday', date: '2024-11-29', type: 'shopping-event', template: '🖤 BLACK FRIDAY: Up to 70% OFF Everything! Limited Time Only!' },
    { name: 'Cyber Monday', date: '2024-12-02', type: 'shopping-event', template: '💻 CYBER MONDAY: Exclusive Online Deals - Save Big Today!' },
    { name: 'Christmas', date: '2024-12-25', type: 'holiday', template: '🎄 Christmas Sale: Perfect Gifts Await - Free Shipping on $50+' },
    { name: 'New Year', date: '2025-01-01', type: 'holiday', template: '🎊 New Year New You: Start 2025 with 30% OFF Everything!' },
    { name: 'Valentine\'s Day', date: '2025-02-14', type: 'holiday', template: '💝 Valentine\'s Special: Show Your Love with 25% OFF Gifts' },
    { name: 'Mother\'s Day', date: '2025-05-11', type: 'holiday', template: '🌹 Mother\'s Day: Celebrate Mom with Special Deals' },
    { name: 'Summer Sale', date: '2024-06-21', type: 'seasonal', template: '☀️ Summer Sale is Here: Beat the Heat with Hot Deals!' }
  ];

  const [newBanner, setNewBanner] = useState<Partial<AnnouncementBanner>>({
    name: '',
    message: '',
    status: 'scheduled',
    type: 'sale',
    design: {
      backgroundColor: '#3B82F6',
      textColor: '#FFFFFF',
      fontSize: 'medium',
      animation: 'slide',
      position: 'top'
    },
    scheduling: {
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      timezone: 'UTC'
    },
    targeting: {
      pages: ['all'],
      countries: ['all'],
      devices: ['desktop', 'mobile'],
      newVisitors: true,
      returningVisitors: true
    },
    actions: {
      type: 'none'
    },
    analytics: {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      ctr: 0
    }
  });

  const handleCreateBanner = () => {
    if (!newBanner.name || !newBanner.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    const banner: AnnouncementBanner = {
      ...newBanner as AnnouncementBanner,
      id: Date.now().toString()
    };

    setBanners(prev => [...prev, banner]);
    setIsCreating(false);
    toast.success('Announcement banner created successfully!');
    
    // Reset form
    setNewBanner({
      name: '',
      message: '',
      status: 'scheduled',
      type: 'sale',
      design: {
        backgroundColor: '#3B82F6',
        textColor: '#FFFFFF',
        fontSize: 'medium',
        animation: 'slide',
        position: 'top'
      },
      scheduling: {
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        timezone: 'UTC'
      },
      targeting: {
        pages: ['all'],
        countries: ['all'],
        devices: ['desktop', 'mobile']
      },
      actions: {
        type: 'none'
      },
      analytics: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0
      }
    });
  };

  const handleToggleBanner = (bannerId: string) => {
    setBanners(prev => prev.map(banner => 
      banner.id === bannerId 
        ? { ...banner, status: banner.status === 'active' ? 'paused' : 'active' }
        : banner
    ));
    toast.success('Banner status updated');
  };

  const applyHolidayTemplate = (holiday: HolidayEvent) => {
    setNewBanner(prev => ({
      ...prev,
      name: `${holiday.name} Banner`,
      message: holiday.template || `Special ${holiday.name} offer!`,
      type: holiday.type === 'shopping-event' ? 'sale' : 'holiday' as any,
      scheduling: {
        ...prev.scheduling!,
        startDate: new Date(new Date(holiday.date).getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: holiday.date
      }
    }));
    toast.success(`Applied ${holiday.name} template`);
  };

  const renderBannersList = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Announcement Banners</h3>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Megaphone className="w-4 h-4" />
          <span>Create Banner</span>
        </button>
      </div>

      {banners.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Megaphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Announcement Banners Yet</h3>
          <p className="text-gray-600 mb-4">Create your first banner to start engaging visitors</p>
          <button
            onClick={() => setIsCreating(true)}
            className="px-6 py-2 bg-signal-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Get Started
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{banner.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{banner.message}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      banner.status === 'active' ? 'bg-green-100 text-green-800' :
                      banner.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                      banner.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {banner.status}
                    </span>
                    
                    <button
                      onClick={() => handleToggleBanner(banner.id)}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        banner.status === 'active' 
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {banner.status === 'active' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Banner Preview */}
                <div className="mb-4">
                  <div 
                    className="rounded-lg p-3 text-center"
                    style={{
                      backgroundColor: banner.design.backgroundColor,
                      color: banner.design.textColor,
                      fontSize: banner.design.fontSize === 'small' ? '14px' : banner.design.fontSize === 'large' ? '18px' : '16px'
                    }}
                  >
                    {banner.message}
                  </div>
                </div>

                {/* Analytics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{banner.analytics.impressions.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Impressions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{banner.analytics.clicks.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Clicks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{banner.analytics.ctr.toFixed(1)}%</div>
                    <div className="text-xs text-gray-500">CTR</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{banner.analytics.conversions}</div>
                    <div className="text-xs text-gray-500">Conversions</div>
                  </div>
                </div>

                {/* Schedule Info */}
                <div className="text-sm text-gray-600 mb-4">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(banner.scheduling.startDate).toLocaleDateString()} - {new Date(banner.scheduling.endDate).toLocaleDateString()}
                    </span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      banner.type === 'sale' ? 'bg-red-100 text-red-800' :
                      banner.type === 'holiday' ? 'bg-green-100 text-green-800' :
                      banner.type === 'shipping' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {banner.type.replace('-', ' ')}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => setSelectedBanner(banner)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderBannerBuilder = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Create Announcement Banner</h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsCreating(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateBanner}
            className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
          >
            Create Banner
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Banner Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="font-medium text-gray-900 mb-4">Banner Content</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Banner Name</label>
                <input
                  type="text"
                  value={newBanner.name}
                  onChange={(e) => setNewBanner(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Summer Sale Banner"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={newBanner.message}
                  onChange={(e) => setNewBanner(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="🔥 Summer Sale: Up to 50% OFF Everything! Free Shipping on $75+"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={newBanner.type}
                  onChange={(e) => setNewBanner(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                >
                  <option value="sale">Sale/Promotion</option>
                  <option value="holiday">Holiday</option>
                  <option value="shipping">Shipping Info</option>
                  <option value="product-launch">Product Launch</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="font-medium text-gray-900 mb-4">Design</h4>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                  <input
                    type="color"
                    value={newBanner.design?.backgroundColor}
                    onChange={(e) => setNewBanner(prev => ({
                      ...prev,
                      design: { ...prev.design!, backgroundColor: e.target.value }
                    }))}
                    className="w-full h-10 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                  <input
                    type="color"
                    value={newBanner.design?.textColor}
                    onChange={(e) => setNewBanner(prev => ({
                      ...prev,
                      design: { ...prev.design!, textColor: e.target.value }
                    }))}
                    className="w-full h-10 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                  <select
                    value={newBanner.design?.fontSize}
                    onChange={(e) => setNewBanner(prev => ({
                      ...prev,
                      design: { ...prev.design!, fontSize: e.target.value as any }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                  <select
                    value={newBanner.design?.position}
                    onChange={(e) => setNewBanner(prev => ({
                      ...prev,
                      design: { ...prev.design!, position: e.target.value as any }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  >
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Animation</label>
                <select
                  value={newBanner.design?.animation}
                  onChange={(e) => setNewBanner(prev => ({
                    ...prev,
                    design: { ...prev.design!, animation: e.target.value as any }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                >
                  <option value="none">None</option>
                  <option value="slide">Slide</option>
                  <option value="fade">Fade</option>
                  <option value="bounce">Bounce</option>
                  <option value="pulse">Pulse</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="font-medium text-gray-900 mb-4">Scheduling</h4>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={newBanner.scheduling?.startDate}
                    onChange={(e) => setNewBanner(prev => ({
                      ...prev,
                      scheduling: { ...prev.scheduling!, startDate: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={newBanner.scheduling?.endDate}
                    onChange={(e) => setNewBanner(prev => ({
                      ...prev,
                      scheduling: { ...prev.scheduling!, endDate: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                <select
                  value={newBanner.scheduling?.timezone}
                  onChange={(e) => setNewBanner(prev => ({
                    ...prev,
                    scheduling: { ...prev.scheduling!, timezone: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time</option>
                  <option value="PST">Pacific Time</option>
                  <option value="GMT">Greenwich Mean Time</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Preview & Templates */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="font-medium text-gray-900 mb-4">Live Preview</h4>
            
            <div className="space-y-4">
              <div 
                className="rounded-lg p-4 text-center transition-all"
                style={{
                  backgroundColor: newBanner.design?.backgroundColor || '#3B82F6',
                  color: newBanner.design?.textColor || '#FFFFFF',
                  fontSize: newBanner.design?.fontSize === 'small' ? '14px' : newBanner.design?.fontSize === 'large' ? '18px' : '16px'
                }}
              >
                {newBanner.message || 'Your banner message will appear here'}
              </div>
              
              <p className="text-sm text-gray-600 text-center">
                Preview of how your banner will appear on your store
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="font-medium text-gray-900 mb-4">Holiday Templates</h4>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {holidayTemplates.map((holiday, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-sm text-gray-900">{holiday.name}</h5>
                    <span className="text-xs text-gray-500">{new Date(holiday.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{holiday.template}</p>
                  <button
                    onClick={() => applyHolidayTemplate(holiday)}
                    className="w-full px-3 py-1 bg-signal-blue text-white rounded text-sm hover:bg-blue-600 transition-colors"
                  >
                    Use Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Banner Analytics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Total Impressions</h4>
              <p className="text-2xl font-bold text-gray-900">45,231</p>
            </div>
          </div>
          <p className="text-sm text-green-600">+15% from last week</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <MousePointer className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Total Clicks</h4>
              <p className="text-2xl font-bold text-gray-900">2,847</p>
            </div>
          </div>
          <p className="text-sm text-green-600">+23% from last week</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Zap className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Average CTR</h4>
              <p className="text-2xl font-bold text-gray-900">6.3%</p>
            </div>
          </div>
          <p className="text-sm text-green-600">+1.2% from last week</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Conversions</h4>
              <p className="text-2xl font-bold text-gray-900">524</p>
            </div>
          </div>
          <p className="text-sm text-green-600">+18% from last week</p>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'banners', label: 'Banners', icon: Megaphone },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Announcement Manager</h2>
          <p className="text-gray-600">Create dynamic banners for sales, holidays, and special events</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
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
        {isCreating ? renderBannerBuilder() : (
          <>
            {activeTab === 'banners' && renderBannersList()}
            {activeTab === 'analytics' && renderAnalytics()}
            {activeTab === 'calendar' && (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Holiday calendar coming soon</p>
              </div>
            )}
            {activeTab === 'settings' && (
              <div className="text-center py-12">
                <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Global settings coming soon</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AnnouncementManager;