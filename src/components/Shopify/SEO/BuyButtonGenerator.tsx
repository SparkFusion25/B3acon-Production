import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Heart, 
  Eye, 
  Copy, 
  Download, 
  Settings,
  Zap,
  Palette,
  Monitor,
  Smartphone,
  Tablet,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface BuyButtonStyle {
  id: string;
  name: string;
  description: string;
  css: string;
  preview: {
    background: string;
    color: string;
    border: string;
    borderRadius: string;
    fontSize: string;
    padding: string;
    fontWeight: string;
    textTransform: string;
    shadow: string;
    hoverEffect: string;
  };
}

interface ButtonAnalytics {
  id: string;
  views: number;
  clicks: number;
  conversions: number;
  revenue: number;
  ctr: number;
  conversionRate: number;
  avgOrderValue: number;
}

interface BuyButtonConfig {
  id: string;
  name: string;
  product: {
    id: string;
    title: string;
    price: number;
    currency: string;
    image: string;
    variants: Array<{
      id: string;
      title: string;
      price: number;
      available: boolean;
    }>;
  };
  style: string;
  customText: string;
  showPrice: boolean;
  showImage: boolean;
  showVariants: boolean;
  enableWishlist: boolean;
  enableQuickView: boolean;
  redirectUrl: string;
  trackingEnabled: boolean;
  mobileOptimized: boolean;
  createdAt: string;
  isActive: boolean;
}

const BuyButtonGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState('generator');
  const [selectedStyle, setSelectedStyle] = useState('modern');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [buyButtons, setBuyButtons] = useState<BuyButtonConfig[]>([]);
  const [analytics, setAnalytics] = useState<ButtonAnalytics[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [buttonConfig, setButtonConfig] = useState<Partial<BuyButtonConfig>>({
    name: 'New Buy Button',
    customText: 'Add to Cart',
    showPrice: true,
    showImage: true,
    showVariants: false,
    enableWishlist: true,
    enableQuickView: false,
    trackingEnabled: true,
    mobileOptimized: true,
    product: {
      id: 'sample-product',
      title: 'Premium Wireless Headphones',
      price: 199.99,
      currency: 'USD',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      variants: [
        { id: 'var1', title: 'Black', price: 199.99, available: true },
        { id: 'var2', title: 'White', price: 199.99, available: true },
        { id: 'var3', title: 'Silver', price: 219.99, available: false }
      ]
    }
  });

  const buttonStyles: BuyButtonStyle[] = [
    {
      id: 'modern',
      name: 'Modern Gradient',
      description: 'Clean gradient with smooth animations',
      css: `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 12px;
        padding: 16px 32px;
        font-size: 16px;
        font-weight: 600;
        text-transform: none;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        transition: all 0.3s ease;
        cursor: pointer;
      `,
      preview: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        padding: '16px 32px',
        fontWeight: '600',
        textTransform: 'none',
        shadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
        hoverEffect: 'transform: translateY(-2px); box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);'
      }
    },
    {
      id: 'minimal',
      name: 'Minimal Clean',
      description: 'Simple, clean design with subtle hover',
      css: `
        background: #000000;
        color: white;
        border: 1px solid #000000;
        border-radius: 6px;
        padding: 14px 28px;
        font-size: 14px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        transition: all 0.2s ease;
        cursor: pointer;
      `,
      preview: {
        background: '#000000',
        color: 'white',
        border: '1px solid #000000',
        borderRadius: '6px',
        fontSize: '14px',
        padding: '14px 28px',
        fontWeight: '500',
        textTransform: 'uppercase',
        shadow: 'none',
        hoverEffect: 'background: #333333; transform: scale(1.02);'
      }
    },
    {
      id: 'playful',
      name: 'Playful Rounded',
      description: 'Fun, rounded design with bright colors',
      css: `
        background: #ff6b6b;
        color: white;
        border: none;
        border-radius: 50px;
        padding: 18px 36px;
        font-size: 16px;
        font-weight: 700;
        text-transform: none;
        box-shadow: 0 8px 20px rgba(255, 107, 107, 0.3);
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        cursor: pointer;
      `,
      preview: {
        background: '#ff6b6b',
        color: 'white',
        border: 'none',
        borderRadius: '50px',
        fontSize: '16px',
        padding: '18px 36px',
        fontWeight: '700',
        textTransform: 'none',
        shadow: '0 8px 20px rgba(255, 107, 107, 0.3)',
        hoverEffect: 'transform: scale(1.05) rotate(-1deg); box-shadow: 0 12px 25px rgba(255, 107, 107, 0.4);'
      }
    },
    {
      id: 'professional',
      name: 'Professional Blue',
      description: 'Corporate-friendly design',
      css: `
        background: #2563eb;
        color: white;
        border: 2px solid #2563eb;
        border-radius: 8px;
        padding: 12px 24px;
        font-size: 15px;
        font-weight: 600;
        text-transform: none;
        box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
        transition: all 0.2s ease;
        cursor: pointer;
      `,
      preview: {
        background: '#2563eb',
        color: 'white',
        border: '2px solid #2563eb',
        borderRadius: '8px',
        fontSize: '15px',
        padding: '12px 24px',
        fontWeight: '600',
        textTransform: 'none',
        shadow: '0 2px 4px rgba(37, 99, 235, 0.2)',
        hoverEffect: 'background: #1d4ed8; border-color: #1d4ed8;'
      }
    },
    {
      id: 'outlined',
      name: 'Outlined Hover',
      description: 'Outlined button with fill hover effect',
      css: `
        background: transparent;
        color: #059669;
        border: 2px solid #059669;
        border-radius: 10px;
        padding: 14px 30px;
        font-size: 16px;
        font-weight: 600;
        text-transform: none;
        transition: all 0.3s ease;
        cursor: pointer;
      `,
      preview: {
        background: 'transparent',
        color: '#059669',
        border: '2px solid #059669',
        borderRadius: '10px',
        fontSize: '16px',
        padding: '14px 30px',
        fontWeight: '600',
        textTransform: 'none',
        shadow: 'none',
        hoverEffect: 'background: #059669; color: white; transform: translateY(-1px);'
      }
    }
  ];

  useEffect(() => {
    loadSampleData();
  }, []);

  const loadSampleData = () => {
    // Sample buy buttons
    const sampleButtons: BuyButtonConfig[] = [
      {
        id: '1',
        name: 'Homepage Buy Button',
        product: buttonConfig.product!,
        style: 'modern',
        customText: 'Buy Now',
        showPrice: true,
        showImage: true,
        showVariants: false,
        enableWishlist: true,
        enableQuickView: false,
        redirectUrl: '/cart',
        trackingEnabled: true,
        mobileOptimized: true,
        createdAt: '2024-01-01T10:00:00Z',
        isActive: true
      },
      {
        id: '2',
        name: 'Product Page CTA',
        product: buttonConfig.product!,
        style: 'professional',
        customText: 'Add to Cart',
        showPrice: false,
        showImage: false,
        showVariants: true,
        enableWishlist: false,
        enableQuickView: true,
        redirectUrl: '/checkout',
        trackingEnabled: true,
        mobileOptimized: true,
        createdAt: '2024-01-02T10:00:00Z',
        isActive: true
      }
    ];

    // Sample analytics
    const sampleAnalytics: ButtonAnalytics[] = [
      {
        id: '1',
        views: 15420,
        clicks: 1847,
        conversions: 231,
        revenue: 45789.69,
        ctr: 11.97,
        conversionRate: 12.51,
        avgOrderValue: 198.22
      },
      {
        id: '2',
        views: 8932,
        clicks: 1205,
        conversions: 167,
        revenue: 33156.33,
        ctr: 13.49,
        conversionRate: 13.86,
        avgOrderValue: 198.54
      }
    ];

    setBuyButtons(sampleButtons);
    setAnalytics(sampleAnalytics);
  };

  const generateButton = async () => {
    setIsGenerating(true);
    try {
      const newButton: BuyButtonConfig = {
        id: Date.now().toString(),
        name: buttonConfig.name || 'New Buy Button',
        product: buttonConfig.product!,
        style: selectedStyle,
        customText: buttonConfig.customText || 'Add to Cart',
        showPrice: buttonConfig.showPrice || false,
        showImage: buttonConfig.showImage || false,
        showVariants: buttonConfig.showVariants || false,
        enableWishlist: buttonConfig.enableWishlist || false,
        enableQuickView: buttonConfig.enableQuickView || false,
        redirectUrl: buttonConfig.redirectUrl || '/cart',
        trackingEnabled: buttonConfig.trackingEnabled || true,
        mobileOptimized: buttonConfig.mobileOptimized || true,
        createdAt: new Date().toISOString(),
        isActive: true
      };

      setBuyButtons(prev => [newButton, ...prev]);
      toast.success('Buy button generated successfully!');
    } catch (error) {
      toast.error('Failed to generate buy button');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyButtonCode = (button: BuyButtonConfig) => {
    const style = buttonStyles.find(s => s.id === button.style);
    const code = `
<!-- B3ACON Buy Button -->
<div class="b3acon-buy-button" data-product-id="${button.product.id}">
  ${button.showImage ? `<img src="${button.product.image}" alt="${button.product.title}" class="product-image" />` : ''}
  <div class="button-content">
    <h3 class="product-title">${button.product.title}</h3>
    ${button.showPrice ? `<span class="product-price">$${button.product.price} ${button.product.currency}</span>` : ''}
    ${button.showVariants ? `
      <select class="variant-selector">
        ${button.product.variants.map(v => `<option value="${v.id}" ${!v.available ? 'disabled' : ''}>${v.title} - $${v.price}</option>`).join('')}
      </select>
    ` : ''}
    <button class="buy-button" style="${style?.css.replace(/\n/g, ' ').replace(/\s+/g, ' ')}" onclick="addToCart('${button.product.id}')">
      ${button.customText}
    </button>
    ${button.enableWishlist ? `<button class="wishlist-btn" onclick="addToWishlist('${button.product.id}')">♡</button>` : ''}
    ${button.enableQuickView ? `<button class="quickview-btn" onclick="quickView('${button.product.id}')">👁</button>` : ''}
  </div>
</div>

<style>
.b3acon-buy-button {
  max-width: 400px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 16px;
}
.buy-button { ${style?.css} }
.buy-button:hover { ${style?.preview.hoverEffect} }
${button.mobileOptimized ? `
@media (max-width: 768px) {
  .b3acon-buy-button { max-width: 100%; margin: 0 auto; }
  .buy-button { width: 100%; padding: 14px 20px; font-size: 16px; }
}
` : ''}
</style>

<script>
function addToCart(productId) {
  // Add your cart logic here
  ${button.trackingEnabled ? `gtag('event', 'add_to_cart', { 'currency': '${button.product.currency}', 'value': ${button.product.price} });` : ''}
  window.location.href = '${button.redirectUrl}';
}
</script>`;

    navigator.clipboard.writeText(code);
    toast.success('Button code copied to clipboard!');
  };

  const getDevicePreviewClass = () => {
    switch (previewDevice) {
      case 'mobile': return 'max-w-sm mx-auto';
      case 'tablet': return 'max-w-md mx-auto';
      default: return 'max-w-lg mx-auto';
    }
  };

  const renderGenerator = () => {
    const selectedStyleObj = buttonStyles.find(s => s.id === selectedStyle);
    
    return (
      <div className="space-y-6">
        {/* Style Selection */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Button Style</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {buttonStyles.map(style => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`p-4 border rounded-lg text-left transition-all ${
                  selectedStyle === style.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="mb-3">
                  <div
                    className="w-full py-3 px-6 text-center rounded transition-all cursor-pointer"
                    style={{
                      background: style.preview.background,
                      color: style.preview.color,
                      border: style.preview.border,
                      borderRadius: style.preview.borderRadius,
                      fontSize: '14px',
                      fontWeight: style.preview.fontWeight,
                      boxShadow: style.preview.shadow
                    }}
                  >
                    Add to Cart
                  </div>
                </div>
                <h4 className="font-medium text-gray-900">{style.name}</h4>
                <p className="text-sm text-gray-600">{style.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Configuration */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Button Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Name</label>
                <input
                  type="text"
                  value={buttonConfig.name}
                  onChange={(e) => setButtonConfig(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                <input
                  type="text"
                  value={buttonConfig.customText}
                  onChange={(e) => setButtonConfig(prev => ({ ...prev, customText: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Redirect URL</label>
                <input
                  type="text"
                  value={buttonConfig.redirectUrl}
                  onChange={(e) => setButtonConfig(prev => ({ ...prev, redirectUrl: e.target.value }))}
                  placeholder="/cart or /checkout"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Display Options</h4>
                
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={buttonConfig.showPrice}
                    onChange={(e) => setButtonConfig(prev => ({ ...prev, showPrice: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Show product price</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={buttonConfig.showImage}
                    onChange={(e) => setButtonConfig(prev => ({ ...prev, showImage: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Show product image</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={buttonConfig.showVariants}
                    onChange={(e) => setButtonConfig(prev => ({ ...prev, showVariants: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Show product variants</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={buttonConfig.enableWishlist}
                    onChange={(e) => setButtonConfig(prev => ({ ...prev, enableWishlist: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Enable wishlist button</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={buttonConfig.trackingEnabled}
                    onChange={(e) => setButtonConfig(prev => ({ ...prev, trackingEnabled: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Enable conversion tracking</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={buttonConfig.mobileOptimized}
                    onChange={(e) => setButtonConfig(prev => ({ ...prev, mobileOptimized: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Mobile optimized</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-2 rounded ${previewDevice === 'desktop' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <Monitor className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPreviewDevice('tablet')}
                className={`p-2 rounded ${previewDevice === 'tablet' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <Tablet className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-2 rounded ${previewDevice === 'mobile' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <Smartphone className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className={`bg-gray-50 p-8 rounded-lg ${getDevicePreviewClass()}`}>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              {buttonConfig.showImage && (
                <img
                  src={buttonConfig.product?.image}
                  alt={buttonConfig.product?.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-900">{buttonConfig.product?.title}</h3>
                
                {buttonConfig.showPrice && (
                  <p className="text-xl font-bold text-green-600">
                    ${buttonConfig.product?.price} {buttonConfig.product?.currency}
                  </p>
                )}

                {buttonConfig.showVariants && (
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    {buttonConfig.product?.variants.map(variant => (
                      <option key={variant.id} disabled={!variant.available}>
                        {variant.title} - ${variant.price}
                      </option>
                    ))}
                  </select>
                )}

                <div className="flex gap-3">
                  <button
                    className="flex-1 transition-all duration-300"
                    style={{
                      ...selectedStyleObj?.preview,
                      padding: previewDevice === 'mobile' ? '14px 20px' : selectedStyleObj?.preview.padding,
                      fontSize: previewDevice === 'mobile' ? '16px' : selectedStyleObj?.preview.fontSize,
                      width: previewDevice === 'mobile' ? '100%' : 'auto'
                    }}
                  >
                    {buttonConfig.customText}
                  </button>
                  
                  {buttonConfig.enableWishlist && (
                    <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Heart className="h-5 w-5 text-gray-600" />
                    </button>
                  )}
                  
                  {buttonConfig.enableQuickView && (
                    <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Eye className="h-5 w-5 text-gray-600" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={generateButton}
              disabled={isGenerating}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Generate Button
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderButtonsList = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Your Buy Buttons</h3>
        <p className="text-sm text-gray-600">{buyButtons.length} buttons created</p>
      </div>

      <div className="grid gap-6">
        {buyButtons.map(button => (
          <div key={button.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{button.name}</h4>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span>Style: {buttonStyles.find(s => s.id === button.style)?.name}</span>
                  <span>•</span>
                  <span>Created: {new Date(button.createdAt).toLocaleDateString()}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    button.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {button.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => copyButtonCode(button)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  title="Copy Code"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-50 rounded" title="Edit">
                  <Settings className="h-4 w-4" />
                </button>
                <button className="p-2 text-green-600 hover:bg-green-50 rounded" title="Download">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Button Preview */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="max-w-sm mx-auto bg-white border border-gray-200 rounded-lg p-4">
                {button.showImage && (
                  <img
                    src={button.product.image}
                    alt={button.product.title}
                    className="w-full h-32 object-cover rounded mb-3"
                  />
                )}
                <h5 className="font-medium text-gray-900 mb-2">{button.product.title}</h5>
                {button.showPrice && (
                  <p className="text-green-600 font-semibold mb-3">
                    ${button.product.price} {button.product.currency}
                  </p>
                )}
                <button
                  className="w-full py-2 px-4 rounded text-center font-medium"
                  style={buttonStyles.find(s => s.id === button.style)?.preview}
                >
                  {button.customText}
                </button>
              </div>
            </div>

            {/* Configuration Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Price Display:</span>
                <span className="ml-2 font-medium">{button.showPrice ? 'Yes' : 'No'}</span>
              </div>
              <div>
                <span className="text-gray-600">Variants:</span>
                <span className="ml-2 font-medium">{button.showVariants ? 'Yes' : 'No'}</span>
              </div>
              <div>
                <span className="text-gray-600">Wishlist:</span>
                <span className="ml-2 font-medium">{button.enableWishlist ? 'Enabled' : 'Disabled'}</span>
              </div>
              <div>
                <span className="text-gray-600">Mobile:</span>
                <span className="ml-2 font-medium">{button.mobileOptimized ? 'Optimized' : 'Standard'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Button Performance Analytics</h3>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-3xl font-bold text-blue-600">
                {analytics.reduce((sum, a) => sum + a.views, 0).toLocaleString()}
              </p>
            </div>
            <Eye className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clicks</p>
              <p className="text-3xl font-bold text-green-600">
                {analytics.reduce((sum, a) => sum + a.clicks, 0).toLocaleString()}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversions</p>
              <p className="text-3xl font-bold text-purple-600">
                {analytics.reduce((sum, a) => sum + a.conversions, 0).toLocaleString()}
              </p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-3xl font-bold text-orange-600">
                ${analytics.reduce((sum, a) => sum + a.revenue, 0).toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="font-medium text-gray-900">Button Performance Details</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Button</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clicks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CTR</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conv. Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">AOV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analytics.map((data, index) => {
                const button = buyButtons.find(b => b.id === data.id);
                return (
                  <tr key={data.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{button?.name || `Button ${index + 1}`}</div>
                      <div className="text-sm text-gray-500">{button?.style}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{data.views.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{data.clicks.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{data.ctr.toFixed(2)}%</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{data.conversions.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{data.conversionRate.toFixed(2)}%</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${data.revenue.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${data.avgOrderValue.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'generator', label: 'Button Generator', icon: Zap },
    { id: 'buttons', label: 'My Buttons', icon: ShoppingCart },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Buy Button Generator</h2>
          <p className="text-gray-600">Create conversion-optimized buy buttons for your Shopify store</p>
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
      {activeTab === 'generator' && renderGenerator()}
      {activeTab === 'buttons' && renderButtonsList()}
      {activeTab === 'analytics' && renderAnalytics()}
    </div>
  );
};

export default BuyButtonGenerator;