import React, { useState, useEffect } from 'react';
import { 
  Link, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Search,
  Filter,
  BarChart3,
  ArrowRight,
  Globe,
  Clock
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface BrokenLink {
  id: string;
  url: string;
  sourceUrl: string;
  sourceTitle: string;
  status: number;
  statusText: string;
  type: 'internal' | 'external' | 'image' | 'resource';
  priority: 'high' | 'medium' | 'low';
  foundOn: string[];
  lastChecked: string;
  fixSuggestion?: string;
  isFixed: boolean;
}

interface Redirect {
  id: string;
  from: string;
  to: string;
  type: '301' | '302' | '307';
  hits: number;
  createdAt: string;
  lastUsed: string;
  isActive: boolean;
  description?: string;
}

interface ScanSettings {
  includeExternal: boolean;
  includeImages: boolean;
  includeResources: boolean;
  maxDepth: number;
  followRedirects: boolean;
  timeout: number;
}

const BrokenLinksManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('broken-links');
  const [brokenLinks, setBrokenLinks] = useState<BrokenLink[]>([]);
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedLinks, setSelectedLinks] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddRedirect, setShowAddRedirect] = useState(false);
  const [newRedirect, setNewRedirect] = useState({ from: '', to: '', type: '301' as const, description: '' });
  
  const [scanSettings, setScanSettings] = useState<ScanSettings>({
    includeExternal: true,
    includeImages: true,
    includeResources: true,
    maxDepth: 3,
    followRedirects: true,
    timeout: 10
  });

  useEffect(() => {
    loadSampleData();
  }, []);

  const loadSampleData = () => {
    // Sample broken links data
    setBrokenLinks([
      {
        id: '1',
        url: 'https://example.com/old-product-page',
        sourceUrl: '/products/tech-gadgets',
        sourceTitle: 'Tech Gadgets Collection',
        status: 404,
        statusText: 'Not Found',
        type: 'external',
        priority: 'high',
        foundOn: ['/products/tech-gadgets', '/collections/electronics'],
        lastChecked: '2024-01-03T10:30:00Z',
        fixSuggestion: 'Create redirect to new product page',
        isFixed: false
      },
      {
        id: '2',
        url: '/discontinued-product',
        sourceUrl: '/pages/about',
        sourceTitle: 'About Us Page',
        status: 404,
        statusText: 'Not Found',
        type: 'internal',
        priority: 'high',
        foundOn: ['/pages/about', '/blogs/news'],
        lastChecked: '2024-01-03T10:30:00Z',
        fixSuggestion: 'Redirect to similar product or remove link',
        isFixed: false
      },
      {
        id: '3',
        url: 'https://cdn.example.com/image.jpg',
        sourceUrl: '/products/smartphone',
        sourceTitle: 'Premium Smartphone',
        status: 403,
        statusText: 'Forbidden',
        type: 'image',
        priority: 'medium',
        foundOn: ['/products/smartphone'],
        lastChecked: '2024-01-03T10:30:00Z',
        fixSuggestion: 'Replace with working image URL',
        isFixed: false
      },
      {
        id: '4',
        url: 'https://social-media.com/old-account',
        sourceUrl: '/pages/contact',
        sourceTitle: 'Contact Page',
        status: 301,
        statusText: 'Moved Permanently',
        type: 'external',
        priority: 'low',
        foundOn: ['/pages/contact'],
        lastChecked: '2024-01-03T10:30:00Z',
        fixSuggestion: 'Update to new social media URL',
        isFixed: false
      }
    ]);

    // Sample redirects data
    setRedirects([
      {
        id: '1',
        from: '/old-collection',
        to: '/collections/new-arrivals',
        type: '301',
        hits: 247,
        createdAt: '2023-12-01T00:00:00Z',
        lastUsed: '2024-01-03T09:15:00Z',
        isActive: true,
        description: 'Redirect old collection to new arrivals'
      },
      {
        id: '2',
        from: '/products/discontinued-item',
        to: '/collections/similar-products',
        type: '301',
        hits: 89,
        createdAt: '2023-12-15T00:00:00Z',
        lastUsed: '2024-01-02T14:22:00Z',
        isActive: true,
        description: 'Discontinued product redirect'
      },
      {
        id: '3',
        from: '/sale',
        to: '/collections/sale',
        type: '302',
        hits: 1523,
        createdAt: '2023-11-20T00:00:00Z',
        lastUsed: '2024-01-03T11:45:00Z',
        isActive: true,
        description: 'Temporary sale page redirect'
      }
    ]);
  };

  const startScan = async () => {
    setIsScanning(true);
    try {
      // Simulate scanning process
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Add some new broken links during scan
      const newBrokenLinks = [
        {
          id: Date.now().toString(),
          url: '/product/new-broken-link',
          sourceUrl: '/collections/featured',
          sourceTitle: 'Featured Products',
          status: 404,
          statusText: 'Not Found',
          type: 'internal' as const,
          priority: 'high' as const,
          foundOn: ['/collections/featured'],
          lastChecked: new Date().toISOString(),
          fixSuggestion: 'Remove broken link or fix URL',
          isFixed: false
        }
      ];
      
      setBrokenLinks(prev => [...prev, ...newBrokenLinks]);
      toast.success(`Scan completed! Found ${newBrokenLinks.length} new broken links.`);
    } catch (error) {
      toast.error('Scan failed. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const fixLink = async (linkId: string, action: 'redirect' | 'remove' | 'update') => {
    try {
      const link = brokenLinks.find(l => l.id === linkId);
      if (!link) return;

      switch (action) {
        case 'redirect':
          // Create automatic redirect
          const newRedirect: Redirect = {
            id: Date.now().toString(),
            from: link.url,
            to: '/collections/all', // Default redirect
            type: '301',
            hits: 0,
            createdAt: new Date().toISOString(),
            lastUsed: new Date().toISOString(),
            isActive: true,
            description: `Auto-created redirect for broken link`
          };
          setRedirects(prev => [newRedirect, ...prev]);
          break;
        
        case 'remove':
          // Mark as fixed by removal
          break;
        
        case 'update':
          // Mark as fixed by update
          break;
      }

      setBrokenLinks(prev => prev.map(l => 
        l.id === linkId ? { ...l, isFixed: true } : l
      ));
      
      toast.success(`Link ${action}d successfully!`);
    } catch (error) {
      toast.error(`Failed to ${action} link`);
    }
  };

  const createRedirect = async () => {
    try {
      if (!newRedirect.from || !newRedirect.to) {
        toast.error('Please fill in both from and to URLs');
        return;
      }

      const redirect: Redirect = {
        id: Date.now().toString(),
        from: newRedirect.from,
        to: newRedirect.to,
        type: newRedirect.type,
        hits: 0,
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString(),
        isActive: true,
        description: newRedirect.description
      };

      setRedirects(prev => [redirect, ...prev]);
      setNewRedirect({ from: '', to: '', type: '301', description: '' });
      setShowAddRedirect(false);
      toast.success('Redirect created successfully!');
    } catch (error) {
      toast.error('Failed to create redirect');
    }
  };

  const toggleRedirect = async (redirectId: string) => {
    setRedirects(prev => prev.map(redirect =>
      redirect.id === redirectId 
        ? { ...redirect, isActive: !redirect.isActive }
        : redirect
    ));
    toast.success('Redirect status updated');
  };

  const deleteRedirect = async (redirectId: string) => {
    setRedirects(prev => prev.filter(redirect => redirect.id !== redirectId));
    toast.success('Redirect deleted');
  };

  const exportReport = () => {
    const data = {
      brokenLinks: brokenLinks.length,
      fixedLinks: brokenLinks.filter(l => l.isFixed).length,
      activeRedirects: redirects.filter(r => r.isActive).length,
      totalRedirectHits: redirects.reduce((sum, r) => sum + r.hits, 0),
      scanDate: new Date().toISOString(),
      links: brokenLinks,
      redirects: redirects
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `broken-links-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredBrokenLinks = brokenLinks.filter(link => {
    const matchesSearch = link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.sourceTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'fixed' && link.isFixed) ||
                         (filterStatus === 'unfixed' && !link.isFixed) ||
                         (filterStatus === link.priority);
    return matchesSearch && matchesFilter;
  });

  const stats = {
    totalBroken: brokenLinks.length,
    fixed: brokenLinks.filter(l => l.isFixed).length,
    highPriority: brokenLinks.filter(l => l.priority === 'high' && !l.isFixed).length,
    activeRedirects: redirects.filter(r => r.isActive).length,
    totalRedirectHits: redirects.reduce((sum, r) => sum + r.hits, 0)
  };

  const renderBrokenLinks = () => (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search broken links..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Links</option>
            <option value="unfixed">Unfixed</option>
            <option value="fixed">Fixed</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={startScan}
            disabled={isScanning}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isScanning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Scanning...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Scan Now
              </>
            )}
          </button>
          
          <button
            onClick={exportReport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Broken</p>
              <p className="text-2xl font-bold text-red-600">{stats.totalBroken}</p>
            </div>
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Fixed</p>
              <p className="text-2xl font-bold text-green-600">{stats.fixed}</p>
            </div>
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-orange-600">{stats.highPriority}</p>
            </div>
            <AlertTriangle className="h-6 w-6 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Redirects</p>
              <p className="text-2xl font-bold text-blue-600">{stats.activeRedirects}</p>
            </div>
            <ArrowRight className="h-6 w-6 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Redirect Hits</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalRedirectHits}</p>
            </div>
            <BarChart3 className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Broken Links Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Found On</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Checked</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBrokenLinks.map((link) => (
                <tr key={link.id} className={`hover:bg-gray-50 ${link.isFixed ? 'opacity-60' : ''}`}>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900 break-all">{link.url}</div>
                      <div className="text-sm text-gray-500">From: {link.sourceTitle}</div>
                      {link.fixSuggestion && (
                        <div className="text-xs text-blue-600 mt-1">{link.fixSuggestion}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      link.status === 404 ? 'bg-red-100 text-red-800' :
                      link.status === 403 ? 'bg-orange-100 text-orange-800' :
                      link.status === 301 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {link.status} {link.statusText}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${
                      link.type === 'internal' ? 'bg-blue-100 text-blue-800' :
                      link.type === 'external' ? 'bg-purple-100 text-purple-800' :
                      link.type === 'image' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {link.type === 'external' && <ExternalLink className="h-3 w-3" />}
                      {link.type === 'internal' && <Link className="h-3 w-3" />}
                      {link.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      link.priority === 'high' ? 'bg-red-100 text-red-800' :
                      link.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {link.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {link.foundOn.slice(0, 2).map((page, index) => (
                        <div key={index} className="truncate">{page}</div>
                      ))}
                      {link.foundOn.length > 2 && (
                        <div className="text-xs text-gray-500">+{link.foundOn.length - 2} more</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(link.lastChecked).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {!link.isFixed ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => fixLink(link.id, 'redirect')}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Create Redirect"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => fixLink(link.id, 'update')}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Mark as Fixed"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => fixLink(link.id, 'remove')}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Remove Link"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-green-600 text-sm font-medium">Fixed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderRedirects = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Redirect Management</h3>
        <button
          onClick={() => setShowAddRedirect(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Redirect
        </button>
      </div>

      {/* Add Redirect Modal */}
      {showAddRedirect && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Redirect</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From URL</label>
                <input
                  type="text"
                  value={newRedirect.from}
                  onChange={(e) => setNewRedirect(prev => ({ ...prev, from: e.target.value }))}
                  placeholder="/old-url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To URL</label>
                <input
                  type="text"
                  value={newRedirect.to}
                  onChange={(e) => setNewRedirect(prev => ({ ...prev, to: e.target.value }))}
                  placeholder="/new-url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Redirect Type</label>
                <select
                  value={newRedirect.type}
                  onChange={(e) => setNewRedirect(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="301">301 - Permanent</option>
                  <option value="302">302 - Temporary</option>
                  <option value="307">307 - Temporary (Preserve Method)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  value={newRedirect.description}
                  onChange={(e) => setNewRedirect(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of this redirect"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={createRedirect}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex-1"
              >
                Create Redirect
              </button>
              <button
                onClick={() => setShowAddRedirect(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Redirects Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">From</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hits</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Used</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {redirects.map((redirect) => (
                <tr key={redirect.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{redirect.from}</div>
                    {redirect.description && (
                      <div className="text-sm text-gray-500">{redirect.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{redirect.to}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      redirect.type === '301' ? 'bg-green-100 text-green-800' :
                      redirect.type === '302' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {redirect.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {redirect.hits.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleRedirect(redirect.id)}
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        redirect.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {redirect.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(redirect.lastUsed).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      <button
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteRedirect(redirect.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'broken-links', label: 'Broken Links', icon: XCircle },
    { id: 'redirects', label: 'Redirects', icon: ArrowRight },
    { id: 'settings', label: 'Scan Settings', icon: RefreshCw }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Broken Links & Redirects</h2>
          <p className="text-gray-600">Monitor and fix broken links to improve SEO and user experience</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'broken-links' && renderBrokenLinks()}
      {activeTab === 'redirects' && renderRedirects()}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Scan Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="includeExternal"
                  checked={scanSettings.includeExternal}
                  onChange={(e) => setScanSettings(prev => ({ ...prev, includeExternal: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <label htmlFor="includeExternal" className="text-sm font-medium text-gray-700">
                  Include external links
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="includeImages"
                  checked={scanSettings.includeImages}
                  onChange={(e) => setScanSettings(prev => ({ ...prev, includeImages: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <label htmlFor="includeImages" className="text-sm font-medium text-gray-700">
                  Include image links
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="includeResources"
                  checked={scanSettings.includeResources}
                  onChange={(e) => setScanSettings(prev => ({ ...prev, includeResources: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <label htmlFor="includeResources" className="text-sm font-medium text-gray-700">
                  Include resource links (CSS, JS)
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Scan Depth ({scanSettings.maxDepth})
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={scanSettings.maxDepth}
                  onChange={(e) => setScanSettings(prev => ({ ...prev, maxDepth: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeout (seconds)
                </label>
                <input
                  type="number"
                  min="5"
                  max="60"
                  value={scanSettings.timeout}
                  onChange={(e) => setScanSettings(prev => ({ ...prev, timeout: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrokenLinksManager;