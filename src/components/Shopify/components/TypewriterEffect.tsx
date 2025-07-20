import React, { useState, useEffect } from 'react';
import { Type, Play, Pause, Settings, Eye, Code } from 'lucide-react';
import { useShopifyAuth } from '../../../contexts/ShopifyAuthContext';

const TypewriterEffect: React.FC = () => {
  const { user, subscription } = useShopifyAuth();
  const [activeTab, setActiveTab] = useState('editor');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');

  const [typewriterConfig, setTypewriterConfig] = useState({
    texts: [
      'Welcome to our amazing store!',
      'Discover premium products',
      'Shop with confidence',
      'Join thousands of happy customers'
    ],
    speed: 100,
    pause_duration: 2000,
    delete_speed: 50,
    loop: true,
    show_cursor: true,
    cursor_style: '|',
    font_size: '2xl',
    color: '#3b82f6',
    alignment: 'center'
  });

  const [newText, setNewText] = useState('');

  // Typewriter animation effect
  useEffect(() => {
    if (!isPlaying || typewriterConfig.texts.length === 0) return;

    const currentText = typewriterConfig.texts[currentTextIndex];
    const isTyping = currentCharIndex < currentText.length;
    const isComplete = currentCharIndex === currentText.length;

    if (isTyping) {
      const timer = setTimeout(() => {
        setDisplayText(currentText.slice(0, currentCharIndex + 1));
        setCurrentCharIndex(prev => prev + 1);
      }, typewriterConfig.speed);

      return () => clearTimeout(timer);
    } else if (isComplete) {
      const timer = setTimeout(() => {
        if (typewriterConfig.loop) {
          // Start deleting
          const deleteTimer = setInterval(() => {
            setCurrentCharIndex(prev => {
              if (prev > 0) {
                setDisplayText(currentText.slice(0, prev - 1));
                return prev - 1;
              } else {
                clearInterval(deleteTimer);
                setCurrentTextIndex(prev => (prev + 1) % typewriterConfig.texts.length);
                return 0;
              }
            });
          }, typewriterConfig.delete_speed);
        } else {
          setCurrentTextIndex(prev => {
            if (prev + 1 < typewriterConfig.texts.length) {
              setCurrentCharIndex(0);
              return prev + 1;
            }
            return prev;
          });
        }
      }, typewriterConfig.pause_duration);

      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentTextIndex, currentCharIndex, typewriterConfig]);

  const handleAddText = (e: React.FormEvent) => {
    e.preventDefault();
    if (newText.trim()) {
      setTypewriterConfig(prev => ({
        ...prev,
        texts: [...prev.texts, newText.trim()]
      }));
      setNewText('');
    }
  };

  const handleRemoveText = (index: number) => {
    setTypewriterConfig(prev => ({
      ...prev,
      texts: prev.texts.filter((_, i) => i !== index)
    }));
  };

  const handlePlay = () => {
    setIsPlaying(true);
    setCurrentCharIndex(0);
    setCurrentTextIndex(0);
    setDisplayText('');
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const generateCode = () => {
    return `
<div class="typewriter-container">
  <div class="typewriter-text text-${typewriterConfig.font_size} text-${typewriterConfig.alignment}" 
       style="color: ${typewriterConfig.color}">
    ${displayText}${typewriterConfig.show_cursor ? typewriterConfig.cursor_style : ''}
  </div>
</div>

<script>
const typewriterTexts = ${JSON.stringify(typewriterConfig.texts)};
const typewriterSpeed = ${typewriterConfig.speed};
const pauseDuration = ${typewriterConfig.pause_duration};
const deleteSpeed = ${typewriterConfig.delete_speed};
const loop = ${typewriterConfig.loop};

// Typewriter implementation
let currentTextIndex = 0;
let currentCharIndex = 0;
const textElement = document.querySelector('.typewriter-text');

function typeWriter() {
  const currentText = typewriterTexts[currentTextIndex];
  
  if (currentCharIndex < currentText.length) {
    textElement.textContent = currentText.slice(0, currentCharIndex + 1) + '${typewriterConfig.show_cursor ? typewriterConfig.cursor_style : ''}';
    currentCharIndex++;
    setTimeout(typeWriter, typewriterSpeed);
  } else {
    setTimeout(() => {
      if (loop) {
        deleteText();
      } else {
        currentTextIndex = (currentTextIndex + 1) % typewriterTexts.length;
        currentCharIndex = 0;
        if (currentTextIndex > 0) typeWriter();
      }
    }, pauseDuration);
  }
}

function deleteText() {
  const currentText = typewriterTexts[currentTextIndex];
  
  if (currentCharIndex > 0) {
    textElement.textContent = currentText.slice(0, currentCharIndex - 1) + '${typewriterConfig.show_cursor ? typewriterConfig.cursor_style : ''}';
    currentCharIndex--;
    setTimeout(deleteText, deleteSpeed);
  } else {
    currentTextIndex = (currentTextIndex + 1) % typewriterTexts.length;
    currentCharIndex = 0;
    typeWriter();
  }
}

// Start the typewriter effect
typeWriter();
</script>`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
            <Type className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">TYPEWRITER Effect</h1>
            <p className="text-gray-600">Create engaging typewriter text animations for your store</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'editor', label: 'Editor', icon: Type },
            { id: 'preview', label: 'Live Preview', icon: Eye },
            { id: 'settings', label: 'Settings', icon: Settings },
            { id: 'code', label: 'Get Code', icon: Code }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Editor Tab */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Text Management */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Text Management</h3>
              
              <form onSubmit={handleAddText} className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    placeholder="Add new text line..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Add
                  </button>
                </div>
              </form>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Current Text Lines:</h4>
                {typewriterConfig.texts.map((text, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700 flex-1">{text}</span>
                    <button
                      onClick={() => handleRemoveText(index)}
                      className="ml-2 text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Controls</h3>
              
              <div className="flex gap-3">
                <button
                  onClick={handlePlay}
                  disabled={isPlaying}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="w-4 h-4" />
                  Play
                </button>
                
                <button
                  onClick={handlePause}
                  disabled={!isPlaying}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Pause className="w-4 h-4" />
                  Pause
                </button>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Live Preview</h3>
              
              <div className="min-h-32 flex items-center justify-center bg-gray-50 rounded-lg p-8">
                <div 
                  className={`text-${typewriterConfig.font_size} font-medium text-${typewriterConfig.alignment} transition-all duration-200`}
                  style={{ color: typewriterConfig.color }}
                >
                  {displayText}
                  {typewriterConfig.show_cursor && isPlaying && (
                    <span className="animate-pulse">{typewriterConfig.cursor_style}</span>
                  )}
                  {!isPlaying && !displayText && (
                    <span className="text-gray-400 text-lg">Click Play to start typewriter effect</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Tab */}
      {activeTab === 'preview' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="min-h-64 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
              <div 
                className={`text-${typewriterConfig.font_size} font-medium text-${typewriterConfig.alignment} transition-all duration-200`}
                style={{ color: typewriterConfig.color }}
              >
                {displayText}
                {typewriterConfig.show_cursor && isPlaying && (
                  <span className="animate-pulse">{typewriterConfig.cursor_style}</span>
                )}
                {!isPlaying && !displayText && (
                  <span className="text-gray-400 text-xl">Start the typewriter to see the effect</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Typewriter Settings</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Typing Speed (ms)
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    value={typewriterConfig.speed}
                    onChange={(e) => setTypewriterConfig(prev => ({...prev, speed: parseInt(e.target.value)}))}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">{typewriterConfig.speed}ms</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pause Duration (ms)
                  </label>
                  <input
                    type="range"
                    min="500"
                    max="5000"
                    value={typewriterConfig.pause_duration}
                    onChange={(e) => setTypewriterConfig(prev => ({...prev, pause_duration: parseInt(e.target.value)}))}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">{typewriterConfig.pause_duration}ms</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delete Speed (ms)
                  </label>
                  <input
                    type="range"
                    min="25"
                    max="200"
                    value={typewriterConfig.delete_speed}
                    onChange={(e) => setTypewriterConfig(prev => ({...prev, delete_speed: parseInt(e.target.value)}))}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">{typewriterConfig.delete_speed}ms</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Font Size
                  </label>
                  <select
                    value={typewriterConfig.font_size}
                    onChange={(e) => setTypewriterConfig(prev => ({...prev, font_size: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="sm">Small</option>
                    <option value="base">Base</option>
                    <option value="lg">Large</option>
                    <option value="xl">Extra Large</option>
                    <option value="2xl">2X Large</option>
                    <option value="3xl">3X Large</option>
                    <option value="4xl">4X Large</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Text Color
                  </label>
                  <input
                    type="color"
                    value={typewriterConfig.color}
                    onChange={(e) => setTypewriterConfig(prev => ({...prev, color: e.target.value}))}
                    className="w-full h-10 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Text Alignment
                  </label>
                  <select
                    value={typewriterConfig.alignment}
                    onChange={(e) => setTypewriterConfig(prev => ({...prev, alignment: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={typewriterConfig.loop}
                    onChange={(e) => setTypewriterConfig(prev => ({...prev, loop: e.target.checked}))}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Loop Animation</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={typewriterConfig.show_cursor}
                    onChange={(e) => setTypewriterConfig(prev => ({...prev, show_cursor: e.target.checked}))}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Show Cursor</span>
                </label>

                {typewriterConfig.show_cursor && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cursor Character
                    </label>
                    <input
                      type="text"
                      maxLength={1}
                      value={typewriterConfig.cursor_style}
                      onChange={(e) => setTypewriterConfig(prev => ({...prev, cursor_style: e.target.value}))}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Code Tab */}
      {activeTab === 'code' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Generated Code</h3>
              <button
                onClick={() => navigator.clipboard.writeText(generateCode())}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Copy Code
              </button>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-green-400 text-sm">
                <code>{generateCode()}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TypewriterEffect;