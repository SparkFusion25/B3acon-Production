export const mockAgencyData = {
  overview: {
    totalClients: 47,
    monthlyRevenue: 245000,
    activeProjects: 89,
    teamUtilization: 82,
    clientGrowth: 12.5,
    revenueGrowth: 18.5,
    recentActivity: [
      {
        type: 'client',
        description: 'New client TechCorp Solutions onboarded',
        timestamp: '2 hours ago'
      },
      {
        type: 'project',
        description: 'SEO audit completed for RetailMax',
        timestamp: '4 hours ago'
      },
      {
        type: 'billing',
        description: 'Invoice #2024-045 paid by FinanceFlow',
        timestamp: '6 hours ago'
      },
      {
        type: 'team',
        description: 'Sarah Johnson assigned to new Amazon project',
        timestamp: '8 hours ago'
      },
      {
        type: 'client',
        description: 'Client meeting scheduled with EcomStore',
        timestamp: '1 day ago'
      }
    ],
    alerts: [
      {
        priority: 'high' as const,
        title: 'Overdue Invoice',
        message: 'Invoice #2024-042 is 15 days overdue from DataCorp',
        timestamp: '1 hour ago'
      },
      {
        priority: 'medium' as const,
        title: 'Project Deadline',
        message: 'PPC campaign launch due tomorrow for TechStart',
        timestamp: '3 hours ago'
      },
      {
        priority: 'low' as const,
        title: 'Team Update',
        message: 'Monthly team performance review completed',
        timestamp: '1 day ago'
      }
    ]
  },
  clients: [
    {
      id: '1',
      name: 'TechCorp Solutions',
      email: 'contact@techcorp.com',
      logo: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
      website: 'https://techcorp.com',
      industry: 'Technology',
      subscription: 'enterprise' as const,
      monthlyValue: 8500,
      status: 'active' as const,
      services: ['SEO', 'Social Media', 'PPC', 'Amazon', 'CRM'],
      lastActivity: '2 hours ago',
      joinDate: '2023-06-15'
    },
    {
      id: '2',
      name: 'RetailMax Inc',
      email: 'hello@retailmax.com',
      logo: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
      website: 'https://retailmax.com',
      industry: 'Retail',
      subscription: 'professional' as const,
      monthlyValue: 4200,
      status: 'active' as const,
      services: ['SEO', 'PPC', 'Social Media'],
      lastActivity: '1 day ago',
      joinDate: '2023-08-22'
    },
    {
      id: '3',
      name: 'FinanceFlow',
      email: 'team@financeflow.com',
      logo: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
      website: 'https://financeflow.com',
      industry: 'Finance',
      subscription: 'professional' as const,
      monthlyValue: 3800,
      status: 'active' as const,
      services: ['SEO', 'CRM'],
      lastActivity: '3 days ago',
      joinDate: '2023-09-10'
    },
    {
      id: '4',
      name: 'EcomStore',
      email: 'support@ecomstore.com',
      logo: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
      website: 'https://ecomstore.com',
      industry: 'E-commerce',
      subscription: 'professional' as const,
      monthlyValue: 5200,
      status: 'active' as const,
      services: ['Amazon', 'PPC', 'Social Media'],
      lastActivity: '5 hours ago',
      joinDate: '2023-07-03'
    }
  ],
  team: [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@sparkdigital.com',
      role: 'admin' as const,
      department: 'Management',
      avatar: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
      phone: '+1 (555) 123-4567',
      joinDate: '2022-01-15',
      status: 'active' as const,
      skills: ['Leadership', 'Strategy', 'Client Relations'],
      clientsAssigned: 12,
      projectsActive: 8,
      performance: 95
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike@sparkdigital.com',
      role: 'manager' as const,
      department: 'SEO',
      avatar: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
      phone: '+1 (555) 234-5678',
      joinDate: '2022-03-20',
      status: 'active' as const,
      skills: ['SEO', 'Analytics', 'Content Strategy'],
      clientsAssigned: 8,
      projectsActive: 6,
      performance: 92
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily@sparkdigital.com',
      role: 'specialist' as const,
      department: 'PPC',
      avatar: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
      phone: '+1 (555) 345-6789',
      joinDate: '2022-05-10',
      status: 'active' as const,
      skills: ['Google Ads', 'Facebook Ads', 'Analytics'],
      clientsAssigned: 6,
      projectsActive: 4,
      performance: 88
    },
    {
      id: '4',
      name: 'David Wilson',
      email: 'david@sparkdigital.com',
      role: 'specialist' as const,
      department: 'Social',
      avatar: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
      phone: '+1 (555) 456-7890',
      joinDate: '2022-07-01',
      status: 'active' as const,
      skills: ['Social Media', 'Content Creation', 'Community Management'],
      clientsAssigned: 5,
      projectsActive: 7,
      performance: 90
    }
  ],
  billing: {
    monthlyRevenue: 245000,
    outstandingAmount: 32500,
    paidInvoices: 28,
    pendingInvoices: 6,
    recentInvoices: [
      {
        id: '2024-045',
        clientName: 'TechCorp Solutions',
        amount: 8500,
        status: 'paid' as const,
        dueDate: '2024-01-15',
        issueDate: '2024-01-01',
        services: ['SEO', 'PPC', 'Social Media']
      },
      {
        id: '2024-046',
        clientName: 'RetailMax Inc',
        amount: 4200,
        status: 'pending' as const,
        dueDate: '2024-01-20',
        issueDate: '2024-01-05',
        services: ['SEO', 'PPC']
      },
      {
        id: '2024-047',
        clientName: 'FinanceFlow',
        amount: 3800,
        status: 'overdue' as const,
        dueDate: '2024-01-10',
        issueDate: '2023-12-25',
        services: ['SEO', 'CRM']
      },
      {
        id: '2024-048',
        clientName: 'EcomStore',
        amount: 5200,
        status: 'draft' as const,
        dueDate: '2024-01-25',
        issueDate: '2024-01-10',
        services: ['Amazon', 'PPC', 'Social Media']
      }
    ]
  },
  analytics: {
    totalClients: 47,
    activeProjects: 89,
    monthlyRevenue: 245000,
    teamUtilization: 82,
    clientSatisfaction: 94,
    projectCompletionRate: 87,
    revenueGrowth: 18.5,
    clientRetention: 96
  },
  leads: [],
  affiliates: [],
  emailCampaigns: [],
  landingPages: []
};