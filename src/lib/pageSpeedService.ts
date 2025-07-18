// Real Page Speed Optimization Service
export class PageSpeedService {
  private observer: PerformanceObserver | null = null;
  private vitals: {
    LCP?: number;
    FID?: number;
    CLS?: number;
    FCP?: number;
    TTFB?: number;
  } = {};

  constructor() {
    this.initializePerformanceMonitoring();
  }

  // 1. REAL CORE WEB VITALS MEASUREMENT
  private initializePerformanceMonitoring(): void {
    // Largest Contentful Paint (LCP)
    this.observeMetric('largest-contentful-paint', (entries) => {
      const lcpEntry = entries[entries.length - 1];
      this.vitals.LCP = lcpEntry.startTime;
    });

    // First Input Delay (FID)
    this.observeMetric('first-input', (entries) => {
      const fidEntry = entries[0];
      this.vitals.FID = fidEntry.processingStart - fidEntry.startTime;
    });

    // Cumulative Layout Shift (CLS)
    this.observeMetric('layout-shift', (entries) => {
      let clsValue = 0;
      for (const entry of entries) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      this.vitals.CLS = clsValue;
    });

    // First Contentful Paint (FCP)
    this.observeMetric('paint', (entries) => {
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        this.vitals.FCP = fcpEntry.startTime;
      }
    });

    // Time to First Byte (TTFB)
    this.observeMetric('navigation', (entries) => {
      const navEntry = entries[0] as PerformanceNavigationTiming;
      this.vitals.TTFB = navEntry.responseStart - navEntry.requestStart;
    });
  }

  private observeMetric(type: string, callback: (entries: any[]) => void): void {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      observer.observe({ type, buffered: true });
    } catch (error) {
      console.warn(`Performance observer not supported for ${type}`);
    }
  }

  // 2. REAL CSS/JS MINIFICATION
  minifyCSS(css: string): string {
    return css
      // Remove comments
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Remove whitespace
      .replace(/\s+/g, ' ')
      // Remove spaces around selectors and properties
      .replace(/\s*{\s*/g, '{')
      .replace(/;\s*/g, ';')
      .replace(/\s*}\s*/g, '}')
      .replace(/:\s*/g, ':')
      .replace(/,\s*/g, ',')
      // Remove trailing semicolons
      .replace(/;}/g, '}')
      .trim();
  }

  minifyJS(js: string): string {
    return js
      // Remove single-line comments
      .replace(/\/\/.*$/gm, '')
      // Remove multi-line comments
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Remove extra whitespace
      .replace(/\s+/g, ' ')
      // Remove spaces around operators
      .replace(/\s*([{}();,=+\-*\/])\s*/g, '$1')
      .trim();
  }

  // 3. REAL LAZY LOADING IMPLEMENTATION
  implementLazyLoading(): {
    images: string;
    iframes: string;
    scripts: string;
  } {
    return {
      images: `
// Enhanced Lazy Loading for Images
const createImageObserver = () => {
  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Load high-res image
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          
          // Load srcset if available
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
            img.removeAttribute('data-srcset');
          }
          
          img.classList.remove('lazy');
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.01
    }
  );
  
  return imageObserver;
};

// Apply to all lazy images
const imageObserver = createImageObserver();
document.querySelectorAll('img[data-src]').forEach(img => {
  imageObserver.observe(img);
});`,

      iframes: `
// Lazy Loading for iFrames
const createIframeObserver = () => {
  const iframeObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const iframe = entry.target;
          if (iframe.dataset.src) {
            iframe.src = iframe.dataset.src;
            iframe.removeAttribute('data-src');
            observer.unobserve(iframe);
          }
        }
      });
    },
    { rootMargin: '100px 0px' }
  );
  
  return iframeObserver;
};

const iframeObserver = createIframeObserver();
document.querySelectorAll('iframe[data-src]').forEach(iframe => {
  iframeObserver.observe(iframe);
});`,

      scripts: `
// Lazy Loading for Scripts
const loadScriptLazy = (src, callback) => {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  script.onload = callback;
  document.head.appendChild(script);
};

// Load non-critical scripts after page load
window.addEventListener('load', () => {
  const lazyScripts = document.querySelectorAll('script[data-src]');
  lazyScripts.forEach(script => {
    loadScriptLazy(script.dataset.src, () => {
      script.removeAttribute('data-src');
    });
  });
});`
    };
  }

  // 4. REAL CACHING IMPLEMENTATION
  implementCaching(): {
    serviceWorker: string;
    headers: Record<string, string>;
    localStorage: string;
  } {
    return {
      serviceWorker: `
// Service Worker for Advanced Caching
const CACHE_NAME = 'speed-optimizer-v1';
const STATIC_CACHE = 'static-cache-v1';
const DYNAMIC_CACHE = 'dynamic-cache-v1';

const STATIC_ASSETS = [
  '/',
  '/css/main.css',
  '/js/main.js',
  '/images/logo.png'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event with stale-while-revalidate strategy
self.addEventListener('fetch', event => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  event.respondWith(
    caches.open(DYNAMIC_CACHE)
      .then(cache => {
        return cache.match(request)
          .then(cachedResponse => {
            const fetchPromise = fetch(request)
              .then(networkResponse => {
                // Update cache with fresh response
                cache.put(request, networkResponse.clone());
                return networkResponse;
              });
            
            // Return cached version immediately, fetch in background
            return cachedResponse || fetchPromise;
          });
      })
  );
});`,

      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Expires': new Date(Date.now() + 31536000000).toUTCString(),
        'ETag': '"' + Date.now().toString(36) + '"',
        'Last-Modified': new Date().toUTCString(),
        'Vary': 'Accept-Encoding',
        'X-Content-Type-Options': 'nosniff'
      },

      localStorage: `
// Intelligent localStorage Caching
const CacheManager = {
  set(key, data, expiry = 3600000) { // 1 hour default
    const item = {
      data,
      timestamp: Date.now(),
      expiry
    };
    localStorage.setItem(key, JSON.stringify(item));
  },
  
  get(key) {
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    const { data, timestamp, expiry } = JSON.parse(item);
    
    if (Date.now() - timestamp > expiry) {
      localStorage.removeItem(key);
      return null;
    }
    
    return data;
  },
  
  clear() {
    localStorage.clear();
  },
  
  size() {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length;
      }
    }
    return total;
  }
};`
    };
  }

  // 5. REAL RESOURCE OPTIMIZATION
  optimizeResources(): {
    preload: string[];
    prefetch: string[];
    dns: string[];
    critical: string;
  } {
    return {
      preload: [
        '<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>',
        '<link rel="preload" href="/css/critical.css" as="style">',
        '<link rel="preload" href="/js/main.js" as="script">',
        '<link rel="preload" href="/images/hero.webp" as="image">'
      ],

      prefetch: [
        '<link rel="prefetch" href="/css/secondary.css">',
        '<link rel="prefetch" href="/js/analytics.js">',
        '<link rel="prefetch" href="/images/gallery/">',
        '<link rel="modulepreload" href="/js/modules/lazy.js">'
      ],

      dns: [
        '<link rel="dns-prefetch" href="//fonts.googleapis.com">',
        '<link rel="dns-prefetch" href="//cdn.jsdelivr.net">',
        '<link rel="dns-prefetch" href="//analytics.google.com">',
        '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
      ],

      critical: `
/* Critical CSS - Above the fold styles */
body { font-family: system-ui, -apple-system, sans-serif; margin: 0; }
.header { background: #fff; height: 60px; position: fixed; top: 0; width: 100%; z-index: 1000; }
.hero { height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
.btn { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; }
@media (max-width: 768px) {
  .container { padding: 0 15px; }
  .hero { height: 60vh; }
}`
    };
  }

  // 6. REAL PERFORMANCE MONITORING
  async analyzePagePerformance(): Promise<{
    vitals: typeof this.vitals;
    resources: Array<{
      name: string;
      type: string;
      size: number;
      duration: number;
      optimizable: boolean;
    }>;
    suggestions: Array<{
      type: string;
      impact: 'high' | 'medium' | 'low';
      description: string;
      implementation: string;
    }>;
    score: number;
  }> {
    // Get performance entries
    const resources = performance.getEntriesByType('resource').map((entry: any) => ({
      name: entry.name,
      type: this.getResourceType(entry.name),
      size: entry.transferSize || 0,
      duration: entry.duration,
      optimizable: this.isOptimizable(entry.name)
    }));

    // Generate suggestions
    const suggestions = [];

    // Check for large images
    const largeImages = resources.filter(r => 
      r.type === 'image' && r.size > 100000 // > 100KB
    );
    if (largeImages.length > 0) {
      suggestions.push({
        type: 'image-optimization',
        impact: 'high' as const,
        description: `Found ${largeImages.length} large images that should be optimized`,
        implementation: 'Convert to WebP/AVIF, compress, and implement lazy loading'
      });
    }

    // Check for unminified resources
    const unminifiedCSS = resources.filter(r => 
      r.type === 'stylesheet' && !r.name.includes('.min.')
    );
    if (unminifiedCSS.length > 0) {
      suggestions.push({
        type: 'css-minification',
        impact: 'medium' as const,
        description: `${unminifiedCSS.length} CSS files can be minified`,
        implementation: 'Minify CSS files and enable gzip compression'
      });
    }

    // Check Core Web Vitals
    if (this.vitals.LCP && this.vitals.LCP > 2500) {
      suggestions.push({
        type: 'lcp-optimization',
        impact: 'high' as const,
        description: 'Largest Contentful Paint is slow',
        implementation: 'Optimize largest content element, use preload hints'
      });
    }

    if (this.vitals.CLS && this.vitals.CLS > 0.1) {
      suggestions.push({
        type: 'cls-optimization',
        impact: 'high' as const,
        description: 'Cumulative Layout Shift is high',
        implementation: 'Add width/height to images, reserve space for dynamic content'
      });
    }

    // Calculate performance score
    const score = this.calculatePerformanceScore();

    return {
      vitals: this.vitals,
      resources,
      suggestions,
      score
    };
  }

  // 7. REAL COMPRESSION IMPLEMENTATION
  enableCompression(): {
    gzip: string;
    brotli: string;
    clientSide: string;
  } {
    return {
      gzip: `
// Node.js/Express Gzip Implementation
const compression = require('compression');

app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));`,

      brotli: `
// Brotli Compression (better than gzip)
const express = require('express');
const expressStaticGzip = require('express-static-gzip');

app.use('/', expressStaticGzip('public', {
  enableBrotli: true,
  orderPreference: ['br', 'gz'],
  setHeaders: (res, path) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  }
}));`,

      clientSide: `
// Client-side text compression for localStorage
const TextCompressor = {
  compress(text) {
    // Simple run-length encoding for demo
    return text.replace(/(.)\\1+/g, (match, char) => {
      return char + match.length;
    });
  },
  
  decompress(compressed) {
    return compressed.replace(/(.)([0-9]+)/g, (match, char, count) => {
      return char.repeat(parseInt(count));
    });
  }
};`
    };
  }

  // Helper methods
  private getResourceType(url: string): string {
    if (url.match(/\\.(css)$/i)) return 'stylesheet';
    if (url.match(/\\.(js)$/i)) return 'script';
    if (url.match(/\\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)) return 'image';
    if (url.match(/\\.(woff|woff2|ttf|eot)$/i)) return 'font';
    return 'other';
  }

  private isOptimizable(url: string): boolean {
    return !url.includes('.min.') && !url.includes('cdn');
  }

  private calculatePerformanceScore(): number {
    let score = 100;
    
    if (this.vitals.LCP) {
      if (this.vitals.LCP > 4000) score -= 25;
      else if (this.vitals.LCP > 2500) score -= 15;
    }
    
    if (this.vitals.FID) {
      if (this.vitals.FID > 300) score -= 20;
      else if (this.vitals.FID > 100) score -= 10;
    }
    
    if (this.vitals.CLS) {
      if (this.vitals.CLS > 0.25) score -= 25;
      else if (this.vitals.CLS > 0.1) score -= 15;
    }
    
    return Math.max(0, score);
  }

  // Public method to get current vitals
  getCurrentVitals(): typeof this.vitals {
    return { ...this.vitals };
  }

  // Method to force refresh vitals
  async refreshVitals(): Promise<typeof this.vitals> {
    // Wait a bit for new measurements
    await new Promise(resolve => setTimeout(resolve, 1000));
    return this.getCurrentVitals();
  }
}

export const pageSpeedService = new PageSpeedService();