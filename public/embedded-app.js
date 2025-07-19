// Shopify App Bridge Configuration for Embedded Apps
(function() {
  // Check if we're in an iframe (embedded app context)
  if (window.top !== window.self) {
    console.log('🔗 Embedded Shopify App Detected');
    
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const shop = urlParams.get('shop');
    const host = urlParams.get('host');
    
    if (shop && host) {
      console.log(`🏪 Shop: ${shop}`);
      console.log(`🌐 Host: ${host}`);
      
      // Load Shopify App Bridge
      if (!window.AppBridge) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@shopify/app-bridge@3';
        script.onload = function() {
          initializeAppBridge(shop, host);
        };
        document.head.appendChild(script);
      } else {
        initializeAppBridge(shop, host);
      }
    }
  }
  
  function initializeAppBridge(shop, host) {
    try {
      // Initialize App Bridge
      const app = window.AppBridge.createApp({
        apiKey: 'your-shopify-api-key', // Replace with your actual API key
        host: host,
        forceRedirect: true
      });
      
      console.log('✅ App Bridge Initialized');
      
      // Set up navigation
      const Navigation = window.AppBridge.actions.Navigation;
      
      // Handle navigation within the embedded app
      Navigation.create(app, {
        link: Navigation.LinkType.External,
        href: window.location.href
      });
      
      // Set up loading states
      const Loading = window.AppBridge.actions.Loading;
      const loading = Loading.create(app);
      
      // Show loading initially
      loading.dispatch(Loading.Action.START);
      
      // Hide loading when page is ready
      document.addEventListener('DOMContentLoaded', function() {
        loading.dispatch(Loading.Action.STOP);
      });
      
    } catch (error) {
      console.error('❌ App Bridge Error:', error);
    }
  }
  
  // Auto-detect and handle Shopify embedded app context
  window.addEventListener('load', function() {
    // Check if this is a Shopify embedded app
    if (window.top !== window.self) {
      document.body.classList.add('shopify-embedded-app');
      
      // Add embedded app styles
      const style = document.createElement('style');
      style.textContent = `
        .shopify-embedded-app {
          margin: 0;
          padding: 20px;
          background: #f6f6f7;
          font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif;
        }
        
        .shopify-embedded-app .glass-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e1e3e5;
        }
        
        .shopify-embedded-app .btn-premium {
          background: #008060;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 12px 16px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .shopify-embedded-app .btn-premium:hover {
          background: #004c3f;
        }
      `;
      document.head.appendChild(style);
    }
  });
})();