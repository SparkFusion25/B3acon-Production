export interface AgencyOverviewData {
  totalClients: number;
  monthlyRevenue: number;
  activeProjects: number;
  teamUtilization: number;
  clientGrowth: number;
  revenueGrowth: number;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
  }>;
  alerts: Array<{
    priority: 'high' | 'medium' | 'low';
    title: string;
    message: string;
    timestamp: string;
  }>;
}