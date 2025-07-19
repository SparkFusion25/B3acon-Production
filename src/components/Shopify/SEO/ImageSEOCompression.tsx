import React, { useState, useEffect } from 'react';
import { 
  Image, 
  Minimize2 as Compress, 
  Download, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  Settings,
  Zap,
  Eye,
  FileText,
  BarChart3,
  Sparkles as Optimize
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ImageOptimization {
  id: string;
  originalUrl: string;
  optimizedUrl: string;
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  altText: string;
  title: string;
  filename: string;
  format: string;
  dimensions: { width: number; height: number };
  seoScore: number;
  issues: string[];
  suggestions: string[];
}

interface OptimizationSettings {
  quality: number;
  format: 'webp' | 'jpeg' | 'png' | 'auto';
  maxWidth: number;
  maxHeight: number;
  autoAltText: boolean;
  lazyLoading: boolean;
}

const ImageSEOCompression: React.FC = () => {
  const [images, setImages] = useState<ImageOptimization[]>([]);
  const [settings, setSettings] = useState<OptimizationSettings>({
    quality: 85,
    format: 'auto',
    maxWidth: 1920,
    maxHeight: 1080,
    autoAltText: true,
    lazyLoading: true
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  useEffect(() => {
    loadSampleData();
  }, []);

  const loadSampleData = () => {
    // Sample image data for demonstration
    setImages([
      {
        id: '1',
        originalUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200',
        optimizedUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&fm=webp&q=85',
        originalSize: 2400000, // 2.4MB
        optimizedSize: 180000, // 180KB
        compressionRatio: 92.5,
        altText: '',
        title: 'Product Image 1',
        filename: 'product-headphones.jpg',
        format: 'JPEG',
        dimensions: { width: 1200, height: 800 },
        seoScore: 45,
        issues: ['Missing alt text', 'Large file size', 'Not optimized format'],
        suggestions: ['Add descriptive alt text', 'Compress image', 'Convert to WebP format']
      },
      {
        id: '2',
        originalUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200',
        optimizedUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&fm=webp&q=85',
        originalSize: 1800000, // 1.8MB
        optimizedSize: 145000, // 145KB
        compressionRatio: 91.9,
        altText: 'Red running shoes for athletic performance',
        title: 'Premium Running Shoes',
        filename: 'red-running-shoes.jpg',
        format: 'JPEG',
        dimensions: { width: 1200, height: 800 },
        seoScore: 85,
        issues: ['Large file size'],
        suggestions: ['Compress image for faster loading']
      },
      {
        id: '3',
        originalUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200',
        optimizedUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&fm=webp&q=85',
        originalSize: 3200000, // 3.2MB
        optimizedSize: 225000, // 225KB
        compressionRatio: 93.0,
        altText: 'Luxury analog watch with leather strap',
        title: 'Classic Leather Watch',
        filename: 'luxury-watch.jpg',
        format: 'JPEG',
        dimensions: { width: 1200, height: 1200 },
        seoScore: 90,
        issues: [],
        suggestions: ['Consider adding structured data for product images']
      }
    ]);
  };

  const analyzeImages = async () => {
    setIsAnalyzing(true);
    try {
      // Simulate image analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update images with fresh analysis
      setImages(prev => prev.map(img => ({
        ...img,
        seoScore: Math.random() * 40 + 60, // Random score between 60-100
        issues: img.altText ? [] : ['Missing alt text', 'Large file size'],
        suggestions: img.altText ? ['Optimize file size'] : ['Add alt text', 'Optimize file size', 'Convert to WebP']
      })));
      
      toast.success('Image analysis completed!');
    } catch (error) {
      toast.error('Failed to analyze images');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const optimizeImages = async (imageIds: string[]) => {
    setIsOptimizing(true);
    try {
      // Simulate optimization process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setImages(prev => prev.map(img => 
        imageIds.includes(img.id) ? {
          ...img,
          optimizedSize: Math.floor(img.originalSize * 0.15), // 85% compression
          compressionRatio: 85,
          seoScore: Math.min(img.seoScore + 20, 100),
          issues: img.issues.filter(issue => !issue.includes('file size')),
          suggestions: img.suggestions.filter(s => !s.includes('Compress'))
        } : img
      ));
      
      toast.success(`Optimized ${imageIds.length} images successfully!`);
      setSelectedImages([]);
    } catch (error) {
      toast.error('Failed to optimize images');
    } finally {
      setIsOptimizing(false);
    }
  };

  const generateAltText = async (imageId: string) => {
    try {
      // Simulate AI alt text generation
      const altTexts = [
        'Professional wireless headphones with noise cancellation',
        'Premium running shoes in vibrant red color',
        'Elegant analog watch with brown leather strap',
        'Modern smartphone with sleek design',
        'Comfortable office chair with ergonomic support'
      ];
      
      const randomAlt = altTexts[Math.floor(Math.random() * altTexts.length)];
      
      setImages(prev => prev.map(img => 
        img.id === imageId ? {
          ...img,
          altText: randomAlt,
          seoScore: Math.min(img.seoScore + 15, 100),
          issues: img.issues.filter(issue => !issue.includes('alt text')),
          suggestions: img.suggestions.filter(s => !s.includes('alt text'))
        } : img
      ));
      
      toast.success('Alt text generated successfully!');
    } catch (error) {
      toast.error('Failed to generate alt text');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return Math.round(bytes / 1024) + ' KB';
    return Math.round(bytes / 1048576 * 10) / 10 + ' MB';
  };

  const calculateTotalSavings = () => {
    const totalOriginal = images.reduce((sum, img) => sum + img.originalSize, 0);
    const totalOptimized = images.reduce((sum, img) => sum + img.optimizedSize, 0);
    const savings = totalOriginal - totalOptimized;
    const percentage = (savings / totalOriginal) * 100;
    
    return { savings, percentage, totalOriginal, totalOptimized };
  };

  const stats = calculateTotalSavings();
  const averageScore = images.reduce((sum, img) => sum + img.seoScore, 0) / images.length;

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Images</p>
              <p className="text-3xl font-bold text-gray-900">{images.length}</p>
            </div>
            <Image className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average SEO Score</p>
              <p className="text-3xl font-bold text-green-600">{Math.round(averageScore)}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Size Reduction</p>
              <p className="text-3xl font-bold text-purple-600">{Math.round(stats.percentage)}%</p>
            </div>
            <Compress className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Space Saved</p>
              <p className="text-3xl font-bold text-orange-600">{formatFileSize(stats.savings)}</p>
            </div>
            <Download className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={analyzeImages}
            disabled={isAnalyzing}
            className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Analyze All Images
              </>
            )}
          </button>

          <button
            onClick={() => optimizeImages(images.map(img => img.id))}
            disabled={isOptimizing}
            className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isOptimizing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Optimizing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Optimize All Images
              </>
            )}
          </button>

          <button
            className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Optimization Settings
          </button>
        </div>
      </div>

      {/* Performance Impact */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Impact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Page Load Speed Improvement</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Before Optimization</span>
                <span className="text-red-600">4.2s</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '84%' }}></div>
              </div>
              <div className="flex justify-between text-sm">
                <span>After Optimization</span>
                <span className="text-green-600">1.8s</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '36%' }}></div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">SEO Benefits</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Improved Core Web Vitals</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Better mobile experience</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Reduced bounce rate</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Enhanced accessibility</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderImagesList = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Image Management</h3>
        <div className="flex gap-2">
          {selectedImages.length > 0 && (
            <button
              onClick={() => optimizeImages(selectedImages)}
              disabled={isOptimizing}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Optimize className="h-4 w-4" />
              Optimize Selected ({selectedImages.length})
            </button>
          )}
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Images
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedImages.length === images.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedImages(images.map(img => img.id));
                      } else {
                        setSelectedImages([]);
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SEO Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alt Text</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issues</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {images.map((image) => (
                <tr key={image.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedImages.includes(image.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedImages([...selectedImages, image.id]);
                        } else {
                          setSelectedImages(selectedImages.filter(id => id !== image.id));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={image.optimizedUrl}
                        alt={image.altText || image.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{image.title}</div>
                        <div className="text-sm text-gray-500">{image.filename}</div>
                        <div className="text-xs text-gray-400">{image.dimensions.width}×{image.dimensions.height}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-12 h-2 rounded-full ${
                        image.seoScore >= 80 ? 'bg-green-500' :
                        image.seoScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`} style={{ width: `${image.seoScore}%` }}></div>
                      <span className="text-sm font-medium">{Math.round(image.seoScore)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="text-gray-900">{formatFileSize(image.optimizedSize)}</div>
                      <div className="text-gray-500 line-through">{formatFileSize(image.originalSize)}</div>
                      <div className="text-green-600">{Math.round(image.compressionRatio)}% saved</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <div className="text-sm">
                      {image.altText ? (
                        <span className="text-gray-900">{image.altText}</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-red-500">Missing</span>
                          <button
                            onClick={() => generateAltText(image.id)}
                            className="text-blue-600 hover:text-blue-700 text-xs"
                          >
                            Generate
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {image.issues.map((issue, index) => (
                        <span key={index} className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                          {issue}
                        </span>
                      ))}
                      {image.issues.length === 0 && (
                        <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                          Optimized
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      <button
                        onClick={() => optimizeImages([image.id])}
                        disabled={isOptimizing}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Optimize"
                      >
                        <Optimize className="h-4 w-4" />
                      </button>
                      <button
                        className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
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

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Optimization Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image Quality ({settings.quality}%)
            </label>
            <input
              type="range"
              min="20"
              max="100"
              value={settings.quality}
              onChange={(e) => setSettings(prev => ({ ...prev, quality: parseInt(e.target.value) }))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Smaller file</span>
              <span>Better quality</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Output Format
            </label>
            <select
              value={settings.format}
              onChange={(e) => setSettings(prev => ({ ...prev, format: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="auto">Auto (Recommended)</option>
              <option value="webp">WebP</option>
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Width (px)
            </label>
            <input
              type="number"
              value={settings.maxWidth}
              onChange={(e) => setSettings(prev => ({ ...prev, maxWidth: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Height (px)
            </label>
            <input
              type="number"
              value={settings.maxHeight}
              onChange={(e) => setSettings(prev => ({ ...prev, maxHeight: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="autoAltText"
              checked={settings.autoAltText}
              onChange={(e) => setSettings(prev => ({ ...prev, autoAltText: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <label htmlFor="autoAltText" className="text-sm font-medium text-gray-700">
              Auto-generate alt text using AI
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="lazyLoading"
              checked={settings.lazyLoading}
              onChange={(e) => setSettings(prev => ({ ...prev, lazyLoading: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <label htmlFor="lazyLoading" className="text-sm font-medium text-gray-700">
              Enable lazy loading for better performance
            </label>
          </div>
        </div>

        <div className="mt-6">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'images', label: 'Images', icon: Image },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Image SEO & Compression</h2>
          <p className="text-gray-600">Optimize your product images for better SEO and faster loading</p>
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
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'images' && renderImagesList()}
      {activeTab === 'settings' && renderSettings()}
    </div>
  );
};

export default ImageSEOCompression;