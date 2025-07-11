import React, { useState } from 'react';
import { Users, Target, Calendar, Plus, Filter, Search, MoreHorizontal, Edit, Trash2, Phone, Mail, Clock, CheckSquare, MessageSquare } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';

const CRMHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pipeline');
  const [showContactForm, setShowContactForm] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    source: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddDealModal, setShowAddDealModal] = useState(false);
  const [newDeal, setNewDeal] = useState({
    name: '',
    client_id: '',
    value: '',
    stage: 'prospecting',
    probability: '50',
    close_date: '',
    description: ''
  });

  const leads = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@techstartup.com',
      company: 'TechStartup Inc',
      source: 'Website',
      status: 'qualified',
      score: 85,
      estimated_value: 15000,
      created_at: '2024-01-15'
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike@retailcorp.com',
      company: 'RetailCorp',
      source: 'LinkedIn',
      status: 'contacted',
      score: 72,
      estimated_value: 8500,
      created_at: '2024-01-16'
    }
  ];

  const deals = [
    {
      id: 1,
      name: 'TechStart SEO Package',
      value: 15000,
      stage: 'proposal',
      probability: 75,
      close_date: '2024-02-15',
      client: 'TechStartup Inc'
    },
    {
      id: 2,
      name: 'RetailCorp PPC Campaign',
      value: 8500,
      stage: 'negotiation',
      probability: 60,
      close_date: '2024-02-20',
      client: 'RetailCorp'
    }
  ];

  const pipelineStages = [
    { id: 'new', name: 'New Leads', color: 'bg-blue-500' },
    { id: 'contacted', name: 'Contacted', color: 'bg-yellow-500' },
    { id: 'qualified', name: 'Qualified', color: 'bg-purple-500' },
    { id: 'proposal', name: 'Proposal', color: 'bg-orange-500' },
    { id: 'negotiation', name: 'Negotiation', color: 'bg-pink-500' },
    { id: 'closed', name: 'Closed Won', color: 'bg-green-500' }
  ];

  const pipelineDeals = [
    {
      id: 1,
      name: 'TechStart SEO Package',
      company: 'TechStartup Inc',
      value: 15000,
      stage: 'new',
      contact: 'Sarah Johnson',
      lastActivity: '2 hours ago'
    },
    {
      id: 2,
      name: 'RetailCorp PPC Campaign',
      company: 'RetailCorp',
      value: 8500,
      stage: 'contacted',
      contact: 'Mike Chen',
      lastActivity: '1 day ago'
    },
    {
      id: 3,
      name: 'FinancePlus Website Redesign',
      company: 'FinancePlus',
      value: 12000,
      stage: 'qualified',
      contact: 'Emily Rodriguez',
      lastActivity: '3 days ago'
    },
    {
      id: 4,
      name: 'GrowthCo Social Media',
      company: 'GrowthCo',
      value: 6000,
      stage: 'proposal',
      contact: 'David Wilson',
      lastActivity: '5 days ago'
    },
    {
      id: 5,
      name: 'EcomStore Amazon PPC',
      company: 'EcomStore',
      value: 9500,
      stage: 'negotiation',
      contact: 'Jennifer Lee',
      lastActivity: '2 days ago'
    },
    {
      id: 6,
      name: 'TechCorp SEO Retainer',
      company: 'TechCorp',
      value: 4500,
      stage: 'closed',
      contact: 'Robert Smith',
      lastActivity: '1 week ago'
    }
  ];

  const activities = [
    {
      id: 1,
      type: 'call',
      subject: 'Follow-up call with Sarah',
      contact: 'Sarah Johnson',
      company: 'TechStartup Inc',
      scheduled: '2024-07-15T10:00:00',
      completed: false
    },
    {
      id: 2,
      type: 'email',
      subject: 'Proposal follow-up',
      contact: 'Mike Chen',
      company: 'RetailCorp',
      scheduled: '2024-07-16T14:00:00',
      completed: false
    },
    {
      id: 3,
      type: 'meeting',
      subject: 'Initial consultation',
      contact: 'Emily Rodriguez',
      company: 'FinancePlus',
      scheduled: '2024-07-18T11:00:00',
      completed: false
    },
    {
      id: 4,
      type: 'task',
      subject: 'Prepare contract',
      contact: 'David Wilson',
      company: 'GrowthCo',
      scheduled: '2024-07-14T09:00:00',
      completed: true
    },
    {
      id: 5,
      type: 'note',
      subject: 'Client requirements',
      contact: 'Jennifer Lee',
      company: 'EcomStore',
      scheduled: '2024-07-13T15:30:00',
      completed: true
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      qualified: 'bg-green-100 text-green-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      nurturing: 'bg-purple-100 text-purple-800',
      converted: 'bg-green-100 text-green-800',
      lost: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewContact(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDealChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewDeal(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newContact.name || !newContact.email) {
      toast.error('Name and email are required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would add to the leads table
      const { data, error } = await supabase
        .from('leads')
        .insert([{
          name: newContact.name,
          email: newContact.email,
          company: newContact.company,
          phone: newContact.phone,
          source: newContact.source,
          notes: newContact.notes,
          status: 'new'
        }])
        .select();
      
      if (error) throw error;
      
      toast.success('Contact added successfully');
      setShowContactForm(false);
      setNewContact({
        name: '',
        email: '',
        company: '',
        phone: '',
        source: '',
        notes: ''
      });
      
      console.log('New contact added:', data);
      
    } catch (error) {
      console.error('Error adding contact:', error);
      toast.error('Failed to add contact');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newDeal.name || !newDeal.client_id || !newDeal.value) {
      toast.error('Name, client, and value are required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would add to the deals table
      const { data, error } = await supabase
        .from('deals')
        .insert([{
          name: newDeal.name,
          client_id: newDeal.client_id,
          value: parseFloat(newDeal.value),
          stage: newDeal.stage,
          probability: parseInt(newDeal.probability),
          close_date: newDeal.close_date,
          description: newDeal.description
        }])
        .select();
      
      if (error) throw error;
      
      toast.success('Deal added successfully');
      setShowAddDealModal(false);
      setNewDeal({
        name: '',
        client_id: '',
        value: '',
        stage: 'prospecting',
        probability: '50',
        close_date: '',
        description: ''
      });
      
      console.log('New deal added:', data);
      
    } catch (error) {
      console.error('Error adding deal:', error);
      toast.error('Failed to add deal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStageColor = (stage: string) => {
    const colors = {
      prospecting: 'bg-blue-100 text-blue-800',
      qualification: 'bg-yellow-100 text-yellow-800',
      proposal: 'bg-purple-100 text-purple-800',
      negotiation: 'bg-orange-100 text-orange-800',
      closed_won: 'bg-green-100 text-green-800',
      closed_lost: 'bg-red-100 text-red-800'
    };
    return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'meeting':
        return <Users className="w-4 h-4" />;
      case 'task':
        return <CheckSquare className="w-4 h-4" />;
      case 'note':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'call':
        return 'bg-blue-100 text-blue-800';
      case 'email':
        return 'bg-green-100 text-green-800';
      case 'meeting':
        return 'bg-purple-100 text-purple-800';
      case 'task':
        return 'bg-orange-100 text-orange-800';
      case 'note':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderLeads = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Lead Management</h3>
        <button className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all">
          <Plus className="w-4 h-4 mr-2" />
          Add Lead
        </button>
      </div>

      <div className="space-y-4">
        {leads.map((lead) => (
          <div key={lead.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-full flex items-center justify-center text-white font-medium">
                  {lead.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{lead.name}</h4>
                  <p className="text-sm text-gray-600">{lead.company}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                {lead.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Email:</span>
                <div className="font-medium text-gray-900">{lead.email}</div>
              </div>
              <div>
                <span className="text-gray-600">Source:</span>
                <div className="font-medium text-gray-900">{lead.source}</div>
              </div>
              <div>
                <span className="text-gray-600">Score:</span>
                <div className="font-medium text-green-600">{lead.score}/100</div>
              </div>
              <div>
                <span className="text-gray-600">Est. Value:</span>
                <div className="font-medium text-gray-900">${lead.estimated_value.toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDeals = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Deal Pipeline</h3>
        <button className="px-4 py-2 bg-gradient-to-r from-beacon-orange to-orange-600 text-white rounded-lg hover:shadow-lg transition-all">
          <Target className="w-4 h-4 mr-2" />
          Add Deal
        </button>
      </div>

      <div className="space-y-4">
        {deals.map((deal) => (
          <div key={deal.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900">{deal.name}</h4>
                <p className="text-sm text-gray-600">{deal.client}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(deal.stage)}`}>
                {deal.stage}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Value:</span>
                <div className="font-medium text-gray-900">${deal.value.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-600">Probability:</span>
                <div className="font-medium text-blue-600">{deal.probability}%</div>
              </div>
              <div>
                <span className="text-gray-600">Close Date:</span>
                <div className="font-medium text-gray-900">{deal.close_date}</div>
              </div>
              <div>
                <span className="text-gray-600">Expected:</span>
                <div className="font-medium text-green-600">
                  ${Math.round(deal.value * (deal.probability / 100)).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPipeline = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Deal Pipeline</h3>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search deals..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
            />
          </div>
          <button 
            onClick={() => setShowAddDealModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Deal
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex space-x-4 min-w-max">
          {pipelineStages.map(stage => {
            const stageDeals = pipelineDeals.filter(deal => deal.stage === stage.id);
            const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
            
            return (
              <div key={stage.id} className="w-80 flex-shrink-0">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                      <h4 className="font-medium text-gray-900">{stage.name}</h4>
                    </div>
                    <div className="text-sm text-gray-600">{stageDeals.length} deals</div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-4">
                    Value: ${stageValue.toLocaleString()}
                  </div>
                  
                  <div className="space-y-3">
                    {stageDeals.map(deal => (
                      <div key={deal.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100 cursor-pointer hover:shadow-sm transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900 text-sm">{deal.name}</h5>
                          <button 
                            onClick={() => toast.success(`Deal options for ${deal.name}`)}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-xs text-gray-600 mb-2">{deal.company}</div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-green-600">${deal.value.toLocaleString()}</span>
                          <span className="text-gray-500">{deal.lastActivity}</span>
                        </div>
                      </div>
                    ))}
                    
                    <button className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg border border-dashed border-gray-300 transition-colors">
                      <Plus 
                        onClick={() => {
                          setNewDeal(prev => ({ ...prev, stage: stage.id }));
                          setShowAddDealModal(true);
                        }}
                        className="w-4 h-4 mx-auto" 
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderContacts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Contacts</h3>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search contacts..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
            />
          </div>
          <button 
            onClick={() => setShowContactForm(true)}
            className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </button>
        </div>
      </div>
              <input
      {/* Contact Form */}
      {showContactForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Add New Contact</h4>
            <button 
              onClick={() => setShowContactForm(false)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={newContact.name}
                name="name"
                onChange={handleContactChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                placeholder="Full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={newContact.email}
                name="email"
                onChange={handleContactChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                placeholder="Email address"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <input
                type="text"
                value={newContact.company}
                name="company"
                onChange={handleContactChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                placeholder="Company name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={newContact.phone}
                name="phone"
                onChange={handleContactChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                placeholder="Phone number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
              <select
                value={newContact.source}
                name="source"
                onChange={handleContactChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
              >
                <option value="">Select source</option>
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Google">Google</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Facebook">Facebook</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={newContact.notes}
              name="notes"
              onChange={handleContactChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
              placeholder="Add notes about this contact"
              rows={3}
            ></textarea>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowContactForm(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddContact}
              disabled={isSubmitting}
              className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
            >
              {isSubmitting ? 'Saving...' : 'Save Contact'}
            </button>
          </div>
        </div>
      )}
      
      {/* Add Deal Modal */}
      {showAddDealModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Deal</h3>
            
            <form onSubmit={handleAddDeal}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deal Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={newDeal.name}
                    onChange={handleDealChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client *</label>
                  <select
                    name="client_id"
                    value={newDeal.client_id}
                    onChange={handleDealChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                    required
                  >
                    <option value="">Select client</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value *</label>
                  <input
                    type="number"
                    name="value"
                    value={newDeal.value}
                    onChange={handleDealChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                  <select
                    name="stage"
                    value={newDeal.stage}
                    onChange={handleDealChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  >
                    <option value="prospecting">Prospecting</option>
                    <option value="qualification">Qualification</option>
                    <option value="proposal">Proposal</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="closed_won">Closed Won</option>
                    <option value="closed_lost">Closed Lost</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Probability (%)</label>
                  <input
                    type="number"
                    name="probability"
                    value={newDeal.probability}
                    onChange={handleDealChange}
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Close Date</label>
                  <input
                    type="date"
                    name="close_date"
                    value={newDeal.close_date}
                    onChange={handleDealChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={newDeal.description}
                    onChange={handleDealChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                    rows={3}
                  ></textarea>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddDealModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding...' : 'Add Deal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contacts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Company</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Source</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-full flex items-center justify-center text-white font-medium">
                        {lead.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900">{lead.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{lead.email}</td>
                  <td className="px-4 py-3 text-gray-600">{lead.company}</td>
                  <td className="px-4 py-3 text-gray-600">+1 (555) 123-4567</td>
                  <td className="px-4 py-3 text-gray-600">{lead.source}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => toast.success(`Edit ${lead.name}`)}
                        className="p-1 text-gray-400 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => toast.success(`Delete ${lead.name}`)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderActivities = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Activities</h3>
        <div className="flex space-x-2">
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent">
            <option value="all">All Types</option>
            <option value="call">Calls</option>
            <option value="email">Emails</option>
            <option value="meeting">Meetings</option>
            <option value="task">Tasks</option>
            <option value="note">Notes</option>
          </select>
          <button className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all">
            <Plus className="w-4 h-4 mr-2" />
            Add Activity
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-medium text-gray-900 mb-4">Upcoming Activities</h4>
          
          <div className="space-y-4">
            {activities.filter(a => !a.completed).map(activity => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="font-medium text-gray-900 text-sm">{activity.subject}</h5>
                    <div className="flex items-center space-x-1">
                      <button className="p-1 text-gray-400 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors">
                        <Edit className="w-3 h-3" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-600 rounded-full hover:bg-gray-100 transition-colors">
                        <CheckSquare className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">{activity.contact} • {activity.company}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {new Date(activity.scheduled).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Completed Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-medium text-gray-900 mb-4">Completed Activities</h4>
          
          <div className="space-y-4">
            {activities.filter(a => a.completed).map(activity => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="font-medium text-gray-900 text-sm">{activity.subject}</h5>
                    <div className="flex items-center space-x-1">
                      <button className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100 transition-colors">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">{activity.contact} • {activity.company}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    <CheckSquare className="w-3 h-3 inline mr-1" />
                    Completed on {new Date(activity.scheduled).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'pipeline', label: 'Pipeline', icon: Target },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'activities', label: 'Activities', icon: Calendar }
  ];

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">CRM Hub</h2>
        <p className="text-gray-600">Manage leads, deals, and customer relationships</p>
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
        {activeTab === 'pipeline' && renderPipeline()}
        {activeTab === 'contacts' && renderContacts()}
        {activeTab === 'leads' && renderLeads()}
        {activeTab === 'activities' && renderActivities()}
      </div>
    </div>
  );
};

export default CRMHub;