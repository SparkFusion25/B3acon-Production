import React, { useState } from 'react';
import { Building, Palette, Settings, Users, Globe, Upload, Check, Edit, Trash2, Save, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface WhiteLabelPartner {
  id: number;
  company_name: string;
  domain: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  is_active: boolean;
}

const WhiteLabelManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('partners');
  const [partners, setPartners] = useState<WhiteLabelPartner[]>([
    {
      id: 1,
      company_name: 'Digital Marketing Pro',
      domain: 'digitalmarketingpro.com',
      logo_url: null,
      primary_color: '#4F46E5',
      secondary_color: '#EC4899',
      is_active: true
    }
  ]);
  const [showAddPartnerModal, setShowAddPartnerModal] = useState(false);
  const [partnerForm, setPartnerForm] = useState<Omit<WhiteLabelPartner, 'id'>>({
    company_name: '',
    domain: '',
    logo_url: null,
    primary_color: '#3478F6',
    secondary_color: '#FF6B35',
    is_active: true
  });
  const [editingPartnerId, setEditingPartnerId] = useState<number | null>(null);
  const [brandingSettings, setBrandingSettings] = useState({
    logo_url: '',
    primary_color: '#3478F6',
    secondary_color: '#FF6B35',
    font_family: 'Inter',
    custom_css: '',
    custom_domain: '',
    favicon_url: ''
  });
  
  const handleAddPartner = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!partnerForm.company_name || !partnerForm.domain) {
      toast.error('Company name and domain are required');
      return;
    }
    
    if (editingPartnerId) {
      // Update existing partner
      setPartners(partners.map(partner => 
        partner.id === editingPartnerId ? { ...partnerForm, id: editingPartnerId } : partner
      ));
      toast.success(`Updated partner: ${partnerForm.company_name}`);
    } else {
      // Add new partner
      const newPartner = {
        ...partnerForm,
        id: Date.now()
      };
      setPartners([...partners, newPartner]);
      toast.success(`Added new partner: ${partnerForm.company_name}`);
    }
    
    setShowAddPartnerModal(false);
    setEditingPartnerId(null);
    setPartnerForm({
      company_name: '',
      domain: '',
      logo_url: null,
      primary_color: '#3478F6',
      secondary_color: '#FF6B35',
      is_active: true
    });
  };
  
  const handleEditPartner = (partner: WhiteLabelPartner) => {
    setEditingPartnerId(partner.id);
    setPartnerForm({
      company_name: partner.company_name,
      domain: partner.domain,
      logo_url: partner.logo_url,
      primary_color: partner.primary_color,
      secondary_color: partner.secondary_color,
      is_active: partner.is_active
    });
    setShowAddPartnerModal(true);
  };
  
  const handleDeletePartner = (partnerId: number) => {
    if (confirm('Are you sure you want to delete this partner?')) {
      setPartners(partners.filter(partner => partner.id !== partnerId));
      toast.success('Partner deleted successfully');
    }
  };
  
  const handleTogglePartnerStatus = (partnerId: number) => {
    setPartners(partners.map(partner => 
      partner.id === partnerId ? { ...partner, is_active: !partner.is_active } : partner
    ));
    
    const partner = partners.find(p => p.id === partnerId);
    if (partner) {
      toast.success(`${partner.is_active ? 'Deactivated' : 'Activated'} partner: ${partner.company_name}`);
    }
  };
  
  const handleSaveBrandingSettings = () => {
    toast.success('Branding settings saved successfully');
  };

  const renderPartners = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">White Label Partners</h3>
        <button 
          onClick={() => setShowAddPartnerModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Building className="w-4 h-4" />
          <span>Add Partner</span>
        </button>
      </div>
      
      {/* Add/Edit Partner Modal */}
      {showAddPartnerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                {editingPartnerId ? 'Edit Partner' : 'Add White Label Partner'}
              </h4>
              <button 
                onClick={() => {
                  setShowAddPartnerModal(false);
                  setEditingPartnerId(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAddPartner} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={partnerForm.company_name}
                  onChange={(e) => setPartnerForm({...partnerForm, company_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  placeholder="Digital Marketing Pro"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-gray-100 border border-gray-300 border-r-0 rounded-l-lg text-gray-600">
                    https://
                  </span>
                  <input
                    type="text"
                    value={partnerForm.domain}
                    onChange={(e) => setPartnerForm({...partnerForm, domain: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                    placeholder="example.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL (Optional)</label>
                <input
                  type="text"
                  value={partnerForm.logo_url || ''}
                  onChange={(e) => setPartnerForm({...partnerForm, logo_url: e.target.value || null})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  placeholder="https://example.com/logo.png"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={partnerForm.primary_color}
                      onChange={(e) => setPartnerForm({...partnerForm, primary_color: e.target.value})}
                      className="w-8 h-8 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      value={partnerForm.primary_color}
                      onChange={(e) => setPartnerForm({...partnerForm, primary_color: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={partnerForm.secondary_color}
                      onChange={(e) => setPartnerForm({...partnerForm, secondary_color: e.target.value})}
                      className="w-8 h-8 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      value={partnerForm.secondary_color}
                      onChange={(e) => setPartnerForm({...partnerForm, secondary_color: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is-active"
                  checked={partnerForm.is_active}
                  onChange={(e) => setPartnerForm({...partnerForm, is_active: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="is-active" className="text-sm text-gray-700">
                  Active
                </label>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddPartnerModal(false);
                    setEditingPartnerId(null);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
                >
                  {editingPartnerId ? 'Update Partner' : 'Add Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {partners.length > 0 ? (
        <div className="space-y-4">
          {partners.map(partner => (
            <div key={partner.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{ background: `linear-gradient(to right, ${partner.primary_color}, ${partner.secondary_color})` }}
                  >
                    {partner.company_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{partner.company_name}</h4>
                    <p className="text-sm text-gray-600">{partner.domain}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  partner.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {partner.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Branding</h5>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: partner.primary_color }}
                    ></div>
                    <div 
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: partner.secondary_color }}
                    ></div>
                    <span className="text-sm text-gray-600">Custom Colors</span>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">White Label URL</h5>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <a 
                      href={`https://${partner.domain}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {partner.domain}
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-2">
                <button 
                  onClick={() => handleTogglePartnerStatus(partner.id)}
                  className={`px-3 py-1 rounded text-xs ${
                    partner.is_active 
                      ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  } transition-colors`}
                >
                  {partner.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button 
                  onClick={() => handleEditPartner(partner)}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200 transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeletePartner(partner.id)}
                  className="px-3 py-1 bg-red-100 text-red-800 rounded text-xs hover:bg-red-200 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center py-12">
            <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Partners Yet</h4>
            <p className="text-gray-600 mb-4">Add your first white label partner to get started.</p>
            <button 
              onClick={() => setShowAddPartnerModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
            >
              Add Partner
            </button>
          </div>
        </div>
      )}
    </div>
  );
  
  const renderBranding = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Branding Settings</h3>
        <button 
          onClick={handleSaveBrandingSettings}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Logo & Favicon</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={brandingSettings.logo_url}
                    onChange={(e) => setBrandingSettings({...brandingSettings, logo_url: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                    placeholder="https://example.com/logo.png"
                  />
                  <button 
                    type="button"
                    onClick={() => toast.success('Upload logo functionality coming soon')}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Upload className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Favicon URL</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={brandingSettings.favicon_url}
                    onChange={(e) => setBrandingSettings({...brandingSettings, favicon_url: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                    placeholder="https://example.com/favicon.ico"
                  />
                  <button 
                    type="button"
                    onClick={() => toast.success('Upload favicon functionality coming soon')}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Upload className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Colors</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={brandingSettings.primary_color}
                    onChange={(e) => setBrandingSettings({...brandingSettings, primary_color: e.target.value})}
                    className="w-8 h-8 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    value={brandingSettings.primary_color}
                    onChange={(e) => setBrandingSettings({...brandingSettings, primary_color: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={brandingSettings.secondary_color}
                    onChange={(e) => setBrandingSettings({...brandingSettings, secondary_color: e.target.value})}
                    className="w-8 h-8 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    value={brandingSettings.secondary_color}
                    onChange={(e) => setBrandingSettings({...brandingSettings, secondary_color: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="font-medium text-gray-900 mb-4">Typography & Custom CSS</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
              <select
                value={brandingSettings.font_family}
                onChange={(e) => setBrandingSettings({...brandingSettings, font_family: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Poppins">Poppins</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Custom CSS</label>
              <textarea
                value={brandingSettings.custom_css}
                onChange={(e) => setBrandingSettings({...brandingSettings, custom_css: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent font-mono"
                rows={6}
                placeholder="/* Add your custom CSS here */"
              ></textarea>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="font-medium text-gray-900 mb-4">Custom Domain</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
            <div className="flex items-center">
              <span className="px-3 py-2 bg-gray-100 border border-gray-300 border-r-0 rounded-l-lg text-gray-600">
                https://
              </span>
              <input
                type="text"
                value={brandingSettings.custom_domain}
                onChange={(e) => setBrandingSettings({...brandingSettings, custom_domain: e.target.value})}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                placeholder="app.yourdomain.com"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              You'll need to set up a CNAME record pointing to b3acon.com
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="font-medium text-gray-900 mb-4">Preview</h4>
        
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <div className="bg-gray-100 p-2 border-b border-gray-300 flex items-center space-x-2">
            <div className="flex-1 flex items-center space-x-2">
              <div 
                className="w-6 h-6 rounded flex items-center justify-center text-white font-bold"
                style={{ background: `linear-gradient(to right, ${brandingSettings.primary_color}, ${brandingSettings.secondary_color})` }}
              >
                B
              </div>
              <span className="font-medium text-gray-900" style={{ fontFamily: brandingSettings.font_family }}>
                White Label Dashboard
              </span>
            </div>
            <button 
              onClick={() => toast.success('Preview in new tab coming soon')}
              className="p-1 text-gray-600 hover:text-gray-900 rounded hover:bg-gray-200"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 bg-white">
            <div 
              className="p-4 rounded-lg text-white text-center"
              style={{ background: `linear-gradient(to right, ${brandingSettings.primary_color}, ${brandingSettings.secondary_color})` }}
            >
              <h5 className="font-bold" style={{ fontFamily: brandingSettings.font_family }}>
                Sample White Label Header
              </h5>
              <p style={{ fontFamily: brandingSettings.font_family }}>
                This is how your branded content will appear
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">White Label Settings</h3>
        <button 
          onClick={() => toast.success('Settings saved successfully')}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="font-medium text-gray-900 mb-4">White Label Features</h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h5 className="font-medium text-gray-900">Custom Branding</h5>
              <p className="text-sm text-gray-600">Allow partners to customize logos, colors, and CSS</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-signal-blue"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h5 className="font-medium text-gray-900">Custom Domain</h5>
              <p className="text-sm text-gray-600">Allow partners to use their own domain</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-signal-blue"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h5 className="font-medium text-gray-900">White Label Emails</h5>
              <p className="text-sm text-gray-600">Send emails from partner domains</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-signal-blue"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h5 className="font-medium text-gray-900">Custom Reports</h5>
              <p className="text-sm text-gray-600">Branded PDF reports with partner logo</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-signal-blue"></div>
            </label>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="font-medium text-gray-900 mb-4">Default Settings</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Default Plan for New Partners</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
            >
              <option value="starter">Starter</option>
              <option value="professional" selected>Professional</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Default Commission Rate</label>
            <div className="flex items-center">
              <input
                type="number"
                min="1"
                max="50"
                defaultValue="20"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
              />
              <span className="ml-2 text-gray-600">%</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Auto-Approve Partners</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-signal-blue"></div>
              <span className="ml-2 text-sm text-gray-700">
                Automatically approve new partner registrations
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'partners', label: 'Partners', icon: Building },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">White Label Management</h2>
        <p className="text-gray-600">Manage white label partnerships and custom branding</p>
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
        {activeTab === 'partners' && renderPartners()}
        {activeTab === 'branding' && renderBranding()}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  );
};

export default WhiteLabelManagement;