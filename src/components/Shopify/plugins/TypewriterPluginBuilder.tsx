import React, { useState, useEffect } from 'react';
import { Copy, Download, Eye, Settings, Palette, Type, Zap, Sparkles } from 'lucide-react';

interface TypewriterConfig {
  texts: string[];
  primaryColor: string;
  secondaryColor: string;
  fontSize: number;
  fontFamily: string;
  speed: number;
  pauseDuration: number;
  loop: boolean;
  showCursor: boolean;
  cursorChar: string;
  gradientEffect: boolean;
  animation: string;
}

const TypewriterPluginBuilder: React.FC = () => {
  const [config, setConfig] = useState<TypewriterConfig>({
    texts: ['Welcome to Our Store', 'Discover Amazing Products', 'Shop with Confidence'],
    primaryColor: '#3B82F6',
    secondaryColor: '#EC4899',
    fontSize: 48,
    fontFamily: 'Inter',
    speed: 100,
    pauseDuration: 2000,
    loop: true,
    showCursor: true,
    cursorChar: '|',
    gradientEffect: true,
    animation: 'typewriter'
  });
  
  const [previewMode, setPreviewMode] = useState(true);
  const [copied, setCopied] = useState(false);
  
  const generateInstallationCode = (config: TypewriterConfig) => {
    return `<!-- B3ACON Typewriter Effect Plugin -->
<div id="b3acon-typewriter" 
     data-texts='${JSON.stringify(config.texts)}'
     data-primary-color="${config.primaryColor}"
     data-secondary-color="${config.secondaryColor}"
     data-font-size="${config.fontSize}"
     data-font-family="${config.fontFamily}"
     data-speed="${config.speed}"
     data-pause="${config.pauseDuration}"
     data-loop="${config.loop}"
     data-cursor="${config.showCursor}"
     data-gradient="${config.gradientEffect}">
</div>

<script src="https://cdn.b3acon.com/plugins/typewriter.min.js"></script>
<style>
  .b3acon-typewriter {
    font-family: ${config.fontFamily}, sans-serif;
    font-size: ${config.fontSize}px;
    font-weight: bold;
    ${config.gradientEffect 
      ? `background: linear-gradient(45deg, ${config.primaryColor}, ${config.secondaryColor});
         -webkit-background-clip: text;
         -webkit-text-fill-color: transparent;
         background-clip: text;`
      : `color: ${config.primaryColor};`
    }
  }
  
  .b3acon-cursor {
    color: ${config.primaryColor};
    animation: blink 1s infinite;
  }
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
</style>`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateInstallationCode(config));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Plugin Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Type className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Typewriter Effect Plugin</h3>
              <p className="text-sm text-gray-600">Create engaging animated text for your store</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                previewMode ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Eye className="w-4 h-4 mr-2" />
              {previewMode ? 'Edit Mode' : 'Preview Mode'}
            </button>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all">
              <Zap className="w-4 h-4 mr-2" />
              Install Plugin
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
        {/* Configuration Panel */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <Settings className="w-5 h-5 text-gray-600" />
            <h4 className="text-lg font-semibold text-gray-900">Customization Options</h4>
          </div>
          
          {/* Text Configuration */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              <Type className="w-4 h-4 inline mr-2" />
              Typewriter Text (one per line)
            </label>
            <textarea
              value={config.texts.join('\n')}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                texts: e.target.value.split('\n').filter(text => text.trim())
              }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your text lines here..."
            />
          </div>
          
          {/* Color Configuration */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              <Palette className="w-4 h-4 inline mr-2" />
              Colors
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Primary Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.primaryColor}
                    onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Secondary Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={config.secondaryColor}
                    onChange={(e) => setConfig(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.secondaryColor}
                    onChange={(e) => setConfig(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Typography Configuration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Size (px)
              </label>
              <input
                type="range"
                min="16"
                max="72"
                value={config.fontSize}
                onChange={(e) => setConfig(prev => ({ ...prev, fontSize: Number(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="text-center text-sm text-gray-600 mt-1">{config.fontSize}px</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Family
              </label>
              <select
                value={config.fontFamily}
                onChange={(e) => setConfig(prev => ({ ...prev, fontFamily: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Playfair Display">Playfair Display</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
              </select>
            </div>
          </div>
          
          {/* Animation Configuration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Typing Speed (ms)
              </label>
              <input
                type="range"
                min="50"
                max="300"
                value={config.speed}
                onChange={(e) => setConfig(prev => ({ ...prev, speed: Number(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="text-center text-sm text-gray-600 mt-1">{config.speed}ms</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pause Duration (ms)
              </label>
              <input
                type="range"
                min="1000"
                max="5000"
                value={config.pauseDuration}
                onChange={(e) => setConfig(prev => ({ ...prev, pauseDuration: Number(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="text-center text-sm text-gray-600 mt-1">{config.pauseDuration}ms</div>
            </div>
          </div>
          
          {/* Advanced Options */}
          <div className="space-y-3">
            <h5 className="font-medium text-gray-900 flex items-center">
              <Sparkles className="w-4 h-4 mr-2" />
              Advanced Options
            </h5>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.gradientEffect}
                onChange={(e) => setConfig(prev => ({ ...prev, gradientEffect: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Enable Gradient Effect</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.showCursor}
                onChange={(e) => setConfig(prev => ({ ...prev, showCursor: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Show Blinking Cursor</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.loop}
                onChange={(e) => setConfig(prev => ({ ...prev, loop: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Loop Animation</span>
            </label>
          </div>
        </div>
        
        {/* Live Preview */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-900 flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Live Preview
          </h4>
          
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 min-h-[300px] flex items-center justify-center border-2 border-dashed border-gray-300">
            <TypewriterPreview config={config} />
          </div>
          
          {/* Installation Code */}
          <div className="space-y-3">
            <h5 className="font-medium text-gray-900 flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Installation Code
            </h5>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto max-h-64">
              <pre>{generateInstallationCode(config)}</pre>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={copyToClipboard}
                className={`flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-colors ${
                  copied ? 'bg-green-50 text-green-700 border-green-300' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Copy className="w-4 h-4 mr-2" />
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                <Zap className="w-4 h-4 mr-2" />
                Auto-Install
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Typewriter Preview Component
const TypewriterPreview: React.FC<{ config: TypewriterConfig }> = ({ config }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    if (config.texts.length === 0) return;
    
    const currentText = config.texts[currentTextIndex] || '';
    
    const timeout = setTimeout(() => {
      if (isDeleting) {
        setDisplayText(currentText.substring(0, currentIndex - 1));
        setCurrentIndex(currentIndex - 1);
        
        if (currentIndex === 0) {
          setIsDeleting(false);
          setCurrentTextIndex((currentTextIndex + 1) % config.texts.length);
        }
      } else {
        setDisplayText(currentText.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
        
        if (currentIndex === currentText.length) {
          if (config.loop) {
            setTimeout(() => setIsDeleting(true), config.pauseDuration);
          }
        }
      }
    }, isDeleting ? config.speed / 2 : config.speed);
    
    return () => clearTimeout(timeout);
  }, [currentIndex, currentTextIndex, isDeleting, config]);
  
  const textStyle: React.CSSProperties = {
    fontSize: `${config.fontSize}px`,
    fontFamily: config.fontFamily,
    fontWeight: 'bold',
    background: config.gradientEffect 
      ? `linear-gradient(45deg, ${config.primaryColor}, ${config.secondaryColor})`
      : config.primaryColor,
    WebkitBackgroundClip: config.gradientEffect ? 'text' : 'unset',
    WebkitTextFillColor: config.gradientEffect ? 'transparent' : 'unset',
    color: config.gradientEffect ? 'transparent' : config.primaryColor
  };
  
  return (
    <div className="text-center">
      <span style={textStyle}>
        {displayText}
      </span>
      {config.showCursor && (
        <span 
          className="animate-pulse ml-1"
          style={{ color: config.primaryColor, fontSize: `${config.fontSize}px` }}
        >
          {config.cursorChar}
        </span>
      )}
    </div>
  );
};

export default TypewriterPluginBuilder;