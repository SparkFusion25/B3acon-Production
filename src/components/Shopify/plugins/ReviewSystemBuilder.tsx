import React, { useState } from 'react';
import { Star, Mail, Settings, Eye, Users, CheckCircle, Clock, Camera, Zap } from 'lucide-react';

interface ReviewConfig {
  reviewSources: string[];
  autoRequestEnabled: boolean;
  requestDelay: number;
  emailTemplate: string;
  displayStyle: string;
  maxReviews: number;
  minRating: number;
  showPhotos: boolean;
  showDates: boolean;
  showVerifiedBadge: boolean;
  customBranding: boolean;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
}

interface Review {
  id: number;
  name: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
  source: string;
  photo?: string;
}

const ReviewSystemBuilder: React.FC = () => {
  const [config, setConfig] = useState<ReviewConfig>({
    reviewSources: ['shopify', 'amazon', 'google'],
    autoRequestEnabled: true,
    requestDelay: 3,
    emailTemplate: 'modern',
    displayStyle: 'carousel',
    maxReviews: 6,
    minRating: 4,
    showPhotos: true,
    showDates: true,
    showVerifiedBadge: true,
    customBranding: true,
    colors: {
      primary: '#3B82F6',
      secondary: '#F59E0B',
      background: '#FFFFFF',
      text: '#1F2937'
    }
  });
  
  const handleSourceToggle = (sourceId: string) => {
    setConfig(prev => ({
      ...prev,
      reviewSources: prev.reviewSources.includes(sourceId)
        ? prev.reviewSources.filter(s => s !== sourceId)
        : [...prev.reviewSources, sourceId]
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Plugin Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Review Management System</h3>
              <p className="text-sm text-gray-600">Automate review collection and display beautiful testimonials</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              Active
            </span>
            <button className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-green-700 hover:to-blue-700 transition-all">
              <Settings className="w-4 h-4 mr-2" />
              Configure Plugin
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 p-6">
        {/* Configuration Panel */}
        <div className="xl:col-span-1 space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <Settings className="w-5 h-5 text-gray-600" />
            <h4 className="text-lg font-semibold text-gray-900">Review Settings</h4>
          </div>
          
          {/* Review Sources */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Review Sources
            </label>
            <div className="space-y-2">
              {[
                { id: 'shopify', label: 'Shopify Reviews', icon: '🛍️' },
                { id: 'amazon', label: 'Amazon Reviews', icon: '📦' },
                { id: 'google', label: 'Google Reviews', icon: '🔍' },
                { id: 'trustpilot', label: 'Trustpilot', icon: '⭐' },
                { id: 'facebook', label: 'Facebook Reviews', icon: '👥' }
              ].map(source => (
                <label key={source.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.reviewSources.includes(source.id)}
                    onChange={() => handleSourceToggle(source.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {source.icon} {source.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Auto Request Settings */}
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.autoRequestEnabled}
                onChange={(e) => setConfig(prev => ({ ...prev, autoRequestEnabled: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Auto-send review requests after purchase
              </span>
            </label>
            
            {config.autoRequestEnabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Send request after (days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={config.requestDelay}
                  onChange={(e) => setConfig(prev => ({ ...prev, requestDelay: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
          
          {/* Display Configuration */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Style
              </label>
              <select
                value={config.displayStyle}
                onChange={(e) => setConfig(prev => ({ ...prev, displayStyle: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="carousel">Carousel</option>
                <option value="grid">Grid Layout</option>
                <option value="list">List View</option>
                <option value="masonry">Masonry</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Reviews to Show
              </label>
              <input
                type="range"
                min="3"
                max="20"
                value={config.maxReviews}
                onChange={(e) => setConfig(prev => ({ ...prev, maxReviews: Number(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-center text-sm text-gray-600 mt-1">{config.maxReviews} reviews</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Rating to Display
              </label>
              <select
                value={config.minRating}
                onChange={(e) => setConfig(prev => ({ ...prev, minRating: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">1 Star and above</option>
                <option value="2">2 Stars and above</option>
                <option value="3">3 Stars and above</option>
                <option value="4">4 Stars and above</option>
                <option value="5">5 Stars only</option>
              </select>
            </div>
          </div>
          
          {/* Display Options */}
          <div className="space-y-3">
            <h5 className="font-medium text-gray-900">Display Options</h5>
            
            {[
              { key: 'showPhotos', label: 'Show customer photos', icon: Camera },
              { key: 'showDates', label: 'Show review dates', icon: Clock },
              { key: 'showVerifiedBadge', label: 'Show verified purchase badges', icon: CheckCircle },
              { key: 'customBranding', label: 'Enable custom branding', icon: Zap }
            ].map(option => (
              <label key={option.key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={config[option.key as keyof ReviewConfig] as boolean}
                  onChange={(e) => setConfig(prev => ({ ...prev, [option.key]: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <option.icon className="w-4 h-4 ml-2 mr-1 text-gray-500" />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>

          {/* Color Configuration */}
          <div className="space-y-4">
            <h5 className="font-medium text-gray-900">Color Scheme</h5>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Primary</label>
                <input
                  type="color"
                  value={config.colors.primary}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    colors: { ...prev.colors, primary: e.target.value }
                  }))}
                  className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Secondary</label>
                <input
                  type="color"
                  value={config.colors.secondary}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    colors: { ...prev.colors, secondary: e.target.value }
                  }))}
                  className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Preview Panel */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <Eye className="w-5 h-5 text-gray-600" />
            <h4 className="text-lg font-semibold text-gray-900">Live Preview</h4>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-300">
            <ReviewSystemPreview config={config} />
          </div>
          
          {/* Email Template Preview */}
          <div className="space-y-3">
            <h5 className="font-medium text-gray-900 flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              Review Request Email Preview
            </h5>
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <ReviewEmailTemplate config={config} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Pro Tip:</span> Higher rated reviews improve conversion rates by up to 270%
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Save Draft
          </button>
          <button className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-green-700 hover:to-blue-700 transition-all">
            Install & Activate
          </button>
        </div>
      </div>
    </div>
  );
};

// Review System Preview Component
const ReviewSystemPreview: React.FC<{ config: ReviewConfig }> = ({ config }) => {
  const sampleReviews: Review[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      rating: 5,
      text: 'Absolutely love this product! The quality exceeded my expectations and shipping was super fast.',
      date: '2024-01-15',
      verified: true,
      source: 'shopify',
      photo: undefined
    },
    {
      id: 2,
      name: 'Mike Chen',
      rating: 5,
      text: 'Great value for money. Been using it for 3 months now and it\'s holding up perfectly.',
      date: '2024-01-10',
      verified: true,
      source: 'amazon',
      photo: 'customer-photo-url'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      rating: 4,
      text: 'Really good product, fast delivery. Would definitely recommend to others!',
      date: '2024-01-08',
      verified: true,
      source: 'google',
      photo: undefined
    },
    {
      id: 4,
      name: 'David Thompson',
      rating: 5,
      text: 'Outstanding customer service and product quality. Will buy again!',
      date: '2024-01-05',
      verified: true,
      source: 'trustpilot',
      photo: undefined
    }
  ];
  
  const filteredReviews = sampleReviews
    .filter(review => review.rating >= config.minRating)
    .slice(0, config.maxReviews);
  
  if (config.displayStyle === 'carousel') {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-center" style={{ color: config.colors.text }}>
          What Our Customers Say
        </h3>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {filteredReviews.map(review => (
            <ReviewCard key={review.id} review={review} config={config} />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-center" style={{ color: config.colors.text }}>
        Customer Reviews
      </h3>
      <div className={`grid gap-4 ${
        config.displayStyle === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
      }`}>
        {filteredReviews.map(review => (
          <ReviewCard key={review.id} review={review} config={config} />
        ))}
      </div>
    </div>
  );
};

// Individual Review Card Component
const ReviewCard: React.FC<{ review: Review; config: ReviewConfig }> = ({ review, config }) => {
  const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
  
  const getSourceIcon = (source: string) => {
    const icons: Record<string, string> = {
      shopify: '🛍️',
      amazon: '📦',
      google: '🔍',
      trustpilot: '⭐',
      facebook: '👥'
    };
    return icons[source] || '⭐';
  };
  
  return (
    <div 
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 min-w-[300px]"
      style={{ backgroundColor: config.colors.background }}
    >
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {review.name.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-semibold text-sm" style={{ color: config.colors.text }}>
                {review.name}
              </h4>
              <div className="flex items-center space-x-2 mt-1">
                <StarRating rating={review.rating} />
                <span className="text-xs text-gray-500">{getSourceIcon(review.source)}</span>
              </div>
            </div>
            {config.showVerifiedBadge && review.verified && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                <CheckCircle className="w-3 h-3 inline mr-1" />
                Verified
              </span>
            )}
          </div>
          <p className="text-sm mt-2" style={{ color: config.colors.text }}>
            {review.text}
          </p>
          {config.showDates && (
            <p className="text-xs text-gray-500 mt-2 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {new Date(review.date).toLocaleDateString()}
            </p>
          )}
          {config.showPhotos && review.photo && (
            <div className="mt-3">
              <Camera className="w-4 h-4 text-gray-400" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Email Template Preview
const ReviewEmailTemplate: React.FC<{ config: ReviewConfig }> = ({ config }) => {
  return (
    <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div 
        className="p-4 text-white text-center"
        style={{ background: `linear-gradient(45deg, ${config.colors.primary}, ${config.colors.secondary})` }}
      >
        <h2 className="text-lg font-bold">How was your experience?</h2>
        <p className="text-sm opacity-90">We'd love to hear from you!</p>
      </div>
      
      <div className="p-6 text-center">
        <div className="mb-4">
          <div className="w-20 h-20 mx-auto rounded-lg bg-gray-200 flex items-center justify-center">
            <span className="text-2xl">📦</span>
          </div>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2">
          Thank you for your purchase!
        </h3>
        
        <p className="text-sm text-gray-600 mb-6">
          Your opinion matters to us and helps other customers make informed decisions.
        </p>
        
        <div className="space-y-3">
          <button 
            className="w-full text-white py-3 px-4 rounded-lg font-medium transition-all hover:opacity-90"
            style={{ background: `linear-gradient(45deg, ${config.colors.primary}, ${config.colors.secondary})` }}
          >
            <Star className="w-4 h-4 inline mr-2" />
            Leave a Review
          </button>
          
          <p className="text-xs text-gray-500">
            Takes less than 2 minutes • Helps other shoppers
          </p>
        </div>
        
        <div className="mt-4 flex justify-center space-x-2">
          {[1, 2, 3, 4, 5].map(star => (
            <Star key={star} className="w-6 h-6 text-yellow-400 fill-current" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewSystemBuilder;