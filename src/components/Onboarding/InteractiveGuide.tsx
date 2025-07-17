import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ArrowRight, ArrowLeft, Play, Pause, RotateCcw, Lightbulb, Target, Zap, Star, Award } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Step {
  id: string;
  title: string;
  description: string;
  component: string;
  action: string;
  tips: string[];
  estimatedTime: string;
  difficulty: 'easy' | 'medium' | 'advanced';
  category: 'setup' | 'features' | 'optimization' | 'advanced';
  prerequisites?: string[];
  videoUrl?: string;
}

interface InteractiveGuideProps {
  isOpen: boolean;
  onClose: () => void;
  userProgress?: any;
}

const InteractiveGuide: React.FC<InteractiveGuideProps> = ({ isOpen, onClose, userProgress = {} }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('setup');
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [showTips, setShowTips] = useState(true);

  const onboardingSteps: Step[] = [
    // Setup Category
    {
      id: 'account-setup',
      title: 'Complete Your Account Profile',
      description: 'Set up your agency profile with company information, team details, and contact preferences.',
      component: 'UserProfile',
      action: 'Navigate to Settings → Profile and complete all required fields',
      tips: [
        'Add a professional logo for better brand recognition',
        'Include team member roles for proper access management',
        'Set timezone and communication preferences'
      ],
      estimatedTime: '5 minutes',
      difficulty: 'easy',
      category: 'setup'
    },
    {
      id: 'api-configuration',
      title: 'Configure API Integrations',
      description: 'Set up SerpAPI and other essential integrations for enhanced functionality.',
      component: 'APISettings',
      action: 'Add your SerpAPI key in the environment configuration',
      tips: [
        'Get free SerpAPI key with 100 searches/month',
        'Test the connection after adding your key',
        'Monitor usage in your SerpAPI dashboard'
      ],
      estimatedTime: '10 minutes',
      difficulty: 'medium',
      category: 'setup'
    },
    {
      id: 'client-import',
      title: 'Import Your First Client',
      description: 'Add client information and set up your first project for comprehensive tracking.',
      component: 'ClientManagement',
      action: 'Go to Clients → Add Client and create your first client profile',
      tips: [
        'Use the CSV import feature for multiple clients',
        'Set up client-specific goals and KPIs',
        'Configure automated reporting preferences'
      ],
      estimatedTime: '8 minutes',
      difficulty: 'easy',
      category: 'setup'
    },

    // Features Category
    {
      id: 'seo-intelligence',
      title: 'Explore SEO Intelligence Hub',
      description: 'Learn to perform keyword analysis, competitor tracking, and SERP analysis.',
      component: 'SEOIntelligenceHub',
      action: 'Visit SEO Intelligence → Keyword Analysis and analyze your first set of keywords',
      tips: [
        'Start with 5-10 core business keywords',
        'Add main competitors for comparison',
        'Use location targeting for local businesses'
      ],
      estimatedTime: '15 minutes',
      difficulty: 'medium',
      category: 'features'
    },
    {
      id: 'lead-prospecting',
      title: 'Master Lead Prospecting',
      description: 'Use company research and local business search to find quality leads.',
      component: 'LeadProspectingTool',
      action: 'Navigate to Lead Prospecting → Company Research and find potential clients',
      tips: [
        'Research industry-specific companies for targeted outreach',
        'Use local business search for location-based leads',
        'Export results for integration with your CRM'
      ],
      estimatedTime: '12 minutes',
      difficulty: 'medium',
      category: 'features'
    },
    {
      id: 'social-media-management',
      title: 'Set Up Social Media Center',
      description: 'Configure social platforms and explore content research capabilities.',
      component: 'SocialMediaCenter',
      action: 'Visit Social Media → Content Research and discover trending topics',
      tips: [
        'Connect your social media accounts',
        'Use hashtag analysis for better reach',
        'Monitor trends for timely content creation'
      ],
      estimatedTime: '10 minutes',
      difficulty: 'easy',
      category: 'features'
    },
    {
      id: 'shopify-integration',
      title: 'Connect E-commerce Tools',
      description: 'Set up Shopify integration and explore product research features.',
      component: 'ShopifyIntegration',
      action: 'Go to Shopify Integration → Product Research and analyze market trends',
      tips: [
        'Connect your Shopify store for seamless sync',
        'Use competitor analysis for pricing strategies',
        'Monitor product trends for inventory planning'
      ],
      estimatedTime: '15 minutes',
      difficulty: 'medium',
      category: 'features'
    },

    // Optimization Category
    {
      id: 'dashboard-customization',
      title: 'Customize Your Dashboard',
      description: 'Personalize widgets, metrics, and layout for optimal workflow.',
      component: 'AgencyDashboard',
      action: 'Customize dashboard widgets to show your most important metrics',
      tips: [
        'Pin frequently used tools to the top',
        'Set up custom KPI tracking',
        'Configure notification preferences'
      ],
      estimatedTime: '8 minutes',
      difficulty: 'easy',
      category: 'optimization'
    },
    {
      id: 'automation-setup',
      title: 'Configure Automation',
      description: 'Set up automated reports, alerts, and recurring tasks.',
      component: 'AutomationCenter',
      action: 'Create your first automated client report',
      tips: [
        'Schedule weekly performance reports',
        'Set up ranking change alerts',
        'Automate lead scoring and segmentation'
      ],
      estimatedTime: '20 minutes',
      difficulty: 'medium',
      category: 'optimization'
    },
    {
      id: 'team-collaboration',
      title: 'Set Up Team Collaboration',
      description: 'Configure team roles, permissions, and collaboration tools.',
      component: 'TeamManagement',
      action: 'Invite team members and assign appropriate roles',
      tips: [
        'Define clear role-based permissions',
        'Set up project assignment workflows',
        'Configure internal communication preferences'
      ],
      estimatedTime: '12 minutes',
      difficulty: 'medium',
      category: 'optimization'
    },

    // Advanced Category
    {
      id: 'white-label-setup',
      title: 'Configure White Label Branding',
      description: 'Customize the platform with your agency branding for client presentations.',
      component: 'WhiteLabelManagement',
      action: 'Upload your logo and customize the client portal branding',
      tips: [
        'Use high-resolution logo files',
        'Match your brand color scheme',
        'Customize email templates with your branding'
      ],
      estimatedTime: '15 minutes',
      difficulty: 'advanced',
      category: 'advanced'
    },
    {
      id: 'advanced-analytics',
      title: 'Master Advanced Analytics',
      description: 'Set up custom reporting, advanced metrics, and data visualization.',
      component: 'AdvancedAnalytics',
      action: 'Create a custom analytics dashboard for your top client',
      tips: [
        'Use custom date ranges for specific analysis',
        'Set up conversion tracking',
        'Create executive-level summary reports'
      ],
      estimatedTime: '25 minutes',
      difficulty: 'advanced',
      category: 'advanced'
    },
    {
      id: 'api-integration',
      title: 'Advanced API Integration',
      description: 'Connect additional tools and set up custom workflows.',
      component: 'APIIntegration',
      action: 'Set up your first custom API integration',
      tips: [
        'Start with webhook configurations',
        'Test integrations in staging environment',
        'Document custom workflows for team reference'
      ],
      estimatedTime: '30 minutes',
      difficulty: 'advanced',
      category: 'advanced'
    }
  ];

  const categories = [
    { id: 'setup', label: 'Initial Setup', icon: Target, color: 'blue' },
    { id: 'features', label: 'Core Features', icon: Zap, color: 'green' },
    { id: 'optimization', label: 'Optimization', icon: Star, color: 'yellow' },
    { id: 'advanced', label: 'Advanced', icon: Award, color: 'purple' }
  ];

  const filteredSteps = onboardingSteps.filter(step => step.category === selectedCategory);

  useEffect(() => {
    // Load completed steps from localStorage
    const saved = localStorage.getItem('b3acon-onboarding-progress');
    if (saved) {
      setCompletedSteps(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Auto-advance steps if autoplay is enabled
    if (isAutoPlay && currentStep < filteredSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 15000); // 15 seconds per step
      return () => clearTimeout(timer);
    }
  }, [currentStep, isAutoPlay, filteredSteps.length]);

  const markStepComplete = (stepId: string) => {
    const updated = [...completedSteps, stepId];
    setCompletedSteps(updated);
    localStorage.setItem('b3acon-onboarding-progress', JSON.stringify(updated));
    toast.success('Step completed! 🎉');
  };

  const resetProgress = () => {
    setCompletedSteps([]);
    setCurrentStep(0);
    localStorage.removeItem('b3acon-onboarding-progress');
    toast.success('Progress reset successfully');
  };

  const getProgressPercentage = () => {
    const categorySteps = onboardingSteps.filter(step => step.category === selectedCategory);
    const completedInCategory = categorySteps.filter(step => completedSteps.includes(step.id)).length;
    return (completedInCategory / categorySteps.length) * 100;
  };

  const getTotalProgress = () => {
    return (completedSteps.length / onboardingSteps.length) * 100;
  };

  const currentStepData = filteredSteps[currentStep];
  const isStepCompleted = currentStepData && completedSteps.includes(currentStepData.id);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-signal-blue to-beacon-orange p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">B3ACON Interactive Setup Guide</h2>
              <p className="text-blue-100">Master your marketing command center step by step</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm text-blue-100">Total Progress</div>
                <div className="text-lg font-bold">{Math.round(getTotalProgress())}%</div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="bg-white bg-opacity-20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${getTotalProgress()}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex h-[calc(90vh-140px)]">
          {/* Sidebar - Categories */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <div className="space-y-2">
              {categories.map((category) => {
                const Icon = category.icon;
                const categorySteps = onboardingSteps.filter(step => step.category === category.id);
                const completedInCategory = categorySteps.filter(step => completedSteps.includes(step.id)).length;
                const categoryProgress = (completedInCategory / categorySteps.length) * 100;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setCurrentStep(0);
                    }}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      selectedCategory === category.id
                        ? 'bg-signal-blue text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{category.label}</span>
                    </div>
                    <div className="text-xs opacity-75 mb-2">
                      {completedInCategory}/{categorySteps.length} completed
                    </div>
                    <div className={`h-1 rounded-full ${
                      selectedCategory === category.id ? 'bg-white bg-opacity-30' : 'bg-gray-200'
                    }`}>
                      <div 
                        className={`h-1 rounded-full transition-all duration-500 ${
                          selectedCategory === category.id ? 'bg-white' : 'bg-signal-blue'
                        }`}
                        style={{ width: `${categoryProgress}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Controls */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="space-y-3">
                <button
                  onClick={() => setIsAutoPlay(!isAutoPlay)}
                  className="w-full flex items-center justify-center space-x-2 p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span className="text-sm">{isAutoPlay ? 'Pause' : 'Auto Play'}</span>
                </button>
                
                <button
                  onClick={() => setShowTips(!showTips)}
                  className="w-full flex items-center justify-center space-x-2 p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Lightbulb className="w-4 h-4" />
                  <span className="text-sm">{showTips ? 'Hide Tips' : 'Show Tips'}</span>
                </button>
                
                <button
                  onClick={resetProgress}
                  className="w-full flex items-center justify-center space-x-2 p-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="text-sm">Reset Progress</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            {currentStepData ? (
              <div className="p-6">
                {/* Step Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-500">
                        Step {currentStep + 1} of {filteredSteps.length}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        currentStepData.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        currentStepData.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {currentStepData.difficulty}
                      </span>
                      <span className="text-xs text-gray-500">
                        ⏱️ {currentStepData.estimatedTime}
                      </span>
                    </div>
                    {isStepCompleted && (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{currentStepData.title}</h3>
                  <p className="text-gray-600 text-lg">{currentStepData.description}</p>
                </div>

                {/* Action Steps */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-blue-900 mb-2">📋 Action Required:</h4>
                  <p className="text-blue-800">{currentStepData.action}</p>
                </div>

                {/* Tips Section */}
                {showTips && currentStepData.tips && (
                  <div className="bg-yellow-50 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-yellow-900 mb-3 flex items-center">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Pro Tips:
                    </h4>
                    <ul className="space-y-2">
                      {currentStepData.tips.map((tip, index) => (
                        <li key={index} className="text-yellow-800 text-sm flex items-start">
                          <span className="text-yellow-600 mr-2">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Prerequisites */}
                {currentStepData.prerequisites && currentStepData.prerequisites.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">⚠️ Prerequisites:</h4>
                    <ul className="space-y-1">
                      {currentStepData.prerequisites.map((prereq, index) => (
                        <li key={index} className="text-gray-700 text-sm">
                          • {prereq}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center space-x-3">
                    {!isStepCompleted && (
                      <button
                        onClick={() => markStepComplete(currentStepData.id)}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Mark Complete</span>
                      </button>
                    )}
                    
                    <button
                      onClick={() => setCurrentStep(Math.min(filteredSteps.length - 1, currentStep + 1))}
                      disabled={currentStep === filteredSteps.length - 1}
                      className="flex items-center space-x-2 px-6 py-2 bg-signal-blue text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center">
                <div className="text-gray-500">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">All Steps Completed!</h3>
                  <p>You've mastered the {selectedCategory} category. Choose another category to continue learning.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveGuide;