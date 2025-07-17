import React, { useState } from 'react';
import { Megaphone, Calendar, Target, Eye, Save, Play } from 'lucide-react';

const AnnouncementManager = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('black-friday');
  const [announcement, setAnnouncement] = useState({
    title: 'Black Friday Sale - 50% OFF Everything!',
    message: 'Biggest sale of the year! Use code BLACKFRIDAY50 for 50% off sitewide.',
    buttonText: 'Shop Now',
    backgroundColor: '#000000',
    textColor: '#ffffff',
    buttonColor: '#ff6b35',
    animation: 'slide',
    placement: 'top',
    schedule: {
      enabled: true,
      startDate: '2024-11-29',
      endDate: '2024-12-02',
      timezone: 'America/New_York'
    }
  });

  const templates = [
    {
      id: 'black-friday',
      name: 'Black Friday',
      preview: { bg: '#000000', text: '#ffffff', accent: '#ff6b35' },
      defaultText: 'Black Friday Sale - 50% OFF Everything!'
    },
    {
      id: 'cyber-monday',
      name: 'Cyber Monday',
      preview: { bg: '#1e40af', text: '#ffffff', accent: '#00d4ff' },
      defaultText: 'Cyber Monday Deals - Extra 30% OFF Tech!'
    },
    {
      id: 'christmas',
      name: 'Christmas',
      preview: { bg: '#dc2626', text: '#ffffff', accent: '#10b981' },
      defaultText: 'Christmas Special - Free Shipping + 25% OFF!'
    },
    {
      id: 'new-year',
      name: 'New Year',
      preview: { bg: '#7c3aed', text: '#ffffff', accent: '#fbbf24' },
      defaultText: 'New Year, New You - 40% OFF Everything!'
    },
    {
      id: 'valentines',
      name: "Valentine's Day",
      preview: { bg: '#ec4899', text: '#ffffff', accent: '#f87171' },
      defaultText: "Valentine's Special - Buy 1 Get 1 Free!"
    },
    {
      id: 'mothers-day',
      name: "Mother's Day",
      preview: { bg: '#db2777', text: '#ffffff', accent: '#fbbf24' },
      defaultText: "Mother's Day Gifts - 30% OFF + Free Gift Wrap!"
    },
    {
      id: 'summer-sale',
      name: 'Summer Sale',
      preview: { bg: '#f59e0b', text: '#ffffff', accent: '#06b6d4' },
      defaultText: 'Summer Sale - Up to 60% OFF Summer Collection!'
    }
  ];

  const animations = [
    { id: 'slide', name: 'Slide Down', description: 'Slides in from the top' },
    { id: 'fade', name: 'Fade In', description: 'Gradually appears' },
    { id: 'bounce', name: 'Bounce', description: 'Bounces into view' },
    { id: 'pulse', name: 'Pulse', description: 'Pulses to grab attention' }
  ];

  const placements = [
    { id: 'top', name: 'Top Bar', description: 'Fixed at the top of the page' },
    { id: 'bottom', name: 'Bottom Bar', description: 'Fixed at the bottom of the page' },
    { id: 'popup', name: 'Center Popup', description: 'Modal in the center of screen' },
    { id: 'corner', name: 'Corner Banner', description: 'Small banner in corner' }
  ];

  const mockStats = {
    impressions: 8247,
    clicks: 892,
    ctr: 10.8,
    conversions: 156,
    revenue: 4720
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setAnnouncement({
        ...announcement,
        title: template.defaultText,
        backgroundColor: template.preview.bg,
        textColor: template.preview.text,
        buttonColor: template.preview.accent
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Announcement Manager</h2>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Play className="w-4 h-4" />
            <span>Go Live</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Template Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Holiday Templates</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div 
                    className="w-full h-12 rounded-md mb-2 flex items-center justify-center"
                    style={{ backgroundColor: template.preview.bg }}
                  >
                    <div 
                      className="text-xs font-medium"
                      style={{ color: template.preview.text }}
                    >
                      {template.name}
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">{template.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Content Customization */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Content</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Announcement Title</label>
                <input
                  type="text"
                  value={announcement.title}
                  onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={announcement.message}
                  onChange={(e) => setAnnouncement({ ...announcement, message: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                <input
                  type="text"
                  value={announcement.buttonText}
                  onChange={(e) => setAnnouncement({ ...announcement, buttonText: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Design Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Design</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={announcement.backgroundColor}
                    onChange={(e) => setAnnouncement({ ...announcement, backgroundColor: e.target.value })}
                    className="w-12 h-10 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    value={announcement.backgroundColor}
                    onChange={(e) => setAnnouncement({ ...announcement, backgroundColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={announcement.textColor}
                    onChange={(e) => setAnnouncement({ ...announcement, textColor: e.target.value })}
                    className="w-12 h-10 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    value={announcement.textColor}
                    onChange={(e) => setAnnouncement({ ...announcement, textColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Animation & Placement */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Display Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Animation</label>
                <select
                  value={announcement.animation}
                  onChange={(e) => setAnnouncement({ ...announcement, animation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {animations.map((anim) => (
                    <option key={anim.id} value={anim.id}>{anim.name} - {anim.description}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Placement</label>
                <div className="grid grid-cols-2 gap-3">
                  {placements.map((placement) => (
                    <button
                      key={placement.id}
                      onClick={() => setAnnouncement({ ...announcement, placement: placement.id })}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                        announcement.placement === placement.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{placement.name}</div>
                      <div className="text-xs text-gray-600">{placement.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Scheduling */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-500" />
              Smart Scheduling
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={announcement.schedule.enabled}
                  onChange={(e) => setAnnouncement({
                    ...announcement,
                    schedule: { ...announcement.schedule, enabled: e.target.checked }
                  })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-gray-700">Enable scheduled publishing</label>
              </div>
              
              {announcement.schedule.enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={announcement.schedule.startDate}
                      onChange={(e) => setAnnouncement({
                        ...announcement,
                        schedule: { ...announcement.schedule, startDate: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={announcement.schedule.endDate}
                      onChange={(e) => setAnnouncement({
                        ...announcement,
                        schedule: { ...announcement.schedule, endDate: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview & Analytics */}
        <div className="space-y-6">
          {/* Live Preview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-blue-500" />
              Live Preview
            </h3>
            <div className="bg-gray-100 rounded-lg p-4 min-h-48">
              <div 
                className="w-full p-4 rounded-lg shadow-lg"
                style={{ 
                  backgroundColor: announcement.backgroundColor,
                  color: announcement.textColor 
                }}
              >
                <div className="text-center">
                  <h4 className="font-bold text-lg mb-2">{announcement.title}</h4>
                  <p className="text-sm mb-4 opacity-90">{announcement.message}</p>
                  <button 
                    className="px-6 py-2 rounded-lg font-medium transition-colors"
                    style={{ backgroundColor: announcement.buttonColor, color: '#ffffff' }}
                  >
                    {announcement.buttonText}
                  </button>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <div className="text-xs text-gray-500">
                  Animation: {animations.find(a => a.id === announcement.animation)?.name}
                </div>
                <div className="text-xs text-gray-500">
                  Placement: {placements.find(p => p.id === announcement.placement)?.name}
                </div>
              </div>
            </div>
          </div>

          {/* Performance Analytics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-500" />
              Performance
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Impressions</span>
                <span className="font-bold">{mockStats.impressions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Clicks</span>
                <span className="font-bold">{mockStats.clicks}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Click Rate</span>
                <span className="font-bold text-blue-600">{mockStats.ctr}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Conversions</span>
                <span className="font-bold text-green-600">{mockStats.conversions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Revenue</span>
                <span className="font-bold text-green-600">${mockStats.revenue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <div className="font-medium text-gray-900">Duplicate Campaign</div>
                <div className="text-sm text-gray-600">Create a copy of this announcement</div>
              </button>
              
              <button className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
                <div className="font-medium text-gray-900">A/B Test</div>
                <div className="text-sm text-gray-600">Test different versions</div>
              </button>
              
              <button className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors">
                <div className="font-medium text-gray-900">Schedule Recurring</div>
                <div className="text-sm text-gray-600">Set up automatic repeats</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementManager;