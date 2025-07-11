import React, { useState } from 'react';
import { MessageCircle, Phone, Mail, HelpCircle, Send, Paperclip, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ClientSupport: React.FC = () => {
  const [message, setMessage] = useState('');
  
  const handleStartChat = () => {
    toast.success('Starting live chat session');
  };
  
  const handleCallSupport = () => {
    toast.success('Calling support line');
  };
  
  const handleEmailSupport = () => {
    toast.success('Opening email support');
  };
  
  const handleCreateTicket = () => {
    toast.success('Creating new support ticket');
  };
  
  const handleViewTicket = (ticketId: string) => {
    toast.success(`Viewing ticket ${ticketId}`);
  };
  
  const handleReopenTicket = (ticketId: string) => {
    toast.success(`Reopening ticket ${ticketId}`);
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      toast.success('Message sent');
      setMessage('');
    } else {
      toast.error('Please enter a message');
    }
  };

  const supportTickets = [
    {
      id: 'TKT-2024-001',
      subject: 'Question about SEO report',
      status: 'open',
      priority: 'medium',
      created: '2024-01-18',
      lastUpdate: '2024-01-19',
      messages: [
        {
          sender: 'You',
          message: 'I have a question about the latest SEO report. Can you explain why our ranking dropped for the keyword "digital marketing services"?',
          time: '2024-01-18 14:32'
        },
        {
          sender: 'Sarah Johnson',
          message: 'Hi there! I\'ve looked into this and it appears there was a Google algorithm update that affected rankings in your industry. We\'re already working on adjustments to recover the position. I\'ll send you a detailed analysis by tomorrow.',
          time: '2024-01-19 09:15'
        }
      ]
    },
    {
      id: 'TKT-2023-042',
      subject: 'Social media campaign approval',
      status: 'closed',
      priority: 'high',
      created: '2023-12-10',
      lastUpdate: '2023-12-12',
      messages: [
        {
          sender: 'You',
          message: 'We need to get approval for the holiday social media campaign as soon as possible.',
          time: '2023-12-10 11:20'
        },
        {
          sender: 'Mike Chen',
          message: 'I\'ve reviewed the campaign and it looks great! Approved and scheduled for posting.',
          time: '2023-12-12 14:45'
        }
      ]
    }
  ];

  const faqItems = [
    {
      question: 'How often will I receive performance reports?',
      answer: 'Performance reports are delivered monthly by default. However, you can request weekly reports or real-time dashboard access depending on your subscription plan.'
    },
    {
      question: 'How do I request changes to my campaigns?',
      answer: 'You can request changes by opening a support ticket, emailing your account manager directly, or discussing during your regular strategy calls.'
    },
    {
      question: 'What\'s included in my current plan?',
      answer: 'Your Professional plan includes SEO optimization, PPC management, social media management across 4 platforms, content marketing, weekly performance reports, and priority support.'
    },
    {
      question: 'How can I upgrade my subscription?',
      answer: 'You can upgrade your subscription at any time by going to the Billing section and selecting "Change Plan" under your current subscription details.'
    }
  ];

  const getStatusColor = (status: string) => {
    return status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': 'bg-blue-100 text-blue-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Help & Support</h2>
        <p className="text-gray-600">Get assistance with your marketing services</p>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-signal-blue to-blue-600 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Live Chat</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Chat with our support team in real-time</p>
          <button 
            onClick={handleStartChat}
            className="w-full py-2 bg-gradient-to-r from-signal-blue to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            Start Chat
          </button>
          <p className="text-xs text-gray-500 mt-2 text-center">Available Mon-Fri, 9am-6pm EST</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-beacon-orange to-orange-600 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Phone Support</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Call our dedicated support line</p>
          <button 
            onClick={handleCallSupport}
            className="w-full py-2 bg-gradient-to-r from-beacon-orange to-orange-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            +1 (555) 123-4567
          </button>
          <p className="text-xs text-gray-500 mt-2 text-center">Available Mon-Fri, 9am-6pm EST</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Email Support</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Send us an email anytime</p>
          <button 
            onClick={handleEmailSupport}
            className="w-full py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
          >
            support@b3acon.com
          </button>
          <p className="text-xs text-gray-500 mt-2 text-center">24-hour response time</p>
        </div>
      </div>

      {/* Support Tickets */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Support Tickets</h3>
          <button 
            onClick={handleCreateTicket}
            className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Ticket</span>
          </button>
        </div>

        <div className="space-y-4">
          {supportTickets.map((ticket) => (
            <div key={ticket.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">{ticket.subject}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority} priority
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    <span>Ticket ID: {ticket.id}</span>
                    <span className="mx-2">•</span>
                    <span>Created: {ticket.created}</span>
                    <span className="mx-2">•</span>
                    <span>Last update: {ticket.lastUpdate}</span>
                  </p>
                </div>
                <button 
                  onClick={() => ticket.status === 'open' ? handleViewTicket(ticket.id) : handleReopenTicket(ticket.id)}
                  className="text-signal-blue hover:text-blue-700 text-sm font-medium"
                >
                  {ticket.status === 'open' ? 'View Details' : 'Reopen'}
                </button>
              </div>

              {ticket.status === 'open' && (
                <div className="p-4">
                  <div className="space-y-4 mb-4">
                    {ticket.messages.map((msg, index) => (
                      <div key={index} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-md rounded-lg p-3 ${
                          msg.sender === 'You' 
                            ? 'bg-signal-blue text-white rounded-br-none' 
                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                        }`}>
                          <p className="text-xs font-medium mb-1">{msg.sender}</p>
                          <p className="text-sm">{msg.message}</p>
                          <p className={`text-xs mt-1 ${msg.sender === 'You' ? 'text-blue-100' : 'text-gray-500'}`}>
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your reply..."
                        className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                      />
                      <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <Paperclip className="w-5 h-5" />
                      </button>
                    </div>
                    <button 
                      type="submit"
                      className="p-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-lg flex items-center justify-center">
            <HelpCircle className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">{item.question}</h4>
              <p className="text-sm text-gray-600">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientSupport;