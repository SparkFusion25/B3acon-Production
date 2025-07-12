import React, { useState } from 'react';
import { Palette, Image, Video, FileText, Upload, Plus, Folder, Grid, List, Search, MoreVertical, Download, Trash2, Share2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CreativeStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState('assets');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    file: null as File | null,
    name: '',
    type: 'image',
    tags: [] as string[]
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadForm({
        ...uploadForm,
        file,
        name: file.name
      });
    }
  };
  
  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.file) {
      toast.error('Please select a file to upload');
      return;
    }
    
    toast.success(`Uploaded ${uploadForm.name} successfully!`);
    setShowUploadModal(false);
    setUploadForm({
      file: null,
      name: '',
      type: 'image',
      tags: []
    });
  };
  
  const handleTagToggle = (tag: string) => {
    if (uploadForm.tags.includes(tag)) {
      setUploadForm({
        ...uploadForm,
        tags: uploadForm.tags.filter(t => t !== tag)
      });
    } else {
      setUploadForm({
        ...uploadForm,
        tags: [...uploadForm.tags, tag]
      });
    }
  };

  const renderAssets = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Creative Assets</h3>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Assets</span>
        </button>
      </div>
      
      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Upload Asset</h4>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {uploadForm.file ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center">
                      {uploadForm.file.type.startsWith('image/') ? (
                        <Image className="w-12 h-12 text-gray-400" />
                      ) : uploadForm.file.type.startsWith('video/') ? (
                        <Video className="w-12 h-12 text-gray-400" />
                      ) : (
                        <FileText className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    <p className="text-gray-900 font-medium">{uploadForm.file.name}</p>
                    <p className="text-gray-500 text-sm">{(uploadForm.file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <button
                      type="button"
                      onClick={() => setUploadForm({...uploadForm, file: null})}
                      className="text-red-600 text-sm hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-900 font-medium">Drag and drop file here</p>
                    <p className="text-gray-500 text-sm mb-4">or</p>
                    <label className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
                      Browse Files
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={handleFileChange}
                        accept="image/*,video/*,application/pdf"
                      />
                    </label>
                  </>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name</label>
                <input
                  type="text"
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm({...uploadForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asset Type</label>
                <select
                  value={uploadForm.type}
                  onChange={(e) => setUploadForm({...uploadForm, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="document">Document</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {['Logo', 'Banner', 'Social Media', 'Product', 'Marketing'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        uploadForm.tags.includes(tag)
                          ? 'bg-signal-blue text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!uploadForm.file}
                  className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Asset Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
            >
              <Grid className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
            >
              <List className="w-5 h-5 text-gray-600" />
            </button>
            <div className="relative ml-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search assets..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm">
              All Files
            </button>
            <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded transition-colors text-sm">
              Images
            </button>
            <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded transition-colors text-sm">
              Videos
            </button>
          </div>
        </div>
        
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 1, name: 'Logo.png', type: 'image', size: '1.2 MB', url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
              { id: 2, name: 'Banner.jpg', type: 'image', size: '2.4 MB', url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
              { id: 3, name: 'Product_Demo.mp4', type: 'video', size: '8.7 MB', url: '' },
              { id: 4, name: 'Brand_Guidelines.pdf', type: 'document', size: '3.5 MB', url: '' },
              { id: 5, name: 'Team_Photo.jpg', type: 'image', size: '1.8 MB', url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
              { id: 6, name: 'Social_Post.png', type: 'image', size: '0.9 MB', url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' }
            ].map(asset => (
              <div key={asset.id} className="group relative border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                {asset.type === 'image' ? (
                  <div className="aspect-video bg-gray-100">
                    <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                  </div>
                ) : asset.type === 'video' ? (
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    <Video className="w-12 h-12 text-gray-400" />
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    <FileText className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                
                <div className="p-3">
                  <h4 className="font-medium text-gray-900 text-sm truncate">{asset.name}</h4>
                  <p className="text-gray-500 text-xs">{asset.size}</p>
                </div>
                
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white rounded-full shadow-md p-1">
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {[
              { id: 1, name: 'Logo.png', type: 'image', size: '1.2 MB', modified: '2 days ago' },
              { id: 2, name: 'Banner.jpg', type: 'image', size: '2.4 MB', modified: '3 days ago' },
              { id: 3, name: 'Product_Demo.mp4', type: 'video', size: '8.7 MB', modified: '1 week ago' },
              { id: 4, name: 'Brand_Guidelines.pdf', type: 'document', size: '3.5 MB', modified: '2 weeks ago' },
              { id: 5, name: 'Team_Photo.jpg', type: 'image', size: '1.8 MB', modified: '3 weeks ago' },
              { id: 6, name: 'Social_Post.png', type: 'image', size: '0.9 MB', modified: '1 month ago' }
            ].map(asset => (
              <div key={asset.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  {asset.type === 'image' ? (
                    <Image className="w-5 h-5 text-blue-500" />
                  ) : asset.type === 'video' ? (
                    <Video className="w-5 h-5 text-purple-500" />
                  ) : (
                    <FileText className="w-5 h-5 text-orange-500" />
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900">{asset.name}</h4>
                    <p className="text-gray-500 text-xs">{asset.size} • Modified {asset.modified}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => toast.success(`Downloading ${asset.name}`)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => toast.success(`Sharing ${asset.name}`)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => toast.success(`${asset.name} moved to trash`)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
  
  const renderTemplates = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Design Templates</h3>
        <button 
          onClick={() => toast.success('Creating new template')}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Template</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { id: 1, name: 'Social Media Post', category: 'Social Media', thumbnail: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
          { id: 2, name: 'Email Header', category: 'Email', thumbnail: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
          { id: 3, name: 'Blog Banner', category: 'Web', thumbnail: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
          { id: 4, name: 'Product Showcase', category: 'E-commerce', thumbnail: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
          { id: 5, name: 'Presentation Slide', category: 'Presentation', thumbnail: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
          { id: 6, name: 'Business Card', category: 'Print', thumbnail: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' }
        ].map(template => (
          <div key={template.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-video bg-gray-100">
              <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{template.name}</h4>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                  {template.category}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => toast.success(`Using ${template.name} template`)}
                  className="text-signal-blue hover:text-blue-700 text-sm font-medium"
                >
                  Use Template
                </button>
                <button 
                  onClick={() => toast.success(`Previewing ${template.name}`)}
                  className="text-gray-600 hover:text-gray-800 text-sm"
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
  
  const renderBrandKit = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Brand Kit</h3>
        <button 
          onClick={() => toast.success('Updating brand kit')}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Palette className="w-4 h-4" />
          <span>Update Brand Kit</span>
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="font-medium text-gray-900 mb-6">Brand Identity</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-3">Logo</h5>
            <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-lg flex items-center justify-center">
                <Zap className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
          
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-3">Color Palette</h5>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="h-16 bg-[#3478F6] rounded-lg mb-1"></div>
                <p className="text-xs text-gray-600">Signal Blue</p>
                <p className="text-xs font-mono text-gray-900">#3478F6</p>
              </div>
              <div>
                <div className="h-16 bg-[#FF6B35] rounded-lg mb-1"></div>
                <p className="text-xs text-gray-600">Beacon Orange</p>
                <p className="text-xs font-mono text-gray-900">#FF6B35</p>
              </div>
              <div>
                <div className="h-16 bg-[#121212] rounded-lg mb-1"></div>
                <p className="text-xs text-gray-600">Jet Black</p>
                <p className="text-xs font-mono text-gray-900">#121212</p>
              </div>
              <div>
                <div className="h-16 bg-[#2E2E2E] rounded-lg mb-1"></div>
                <p className="text-xs text-gray-600">Slate Gray</p>
                <p className="text-xs font-mono text-gray-900">#2E2E2E</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-3">Typography</h5>
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Heading Font</p>
                <p className="text-2xl font-bold text-gray-900">Inter</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Body Font</p>
                <p className="text-base text-gray-900">Inter</p>
              </div>
            </div>
          </div>
          
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-3">Brand Guidelines</h5>
            <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Brand_Guidelines.pdf</p>
                  <p className="text-xs text-gray-600">3.5 MB • Updated 2 weeks ago</p>
                </div>
              </div>
              <button 
                onClick={() => toast.success('Downloading brand guidelines')}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'assets', label: 'Assets', icon: Image },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'brand', label: 'Brand Kit', icon: Palette }
  ];

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Creative Studio</h2>
        <p className="text-gray-600">Manage your creative assets and brand materials</p>
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
        {activeTab === 'assets' && renderAssets()}
        {activeTab === 'templates' && renderTemplates()}
        {activeTab === 'brand' && renderBrandKit()}
      </div>
    </div>
  );
};

export default CreativeStudio;