import React, { useState, useEffect } from 'react';
import { Layout, Edit, Save, Eye, Trash2, Plus, Image, Type, Box, Link as LinkIcon, Users, Zap, Target, Mail, BarChart3, ShoppingBag } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';

interface ContentSection {
  id: string;
  type: 'hero' | 'features' | 'pricing' | 'testimonials' | 'cta' | 'custom';
  title: string;
  subtitle?: string;
  content?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonUrl?: string;
  items?: Array<{
    id: string;
    title: string;
    description: string;
    icon?: string;
  }>;
}

interface LandingPageContent {
  id?: string;
  title: string;
  description: string;
  logo: string;
  sections: ContentSection[];
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  meta: {
    title: string;
    description: string;
    keywords: string;
  };
}

const defaultContent: LandingPageContent = {
  title: 'B3ACON - Digital Marketing Command Center',
  description: 'The complete digital marketing platform for agencies',
  logo: 'https://example.com/logo.png',
  sections: [
    {
      id: 'hero-1',
      type: 'hero',
      title: 'Install B3ACON',
      subtitle: 'The enterprise-grade marketing command center for agencies. Manage clients, campaigns, and performance across multiple channels in one powerful platform.',
      buttonText: 'Start Free 14-Day Trial',
      buttonUrl: '/signup',
      imageUrl: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: 'features-1',
      type: 'features',
      title: 'All-in-One Marketing Platform',
      subtitle: 'Everything you need to manage your digital marketing operations in one powerful platform.',
      items: [
        {
          id: 'feature-1',
          title: 'CRM',
          description: 'Complete client relationship management with lead tracking, deal pipeline, and activity management.',
          icon: 'Users'
        },
        {
          id: 'feature-2',
          title: 'SEO',
          description: 'Advanced SEO intelligence with keyword research, rank tracking, and site audit tools.',
          icon: 'Target'
        },
        {
          id: 'feature-3',
          title: 'Email',
          description: 'Multi-provider email campaign management with automation and analytics.',
          icon: 'Mail'
        },
        {
          id: 'feature-4',
          title: 'Affiliate',
          description: 'Partner recruitment, commission tracking, and automated payment management.',
          icon: 'Users'
        },
        {
          id: 'feature-5',
          title: 'Analytics',
          description: 'Comprehensive performance tracking and reporting across all marketing channels.',
          icon: 'BarChart3'
        },
        {
          id: 'feature-6',
          title: 'Shopify',
          description: 'Seamless integration with Shopify for e-commerce marketing and analytics.',
          icon: 'ShoppingBag'
        }
      ]
    }
  ],
  colors: {
    primary: '#3478F6',
    secondary: '#FF6B35',
    background: '#FFFFFF',
    text: '#121212'
  },
  meta: {
    title: 'B3ACON - Digital Marketing Command Center',
    description: 'The complete digital marketing platform for agencies',
    keywords: 'digital marketing, agency software, marketing platform, SEO tools'
  }
};

