import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Mail, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  X, 
  RefreshCw, 
  Send, 
  Calendar, 
  Clock, 
  Database, 
  Briefcase, 
  Building, 
  MapPin, 
  Globe, 
  Tag, 
  FileText, 
  BarChart3, 
  Zap, 
  ExternalLink,
  Save,
  Eye,
  Pause,
  Play
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../../../lib/supabase';

const LeadProspectingTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState('finder');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    industries: [] as string[],
    jobTitles: [] as string[],
    locations: [] as string[],
    companySizes: [] as string[]
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [databases, setDatabases] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    description: '',
    targetAudience: {
      industries: [] as string[],
      jobTitles: [] as string[],
      companySizes: [] as string[]
    },
    settings: {
      personalization: true,
      followUps: 3,
      schedule: {
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        timeRange: ['9:00', '17:00']
      }
    }
  });
  const [showAddStepModal, setShowAddStepModal] = useState(false);
  const [stepForm, setStepForm] = useState({
    stepNumber: 1,
    stepType: 'email',
    subject: '',
    content: '',
    delayDays: 0,
    delayHours: 0
  });
  const [activeCampaign, setActiveCampaign] = useState<any>(null);
  const [campaignSteps, setCampaignSteps] = useState<any[]>([]);
  
  // Fetch databases and campaigns on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch lead databases
        const { data: dbData, error: dbError } = await supabase
          .from('lead_databases')
          .select('*')
          .order('name');
        
        if (dbError) throw dbError;
        
        if (dbData) {
          setDatabases(dbData);
        }
        
        // Fetch lead campaigns
        const { data: campaignData, error: campaignError } = await supabase
          .from('lead_campaigns')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (campaignError) throw campaignError;
        
        if (campaignData) {
          setCampaigns(campaignData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Fetch campaign steps when active campaign changes
  useEffect(() => {
    if (activeCampaign) {
      const fetchCampaignSteps = async () => {
        try {
          const { data, error } = await supabase
            .from('lead_campaign_steps')
            .select('*')
            .eq('campaign_id', activeCampaign.id)
            .order('step_number');
          
          if (error) throw error;
          
          if (data) {
            setCampaignSteps(data);
          }
        } catch (error) {
          console.error('Error fetching campaign steps:', error);
          toast.error('Failed to load campaign steps');
        }
      };
      
      fetchCampaignSteps();
    }
  }, [activeCampaign]);
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real implementation, this would call an API to search for leads
      // For now, we'll simulate the search with mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock search results
      const mockResults = Array.from({ length: 15 }, (_, i) => ({
        id: `lead-${i + 1}`,
        firstName: ['John', 'Sarah', 'Michael', 'Emily', 'David'][Math.floor(Math.random() * 5)],
        lastName: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 5)],
        email: `${['john', 'sarah', 'michael', 'emily', 'david'][Math.floor(Math.random() * 5)]}.${['smith', 'johnson', 'williams', 'brown', 'jones'][Math.floor(Math.random() * 5)]}@${['techcompany', 'agency', 'startup', 'enterprise', 'business'][Math.floor(Math.random() * 5)]}.com`,
        company: `${['Tech', 'Digital', 'Global', 'Advanced', 'Smart'][Math.floor(Math.random() * 5)]} ${['Solutions', 'Systems', 'Technologies', 'Innovations', 'Enterprises'][Math.floor(Math.random() * 5)]}`,
        jobTitle: `${['Marketing', 'Sales', 'Product', 'Operations', 'Business'][Math.floor(Math.random() * 5)]} ${['Director', 'Manager', 'Lead', 'Head', 'VP'][Math.floor(Math.random() * 5)]}`,
        linkedinUrl: `https://linkedin.com/in/${['john', 'sarah', 'michael', 'emily', 'david'][Math.floor(Math.random() * 5)]}-${['smith', 'johnson', 'williams', 'brown', 'jones'][Math.floor(Math.random() * 5)]}`,
        website: `https://${['techcompany', 'agency', 'startup', 'enterprise', 'business'][Math.floor(Math.random() * 5)]}.com`,
        industry: ['Technology', 'Marketing', 'Finance', 'Healthcare', 'Retail'][Math.floor(Math.random() * 5)],
        companySize: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'][Math.floor(Math.random() * 6)],
        location: ['San Francisco, CA', 'New York, NY', 'London, UK', 'Toronto, Canada', 'Sydney, Australia'][Math.floor(Math.random() * 5)],
        country: ['USA', 'UK', 'Canada', 'Australia', 'Germany'][Math.floor(Math.random() * 5)],
        tags: [
          ['tech', 'saas', 'b2b'],
          ['marketing', 'agency', 'creative'],
          ['finance', 'banking', 'investment'],
          ['healthcare', 'medical', 'wellness'],
          ['retail', 'ecommerce', 'consumer']
        ][Math.floor(Math.random() * 5)],
        emailVerified: Math.random() > 0.3,
        phoneVerified: Math.random() > 0.7
      }));
      
      setSearchResults(mockResults);
      toast.success(`Found ${mockResults.length} leads matching your criteria`);
    } catch (error) {
      console.error('Error searching for leads:', error);
      toast.error('Failed to search for leads');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleToggleSelectLead = (leadId: string) => {
    if (selectedLeads.includes(leadId)) {
      setSelectedLeads(selectedLeads.filter(id => id !== leadId));
    } else {
      setSelectedLeads([...selectedLeads, leadId]);
    }
  };
  
  const handleSelectAllLeads = () => {
    if (selectedLeads.length === searchResults.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(searchResults.map(lead => lead.id));
    }
  };
  
  const handleSaveLeads = async () => {
    if (selectedLeads.length === 0) {
      toast.error('Please select at least one lead');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real implementation, this would save the selected leads to the database
      // For now, we'll simulate the save with a delay
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Saved ${selectedLeads.length} leads to your database`);
      setSelectedLeads([]);
    } catch (error) {
      console.error('Error saving leads:', error);
      toast.error('Failed to save leads');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!campaignForm.name) {
      toast.error('Campaign name is required');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real implementation, this would create a new campaign in the database
      // For now, we'll simulate the creation with a delay
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newCampaign = {
        id: `campaign-${Date.now()}`,
        name: campaignForm.name,
        description: campaignForm.description,
        status: 'draft',
        target_audience: campaignForm.targetAudience,
        settings: campaignForm.settings,
        stats: {
          sent: 0,
          opened: 0,
          replied: 0,
          bounced: 0,
          meetings_booked: 0
        },
        created_at: new Date().toISOString()
      };
      
      setCampaigns([newCampaign, ...campaigns]);
      setShowNewCampaignModal(false);
      setCampaignForm({
        name: '',
        description: '',
        targetAudience: {
          industries: [],
          jobTitles: [],
          companySizes: []
        },
        settings: {
          personalization: true,
          followUps: 3,
          schedule: {
            days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
            timeRange: ['9:00', '17:00']
          }
        }
      });
      
      toast.success('Campaign created successfully');
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error('Failed to create campaign');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddCampaignStep = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activeCampaign) {
      toast.error('No active campaign selected');
      return;
    }
    
    if (!stepForm.subject || !stepForm.content) {
      toast.error('Subject and content are required');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real implementation, this would add a new step to the campaign in the database
      // For now, we'll simulate the addition with a delay
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newStep = {
        id: `step-${Date.now()}`,
        campaign_id: activeCampaign.id,
        step_number: stepForm.stepNumber,
        step_type: stepForm.stepType,
        subject: stepForm.subject,
        content: stepForm.content,
        delay_days: stepForm.delayDays,
        delay_hours: stepForm.delayHours,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setCampaignSteps([...campaignSteps, newStep].sort((a, b) => a.step_number - b.step_number));
      setShowAddStepModal(false);
      setStepForm({
        stepNumber: campaignSteps.length + 1,
        stepType: 'email',
        subject: '',
        content: '',
        delayDays: 0,
        delayHours: 0
      });
      
      toast.success('Campaign step added successfully');
    } catch (error) {
      console.error('Error adding campaign step:', error);
      toast.error('Failed to add campaign step');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleStartCampaign = (campaignId: string) => {
    setCampaigns(campaigns.map(campaign => 
      campaign.id === campaignId ? { ...campaign, status: 'active' } : campaign
    ));
    
    toast.success('Campaign started successfully');
  };
  
  const handlePauseCampaign = (campaignId: string) => {
    setCampaigns(campaigns.map(campaign => 
      campaign.id === campaignId ? { ...campaign, status: 'paused' } : campaign
    ));
    
    toast.success('Campaign paused successfully');
  };
  
  const handleDeleteCampaign = (campaignId: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      setCampaigns(campaigns.filter(campaign => campaign.id !== campaignId));
      
      if (activeCampaign && activeCampaign.id === campaignId) {
        setActiveCampaign(null);
        setCampaignSteps([]);
      }
      
      toast.success('Campaign deleted successfully');
    }
  };
  
  const handleToggleIndustry = (industry: string) => {
    if (filterOptions.industries.includes(industry)) {
      setFilterOptions({
        ...filterOptions,
        industries: filterOptions.industries.filter(i => i !== industry)
      });
    } else {
      setFilterOptions({
        ...filterOptions,
        industries: [...filterOptions.industries, industry]
      });
    }
  };
  
  const handleToggleJobTitle = (jobTitle: string) => {
    if (filterOptions.jobTitles.includes(jobTitle)) {
      setFilterOptions({
        ...filterOptions,
        jobTitles: filterOptions.jobTitles.filter(j => j !== jobTitle)
      });
    } else {
      setFilterOptions({
        ...filterOptions,
        jobTitles: [...filterOptions.jobTitles, jobTitle]
      });
    }
  };
  
  const handleToggleLocation = (location: string) => {
    if (filterOptions.locations.includes(location)) {
      setFilterOptions({
        ...filterOptions,
        locations: filterOptions.locations.filter(l => l !== location)
      });
    } else {
      setFilterOptions({
        ...filterOptions,
        locations: [...filterOptions.locations, location]
      });
    }
  };
  
  const handleToggleCompanySize = (size: string) => {
    if (filterOptions.companySizes.includes(size)) {
      setFilterOptions({
        ...filterOptions,
        companySizes: filterOptions.companySizes.filter(s => s !== size)
      });
    } else {
      setFilterOptions({
        ...filterOptions,
        companySizes: [...filterOptions.companySizes, size]
      });
    }
  };
  
  const renderLeadFinder = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">B2B Lead Finder</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-1 rounded-lg text-sm flex items-center space-x-1 ${
              showFilters ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters {filterOptions.industries.length + filterOptions.jobTitles.length + filterOptions.locations.length + filterOptions.companySizes.length > 0 ? `(${filterOptions.industries.length + filterOptions.jobTitles.length + filterOptions.locations.length + filterOptions.companySizes.length})` : ''}</span>
          </button>
          {selectedLeads.length > 0 && (
            <button
              onClick={handleSaveLeads}
              disabled={isLoading}
              className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center space-x-1"
            >
              <Save className="w-4 h-4" />
              <span>Save {selectedLeads.length} Leads</span>
            </button>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company, job title, industry, or location..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Search</span>
              </>
            )}
          </button>
        </div>
        
        {showFilters && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-4">Filter Options</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Industries</h5>
                <div className="space-y-1">
                  {['Technology', 'Marketing', 'Finance', 'Healthcare', 'Retail'].map((industry) => (
                    <div key={industry} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`industry-${industry}`}
                        checked={filterOptions.industries.includes(industry)}
                        onChange={() => handleToggleIndustry(industry)}
                        className="mr-2"
                      />
                      <label htmlFor={`industry-${industry}`} className="text-sm text-gray-700">
                        {industry}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Job Titles</h5>
                <div className="space-y-1">
                  {['CEO', 'CTO', 'CMO', 'Director', 'VP', 'Manager'].map((title) => (
                    <div key={title} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`job-${title}`}
                        checked={filterOptions.jobTitles.includes(title)}
                        onChange={() => handleToggleJobTitle(title)}
                        className="mr-2"
                      />
                      <label htmlFor={`job-${title}`} className="text-sm text-gray-700">
                        {title}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Locations</h5>
                <div className="space-y-1">
                  {['USA', 'UK', 'Canada', 'Europe', 'Australia'].map((location) => (
                    <div key={location} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`location-${location}`}
                        checked={filterOptions.locations.includes(location)}
                        onChange={() => handleToggleLocation(location)}
                        className="mr-2"
                      />
                      <label htmlFor={`location-${location}`} className="text-sm text-gray-700">
                        {location}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Company Size</h5>
                <div className="space-y-1">
                  {['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'].map((size) => (
                    <div key={size} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`size-${size}`}
                        checked={filterOptions.companySizes.includes(size)}
                        onChange={() => handleToggleCompanySize(size)}
                        className="mr-2"
                      />
                      <label htmlFor={`size-${size}`} className="text-sm text-gray-700">
                        {size}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setFilterOptions({
                    industries: [],
                    jobTitles: [],
                    locations: [],
                    companySizes: []
                  });
                }}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
        
        {searchResults.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="select-all"
                  checked={selectedLeads.length === searchResults.length}
                  onChange={handleSelectAllLeads}
                  className="mr-2"
                />
                <label htmlFor="select-all" className="text-sm font-medium text-gray-700">
                  Select All
                </label>
              </div>
              <div className="text-sm text-gray-600">
                {selectedLeads.length} of {searchResults.length} selected
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {searchResults.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedLeads.includes(lead.id)}
                          onChange={() => handleToggleSelectLead(lead.id)}
                          className="mr-2"
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-full flex items-center justify-center text-white font-medium">
                            {lead.firstName.charAt(0)}{lead.lastName.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{lead.firstName} {lead.lastName}</div>
                            <div className="text-xs text-blue-600 hover:text-blue-800">
                              <a href={lead.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                <ExternalLink className="w-3 h-3 mr-1" />
                                LinkedIn
                              </a>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{lead.company}</div>
                        <div className="text-xs text-gray-500">{lead.companySize} employees</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{lead.jobTitle}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          {lead.email}
                          {lead.emailVerified && (
                            <span className="ml-1 text-green-500" title="Email verified">
                              <Check className="w-4 h-4" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{lead.location}</div>
                        <div className="text-xs text-gray-500">{lead.country}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{lead.industry}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {lead.tags.map((tag: string) => (
                            <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(lead.email);
                              toast.success('Email copied to clipboard');
                            }}
                            className="text-gray-400 hover:text-gray-600"
                            title="Copy email"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toast.success(`Viewing ${lead.firstName} ${lead.lastName}'s profile`)}
                            className="text-gray-400 hover:text-blue-600"
                            title="View profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Search for B2B Leads</h4>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Find decision-makers at your target companies. Search by company name, job title, industry, or location.
            </p>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
            >
              Start Searching
            </button>
          </div>
        )}
      </div>
    </div>
  );
  
  const renderDatabases = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Lead Databases</h3>
        <button
          onClick={() => toast.success('Creating new database')}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Database className="w-4 h-4" />
          <span>New Database</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {databases.map((database) => (
          <div key={database.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-signal-blue to-blue-600 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{database.name}</h4>
                  <p className="text-sm text-gray-600">Source: {database.source}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                database.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {database.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">{database.description}</p>
            
            <div className="flex items-center justify-between text-sm">
              <div className="text-gray-600">
                <span className="font-medium text-gray-900">{database.total_leads.toLocaleString()}</span> leads
              </div>
              <div className="text-gray-600">
                Updated: {new Date(database.last_updated).toLocaleDateString()}
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-2 mt-4">
              <button
                onClick={() => toast.success(`Viewing ${database.name}`)}
                className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
              >
                View Leads
              </button>
              <button
                onClick={() => toast.success(`Exporting ${database.name}`)}
                className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
              >
                Export
              </button>
            </div>
          </div>
        ))}
        
        {databases.length === 0 && (
          <div className="col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center py-12">
              <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Databases Yet</h4>
              <p className="text-gray-600 mb-4">Create your first lead database to start organizing your prospects.</p>
              <button
                onClick={() => toast.success('Creating new database')}
                className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
              >
                Create Database
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
  const renderCampaigns = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Outreach Campaigns</h3>
        <button
          onClick={() => setShowNewCampaignModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Campaign</span>
        </button>
      </div>
      
      {/* New Campaign Modal */}
      {showNewCampaignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Create New Campaign</h4>
              <button 
                onClick={() => setShowNewCampaignModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                <input
                  type="text"
                  value={campaignForm.name}
                  onChange={(e) => setCampaignForm({...campaignForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  placeholder="Q1 Outreach Campaign"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={campaignForm.description}
                  onChange={(e) => setCampaignForm({...campaignForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  placeholder="Campaign targeting marketing directors at tech companies"
                  rows={3}
                />
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Target Audience</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Industries</label>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {['Technology', 'Marketing', 'Finance', 'Healthcare', 'Retail', 'Manufacturing', 'Education'].map((industry) => (
                        <div key={industry} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`target-industry-${industry}`}
                            checked={campaignForm.targetAudience.industries.includes(industry)}
                            onChange={() => {
                              const industries = campaignForm.targetAudience.industries.includes(industry)
                                ? campaignForm.targetAudience.industries.filter(i => i !== industry)
                                : [...campaignForm.targetAudience.industries, industry];
                              
                              setCampaignForm({
                                ...campaignForm,
                                targetAudience: {
                                  ...campaignForm.targetAudience,
                                  industries
                                }
                              });
                            }}
                            className="mr-2"
                          />
                          <label htmlFor={`target-industry-${industry}`} className="text-xs text-gray-700">
                            {industry}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Job Titles</label>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {['CEO', 'CTO', 'CMO', 'CFO', 'COO', 'VP of Marketing', 'VP of Sales', 'Marketing Director', 'Sales Director', 'Product Manager'].map((title) => (
                        <div key={title} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`target-job-${title}`}
                            checked={campaignForm.targetAudience.jobTitles.includes(title)}
                            onChange={() => {
                              const jobTitles = campaignForm.targetAudience.jobTitles.includes(title)
                                ? campaignForm.targetAudience.jobTitles.filter(j => j !== title)
                                : [...campaignForm.targetAudience.jobTitles, title];
                              
                              setCampaignForm({
                                ...campaignForm,
                                targetAudience: {
                                  ...campaignForm.targetAudience,
                                  jobTitles
                                }
                              });
                            }}
                            className="mr-2"
                          />
                          <label htmlFor={`target-job-${title}`} className="text-xs text-gray-700">
                            {title}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Company Size</label>
                    <div className="space-y-1">
                      {['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'].map((size) => (
                        <div key={size} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`target-size-${size}`}
                            checked={campaignForm.targetAudience.companySizes.includes(size)}
                            onChange={() => {
                              const companySizes = campaignForm.targetAudience.companySizes.includes(size)
                                ? campaignForm.targetAudience.companySizes.filter(s => s !== size)
                                : [...campaignForm.targetAudience.companySizes, size];
                              
                              setCampaignForm({
                                ...campaignForm,
                                targetAudience: {
                                  ...campaignForm.targetAudience,
                                  companySizes
                                }
                              });
                            }}
                            className="mr-2"
                          />
                          <label htmlFor={`target-size-${size}`} className="text-xs text-gray-700">
                            {size}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Campaign Settings</h5>
                <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Personalization</label>
                      <p className="text-xs text-gray-500">Use personalization variables in your messages</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={campaignForm.settings.personalization}
                        onChange={() => setCampaignForm({
                          ...campaignForm,
                          settings: {
                            ...campaignForm.settings,
                            personalization: !campaignForm.settings.personalization
                          }
                        })}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-signal-blue"></div>
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Follow-ups</label>
                    <select
                      value={campaignForm.settings.followUps}
                      onChange={(e) => setCampaignForm({
                        ...campaignForm,
                        settings: {
                          ...campaignForm.settings,
                          followUps: parseInt(e.target.value)
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                    >
                      <option value={0}>No follow-ups</option>
                      <option value={1}>1 follow-up</option>
                      <option value={2}>2 follow-ups</option>
                      <option value={3}>3 follow-ups</option>
                      <option value={4}>4 follow-ups</option>
                      <option value={5}>5 follow-ups</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sending Schedule</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Days</label>
                        <div className="space-y-1">
                          {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                            <div key={day} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`day-${day}`}
                                checked={campaignForm.settings.schedule.days.includes(day)}
                                onChange={() => {
                                  const days = campaignForm.settings.schedule.days.includes(day)
                                    ? campaignForm.settings.schedule.days.filter(d => d !== day)
                                    : [...campaignForm.settings.schedule.days, day];
                                  
                                  setCampaignForm({
                                    ...campaignForm,
                                    settings: {
                                      ...campaignForm.settings,
                                      schedule: {
                                        ...campaignForm.settings.schedule,
                                        days
                                      }
                                    }
                                  });
                                }}
                                className="mr-2"
                              />
                              <label htmlFor={`day-${day}`} className="text-xs text-gray-700 capitalize">
                                {day}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Time Range</label>
                        <div className="flex items-center space-x-2">
                          <select
                            value={campaignForm.settings.schedule.timeRange[0]}
                            onChange={(e) => setCampaignForm({
                              ...campaignForm,
                              settings: {
                                ...campaignForm.settings,
                                schedule: {
                                  ...campaignForm.settings.schedule,
                                  timeRange: [e.target.value, campaignForm.settings.schedule.timeRange[1]]
                                }
                              }
                            })}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                          >
                            {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                              <option key={hour} value={`${hour}:00`}>
                                {hour.toString().padStart(2, '0')}:00
                              </option>
                            ))}
                          </select>
                          <span className="text-gray-500">to</span>
                          <select
                            value={campaignForm.settings.schedule.timeRange[1]}
                            onChange={(e) => setCampaignForm({
                              ...campaignForm,
                              settings: {
                                ...campaignForm.settings,
                                schedule: {
                                  ...campaignForm.settings.schedule,
                                  timeRange: [campaignForm.settings.schedule.timeRange[0], e.target.value]
                                }
                              }
                            })}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                          >
                            {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                              <option key={hour} value={`${hour}:00`}>
                                {hour.toString().padStart(2, '0')}:00
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowNewCampaignModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Creating...' : 'Create Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Add Campaign Step Modal */}
      {showAddStepModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Add Campaign Step</h4>
              <button 
                onClick={() => setShowAddStepModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAddCampaignStep} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Step Number</label>
                  <input
                    type="number"
                    min="1"
                    value={stepForm.stepNumber}
                    onChange={(e) => setStepForm({...stepForm, stepNumber: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Step Type</label>
                  <select
                    value={stepForm.stepType}
                    onChange={(e) => setStepForm({...stepForm, stepType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  >
                    <option value="email">Email</option>
                    <option value="linkedin">LinkedIn Message</option>
                    <option value="task">Manual Task</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Line</label>
                <input
                  type="text"
                  value={stepForm.subject}
                  onChange={(e) => setStepForm({...stepForm, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  placeholder="Improving your marketing ROI"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={stepForm.content}
                  onChange={(e) => setStepForm({...stepForm, content: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  placeholder="Hi {{first_name}},

I noticed that {{company}} has been expanding its digital presence lately. I wanted to reach out because we've helped similar companies in the {{industry}} industry improve their marketing ROI by an average of 35%.

Would you be open to a quick 15-minute call to discuss how we might be able to help?

Best regards,
{{sender_name}}"
                  rows={8}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use variables like {{first_name}}, {{company}}, {{industry}} for personalization.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delay (Days)</label>
                  <input
                    type="number"
                    min="0"
                    value={stepForm.delayDays}
                    onChange={(e) => setStepForm({...stepForm, delayDays: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delay (Hours)</label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={stepForm.delayHours}
                    onChange={(e) => setStepForm({...stepForm, delayHours: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddStepModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Adding...' : 'Add Step'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="font-medium text-gray-900 mb-4">Campaigns</h4>
            
            {campaigns.length > 0 ? (
              <div className="space-y-3">
                {campaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    onClick={() => setActiveCampaign(campaign)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      activeCampaign && activeCampaign.id === campaign.id
                        ? 'border-signal-blue bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-medium text-gray-900">{campaign.name}</h5>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                        campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                        campaign.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {campaign.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">{campaign.description}</p>
                    
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <span>Created: {new Date(campaign.created_at).toLocaleDateString()}</span>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (campaign.status === 'active') {
                              handlePauseCampaign(campaign.id);
                            } else {
                              handleStartCampaign(campaign.id);
                            }
                          }}
                          className={`p-1 rounded ${
                            campaign.status === 'active'
                              ? 'text-yellow-600 hover:bg-yellow-100'
                              : 'text-green-600 hover:bg-green-100'
                          }`}
                          title={campaign.status === 'active' ? 'Pause Campaign' : 'Start Campaign'}
                        >
                          {campaign.status === 'active' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCampaign(campaign.id);
                          }}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                          title="Delete Campaign"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No campaigns yet</p>
                <button 
                  onClick={() => setShowNewCampaignModal(true)}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Create Campaign
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-2">
          {activeCampaign ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="font-medium text-gray-900">{activeCampaign.name}</h4>
                  <p className="text-sm text-gray-600">{activeCampaign.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowAddStepModal(true)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Step</span>
                  </button>
                  <button
                    onClick={() => {
                      if (activeCampaign.status === 'active') {
                        handlePauseCampaign(activeCampaign.id);
                      } else {
                        handleStartCampaign(activeCampaign.id);
                      }
                    }}
                    className={`px-3 py-1 rounded text-sm ${
                      activeCampaign.status === 'active'
                        ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    } transition-colors`}
                  >
                    {activeCampaign.status === 'active' ? 'Pause Campaign' : 'Start Campaign'}
                  </button>
                </div>
              </div>
              
              <div className="mb-6">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Campaign Stats</h5>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Sent</div>
                    <div className="text-lg font-bold text-gray-900">{activeCampaign.stats.sent}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Opened</div>
                    <div className="text-lg font-bold text-gray-900">{activeCampaign.stats.opened}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Replied</div>
                    <div className="text-lg font-bold text-gray-900">{activeCampaign.stats.replied}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Bounced</div>
                    <div className="text-lg font-bold text-gray-900">{activeCampaign.stats.bounced}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Meetings</div>
                    <div className="text-lg font-bold text-gray-900">{activeCampaign.stats.meetings_booked}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Campaign Steps</h5>
                
                {campaignSteps.length > 0 ? (
                  <div className="space-y-4">
                    {campaignSteps.map((step, index) => (
                      <div key={step.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-signal-blue rounded-full flex items-center justify-center text-white text-xs font-medium">
                              {step.step_number}
                            </div>
                            <h6 className="font-medium text-gray-900">
                              {step.step_type === 'email' ? 'Email' : 
                               step.step_type === 'linkedin' ? 'LinkedIn Message' : 
                               'Manual Task'}
                            </h6>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            {step.delay_days > 0 || step.delay_hours > 0 ? (
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {step.delay_days > 0 && `${step.delay_days}d `}
                                {step.delay_hours > 0 && `${step.delay_hours}h `}
                                delay
                              </span>
                            ) : (
                              <span>Immediate</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="mb-2">
                          <div className="text-sm font-medium text-gray-900">Subject: {step.subject}</div>
                        </div>
                        
                        <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700 whitespace-pre-line">
                          {step.content}
                        </div>
                        
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={() => toast.success(`Editing step ${step.step_number}`)}
                            className="text-blue-600 hover:text-blue-800 text-xs"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border border-gray-200 rounded-lg">
                    <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No steps in this campaign yet</p>
                    <button 
                      onClick={() => setShowAddStepModal(true)}
                      className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Add First Step
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full flex items-center justify-center">
              <div className="text-center">
                <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Select a Campaign</h4>
                <p className="text-gray-600">Click on a campaign from the list to view and edit its details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Prospecting Analytics</h3>
        <button
          onClick={() => toast.success('Exporting analytics report')}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-600">Total Leads</h4>
            <div className="w-8 h-8 bg-gradient-to-r from-signal-blue to-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">12,450</div>
          <p className="text-sm text-green-600">↗ +18% this month</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-600">Campaigns</h4>
            <div className="w-8 h-8 bg-gradient-to-r from-beacon-orange to-orange-600 rounded-lg flex items-center justify-center">
              <Mail className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">24</div>
          <p className="text-sm text-green-600">↗ +4 this month</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-600">Response Rate</h4>
            <div className="w-8 h-8 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">8.2%</div>
          <p className="text-sm text-green-600">↗ +1.5% this month</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-600">Meetings Booked</h4>
            <div className="w-8 h-8 bg-gradient-to-r from-beacon-orange to-red-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">42</div>
          <p className="text-sm text-green-600">↗ +12 this month</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-medium text-gray-900 mb-4">Campaign Performance</h4>
          
          <div className="space-y-4">
            {[
              { name: 'Tech Companies Outreach', sent: 450, opened: 225, replied: 36, meetings: 12, openRate: 50, replyRate: 8 },
              { name: 'Marketing Agencies Campaign', sent: 320, opened: 192, replied: 29, meetings: 8, openRate: 60, replyRate: 9 },
              { name: 'E-commerce Retailers', sent: 280, opened: 140, replied: 22, meetings: 6, openRate: 50, replyRate: 7.9 }
            ].map((campaign, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900">{campaign.name}</h5>
                  <button
                    onClick={() => toast.success(`Viewing ${campaign.name} details`)}
                    className="text-blue-600 hover:text-blue-800 text-xs"
                  >
                    View Details
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Sent:</span>
                    <div className="font-medium text-gray-900">{campaign.sent}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Opened:</span>
                    <div className="font-medium text-gray-900">{campaign.opened}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Replied:</span>
                    <div className="font-medium text-gray-900">{campaign.replied}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Meetings:</span>
                    <div className="font-medium text-gray-900">{campaign.meetings}</div>
                  </div>
                </div>
                
                <div className="mt-3 space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">Open Rate</span>
                      <span className="font-medium text-gray-900">{campaign.openRate}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-blue-500 rounded-full" 
                        style={{ width: `${campaign.openRate}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">Reply Rate</span>
                      <span className="font-medium text-gray-900">{campaign.replyRate}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-green-500 rounded-full" 
                        style={{ width: `${campaign.replyRate * 5}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-medium text-gray-900 mb-4">Lead Sources</h4>
          
          <div className="space-y-4">
            {[
              { name: 'Tech Companies Database', count: 5000, quality: 85, conversionRate: 4.2 },
              { name: 'Marketing Agencies', count: 2500, quality: 92, conversionRate: 5.8 },
              { name: 'E-commerce Retailers', count: 3200, quality: 78, conversionRate: 3.5 },
              { name: 'Manual Imports', count: 1750, quality: 65, conversionRate: 2.8 }
            ].map((source, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900">{source.name}</h5>
                  <span className="text-sm text-gray-600">{source.count.toLocaleString()} leads</span>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">Lead Quality</span>
                      <span className="font-medium text-gray-900">{source.quality}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-blue-500 rounded-full" 
                        style={{ width: `${source.quality}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">Conversion Rate</span>
                      <span className="font-medium text-gray-900">{source.conversionRate}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-green-500 rounded-full" 
                        style={{ width: `${source.conversionRate * 10}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'finder', label: 'Lead Finder', icon: Search },
    { id: 'databases', label: 'Databases', icon: Database },
    { id: 'campaigns', label: 'Campaigns', icon: Mail },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">B2B Lead Prospecting</h2>
        <p className="text-gray-600">Find, verify, and engage with high-quality B2B leads</p>
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
        {activeTab === 'finder' && renderLeadFinder()}
        {activeTab === 'databases' && renderDatabases()}
        {activeTab === 'campaigns' && renderCampaigns()}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>
    </div>
  );
};

export default LeadProspectingTool;