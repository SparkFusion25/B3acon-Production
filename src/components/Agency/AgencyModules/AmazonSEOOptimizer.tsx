import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Image as ImageIcon, 
  TrendingUp, 
  Search, 
  Target, 
  Zap, 
  Download, 
  Eye, 
  Settings, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  BarChart3, 
  Star, 
  Package, 
  DollarSign,
  ArrowUp,
  ArrowDown,
  Minus,
  Plus,
  ExternalLink,
  FileText,
  Award,
  Users,
  Camera,
  ThumbsUp,
  MessageSquare,
  Percent
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import shopifyOptimizationApi from '../../../lib/shopifyOptimizationApi';

interface AmazonListing {
  asin: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  bsr: number; // Best Seller Rank
  rating: number;
  reviewCount: number;
  mainImage: string;
  images: string[];
  keywords: string[];
  bulletPoints: string[];
  description: string;
  variations: any[];
  lastUpdated: string;
}

interface ListingOptimization {
  asin: string;
  overallScore: number;
  titleScore: number;
  imageScore: number;
  keywordScore: number;
  contentScore: number;
  suggestions: {
    title: string[];
    images: string[];
    keywords: string[];
    content: string[];
  };
}

const AmazonSEOOptimizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'keywords' | 'competitors' | 'analytics'>('overview');
  const [listings, setListings] = useState<AmazonListing[]>([]);
  const [selectedListing, setSelectedListing] = useState<AmazonListing | null>(null);
  const [optimization, setOptimization] = useState<ListingOptimization | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAsin, setNewAsin] = useState('');

  // Mock data for demonstration
  useEffect(() => {
    const mockListings: AmazonListing[] = [
      {
        asin: 'B08N5WRWNW',
        title: 'Premium Wireless Bluetooth Headphones - Noise Cancelling Over Ear',
        brand: 'TechBrand',
        category: 'Electronics > Headphones',
        price: 89.99,
        bsr: 1256,
        rating: 4.3,
        reviewCount: 2847,
        mainImage: 'https://example.com/headphones-main.jpg',
        images: [
          'https://example.com/headphones-1.jpg',
          'https://example.com/headphones-2.jpg',
          'https://example.com/headphones-3.jpg'
        ],
        keywords: ['wireless headphones', 'bluetooth headphones', 'noise cancelling'],
        bulletPoints: [
          'Advanced noise cancellation technology',
          '30-hour battery life with quick charge',
          'Premium comfort for all-day wear',
          'High-quality audio with deep bass',
          'Compatible with all devices'
        ],
        description: 'Experience premium audio quality with our advanced wireless headphones...',
        variations: [],
        lastUpdated: new Date().toISOString()
      },
      {
        asin: 'B07XJ8C8F5',
        title: 'Stainless Steel Water Bottle Insulated Vacuum Flask 24oz',
        brand: 'HydroBrand',
        category: 'Kitchen > Drinkware',
        price: 24.99,
        bsr: 543,
        rating: 4.6,
        reviewCount: 1523,
        mainImage: 'https://example.com/bottle-main.jpg',
        images: [
          'https://example.com/bottle-1.jpg',
          'https://example.com/bottle-2.jpg'
        ],
        keywords: ['water bottle', 'insulated', 'stainless steel'],
        bulletPoints: [
          'Keeps drinks cold for 24 hours, hot for 12 hours',
          'Leak-proof design with secure lid',
          'BPA-free stainless steel construction',
          'Perfect size for travel and daily use'
        ],
        description: 'Stay hydrated with our premium insulated water bottle...',
        variations: [],
        lastUpdated: new Date().toISOString()
      }
    ];
    setListings(mockListings);
    setSelectedListing(mockListings[0]);
  }, []);

  // Analyze listing when selected
  useEffect(() => {
    if (selectedListing) {
      analyzeListing(selectedListing.asin);
    }
  }, [selectedListing]);

  const analyzeListing = async (asin: string) => {
    setLoading(true);
    try {
      const analysis = await shopifyOptimizationApi.analyzeAmazonListing(asin);
      
      // Generate optimization scores
      const titleScore = calculateTitleScore(selectedListing?.title || '');
      const imageScore = calculateImageScore(selectedListing?.images || []);
      const keywordScore = calculateKeywordScore(selectedListing?.keywords || []);
      const contentScore = calculateContentScore(selectedListing?.bulletPoints || []);
      const overallScore = Math.round((titleScore + imageScore + keywordScore + contentScore) / 4);

      setOptimization({
        asin,
        overallScore,
        titleScore,
        imageScore,
        keywordScore,
        contentScore,
        suggestions: {
          title: [
            'Include main keyword in first 80 characters',
            'Add brand name for better visibility',
            'Include key product features',
            'Use numbers for specifications'
          ],
          images: [
            'Add lifestyle images showing product in use',
            'Include size comparison images',
            'Add infographic with key features',
            'Ensure main image has white background'
          ],
          keywords: [
            'Research long-tail keywords with lower competition',
            'Include seasonal keywords when relevant',
            'Add specification-based keywords',
            'Use customer review keywords'
          ],
          content: [
            'Highlight unique selling propositions',
            'Include technical specifications',
            'Add warranty and guarantee information',
            'Use bullet points for easy scanning'
          ]
        }
      });
    } catch (error) {
      toast.error('Failed to analyze listing');
    } finally {
      setLoading(false);
    }
  };

  const calculateTitleScore = (title: string): number => {
    let score = 0;
    if (title.length >= 80 && title.length <= 200) score += 25;
    if (title.includes('Premium') || title.includes('Professional')) score += 15;
    if (/\d/.test(title)) score += 20; // Contains numbers
    if (title.split(' ').length >= 8) score += 20; // Descriptive
    if (title.charAt(0) === title.charAt(0).toUpperCase()) score += 20; // Proper capitalization
    return Math.min(score, 100);
  };

  const calculateImageScore = (images: string[]): number => {
    let score = 0;
    if (images.length >= 5) score += 30;
    else if (images.length >= 3) score += 20;
    else if (images.length >= 1) score += 10;
    
    // Mock additional image quality checks
    score += 35; // Assume good image quality
    score += 35; // Assume proper image formats
    return Math.min(score, 100);
  };

  const calculateKeywordScore = (keywords: string[]): number => {
    let score = 0;
    if (keywords.length >= 10) score += 40;
    else if (keywords.length >= 5) score += 25;
    else if (keywords.length >= 3) score += 15;
    
    // Check for long-tail keywords
    const longTail = keywords.filter(k => k.split(' ').length >= 3);
    if (longTail.length >= 2) score += 30;
    
    score += 30; // Mock relevance score
    return Math.min(score, 100);
  };

  const calculateContentScore = (bulletPoints: string[]): number => {
    let score = 0;
    if (bulletPoints.length >= 5) score += 25;
    else if (bulletPoints.length >= 3) score += 15;
    
    // Check for detailed descriptions
    const detailed = bulletPoints.filter(bp => bp.length >= 30);
    if (detailed.length >= 3) score += 25;
    
    // Check for benefits vs features
    const benefits = bulletPoints.filter(bp => 
      bp.includes('experience') || bp.includes('perfect') || bp.includes('comfortable')
    );
    if (benefits.length >= 1) score += 25;
    
    score += 25; // Mock additional quality checks
    return Math.min(score, 100);
  };

  const addListing = async () => {
    if (!newAsin.trim()) {
      toast.error('Please enter a valid ASIN');
      return;
    }

    setLoading(true);
    try {
      // In real implementation, would fetch from Amazon API
      const mockListing: AmazonListing = {
        asin: newAsin,
        title: 'New Product Listing - Click to analyze',
        brand: 'Unknown',
        category: 'Unknown',
        price: 0,
        bsr: 0,
        rating: 0,
        reviewCount: 0,
        mainImage: '',
        images: [],
        keywords: [],
        bulletPoints: [],
        description: '',
        variations: [],
        lastUpdated: new Date().toISOString()
      };

      setListings([...listings, mockListing]);
      setNewAsin('');
      setShowAddModal(false);
      toast.success('Listing added successfully');
    } catch (error) {
      toast.error('Failed to add listing');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <ShoppingBag className="w-8 h-8 text-orange-600 mr-3" />
              Amazon SEO Optimizer
            </h1>
            <p className="text-gray-600 mt-1">Optimize your Amazon listings for better visibility and sales</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Listing
            </button>
          </div>
        </div>

        {/* Listing Selector */}
        {listings.length > 0 && (
          <div className="flex items-center space-x-4 mb-6">
            <label className="text-sm font-medium text-gray-700">Selected Listing:</label>
            <select
              value={selectedListing?.asin || ''}
              onChange={(e) => {
                const listing = listings.find(l => l.asin === e.target.value);
                setSelectedListing(listing || null);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              {listings.map((listing) => (
                <option key={listing.asin} value={listing.asin}>
                  {listing.asin} - {listing.title.substring(0, 50)}...
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'listings', label: 'Listing Optimizer', icon: Package },
              { id: 'keywords', label: 'Keyword Research', icon: Search },
              { id: 'competitors', label: 'Competitors', icon: Target },
              { id: 'analytics', label: 'Performance', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && selectedListing && optimization && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Metrics */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Listing Performance</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Star className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{selectedListing.rating}</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <MessageSquare className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{selectedListing.reviewCount.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Reviews</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">#{selectedListing.bsr.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">BSR</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">${selectedListing.price}</div>
                  <div className="text-sm text-gray-600">Price</div>
                </div>
              </div>
            </div>

            {/* Optimization Scores */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimization Scores</h3>
              <div className="space-y-4">
                {[
                  { label: 'Overall Score', score: optimization.overallScore },
                  { label: 'Title Optimization', score: optimization.titleScore },
                  { label: 'Image Quality', score: optimization.imageScore },
                  { label: 'Keyword Usage', score: optimization.keywordScore },
                  { label: 'Content Quality', score: optimization.contentScore }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{item.label}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getScoreBackground(item.score)}`}
                          style={{ width: `${item.score}%` }}
                        ></div>
                      </div>
                      <span className={`font-bold ${getScoreColor(item.score)}`}>{item.score}/100</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions & Suggestions */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setActiveTab('listings')}
                  className="w-full flex items-center justify-center py-3 px-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Optimize Listing
                </button>
                <button
                  onClick={() => setActiveTab('keywords')}
                  className="w-full flex items-center justify-center py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Research Keywords
                </button>
                <button
                  onClick={() => setActiveTab('competitors')}
                  className="w-full flex items-center justify-center py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Analyze Competitors
                </button>
              </div>
            </div>

            {/* Top Suggestions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Suggestions</h3>
              <div className="space-y-3">
                {optimization.suggestions.title.slice(0, 3).map((suggestion, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span className="text-sm text-gray-700">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Listing Optimizer Tab */}
      {activeTab === 'listings' && selectedListing && optimization && (
        <div className="space-y-6">
          {/* Current Listing */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Listing Analysis</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Title Analysis</h4>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700 mb-2">{selectedListing.title}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{selectedListing.title.length} characters</span>
                      <span className={`text-sm font-medium ${getScoreColor(optimization.titleScore)}`}>
                        Score: {optimization.titleScore}/100
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Bullet Points</h4>
                  <div className="space-y-2">
                    {selectedListing.bulletPoints.map((point, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded text-sm text-gray-700">
                        • {point}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Images</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedListing.images.map((image, index) => (
                      <div key={index} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                        <Camera className="w-8 h-8 text-gray-400" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-right">
                    <span className={`text-sm font-medium ${getScoreColor(optimization.imageScore)}`}>
                      Score: {optimization.imageScore}/100
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedListing.keywords.map((keyword, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 text-right">
                    <span className={`text-sm font-medium ${getScoreColor(optimization.keywordScore)}`}>
                      Score: {optimization.keywordScore}/100
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Optimization Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(optimization.suggestions).map(([category, suggestions]) => (
              <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
                  {category} Suggestions
                </h3>
                <div className="space-y-3">
                  {suggestions.map((suggestion: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                      <span className="text-sm text-gray-700">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Keywords Tab */}
      {activeTab === 'keywords' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Keyword Research</h3>
            
            {/* Keyword Search */}
            <div className="mb-6">
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Enter seed keyword..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <button className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  Research
                </button>
              </div>
            </div>

            {/* Keywords Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Keyword</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Search Volume</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Competition</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Relevance</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { keyword: 'wireless bluetooth headphones', volume: 45000, competition: 'High', relevance: 95 },
                    { keyword: 'noise cancelling headphones', volume: 33000, competition: 'Medium', relevance: 90 },
                    { keyword: 'over ear headphones wireless', volume: 12000, competition: 'Low', relevance: 85 },
                    { keyword: 'bluetooth headphones with mic', volume: 8500, competition: 'Low', relevance: 80 }
                  ].map((keyword, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium text-gray-900">{keyword.keyword}</td>
                      <td className="py-3 px-4 text-gray-600">{keyword.volume.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          keyword.competition === 'High' ? 'bg-red-100 text-red-800' :
                          keyword.competition === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {keyword.competition}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{keyword.relevance}%</td>
                      <td className="py-3 px-4">
                        <button className="px-3 py-1 bg-orange-50 text-orange-700 rounded hover:bg-orange-100 transition-colors text-sm">
                          Add
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Competitors Tab */}
      {activeTab === 'competitors' && (
        <div className="space-y-6">
          {[
            {
              asin: 'B08XYZ123',
              title: 'Sony WH-1000XM4 Wireless Premium Noise Canceling Overhead Headphones',
              price: 278.00,
              rating: 4.4,
              reviews: 54230,
              bsr: 45,
              images: 8,
              keywords: ['sony headphones', 'premium wireless', 'noise canceling']
            },
            {
              asin: 'B08ABC456',
              title: 'Bose QuietComfort 35 II Wireless Bluetooth Headphones',
              price: 199.99,
              rating: 4.3,
              reviews: 38920,
              bsr: 78,
              images: 6,
              keywords: ['bose headphones', 'quiet comfort', 'wireless bluetooth']
            }
          ].map((competitor, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{competitor.title}</h3>
                  <p className="text-gray-600">ASIN: {competitor.asin}</p>
                </div>
                <a
                  href={`https://amazon.com/dp/${competitor.asin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Amazon
                </a>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">${competitor.price}</div>
                  <div className="text-sm text-gray-600">Price</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{competitor.rating}</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{competitor.reviews.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Reviews</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">#{competitor.bsr}</div>
                  <div className="text-sm text-gray-600">BSR</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{competitor.images}</div>
                  <div className="text-sm text-gray-600">Images</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{competitor.keywords.length}</div>
                  <div className="text-sm text-gray-600">Keywords</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Top Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {competitor.keywords.map((keyword, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Listings', value: listings.length, icon: Package, color: 'blue' },
              { label: 'Avg Rating', value: '4.45', icon: Star, color: 'yellow' },
              { label: 'Total Reviews', value: '4.37K', icon: MessageSquare, color: 'green' },
              { label: 'Avg BSR', value: '899', icon: TrendingUp, color: 'purple' }
            ].map((metric, index) => (
              <div key={index} className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  </div>
                  <metric.icon className={`w-8 h-8 text-${metric.color}-600`} />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Listings Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">ASIN</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Title</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">BSR</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Rating</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Reviews</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Optimization</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((listing, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium text-gray-900">{listing.asin}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {listing.title.length > 50 ? `${listing.title.substring(0, 50)}...` : listing.title}
                      </td>
                      <td className="py-3 px-4 text-gray-600">#{listing.bsr.toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-600">{listing.rating}</td>
                      <td className="py-3 px-4 text-gray-600">{listing.reviewCount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Optimized
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Listing Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add Amazon Listing</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ASIN</label>
                <input
                  type="text"
                  placeholder="B08N5WRWNW"
                  value={newAsin}
                  onChange={(e) => setNewAsin(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              <div className="text-sm text-gray-600">
                <p>Enter the ASIN of the Amazon product you want to optimize.</p>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addListing}
                disabled={loading || !newAsin.trim()}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Listing'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmazonSEOOptimizer;