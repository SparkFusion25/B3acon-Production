import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  User, 
  Building, 
  Calendar, 
  MessageSquare, 
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  BarChart3,
  TrendingUp,
  Users,
  MessageCircle,
  Plus,
  Download,
  Archive,
  Flag,
  Tag,
  X,
  Save
} from 'lucide-react';
import { ContactSubmission, FAQItem, FAQCategory } from '../../../types/blog';
import { toast } from 'react-hot-toast';

const ContactManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'submissions' | 'faqs' | 'analytics'>('submissions');
  const [selectedSubmissions, setSelectedSubmissions] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  // Mock data for contact submissions
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      company: 'TechStart Inc.',
      phone: '+1 (555) 123-4567',
      subject: 'Enterprise Plan Inquiry',
      message: 'Hi, I\'m interested in learning more about your Enterprise plan features. We\'re a growing e-commerce business with 5 Shopify stores and need advanced analytics and reporting capabilities. Could we schedule a demo to discuss pricing and implementation?',
      type: 'sales',
      status: 'new',
      priority: 'high',
      assignedTo: 'John Smith',
      notes: 'Followed up via email. Scheduled demo for next Tuesday.',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T14:30:00Z'
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike@shopify-store.com',
      company: 'Trendy Fashion',
      phone: '+1 (555) 987-6543',
      subject: 'SEO Analysis Feature Questions',
      message: 'I\'m currently using the Professional plan and have some questions about the SEO analysis feature. The keyword tracking seems to be missing some important keywords for my fashion niche. Is there a way to add custom keywords or adjust the tracking frequency?',
      type: 'support',
      status: 'replied',
      priority: 'medium',
      assignedTo: 'Emma Davis',
      notes: 'Provided documentation on custom keyword tracking. Customer satisfied with response.',
      createdAt: '2024-01-14T09:15:00Z',
      updatedAt: '2024-01-14T16:45:00Z'
    },
    {
      id: '3',
      name: 'Lisa Rodriguez',
      email: 'lisa.rodriguez@agency.com',
      company: 'Digital Marketing Pro',
      phone: '+1 (555) 456-7890',
      subject: 'White Label Partnership Opportunity',
      message: 'We\'re a digital marketing agency serving 50+ e-commerce clients. We\'re interested in exploring a white-label partnership to offer B3ACON\'s tools under our brand. What are the requirements and pricing structure for white-label solutions?',
      type: 'partnership',
      status: 'new',
      priority: 'high',
      assignedTo: undefined,
      notes: undefined,
      createdAt: '2024-01-13T14:20:00Z',
      updatedAt: '2024-01-13T14:20:00Z'
    },
    {
      id: '4',
      name: 'David Thompson',
      email: 'david@amazonseller.com',
      company: 'Amazon FBA Success',
      phone: '+1 (555) 234-5678',
      subject: 'Demo Request - Amazon Optimization Tools',
      message: 'I saw your Amazon optimization features and would like to see a demo. We sell health supplements on Amazon and are looking for better keyword research and listing optimization tools. When would be a good time for a 30-minute demo?',
      type: 'demo',
      status: 'resolved',
      priority: 'medium',
      assignedTo: 'Alex Johnson',
      notes: 'Demo completed. Customer signed up for Professional plan.',
      createdAt: '2024-01-12T11:45:00Z',
      updatedAt: '2024-01-12T17:30:00Z'
    },
    {
      id: '5',
      name: 'Emily Wilson',
      email: 'emily.wilson@startup.com',
      company: 'Green Beauty Co.',
      phone: undefined,
      subject: 'Billing Issue - Subscription Not Activated',
      message: 'I signed up for the Professional plan yesterday and made the payment, but my account still shows as Free plan. I can\'t access the advanced features I need for my Shopify store. Please help resolve this billing issue as soon as possible.',
      type: 'support',
      status: 'new',
      priority: 'urgent',
      assignedTo: 'Support Team',
      notes: undefined,
      createdAt: '2024-01-11T16:10:00Z',
      updatedAt: '2024-01-11T16:10:00Z'
    }
  ]);

  const submissionStats = {
    total: submissions.length,
    new: submissions.filter(s => s.status === 'new').length,
    replied: submissions.filter(s => s.status === 'replied').length,
    resolved: submissions.filter(s => s.status === 'resolved').length,
    avgResponseTime: '2.3 hours',
    satisfactionRate: 94
  };

  const submissionsByType = [
    { type: 'support', count: submissions.filter(s => s.type === 'support').length },
    { type: 'sales', count: submissions.filter(s => s.type === 'sales').length },
    { type: 'demo', count: submissions.filter(s => s.type === 'demo').length },
    { type: 'partnership', count: submissions.filter(s => s.type === 'partnership').length },
    { type: 'general', count: submissions.filter(s => s.type === 'general').length }
  ];

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = !searchQuery || 
      submission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.company?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !statusFilter || submission.status === statusFilter;
    const matchesType = !typeFilter || submission.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleBulkAction = (action: string) => {
    if (selectedSubmissions.size === 0) {
      toast.error('Please select submissions first');
      return;
    }

    switch (action) {
      case 'mark-resolved':
        setSubmissions(submissions.map(s => 
          selectedSubmissions.has(s.id) ? { ...s, status: 'resolved' as const } : s
        ));
        toast.success(`${selectedSubmissions.size} submissions marked as resolved`);
        break;
      case 'assign':
        // In a real app, this would open an assignment modal
        toast.success(`${selectedSubmissions.size} submissions assigned`);
        break;
      case 'archive':
        setSubmissions(submissions.filter(s => !selectedSubmissions.has(s.id)));
        toast.success(`${selectedSubmissions.size} submissions archived`);
        break;
      case 'export':
        // In a real app, this would export the data
        toast.success(`${selectedSubmissions.size} submissions exported`);
        break;
    }
    setSelectedSubmissions(new Set());
  };

  const updateSubmissionStatus = (id: string, status: ContactSubmission['status']) => {
    setSubmissions(submissions.map(s => 
      s.id === id ? { ...s, status, updatedAt: new Date().toISOString() } : s
    ));
    toast.success('Status updated successfully');
  };

  const updateSubmissionPriority = (id: string, priority: ContactSubmission['priority']) => {
    setSubmissions(submissions.map(s => 
      s.id === id ? { ...s, priority, updatedAt: new Date().toISOString() } : s
    ));
    toast.success('Priority updated successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'replied': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sales': return Star;
      case 'support': return MessageCircle;
      case 'demo': return Eye;
      case 'partnership': return Users;
      default: return MessageSquare;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contact Management</h1>
            <p className="text-gray-600 mt-1">Manage contact submissions, FAQs, and customer communications</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2 inline" />
              Export
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all duration-200">
              <Plus className="w-4 h-4 mr-2 inline" />
              New Contact
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'submissions', label: 'Submissions', icon: Mail, count: submissions.length },
              { id: 'faqs', label: 'FAQ Management', icon: MessageSquare, count: 45 },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contact Submissions Tab */}
      {activeTab === 'submissions' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                  <p className="text-3xl font-bold text-gray-900">{submissionStats.total}</p>
                </div>
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New Messages</p>
                  <p className="text-3xl font-bold text-gray-900">{submissionStats.new}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                  <p className="text-3xl font-bold text-gray-900">{submissionStats.avgResponseTime}</p>
                </div>
                <Clock className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Satisfaction Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{submissionStats.satisfactionRate}%</p>
                </div>
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search submissions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="new">New</option>
                  <option value="replied">Replied</option>
                  <option value="resolved">Resolved</option>
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="sales">Sales</option>
                  <option value="support">Support</option>
                  <option value="demo">Demo</option>
                  <option value="partnership">Partnership</option>
                  <option value="general">General</option>
                </select>
              </div>

              {selectedSubmissions.size > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {selectedSubmissions.size} selected
                  </span>
                  <button
                    onClick={() => handleBulkAction('mark-resolved')}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Mark Resolved
                  </button>
                  <button
                    onClick={() => handleBulkAction('archive')}
                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                  >
                    Archive
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submissions List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSubmissions(new Set(filteredSubmissions.map(s => s.id)));
                          } else {
                            setSelectedSubmissions(new Set());
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject & Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSubmissions.map((submission) => {
                    const TypeIcon = getTypeIcon(submission.type);
                    return (
                      <tr key={submission.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedSubmissions.has(submission.id)}
                            onChange={(e) => {
                              const newSelected = new Set(selectedSubmissions);
                              if (e.target.checked) {
                                newSelected.add(submission.id);
                              } else {
                                newSelected.delete(submission.id);
                              }
                              setSelectedSubmissions(newSelected);
                            }}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-full flex items-center justify-center text-white font-medium mr-3">
                              {submission.name.charAt(0)}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{submission.name}</div>
                              <div className="text-sm text-gray-500">{submission.email}</div>
                              {submission.company && (
                                <div className="text-xs text-gray-400">{submission.company}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <TypeIcon className="w-4 h-4 text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{submission.subject}</div>
                              <div className="text-xs text-gray-500 capitalize">{submission.type}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={submission.status}
                            onChange={(e) => updateSubmissionStatus(submission.id, e.target.value as any)}
                            className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${getStatusColor(submission.status)}`}
                          >
                            <option value="new">New</option>
                            <option value="replied">Replied</option>
                            <option value="resolved">Resolved</option>
                            <option value="archived">Archived</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={submission.priority}
                            onChange={(e) => updateSubmissionPriority(submission.id, e.target.value as any)}
                            className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${getPriorityColor(submission.priority)}`}
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {submission.assignedTo || 'Unassigned'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(submission.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => {
                                setSelectedSubmission(submission);
                                setShowSubmissionModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Submissions by Type */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Submissions by Type</h3>
              <div className="space-y-4">
                {submissionsByType.map((item) => (
                  <div key={item.type} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{item.type}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(item.count / submissionStats.total) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8 text-right">
                        {item.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Response Time Trends */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Time Trends</h3>
              <div className="space-y-4">
                {[
                  { period: 'Last 7 days', time: '1.8 hours', change: '+12%' },
                  { period: 'Last 30 days', time: '2.3 hours', change: '-5%' },
                  { period: 'Last 90 days', time: '2.7 hours', change: '+8%' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.period}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">{item.time}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.change.startsWith('+') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {item.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submission Detail Modal */}
      {showSubmissionModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Contact Submission Details</h3>
              <button
                onClick={() => setShowSubmissionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <p className="text-sm text-gray-900">{selectedSubmission.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-sm text-gray-900">{selectedSubmission.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <p className="text-sm text-gray-900">{selectedSubmission.company || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <p className="text-sm text-gray-900">{selectedSubmission.phone || 'N/A'}</p>
                </div>
              </div>

              {/* Subject and Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <p className="text-sm text-gray-900">{selectedSubmission.subject}</p>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-900 leading-relaxed">{selectedSubmission.message}</p>
                </div>
              </div>

              {/* Status and Priority */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedSubmission.status)}`}>
                    {selectedSubmission.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedSubmission.priority)}`}>
                    {selectedSubmission.priority}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                    {selectedSubmission.type}
                  </span>
                </div>
              </div>

              {/* Notes */}
              {selectedSubmission.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes</label>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-gray-900">{selectedSubmission.notes}</p>
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <span className="font-medium">Created:</span> {formatDate(selectedSubmission.createdAt)}
                </div>
                <div>
                  <span className="font-medium">Last Updated:</span> {formatDate(selectedSubmission.updatedAt)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowSubmissionModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Reply
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Mark Resolved
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactManagement;