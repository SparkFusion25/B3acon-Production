import React, { useState } from 'react';
import { MessageCircle, Phone, Mail, HelpCircle, Send, Paperclip, Clock, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const ClientSupport: React.FC = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  const [activeTicket, setActiveTicket] = useState<any | null>(null);
  const [ticketMessages, setTicketMessages] = useState<any[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [newTicketForm, setNewTicketForm] = useState({
    subject: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent'
  });
  
  // Fetch tickets on component mount
  React.useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);
  
  // Fetch ticket messages when active ticket changes
  React.useEffect(() => {
    if (activeTicket) {
      fetchTicketMessages(activeTicket.id);
    }
  }, [activeTicket]);
  
  const fetchTickets = async () => {
    if (!user) return;
    
    setIsLoadingTickets(true);
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select(`
          id,
          subject,
          description,
          status,
          priority,
          created_at,
          updated_at,
          profiles:created_by(id, name, email)
        `)
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setTickets(data);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to load support tickets');
    } finally {
      setIsLoadingTickets(false);
    }
  };
  
  const fetchTicketMessages = async (ticketId: string) => {
    setIsLoadingMessages(true);
    try {
      const { data, error } = await supabase
        .from('support_messages')
        .select(`
          id,
          message,
          created_at,
          profiles:sender_id(id, name, email)
        `)
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setTicketMessages(data);
      }
    } catch (error) {
      console.error('Error fetching ticket messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoadingMessages(false);
    }
  };
  
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to create a ticket');
      return;
    }
    
    if (!newTicketForm.subject || !newTicketForm.description) {
      toast.error('Subject and description are required');
      return;
    }
    
    try {
      // Insert new ticket
      const { data: ticketData, error: ticketError } = await supabase
        .from('support_tickets')
        .insert({
          subject: newTicketForm.subject,
          description: newTicketForm.description,
          priority: newTicketForm.priority,
          created_by: user.id
        })
        .select()
        .single();
      
      if (ticketError) {
        throw ticketError;
      }
      
      // Insert initial message
      const { error: messageError } = await supabase
        .from('support_messages')
        .insert({
          ticket_id: ticketData.id,
          sender_id: user.id,
          message: newTicketForm.description
        });
      
      if (messageError) {
        throw messageError;
      }
      
      toast.success('Support ticket created successfully');
      setShowNewTicketModal(false);
      setNewTicketForm({
        subject: '',
        description: '',
        priority: 'medium'
      });
      
      // Refresh tickets
      fetchTickets();
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('Failed to create support ticket');
    }
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !activeTicket) {
      toast.error('Unable to send message');
      return;
    }
    
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    setIsSendingMessage(true);
    try {
      const { error } = await supabase
        .from('support_messages')
        .insert({
          ticket_id: activeTicket.id,
          sender_id: user.id,
          message: message.trim()
        });
      
      if (error) {
        throw error;
      }
      
      // Clear message input
      setMessage('');
      
      // Refresh messages
      fetchTicketMessages(activeTicket.id);
      
      // Update ticket status if it was closed
      if (activeTicket.status === 'closed' || activeTicket.status === 'resolved') {
        const { error: updateError } = await supabase
          .from('support_tickets')
          .update({ status: 'open' })
          .eq('id', activeTicket.id);
        
        if (updateError) {
          console.error('Error updating ticket status:', updateError);
        } else {
          // Update local state
          setActiveTicket({ ...activeTicket, status: 'open' });
          setTickets(tickets.map(t => 
            t.id === activeTicket.id ? { ...t, status: 'open' } : t
          ));
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSendingMessage(false);
    }
  };
  
  const handleReopenTicket = async (ticketId: string) => {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ status: 'open' })
        .eq('id', ticketId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setTickets(tickets.map(t => 
        t.id === ticketId ? { ...t, status: 'open' } : t
      ));
      
      if (activeTicket && activeTicket.id === ticketId) {
        setActiveTicket({ ...activeTicket, status: 'open' });
      }
      
      toast.success('Ticket reopened');
    } catch (error) {
      console.error('Error reopening ticket:', error);
      toast.error('Failed to reopen ticket');
    }
  };
  
  const handleStartChat = () => {
    toast.success('Starting live chat session');
  };
  
  const handleCallSupport = () => {
    toast.success('Calling support line');
  };
  
  const handleEmailSupport = () => {
    toast.success('Opening email support');
  };
  
  const handleViewTicket = (ticket: any) => {
    setActiveTicket(ticket);
  };

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
          onClick={() => setShowNewTicketModal(true)}
          >
            support@b3acon.com
          </button>
          <span>Create Ticket</span>
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Create Support Ticket</h4>
              <button 
                onClick={() => setShowNewTicketModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={newTicketForm.subject}
                  onChange={(e) => setNewTicketForm({...newTicketForm, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  placeholder="Brief description of your issue"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newTicketForm.description}
                  onChange={(e) => setNewTicketForm({...newTicketForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  rows={4}
                  placeholder="Please provide details about your issue or question"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={newTicketForm.priority}
                  onChange={(e) => setNewTicketForm({...newTicketForm, priority: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Support Tickets */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Support Tickets</h3>
          <button 
            onClick={() => setShowNewTicketModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Ticket</span>
          </button>
        </div>

        <div className="space-y-4">
          {isLoadingTickets ? (
            <div className="text-center py-8">
              <svg className="animate-spin h-8 w-8 text-gray-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600">Loading support tickets...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No support tickets yet</h4>
              <p className="text-gray-600 mb-4">Create a new ticket to get help from our support team</p>
              <button 
                onClick={() => setShowNewTicketModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
              >
                Create New Ticket
              </button>
            </div>
          ) : (
            tickets.map((ticket) => (
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
                    <span>Ticket ID: {ticket.id.substring(0, 8)}</span>
                    <span className="mx-2">•</span>
                    <span>Created: {new Date(ticket.created_at).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span>Last update: {new Date(ticket.updated_at).toLocaleDateString()}</span>
                  </p>
                </div>
                <button 
                  onClick={() => ticket.status === 'open' || ticket.status === 'in_progress' ? handleViewTicket(ticket) : handleReopenTicket(ticket.id)}
                  className="text-signal-blue hover:text-blue-700 text-sm font-medium"
                >
                  {ticket.status === 'open' || ticket.status === 'in_progress' ? 'View Details' : 'Reopen'}
                </button>
              </div>

              {activeTicket && activeTicket.id === ticket.id && (
                <div className="p-4">
                  {isLoadingMessages ? (
                    <div className="text-center py-4">
                      <svg className="animate-spin h-6 w-6 text-gray-400 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <p className="text-gray-600 text-sm">Loading messages...</p>
                    </div>
                  ) : (
                    <div className="space-y-4 mb-4">
                      {ticketMessages.map((msg) => {
                        const isCurrentUser = msg.profiles.id === user?.id;
                        return (
                          <div key={msg.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-md rounded-lg p-3 ${
                              isCurrentUser 
                                ? 'bg-signal-blue text-white rounded-br-none' 
                                : 'bg-gray-100 text-gray-800 rounded-bl-none'
                            }`}>
                              <p className="text-xs font-medium mb-1">{isCurrentUser ? 'You' : msg.profiles.name}</p>
                              <p className="text-sm">{msg.message}</p>
                              <p className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                                {new Date(msg.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      
                      {ticketMessages.length === 0 && (
                        <div className="text-center py-4">
                          <p className="text-gray-500">No messages yet</p>
                        </div>
                      )}
                    </div>
                  )}

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
                      disabled={isSendingMessage || !message.trim()}
                      className="p-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
                    >
                      {isSendingMessage ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
            ))
          )}
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