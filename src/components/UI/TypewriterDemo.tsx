import React from 'react';
import Typewriter from './Typewriter';

const TypewriterDemo: React.FC = () => {
  const demoWords = [
    'Beautiful Animations',
    'Smooth Transitions',
    'Perfect Performance',
    'Great User Experience'
  ];

  const shopifyWords = [
    'Revenue Growth',
    'SEO Rankings',
    'Customer Engagement',
    'Store Performance'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Typewriter Component Demo
          </h1>
          <p className="text-gray-600">
            Showcasing different typewriter effects and configurations
          </p>
        </div>

        {/* Basic Demo */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Basic Typewriter</h2>
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-800">
              Experience{' '}
              <span className="text-blue-600">
                <Typewriter
                  words={demoWords}
                  speed={100}
                  deleteSpeed={50}
                  delayBetweenWords={2000}
                  loop={true}
                />
              </span>
            </h3>
          </div>
        </div>

        {/* Shopify Style Demo */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-semibold mb-6">Shopify Hero Style</h2>
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Supercharge Your
              <br />
              <Typewriter
                words={shopifyWords}
                speed={150}
                deleteSpeed={100}
                delayBetweenWords={3000}
                loop={true}
                startDelay={1000}
                cursorChar="_"
                cursorClassName="animate-pulse text-yellow-400 font-bold"
              />
            </h1>
            <p className="text-xl text-blue-100 mt-4">
              AI-powered optimization that delivers real results
            </p>
          </div>
        </div>

        {/* Customization Options */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Customization Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Slow & Steady</h3>
              <div className="text-xl text-gray-700">
                <Typewriter
                  words={['Slow typing effect', 'Perfect for emphasis']}
                  speed={200}
                  deleteSpeed={100}
                  delayBetweenWords={3000}
                  loop={true}
                  cursorChar="▌"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Fast & Dynamic</h3>
              <div className="text-xl text-gray-700">
                <Typewriter
                  words={['Quick typing!', 'Dynamic content', 'Rapid updates']}
                  speed={50}
                  deleteSpeed={25}
                  delayBetweenWords={1000}
                  loop={true}
                  cursorChar="●"
                  cursorClassName="animate-pulse text-red-500"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">No Loop</h3>
              <div className="text-xl text-gray-700">
                <Typewriter
                  words={['This types once', 'Then stops here']}
                  speed={80}
                  deleteSpeed={60}
                  delayBetweenWords={2000}
                  loop={false}
                  cursorChar="|"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">With Prefix/Suffix</h3>
              <div className="text-xl text-gray-700">
                <Typewriter
                  words={['amazing', 'powerful', 'innovative']}
                  speed={100}
                  deleteSpeed={70}
                  delayBetweenWords={2000}
                  loop={true}
                  prefix="B3ACON is "
                  suffix="!"
                  cursorChar="✨"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Usage</h2>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-green-400 text-sm">
{`import Typewriter from '../UI/Typewriter';

<Typewriter
  words={['Word 1', 'Word 2', 'Word 3']}
  speed={100}              // Typing speed in ms
  deleteSpeed={50}         // Delete speed in ms
  delayBetweenWords={2000} // Pause between words
  loop={true}              // Loop through words
  startDelay={0}           // Initial delay
  cursorChar="|"           // Cursor character
  showCursor={true}        // Show/hide cursor
  prefix="Before: "        // Text before typewriter
  suffix=" :After"         // Text after typewriter
/>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypewriterDemo;