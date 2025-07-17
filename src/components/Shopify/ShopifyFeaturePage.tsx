import React from 'react';
import { ArrowLeft, Sparkles, Clock, CheckCircle } from 'lucide-react';
import ShopifyAppLayout from './ShopifyAppLayout';

interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  status: 'available' | 'coming_soon' | 'beta';
}

interface ShopifyFeaturePageProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  features: Feature[];
  comingSoon?: boolean;
  children?: React.ReactNode;
}

const ShopifyFeaturePage: React.FC<ShopifyFeaturePageProps> = ({
  title,
  description,
  icon: PageIcon,
  features,
  comingSoon = false,
  children
}) => {
  const handleGoBack = () => {
    window.history.back();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Available
          </span>
        );
      case 'beta':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Sparkles className="w-3 h-3 mr-1" />
            Beta
          </span>
        );
      case 'coming_soon':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Coming Soon
          </span>
        );
      default:
        return null;
    }
  };

  const pageContent = (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={handleGoBack}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </button>
        
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <PageIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
              {title}
              {comingSoon && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  <Clock className="w-4 h-4 mr-1" />
                  Coming Soon
                </span>
              )}
            </h1>
            <p className="text-lg text-gray-600 mt-2">{description}</p>
          </div>
        </div>
      </div>

      {/* Coming Soon Message */}
      {comingSoon && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-8 mb-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              This Feature is Coming Soon!
            </h3>
            <p className="text-gray-600 mb-6">
              We're working hard to bring you this amazing feature. It will be available in a future update.
            </p>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-sm text-gray-700">
                <strong>Expected Release:</strong> Next Quarter 2024
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Feature Grid */}
      {!comingSoon && features.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  {getStatusBadge(feature.status)}
                </div>
              </div>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Custom Content */}
      {children && (
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          {children}
        </div>
      )}

      {/* Default Content for Available Features */}
      {!comingSoon && !children && (
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PageIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {title} Dashboard
            </h3>
            <p className="text-gray-600 mb-6">
              Access all your {title.toLowerCase()} tools and analytics from this central hub.
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
              <p className="text-sm text-gray-700">
                This feature is fully functional and ready to use. Explore the tools above to get started!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      {!comingSoon && (
        <div className="mt-8 text-center">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Get Started with {title}
          </button>
        </div>
      )}
    </div>
  );

  return <ShopifyAppLayout>{pageContent}</ShopifyAppLayout>;
};

export default ShopifyFeaturePage;