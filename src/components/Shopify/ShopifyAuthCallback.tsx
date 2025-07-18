import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { shopifyApi } from '../../services/shopifyApi';

const ShopifyAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [storeName, setStoreName] = useState('');

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Get parameters from URL
        const code = searchParams.get('code');
        const shop = searchParams.get('shop');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          throw new Error(searchParams.get('error_description') || 'Authentication was denied');
        }

        if (!code || !shop) {
          throw new Error('Missing required authentication parameters');
        }

        // Clean shop domain (remove .myshopify.com if present)
        const shopDomain = shop.replace('.myshopify.com', '');
        setStoreName(shopDomain);

        setMessage('Exchanging authorization code for access token...');

        // Exchange code for access token
        const { accessToken } = await shopifyApi.exchangeCodeForToken(shopDomain, code);

        setMessage('Saving store connection...');

        // Save store connection to Supabase
        await shopifyApi.saveStoreConnection(shopDomain, accessToken);

        setMessage('Installing webhooks...');

        // Install essential webhooks
        const webhookTopics = [
          'app/uninstalled',
          'orders/create',
          'orders/updated',
          'products/create',
          'products/update'
        ];

        const webhookPromises = webhookTopics.map(topic =>
          shopifyApi.installWebhook(
            shopDomain,
            accessToken,
            topic,
            `${window.location.origin}/api/webhooks/shopify`
          ).catch(error => {
            console.warn(`Failed to install webhook for ${topic}:`, error);
          })
        );

        await Promise.allSettled(webhookPromises);

        setStatus('success');
        setMessage('Store connected successfully!');

        // Store shop domain in localStorage for easy access
        localStorage.setItem('shopify_connected_store', shopDomain);

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/shopify/dashboard');
        }, 3000);

      } catch (error) {
        console.error('❌ Shopify auth error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Failed to connect store');
      }
    };

    handleAuth();
  }, [searchParams, navigate]);

  const handleRetry = () => {
    navigate('/shopify/install');
  };

  const handleContinue = () => {
    navigate('/shopify/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Status Icon */}
          <div className="mb-6">
            {status === 'loading' && (
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            )}
            {status === 'success' && (
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            )}
            {status === 'error' && (
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {status === 'loading' && 'Connecting Your Store'}
            {status === 'success' && 'Store Connected!'}
            {status === 'error' && 'Connection Failed'}
          </h1>

          {/* Store Name */}
          {storeName && (
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                <ExternalLink className="w-4 h-4" />
                {storeName}.myshopify.com
              </div>
            </div>
          )}

          {/* Message */}
          <p className="text-gray-600 mb-6">
            {message}
          </p>

          {/* Progress Indicator */}
          {status === 'loading' && (
            <div className="mb-6">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {status === 'success' && (
              <>
                <button
                  onClick={handleContinue}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  Continue to Dashboard
                </button>
                <p className="text-sm text-gray-500">
                  Redirecting automatically in 3 seconds...
                </p>
              </>
            )}

            {status === 'error' && (
              <>
                <button
                  onClick={handleRetry}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  Try Again
                </button>
                <button
                  onClick={() => navigate('/shopify')}
                  className="w-full text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  Back to Shopify App
                </button>
              </>
            )}

            {status === 'loading' && (
              <button
                onClick={() => navigate('/shopify')}
                className="w-full text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Cancel
              </button>
            )}
          </div>

          {/* Security Note */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              🔒 Your store data is securely encrypted and stored. We only access the data necessary to provide our services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopifyAuthCallback;