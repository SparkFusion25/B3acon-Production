export interface DashboardStats {
  totalClients: number;
  activeProjects: number;
  monthlyRevenue: number;
  growthRate: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  logo?: string;
  website?: string;
  industry?: string;
  subscription: 'starter' | 'professional' | 'enterprise';
  monthlyValue: number;
  status: 'active' | 'inactive' | 'pending';
  services: string[];
  lastActivity: string;
  joinDate: string;
}