const LandingPageEditor: React.FC = () => {
  const [content, setContent] = useState<LandingPageContent>(defaultContent);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  useEffect(() => {
    // Load content from database
    const fetchContent = async () => {
      try {
        if (!supabase) {
          throw new Error('Supabase not configured');
        }
        const { data, error } = await supabase
          .from('landing_page_content')
          .select('*')
          .eq('section_key', 'main')
          .single();
          
        if (error) {
          console.error('Error fetching landing page content:', error);
          return;
        }
        
        if (data && data.metadata) {
          setContent(data.metadata as LandingPageContent);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    fetchContent();
  }, []);
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (!supabase) {
        throw new Error('Supabase not configured');
      }
      const { data, error } = await supabase
        .from('landing_page_content')
        .upsert({
          section_key: 'main',
          title: content.title,
          description: content.description,
          metadata: content,
          is_active: true
        }, { onConflict: 'section_key' });
        
      if (error) {
        throw error;
      }
      
      toast.success('Landing page content saved successfully');
    } catch (error) {
      console.error('Error saving landing page content:', error);
      toast.error('Failed to save landing page content');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleAddSection = (type: ContentSection['type']) => {
    const newId = `${type}-${Date.now()}`;
    let newSection: ContentSection = {
      id: newId,
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Section`,
    };
    
    if (type === 'features') {
      newSection.items = [
        {
          id: `item-${Date.now()}-1`,
          title: 'New Feature',
          description: 'Feature description goes here',
          icon: 'Star'
        }
      ];
    }
    
    setContent({
      ...content,
      sections: [...content.sections, newSection]
    });
    
    setActiveSection(newId);
    setIsEditing(true);
  };
  
  const handleRemoveSection = (id: string) => {
    if (confirm('Are you sure you want to remove this section?')) {
      setContent({
        ...content,
        sections: content.sections.filter(section => section.id !== id)
      });
      
      if (activeSection === id) {
        setActiveSection(null);
        setIsEditing(false);
      }
    }
  };
  
  const handleUpdateSection = (id: string, updates: Partial<ContentSection>) => {
    setContent({
      ...content,
      sections: content.sections.map(section => 
        section.id === id ? { ...section, ...updates } : section
      )
    });
  };
  
  const handleAddFeatureItem = (sectionId: string) => {
    const section = content.sections.find(s => s.id === sectionId);
    if (section && section.type === 'features') {
      const newItem = {
        id: `item-${Date.now()}`,
        title: 'New Feature',
        description: 'Feature description goes here',
        icon: 'Star'
      };
      
      handleUpdateSection(sectionId, {
        items: [...(section.items || []), newItem]
      });
    }
  };
  
  const handleUpdateFeatureItem = (sectionId: string, itemId: string, updates: Partial<{title: string, description: string, icon: string}>) => {
    const section = content.sections.find(s => s.id === sectionId);
    if (section && section.type === 'features' && section.items) {
      handleUpdateSection(sectionId, {
        items: section.items.map(item => 
          item.id === itemId ? { ...item, ...updates } : item
        )
      });
    }
  };
  
  const handleRemoveFeatureItem = (sectionId: string, itemId: string) => {
    const section = content.sections.find(s => s.id === sectionId);
    if (section && section.type === 'features' && section.items) {
      handleUpdateSection(sectionId, {
        items: section.items.filter(item => item.id !== itemId)
      });
    }
  };
  
  const renderSectionEditor = () => {
    if (!activeSection) return null;
    
    const section = content.sections.find(s => s.id === activeSection);
    if (!section) return null;
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Edit {section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
            <input
              type="text"
              value={section.title || ''}
              onChange={(e) => handleUpdateSection(section.id, { title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
            />
          </div>
          
          {(section.type === 'hero' || section.type === 'features') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <input
                type="text"
                value={section.subtitle || ''}
                onChange={(e) => handleUpdateSection(section.id, { subtitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
              />
            </div>
          )}
          
          {section.type === 'hero' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={section.imageUrl || ''}
                  onChange={(e) => handleUpdateSection(section.id, { imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                <input
                  type="text"
                  value={section.buttonText || ''}
                  onChange={(e) => handleUpdateSection(section.id, { buttonText: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Button URL</label>
                <input
                  type="text"
                  value={section.buttonUrl || ''}
                  onChange={(e) => handleUpdateSection(section.id, { buttonUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                />
              </div>
            </>
          )}
          
          {section.type === 'features' && section.items && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Features</label>
                <button
                  onClick={() => handleAddFeatureItem(section.id)}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-xs flex items-center"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Feature
                </button>
              </div>
              
              <div className="space-y-4">
                {section.items.map((item, index) => (
                  <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Feature {index + 1}</h4>
                      <button
                        onClick={() => handleRemoveFeatureItem(section.id, item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleUpdateFeatureItem(section.id, item.id, { title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={item.description}
                          onChange={(e) => handleUpdateFeatureItem(section.id, item.id, { description: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                          rows={2}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Icon</label>
                        <select
                          value={item.icon || 'Star'}
                          onChange={(e) => handleUpdateFeatureItem(section.id, item.id, { icon: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                        >
                          <option value="Users">Users</option>
                          <option value="Target">Target</option>
                          <option value="Mail">Mail</option>
                          <option value="BarChart3">Chart</option>
                          <option value="ShoppingBag">ShoppingBag</option>
                          <option value="Zap">Zap</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  const renderSectionPreview = (section: ContentSection) => {
    switch (section.type) {
      case 'hero':
        return (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{section.title}</h2>
                <p className="text-gray-600 mb-4">{section.subtitle}</p>
                <button className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg">
                  {section.buttonText || 'Call to Action'}
                </button>
              </div>
              <div className="hidden md:block">
                {section.imageUrl && (
                  <img 
                    src={section.imageUrl} 
                    alt="Hero" 
                    className="rounded-lg w-full h-40 object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        );
        
      case 'features':
        return (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">{section.title}</h2>
            <p className="text-gray-600 mb-4 text-center">{section.subtitle}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {section.items?.map((item) => (
                <div key={item.id} className="p-4 border border-gray-100 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        );
        
      default:
        return (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{section.title}</h2>
            <p className="text-gray-600">Custom section content</p>
          </div>
        );
    }
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Landing Page Editor</h2>
            <p className="text-gray-600">Customize your landing page content and design</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                previewMode 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } transition-colors`}
            >
              <Eye className="w-4 h-4" />
              <span>{previewMode ? 'Exit Preview' : 'Preview'}</span>
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>

      {previewMode ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8">{content.title}</h1>
            <p className="text-xl text-gray-600 text-center mb-12">{content.description}</p>
            
            <div className="space-y-12">
              {content.sections.map((section) => (
                <div key={section.id} className="mb-8">
                  {renderSectionPreview(section)}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sections Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Page Sections</h3>
                <div className="relative group">
                  <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 hidden group-hover:block z-10">
                    <button 
                      onClick={() => handleAddSection('hero')}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center"
                    >
                      <Layout className="w-4 h-4 mr-2" />
                      <span>Hero Section</span>
                    </button>
                    <button 
                      onClick={() => handleAddSection('features')}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center"
                    >
                      <Box className="w-4 h-4 mr-2" />
                      <span>Features Section</span>
                    </button>
                    <button 
                      onClick={() => handleAddSection('pricing')}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center"
                    >
                      <LinkIcon className="w-4 h-4 mr-2" />
                      <span>Pricing Section</span>
                    </button>
                    <button 
                      onClick={() => handleAddSection('testimonials')}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      <span>Testimonials Section</span>
                    </button>
                    <button 
                      onClick={() => handleAddSection('cta')}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      <span>CTA Section</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                {content.sections.map((section) => (
                  <div 
                    key={section.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors flex items-center justify-between ${
                      activeSection === section.id 
                        ? 'border-signal-blue bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setActiveSection(section.id);
                      setIsEditing(true);
                    }}
                  >
                    <div className="flex items-center">
                      {section.type === 'hero' && <Layout className="w-4 h-4 mr-2 text-gray-600" />}
                      {section.type === 'features' && <Box className="w-4 h-4 mr-2 text-gray-600" />}
                      {section.type === 'pricing' && <LinkIcon className="w-4 h-4 mr-2 text-gray-600" />}
                      {section.type === 'testimonials' && <Users className="w-4 h-4 mr-2 text-gray-600" />}
                      {section.type === 'cta' && <Zap className="w-4 h-4 mr-2 text-gray-600" />}
                      <span className="font-medium text-gray-900">{section.title || `${section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section`}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveSection(section.id);
                          setIsEditing(true);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveSection(section.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                
                {content.sections.length === 0 && (
                  <div className="text-center py-8">
                    <Layout className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No sections added yet</p>
                    <button 
                      onClick={() => handleAddSection('hero')}
                      className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Add Hero Section
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Page Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Page Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                  <input
                    type="text"
                    value={content.title}
                    onChange={(e) => setContent({...content, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Page Description</label>
                  <textarea
                    value={content.description}
                    onChange={(e) => setContent({...content, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                    rows={2}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                  <input
                    type="text"
                    value={content.logo}
                    onChange={(e) => setContent({...content, logo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={content.colors.primary}
                      onChange={(e) => setContent({
                        ...content, 
                        colors: {...content.colors, primary: e.target.value}
                      })}
                      className="w-8 h-8 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      value={content.colors.primary}
                      onChange={(e) => setContent({
                        ...content, 
                        colors: {...content.colors, primary: e.target.value}
                      })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={content.colors.secondary}
                      onChange={(e) => setContent({
                        ...content, 
                        colors: {...content.colors, secondary: e.target.value}
                      })}
                      className="w-8 h-8 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      value={content.colors.secondary}
                      onChange={(e) => setContent({
                        ...content, 
                        colors: {...content.colors, secondary: e.target.value}
                      })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* SEO Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                  <input
                    type="text"
                    value={content.meta.title}
                    onChange={(e) => setContent({
                      ...content, 
                      meta: {...content.meta, title: e.target.value}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                  <textarea
                    value={content.meta.description}
                    onChange={(e) => setContent({
                      ...content, 
                      meta: {...content.meta, description: e.target.value}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                    rows={2}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                  <input
                    type="text"
                    value={content.meta.keywords}
                    onChange={(e) => setContent({
                      ...content, 
                      meta: {...content.meta, keywords: e.target.value}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                    placeholder="Comma-separated keywords"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Section Editor */}
          <div className="lg:col-span-2">
            {isEditing && activeSection ? (
              renderSectionEditor()
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full flex items-center justify-center">
                <div className="text-center">
                  <Edit className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a section to edit</h3>
                  <p className="text-gray-600">Click on a section from the list to edit its content</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPageEditor;