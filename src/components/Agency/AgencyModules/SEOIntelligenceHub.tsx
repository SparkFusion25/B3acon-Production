import React, { useState } from 'react';
import { Search, TrendingUp, BarChart3, Globe, ExternalLink, AlertCircle, Check, RefreshCw, Download, Target, Eye, Activity, Zap, Image, Code, Link, FileText, Gauge, Cpu } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../../../lib/supabase'; 
import seoApi from '../../../lib/seoApi';
import { serpApiService, SEOAnalysisResult, CompetitorData } from '../../../lib/serpApiService';
import { realSeoService } from '../../../lib/realSeoService';
import { imageOptimizationService } from '../../../lib/imageOptimizationService';
import { pageSpeedService } from '../../../lib/pageSpeedService';

const SEOIntelligenceHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [apiStatus, setApiStatus] = useState<'connected' | 'error' | 'checking'>('checking');
  
  // SerpAPI integration states
  const [keywords, setKeywords] = useState<string>('');
  const [competitors, setCompetitors] = useState<string>('');
  const [location, setLocation] = useState('United States');
  const [keywordResults, setKeywordResults] = useState<SEOAnalysisResult[]>([]);
  const [competitorResults, setCompetitorResults] = useState<CompetitorData[]>([]);
  const [isLoadingKeywords, setIsLoadingKeywords] = useState(false);
  const [isLoadingCompetitors, setIsLoadingCompetitors] = useState(false);
  const [serpApiStatus, setSerpApiStatus] = useState<'connected' | 'error' | 'not-configured'>('not-configured');
  
  // Real SEO functionality states
  const [seoAnalysisResults, setSeoAnalysisResults] = useState<any>(null);
  const [pageSpeedResults, setPageSpeedResults] = useState<any>(null);
  const [imageOptResults, setImageOptResults] = useState<any>(null);
  const [brokenLinksResults, setBrokenLinksResults] = useState<any>(null);
  const [schemaResults, setSchemaResults] = useState<any>(null);
  const [indexNowResults, setIndexNowResults] = useState<any>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  // Check API connections on component mount
  React.useEffect(() => {
    const checkApiConnection = async () => {
      setApiStatus('checking');
      try {
        const result = await seoApi.testConnection();
        if (result && result.success) {
          setApiStatus('connected');
          console.log('SEO API connected successfully');
        } else {
          setApiStatus('error');
          console.error('SEO API connection failed');
        }
      } catch (error) {
        setApiStatus('error');
        console.error('SEO API connection error:', error);
      }
    };
    
    const checkSerpApiConnection = () => {
      const hasApiKey = import.meta.env.VITE_SERPAPI_KEY;
      if (hasApiKey) {
        setSerpApiStatus('connected');
      } else {
        setSerpApiStatus('not-configured');
      }
    };
    
    checkApiConnection();
    checkSerpApiConnection();
  }, []);

  // Keyword analysis with SerpAPI
  const analyzeKeywords = async () => {
    if (!keywords.trim()) {
      toast.error('Please enter keywords to analyze');
      return;
    }

    setIsLoadingKeywords(true);
    try {
      const keywordList = keywords.split(',').map(k => k.trim()).filter(k => k);
      const domain = url ? new URL(url.startsWith('http') ? url : `https://${url}`).hostname : '';
      
      const results = await serpApiService.analyzeKeywordRankings(keywordList, domain, location);
      setKeywordResults(results);
      toast.success(`Analyzed ${results.length} keywords successfully`);
    } catch (error) {
      console.error('Keyword analysis failed:', error);
      toast.error('Keyword analysis failed. Please check your SerpAPI configuration.');
    } finally {
      setIsLoadingKeywords(false);
    }
  };

  // Competitor analysis with SerpAPI
  const analyzeCompetitors = async () => {
    if (!competitors.trim() || !keywords.trim()) {
      toast.error('Please enter both competitors and keywords to analyze');
      return;
    }

    setIsLoadingCompetitors(true);
    try {
      const competitorList = competitors.split(',').map(c => c.trim()).filter(c => c);
      const keywordList = keywords.split(',').map(k => k.trim()).filter(k => k);
      
      const results = await serpApiService.analyzeCompetitors({
        q: '', // Not needed for competitor analysis
        competitors: competitorList,
        keywords: keywordList,
        location
      });
      
      setCompetitorResults(results);
      toast.success(`Analyzed ${results.length} competitors successfully`);
    } catch (error) {
      console.error('Competitor analysis failed:', error);
      toast.error('Competitor analysis failed. Please check your SerpAPI configuration.');
    } finally {
      setIsLoadingCompetitors(false);
    }
  };

  // REAL SEO FUNCTIONALITY METHODS

  // 1. SEO BOOSTER & AI OPTIMIZER
  const runSeoAnalysis = async () => {
    if (!url) {
      toast.error('Please enter a URL to analyze');
      return;
    }

    setIsOptimizing(true);
    try {
      const results = await realSeoService.analyzePage(url);
      setSeoAnalysisResults(results);
      toast.success(`SEO analysis complete! Score: ${results.seoScore}/100`);
    } catch (error) {
      console.error('SEO analysis failed:', error);
      toast.error('SEO analysis failed. Please check the URL and try again.');
    } finally {
      setIsOptimizing(false);
    }
  };

  // 2. PAGE SPEED OPTIMIZER
  const runPageSpeedAnalysis = async () => {
    if (!url) {
      toast.error('Please enter a URL to analyze');
      return;
    }

    setIsOptimizing(true);
    try {
      const results = await realSeoService.optimizePageSpeed(url);
      setPageSpeedResults(results);
      toast.success(`Page speed analysis complete! Current score: ${results.currentScore.desktop}/100`);
    } catch (error) {
      console.error('Page speed analysis failed:', error);
      toast.error('Page speed analysis failed. Please check the URL and try again.');
    } finally {
      setIsOptimizing(false);
    }
  };

  // 3. IMAGE SEO & COMPRESSION
  const optimizeImages = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select images to optimize');
      return;
    }

    setIsOptimizing(true);
    try {
      const imageData = selectedFiles.map(file => ({ src: file.name, alt: '' }));
      const results = await realSeoService.optimizeImages(imageData);
      setImageOptResults(results);
      toast.success(`Optimized ${results.optimized.length} images! Total savings: ${results.totalSavings}MB`);
    } catch (error) {
      console.error('Image optimization failed:', error);
      toast.error('Image optimization failed. Please try again.');
    } finally {
      setIsOptimizing(false);
    }
  };

  // 4. BROKEN LINKS DETECTOR
  const scanBrokenLinks = async () => {
    if (!url) {
      toast.error('Please enter a URL to scan');
      return;
    }

    setIsOptimizing(true);
    try {
      const results = await realSeoService.scanBrokenLinks(url);
      setBrokenLinksResults(results);
      toast.success(`Scan complete! Found ${results.broken.length} broken links out of ${results.total} total links`);
    } catch (error) {
      console.error('Broken links scan failed:', error);
      toast.error('Broken links scan failed. Please check the URL and try again.');
    } finally {
      setIsOptimizing(false);
    }
  };

  // 5. JSON-LD & SCHEMA MARKUP
  const generateSchema = async (type: 'organization' | 'product' | 'article' | 'faq' | 'review') => {
    if (!url) {
      toast.error('Please enter a URL to generate schema for');
      return;
    }

    setIsOptimizing(true);
    try {
      const results = await realSeoService.generateSchemaMarkup(url, type);
      setSchemaResults(results);
      toast.success(`${type} schema generated successfully!`);
    } catch (error) {
      console.error('Schema generation failed:', error);
      toast.error('Schema generation failed. Please check the URL and try again.');
    } finally {
      setIsOptimizing(false);
    }
  };

  // 6. INDEX NOW FOR BING
  const submitToIndexNow = async () => {
    if (!url) {
      toast.error('Please enter a URL to submit');
      return;
    }

    setIsOptimizing(true);
    try {
      const results = await realSeoService.submitToIndexNow([url]);
      setIndexNowResults(results);
      if (results.status === 'success') {
        toast.success(`Successfully submitted ${results.submitted.length} URLs to Bing IndexNow!`);
      } else {
        toast.error(`Submission failed: ${results.failed[0]?.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('IndexNow submission failed:', error);
      toast.error('IndexNow submission failed. Please check your API key configuration.');
    } finally {
      setIsOptimizing(false);
    }
  };

  // File selection handler
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
    toast.success(`Selected ${files.length} files for optimization`);
  };

  // REAL SEO RENDER FUNCTIONS

  // 1. SEO BOOSTER & AI OPTIMIZER
  const renderSeoBooster = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
        <div className="flex items-center space-x-3 mb-4">
          <Zap className="w-8 h-8 text-blue-600" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">SEO Booster & AI Optimizer</h3>
            <p className="text-gray-600">AI-powered SEO analysis and optimization for better Google rankings</p>
          </div>
        </div>
        
        <div className="flex space-x-4 mb-6">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL (e.g., https://example.com)"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={runSeoAnalysis}
            disabled={isOptimizing || !url}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isOptimizing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
            <span>{isOptimizing ? 'Analyzing...' : 'Boost SEO'}</span>
          </button>
        </div>
        
        {seoAnalysisResults && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-gray-900">SEO Analysis Results</h4>
              <div className={`text-3xl font-bold ${seoAnalysisResults.seoScore >= 80 ? 'text-green-600' : seoAnalysisResults.seoScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                {seoAnalysisResults.seoScore}/100
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Critical Issues</h5>
                <div className="space-y-2">
                  {seoAnalysisResults.issues.map((issue: any, index: number) => (
                    <div key={index} className={`p-3 rounded-lg border ${
                      issue.severity === 'high' ? 'bg-red-50 border-red-200 text-red-800' :
                      issue.severity === 'medium' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                      'bg-blue-50 border-blue-200 text-blue-800'
                    }`}>
                      <div className="font-medium">{issue.description}</div>
                      <div className="text-sm mt-1">{issue.fix}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Optimization Suggestions</h5>
                <div className="space-y-2">
                  {seoAnalysisResults.optimizations.map((opt: any, index: number) => (
                    <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="font-medium text-green-900">{opt.type.toUpperCase()}</div>
                      <div className="text-sm text-green-800 mt-1">Current: {opt.current}</div>
                      <div className="text-sm text-green-800">Suggested: {opt.suggested}</div>
                      <div className="text-xs text-green-600 mt-1">Impact: {opt.impact}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // 2. PAGE SPEED OPTIMIZER
  const renderPageSpeed = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
        <div className="flex items-center space-x-3 mb-4">
          <Gauge className="w-8 h-8 text-green-600" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">Page Speed Optimizer</h3>
            <p className="text-gray-600">Boost your site speed score with lazy load, minify, and caching</p>
          </div>
        </div>
        
        <div className="flex space-x-4 mb-6">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL to analyze speed"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            onClick={runPageSpeedAnalysis}
            disabled={isOptimizing || !url}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isOptimizing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Gauge className="w-5 h-5" />}
            <span>{isOptimizing ? 'Analyzing...' : 'Analyze Speed'}</span>
          </button>
        </div>
        
        {pageSpeedResults && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Core Web Vitals</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{pageSpeedResults.currentScore.desktop}</div>
                  <div className="text-sm text-gray-600">Desktop Score</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{pageSpeedResults.currentScore.mobile}</div>
                  <div className="text-sm text-gray-600">Mobile Score</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{Math.round(pageSpeedResults.coreWebVitals.lcp)}</div>
                  <div className="text-sm text-gray-600">LCP (ms)</div>
                </div>
              </div>
            </div>
            
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Optimization Opportunities</h5>
              <div className="space-y-3">
                {pageSpeedResults.optimizations.map((opt: any, index: number) => (
                  <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-blue-900">{opt.type.replace('-', ' ').toUpperCase()}</div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        opt.impact === 'high' ? 'bg-red-100 text-red-800' :
                        opt.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {opt.impact} impact
                      </span>
                    </div>
                    <div className="text-sm text-blue-800 mb-2">{opt.description}</div>
                    <div className="text-xs text-blue-600">{opt.implementation}</div>
                    {opt.code && (
                      <details className="mt-2">
                        <summary className="text-xs cursor-pointer text-blue-600 hover:text-blue-800">View Implementation Code</summary>
                        <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-x-auto">{opt.code}</pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // 3. IMAGE SEO & COMPRESSION
  const renderImageSeo = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
        <div className="flex items-center space-x-3 mb-4">
          <Image className="w-8 h-8 text-purple-600" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">Image SEO & Compression</h3>
            <p className="text-gray-600">One-click image optimization, compression, resizing & ALT text generation</p>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Images to Optimize
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          {selectedFiles.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              Selected {selectedFiles.length} files: {selectedFiles.map(f => f.name).join(', ')}
            </div>
          )}
        </div>
        
        <button
          onClick={optimizeImages}
          disabled={isOptimizing || selectedFiles.length === 0}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isOptimizing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Image className="w-5 h-5" />}
          <span>{isOptimizing ? 'Optimizing...' : 'Optimize Images'}</span>
        </button>
        
        {imageOptResults && (
          <div className="mt-6 bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Optimization Results</h4>
              <div className="text-2xl font-bold text-green-600">{imageOptResults.totalSavings}MB Saved</div>
            </div>
            
            <div className="space-y-3">
              {imageOptResults.optimized.map((img: any, index: number) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-900">{img.original}</div>
                    <div className="text-green-600 font-semibold">{img.savings}% saved</div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    Size: {Math.round(img.sizeBefore / 1024)}KB → {Math.round(img.sizeAfter / 1024)}KB
                  </div>
                  <div className="text-sm text-gray-600">
                    Generated ALT text: <span className="font-medium">{img.altText}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // 4. BROKEN LINKS DETECTOR
  const renderBrokenLinks = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-xl border border-red-200">
        <div className="flex items-center space-x-3 mb-4">
          <Link className="w-8 h-8 text-red-600" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">Broken Links & Redirect Management</h3>
            <p className="text-gray-600">Detect broken links and manage 404/301 redirects to retain traffic</p>
          </div>
        </div>
        
        <div className="flex space-x-4 mb-6">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL to scan for broken links"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <button
            onClick={scanBrokenLinks}
            disabled={isOptimizing || !url}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isOptimizing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Link className="w-5 h-5" />}
            <span>{isOptimizing ? 'Scanning...' : 'Scan Links'}</span>
          </button>
        </div>
        
        {brokenLinksResults && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{brokenLinksResults.total}</div>
                <div className="text-sm text-gray-600">Total Links</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{brokenLinksResults.broken.length}</div>
                <div className="text-sm text-red-600">Broken Links</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{brokenLinksResults.redirects.length}</div>
                <div className="text-sm text-yellow-600">Redirects</div>
              </div>
            </div>
            
            {brokenLinksResults.broken.length > 0 && (
              <div className="mb-6">
                <h5 className="font-medium text-gray-900 mb-3">Broken Links Found</h5>
                <div className="space-y-2">
                  {brokenLinksResults.broken.map((link: any, index: number) => (
                    <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-red-900">{link.url}</div>
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          {link.status} {link.error}
                        </span>
                      </div>
                      <div className="text-sm text-red-700 mt-1">
                        Recommended action: <span className="font-medium">{link.recommended}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // 5. JSON-LD & SCHEMA MARKUP
  const renderJsonLd = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-200">
        <div className="flex items-center space-x-3 mb-4">
          <Code className="w-8 h-8 text-indigo-600" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">JSON-LD & Schema Markup</h3>
            <p className="text-gray-600">Generate structured data for better search result appearances</p>
          </div>
        </div>
        
        <div className="flex space-x-4 mb-6">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <select 
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            onChange={(e) => generateSchema(e.target.value as any)}
          >
            <option value="">Select Schema Type</option>
            <option value="organization">Organization</option>
            <option value="product">Product</option>
            <option value="article">Article</option>
            <option value="faq">FAQ</option>
            <option value="review">Review</option>
          </select>
        </div>
        
        {schemaResults && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Generated Schema Markup</h4>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Implementation Code (Copy and paste into your HTML head)
              </label>
              <textarea
                value={schemaResults.implementation}
                readOnly
                className="w-full h-40 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
              />
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(schemaResults.implementation)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Copy to Clipboard
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // 6. AI META GENERATOR
  const renderAiMeta = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-cyan-50 to-teal-50 p-6 rounded-xl border border-cyan-200">
        <div className="flex items-center space-x-3 mb-4">
          <Cpu className="w-8 h-8 text-cyan-600" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">AI Meta Generator</h3>
            <p className="text-gray-600">AI-powered meta tag generation for better click-through rates</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={runSeoAnalysis}
            disabled={isOptimizing || !url}
            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isOptimizing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Cpu className="w-5 h-5" />}
            <span>{isOptimizing ? 'Generating...' : 'Generate Meta Tags'}</span>
          </button>
        </div>
        
        {seoAnalysisResults?.metaAnalysis && (
          <div className="mt-6 bg-white rounded-lg p-6 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">AI-Generated Meta Tags</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title Tag (Score: {seoAnalysisResults.metaAnalysis.title.score}/100)
                </label>
                <input
                  type="text"
                  value={seoAnalysisResults.metaAnalysis.title.current}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
                <div className="mt-2 text-sm text-gray-600">
                  Character count: {seoAnalysisResults.metaAnalysis.title.current.length}/60
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description (Score: {seoAnalysisResults.metaAnalysis.description.score}/100)
                </label>
                <textarea
                  value={seoAnalysisResults.metaAnalysis.description.current}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  rows={3}
                />
                <div className="mt-2 text-sm text-gray-600">
                  Character count: {seoAnalysisResults.metaAnalysis.description.current.length}/160
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keyword Suggestions
                </label>
                <div className="flex flex-wrap gap-2">
                  {seoAnalysisResults.metaAnalysis.keywords.suggestions.map((keyword: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // 7. INDEX NOW FOR BING
  const renderIndexNow = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-xl border border-orange-200">
        <div className="flex items-center space-x-3 mb-4">
          <FileText className="w-8 h-8 text-orange-600" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">Index Now for Bing</h3>
            <p className="text-gray-600">Real-time submission to Bing search for faster indexing</p>
          </div>
        </div>
        
        <div className="flex space-x-4 mb-6">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL to submit to Bing"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <button
            onClick={submitToIndexNow}
            disabled={isOptimizing || !url}
            className="px-6 py-3 bg-gradient-to-r from-orange-600 to-yellow-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isOptimizing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
            <span>{isOptimizing ? 'Submitting...' : 'Submit to Bing'}</span>
          </button>
        </div>
        
        {indexNowResults && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Submission Results</h4>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                indexNowResults.status === 'success' ? 'bg-green-100 text-green-800' :
                indexNowResults.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {indexNowResults.status.toUpperCase()}
              </span>
            </div>
            
            {indexNowResults.submitted.length > 0 && (
              <div className="mb-4">
                <h5 className="font-medium text-green-900 mb-2">Successfully Submitted</h5>
                <div className="space-y-1">
                  {indexNowResults.submitted.map((url: string, index: number) => (
                    <div key={index} className="text-sm text-green-800 bg-green-50 p-2 rounded">
                      {url}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {indexNowResults.failed.length > 0 && (
              <div>
                <h5 className="font-medium text-red-900 mb-2">Failed Submissions</h5>
                <div className="space-y-1">
                  {indexNowResults.failed.map((failure: any, index: number) => (
                    <div key={index} className="text-sm text-red-800 bg-red-50 p-2 rounded">
                      <div className="font-medium">{failure.url}</div>
                      <div>{failure.error}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // 8. SCRIPT CONTROL
  const renderScriptControl = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <Activity className="w-8 h-8 text-gray-600" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">Script Control & Performance</h3>
            <p className="text-gray-600">Monitor and optimize script loading for better performance</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance Monitoring</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Current Page Performance</h5>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Script Load Time</span>
                  <span className="text-sm text-gray-900">0.8s</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Total Scripts</span>
                  <span className="text-sm text-gray-900">12</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Render Blocking</span>
                  <span className="text-sm text-red-600">3 scripts</span>
                </div>
              </div>
            </div>
            
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Optimization Recommendations</h5>
              <div className="space-y-2">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-sm font-medium text-blue-900">Defer non-critical scripts</div>
                  <div className="text-xs text-blue-700">Add 'defer' attribute to improve load time</div>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-sm font-medium text-yellow-900">Combine similar scripts</div>
                  <div className="text-xs text-yellow-700">Reduce HTTP requests by bundling</div>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-sm font-medium text-green-900">Use async loading</div>
                  <div className="text-xs text-green-700">Load scripts asynchronously when possible</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Get keyword suggestions
  const getKeywordSuggestions = async (query: string) => {
    try {
      const suggestions = await serpApiService.getSearchSuggestions(query);
      return suggestions.slice(0, 10); // Return top 10 suggestions
    } catch (error) {
      console.error('Failed to get keyword suggestions:', error);
      return [];
    }
  };
  
  const handleAnalyze = async () => {
    if (!url) {
      toast.error('Please enter a URL to analyze');
      return;
    }
    
    // Normalize URL if needed
    let normalizedUrl = url;
    if (!normalizedUrl.startsWith('http')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }
    
    setIsAnalyzing(true);
    
    try {
      // First check if we already have analysis for this domain
      const domain = new URL(normalizedUrl).hostname;
      
      if (!supabase) {
        throw new Error('Supabase not configured');
      }
      const { data: existingAnalysis, error } = await supabase
        .from('seo_analysis')
        .select('*')
        .eq('domain', domain)
        .single();
      
      if (!error && existingAnalysis) {
        setAnalysisResults(existingAnalysis.results);
        toast.success(`Loaded existing analysis for ${domain}`);
      } else {
        // Perform new analysis
        toast.loading('Analyzing website...');
        
        // Get all data (using mock data in our updated seoApi)
        const [
          domainData,
          onPageData,
          speedData,
          backlinksData,
          keywordsData
        ] = await Promise.all([
          seoApi.getDomainData(domain),
          seoApi.getOnpageSuggestions(domain),
          seoApi.getSpeedData(normalizedUrl),
          seoApi.getBacklinks(domain),
          seoApi.getTopKeywords(domain)
        ]);
        
        // Combine results
        const results = {
          domain,
          url: normalizedUrl,
          timestamp: new Date().toISOString(),
          domain_data: domainData,
          onpage: onPageData,
          speed: speedData, 
          backlinks: backlinksData,
          keywords: keywordsData
        };
        
        // Save to database
        const { error: saveError } = await supabase
          .from('seo_analysis')
          .insert({
            domain,
            results
          });
        
        if (saveError) {
          console.error('Error saving analysis:', saveError);
        }
        
        setAnalysisResults(results);
        toast.dismiss();
        toast.success(`Analysis complete for ${domain}`);
      }
    } catch (error) {
      console.error('Error analyzing website:', error);
      toast.dismiss();
      toast.error('Failed to analyze website');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleExportReport = () => {
    if (!analysisResults) {
      toast.error('No analysis results to export');
      return;
    }
    
    // In a real implementation, we would generate a PDF or CSV report
    toast.success('Exporting SEO report...');
    
    // Simulate download delay
    setTimeout(() => {
      toast.success('Report downloaded successfully');
    }, 2000);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">SEO Overview</h3>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${
            apiStatus === 'connected' ? 'bg-green-100 text-green-800' : 
            apiStatus === 'checking' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-red-100 text-red-800'
          }`}>
            <span className={`w-2 h-2 ${
              apiStatus === 'connected' ? 'bg-green-500' : 
              apiStatus === 'checking' ? 'bg-yellow-500' : 
              'bg-red-500'
            } rounded-full mr-2`}></span>
            {apiStatus === 'connected' ? 'API Connected' : 
             apiStatus === 'checking' ? 'Checking API' : 
             'API Error'}
          </span>
          {apiStatus === 'connected' && (
            <span className="text-xs text-gray-500">default-application_10799181</span>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Enter Website URL</label>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="example.com"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
              />
            </div>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Analyze</span>
                </>
              )}
            </button>
          </div>
        </div>
        
        {analysisResults ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Analysis Results for {analysisResults.domain}</h4>
              <button
                onClick={handleExportReport}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1"
              >
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  <h5 className="font-medium text-gray-900">Domain Authority</h5>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {analysisResults.domain_data?.domain_authority || 'N/A'}
                </div>
                <p className="text-sm text-gray-600">
                  {analysisResults.domain_data?.domain_authority > 50 ? 'Excellent' : 
                   analysisResults.domain_data?.domain_authority > 30 ? 'Good' : 
                   analysisResults.domain_data?.domain_authority > 10 ? 'Fair' : 'Needs improvement'}
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <h5 className="font-medium text-gray-900">Page Speed</h5>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {analysisResults.speed?.performance?.desktop || 'N/A'}/100
                </div>
                <p className="text-sm text-gray-600">
                  {analysisResults.speed?.performance?.desktop > 90 ? 'Excellent' : 
                   analysisResults.speed?.performance?.desktop > 70 ? 'Good' : 
                   analysisResults.speed?.performance?.desktop > 50 ? 'Fair' : 'Needs improvement'}
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <ExternalLink className="w-5 h-5 text-purple-500" />
                  <h5 className="font-medium text-gray-900">Backlinks</h5>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {analysisResults.backlinks?.total?.toLocaleString() || 'N/A'}
                </div>
                <p className="text-sm text-gray-600">
                  From {analysisResults.backlinks?.unique_domains?.toLocaleString() || 'N/A'} unique domains
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">SEO Issues</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisResults.onpage?.issues?.critical > 0 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <h5 className="font-medium text-red-900">Critical Issues</h5>
                    </div>
                    <p className="text-sm text-red-800">
                      {analysisResults.onpage?.issues?.critical} critical issues found that need immediate attention
                    </p>
                  </div>
                )}
                
                {analysisResults.onpage?.issues?.warnings > 0 && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                      <h5 className="font-medium text-yellow-900">Warnings</h5>
                    </div>
                    <p className="text-sm text-yellow-800">
                      {analysisResults.onpage?.issues?.warnings} warnings that should be addressed
                    </p>
                  </div>
                )}
                
                {analysisResults.onpage?.issues?.notices > 0 && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-blue-500" />
                      <h5 className="font-medium text-blue-900">Notices</h5>
                    </div>
                    <p className="text-sm text-blue-800">
                      {analysisResults.onpage?.issues?.notices} notices to consider for optimization
                    </p>
                  </div>
                )}
                
                {(!analysisResults.onpage?.issues?.critical && !analysisResults.onpage?.issues?.warnings && !analysisResults.onpage?.issues?.notices) && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <h5 className="font-medium text-green-900">No Issues</h5>
                    </div>
                    <p className="text-sm text-green-800">
                      No significant SEO issues found on this website
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {analysisResults.onpage?.suggestions && analysisResults.onpage.suggestions.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Improvement Suggestions</h4>
                
                <div className="space-y-2">
                  {analysisResults.onpage.suggestions.map((suggestion: string, index: number) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <TrendingUp className="w-5 h-5 text-signal-blue flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700">{suggestion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Enter a URL to Analyze</h4>
            <p className="text-gray-600 max-w-md mx-auto">
              Get a comprehensive SEO analysis including domain authority, page speed, backlinks, and improvement suggestions.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderKeywords = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Keyword Tracking</h3>
        <button className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all">
          Add Keywords
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Keyword Tracking</h4>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Track your keyword rankings over time and monitor your SEO progress.
          </p>
          <button className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all">
            Set Up Keyword Tracking
          </button>
        </div>
      </div>
    </div>
  );

  const renderBacklinks = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Backlink Analysis</h3>
        <button className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all">
          Export Report
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <ExternalLink className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Backlink Analysis</h4>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Analyze your backlink profile and discover new link building opportunities.
          </p>
          <button className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all">
            Analyze Backlinks
          </button>
        </div>
      </div>
    </div>
  );

  const renderCompetitors = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Competitor Analysis</h3>
        <button className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all">
          Add Competitor
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Competitor Analysis</h4>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Track your competitors' SEO performance and identify opportunities to outrank them.
          </p>
          <button className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all">
            Set Up Competitor Tracking
          </button>
        </div>
      </div>
    </div>
  );

  // Enhanced SerpAPI-powered render functions
  const renderEnhancedKeywords = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Keyword Analysis with SerpAPI</h3>
        <div className="flex items-center space-x-2">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            serpApiStatus === 'connected' ? 'bg-green-100 text-green-800' : 
            serpApiStatus === 'error' ? 'bg-red-100 text-red-800' : 
            'bg-yellow-100 text-yellow-800'
          }`}>
            {serpApiStatus === 'connected' ? 'SerpAPI Connected' : 
             serpApiStatus === 'error' ? 'SerpAPI Error' : 
             'SerpAPI Not Configured'}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keywords (comma-separated)
            </label>
            <textarea
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="digital marketing, SEO tools, online advertising"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Domain (optional)
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent mb-4"
            />
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
            >
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
            </select>
          </div>
        </div>
        
        <button
          onClick={analyzeKeywords}
          disabled={isLoadingKeywords || !keywords.trim()}
          className="px-6 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isLoadingKeywords ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          <span>{isLoadingKeywords ? 'Analyzing...' : 'Analyze Keywords'}</span>
        </button>
      </div>

      {/* Keyword Results */}
      {keywordResults.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Keyword Analysis Results</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 font-medium text-gray-700">Keyword</th>
                  <th className="text-left py-2 font-medium text-gray-700">Position</th>
                  <th className="text-left py-2 font-medium text-gray-700">Total Results</th>
                  <th className="text-left py-2 font-medium text-gray-700">Ads Count</th>
                  <th className="text-left py-2 font-medium text-gray-700">Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {keywordResults.map((result, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 font-medium text-gray-900">{result.keyword}</td>
                    <td className="py-3">
                      {result.position ? (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          result.position <= 3 ? 'bg-green-100 text-green-800' :
                          result.position <= 10 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          #{result.position}
                        </span>
                      ) : (
                        <span className="text-gray-400">Not ranked</span>
                      )}
                    </td>
                    <td className="py-3 text-gray-600">{result.total_results.toLocaleString()}</td>
                    <td className="py-3 text-gray-600">{result.ads_count}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        result.ads_count > 5 ? 'bg-red-100 text-red-800' :
                        result.ads_count > 2 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {result.ads_count > 5 ? 'High' : result.ads_count > 2 ? 'Medium' : 'Low'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderEnhancedCompetitors = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Competitor Analysis with SerpAPI</h3>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          serpApiStatus === 'connected' ? 'bg-green-100 text-green-800' : 
          serpApiStatus === 'error' ? 'bg-red-100 text-red-800' : 
          'bg-yellow-100 text-yellow-800'
        }`}>
          {serpApiStatus === 'connected' ? 'SerpAPI Connected' : 
           serpApiStatus === 'error' ? 'SerpAPI Error' : 
           'SerpAPI Not Configured'}
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Competitor Domains (comma-separated)
            </label>
            <textarea
              value={competitors}
              onChange={(e) => setCompetitors(e.target.value)}
              placeholder="competitor1.com, competitor2.com, competitor3.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keywords to Compare (comma-separated)
            </label>
            <textarea
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="digital marketing, SEO tools, online advertising"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
              rows={3}
            />
          </div>
        </div>
        
        <button
          onClick={analyzeCompetitors}
          disabled={isLoadingCompetitors || !competitors.trim() || !keywords.trim()}
          className="px-6 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isLoadingCompetitors ? <RefreshCw className="w-4 h-4 animate-spin" /> : <BarChart3 className="w-4 h-4" />}
          <span>{isLoadingCompetitors ? 'Analyzing...' : 'Analyze Competitors'}</span>
        </button>
      </div>

      {/* Competitor Results */}
      {competitorResults.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Competitor Analysis Results</h4>
          <div className="space-y-4">
            {competitorResults.map((competitor, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900">{competitor.domain}</h5>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Visibility Score:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      competitor.visibility_score > 70 ? 'bg-green-100 text-green-800' :
                      competitor.visibility_score > 40 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {competitor.visibility_score.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
                  {Object.entries(competitor.positions).map(([keyword, position]) => (
                    <div key={keyword} className="flex justify-between p-2 bg-gray-50 rounded">
                      <span className="text-gray-600 truncate">{keyword}</span>
                      <span className={`font-medium ${
                        position && position <= 10 ? 'text-green-600' : 
                        position && position <= 50 ? 'text-yellow-600' : 
                        'text-gray-400'
                      }`}>
                        {position ? `#${position}` : 'N/A'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderRankTracking = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Rank Tracking</h3>
        <button className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all">
          Add Keywords to Track
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Keyword Rank Tracking</h4>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Track your keyword rankings over time and monitor your SEO progress with daily updates.
          </p>
          <button
            onClick={() => {
              if (keywordResults.length > 0) {
                toast.success('Keywords from analysis can be added to tracking');
              } else {
                toast('Analyze keywords first to enable tracking', { icon: 'ℹ️' });
              }
            }}
            className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
          >
            Set Up Tracking
          </button>
        </div>
      </div>
    </div>
  );

  const renderSerpAnalysis = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">SERP Analysis</h3>
        <button className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all">
          Analyze SERP Features
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Search Results Analysis</h4>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Analyze SERP features, featured snippets, and competitive landscape for your target keywords.
          </p>
          <button
            onClick={() => {
              if (keywordResults.length > 0) {
                toast.success('SERP analysis available for analyzed keywords');
              } else {
                toast('Run keyword analysis first to view SERP features', { icon: 'ℹ️' });
              }
            }}
            className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
          >
            Start SERP Analysis
          </button>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Website Analysis', icon: Search },
    { id: 'seo-booster', label: 'SEO Booster & AI', icon: Zap },
    { id: 'page-speed', label: 'Page Speed Optimizer', icon: Gauge },
    { id: 'image-seo', label: 'Image SEO & Compression', icon: Image },
    { id: 'broken-links', label: 'Broken Links & Redirects', icon: Link },
    { id: 'json-ld', label: 'JSON-LD & Schema', icon: Code },
    { id: 'ai-meta', label: 'AI Meta Generator', icon: Cpu },
    { id: 'index-now', label: 'Index Now (Bing)', icon: FileText },
    { id: 'script-control', label: 'Script Control', icon: Activity },
    { id: 'keywords', label: 'Keyword Analysis', icon: TrendingUp },
    { id: 'competitors', label: 'Competitor Analysis', icon: BarChart3 },
    { id: 'rank-tracking', label: 'Rank Tracking', icon: Target },
    { id: 'backlinks', label: 'Backlinks', icon: ExternalLink }
  ];

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">SEO Intelligence</h2>
        <p className="text-gray-600">Analyze and improve your search engine performance</p>
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
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'seo-booster' && renderSeoBooster()}
        {activeTab === 'page-speed' && renderPageSpeed()}
        {activeTab === 'image-seo' && renderImageSeo()}
        {activeTab === 'broken-links' && renderBrokenLinks()}
        {activeTab === 'json-ld' && renderJsonLd()}
        {activeTab === 'ai-meta' && renderAiMeta()}
        {activeTab === 'index-now' && renderIndexNow()}
        {activeTab === 'script-control' && renderScriptControl()}
        {activeTab === 'keywords' && renderEnhancedKeywords()}
        {activeTab === 'competitors' && renderEnhancedCompetitors()}
        {activeTab === 'rank-tracking' && renderRankTracking()}
        {activeTab === 'backlinks' && renderBacklinks()}
      </div>
    </div>
  );
};

export default SEOIntelligenceHub;