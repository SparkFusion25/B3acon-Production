import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Search, 
  Settings, 
  Bell,
  User,
  Store,
  TrendingUp,
  Target,
  Mail,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  ShoppingBag,
  Eye,
  ChevronDown,
  Filter,
  Calendar,
  Download,
  Sparkles,
  Bot,
  MessageSquare,
  Star,
  PenTool,
  Palette,
  PlugZap,
  CreditCard,
  RefreshCw,
  Activity,
  DollarSign,
  ChevronRight,
  ExternalLink,
  Globe,
  Play,
  Pause,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  AlertCircle,
  Clock,
  Menu,
  X,
  Image,
  Facebook,
  Instagram,
  Twitter,
  Calendar,
  Package,
  Copy,
  Upload,
  Send,
  Reply,
  AlertTriangle,
  Bookmark,
  Share,
  Link,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Camera,
  FileText,
  Folder,
  Save,
  RotateCcw,
  Monitor,
  Smartphone,
  Tablet,
  Layers,
  MoreHorizontal,
  Maximize2,
  Minimize2,
  BarChart,
  PieChart,
  LineChart,
  Database,
  Server,
  Cloud,
  Shield,
  Lock,
  Key,
  Code,
  Terminal,
  Cpu,
  HardDrive,
  Network,
  Wifi,
  Bluetooth,
  Phone,
  Video,
  Headphones,
  Mic,
  Speaker,
  VolumeX,
  Volume2,
  Power,
  Battery,
  Sun,
  Moon,
  MapPin,
  Navigation,
  Compass,
  Map,
  Route,
  Car,
  Plane,
  Train,
  Bike,
  Truck,
  Ship,
  Home,
  Building,
  Building2,
  School,
  Hospital,
  Church,
  Store as StoreIcon,
  ShoppingCart,
  CreditCard,
  Wallet,
  Receipt,
  Tag,
  Gift,
  Award,
  Trophy,
  Medal,
  Crown,
  Gem,
  Diamond,
  Scissors,
  PaintBucket,
  Brush,
  Pen,
  Pencil,
  Eraser,
  Ruler,
  Calculator,
  Clipboard,
  FileImage,
  FileVideo,
  FileAudio,
  FilePlus,
  FileMinus,
  FileSearch,
  FileCheck,
  FileX,
  FolderPlus,
  FolderMinus,
  FolderOpen,
  Archive,
  Trash,
  Recycle,
  Inbox,
  Outbox,
  MailOpen,
  MailPlus,
  MailMinus,
  MailCheck,
  MailX,
  Flag,
  Bookmark as BookmarkIcon,
  Hash,
  AtSign,
  Percent,
  DollarSign as DollarSignIcon,
  Euro,
  PoundSterling,
  Yen,
  Bitcoin,
  CreditCard as CreditCardIcon,
  Banknote,
  HandCoins,
  TrendingUp as TrendingUpIcon,
  TrendingDown,
  BarChart2,
  PieChart as PieChartIcon,
  Activity as ActivityIcon,
  Pulse,
  Crosshair,
  MousePointer,
  Move,
  Maximize,
  Minimize,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Star as StarIcon,
  Heart as HeartIcon,
  Smile,
  Meh,
  Frown,
  ThumbsUp as ThumbsUpIcon,
  ThumbsDown as ThumbsDownIcon,
  Handshake,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
  Users as UsersIcon,
  UserCircle,
  Eye as EyeIcon,
  EyeOff,
  Search as SearchIcon,
  Zap as ZapIcon
} from 'lucide-react';

import '../../styles/premium-design-system.css';
import useShopifyData from '../../hooks/useShopifyData';

// Enhanced UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

// Sidebar Components
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

interface MetricData {
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<any>;
  color: string;
  description: string;
}

interface RealtimeMetric {
  label: string;
  value: string;
  change: string;
  color: string;
  icon: React.ComponentType<any>;
}

interface ActivityItem {
  id: string;
  type: 'sale' | 'visitor' | 'review' | 'campaign';
  message: string;
  time: string;
  amount?: string;
}

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'draft';
  type: string;
  performance: {
    views: number;
    clicks: number;
    conversions: number;
    revenue: number;
  };
}

const PremiumShopifyDashboard: React.FC = () => {
  const { metrics, products, orders, keywordRankings, emailCampaigns, shopInfo, isLoading, error, fetchAllData, refreshProducts, refreshOrders, refreshSEO, refreshEmail } = useShopifyData();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedAITool, setSelectedAITool] = useState('popup-generator');
  const [selectedSEOTool, setSelectedSEOTool] = useState('seo-analyzer');
  const [selectedSocialTool, setSelectedSocialTool] = useState('scheduler');
  const [selectedReviewTab, setSelectedReviewTab] = useState('dashboard');

  // Dashboard enhancement data
  const [realtimeMetrics, setRealtimeMetrics] = useState<RealtimeMetric[]>([
    { label: 'Live Visitors', value: '47', change: '+12%', color: 'green', icon: Eye },
    { label: 'Cart Value', value: '$127', change: '+8%', color: 'blue', icon: ShoppingBag },
    { label: 'Conversion', value: '3.4%', change: '+0.3%', color: 'purple', icon: Target },
    { label: 'Revenue/hr', value: '$890', change: '+15%', color: 'emerald', icon: DollarSign }
  ]);

  const [activeCampaigns, setActiveCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Black Friday Early Bird',
      status: 'active',
      type: 'Popup Campaign',
      performance: { views: 15420, clicks: 2340, conversions: 187, revenue: 12450 }
    },
    {
      id: '2', 
      name: 'Abandoned Cart Recovery',
      status: 'active',
      type: 'Email Series',
      performance: { views: 8760, clicks: 1240, conversions: 94, revenue: 7830 }
    },
    {
      id: '3',
      name: 'First-Time Visitor Welcome',
      status: 'paused',
      type: 'AI Chat',
      performance: { views: 12340, clicks: 890, conversions: 67, revenue: 4290 }
    }
  ]);

  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([
    { id: '1', type: 'sale', message: 'New order #3847 from Sarah M.', time: '2 min ago', amount: '$127.50' },
    { id: '2', type: 'visitor', message: '12 new visitors from Google Ads', time: '5 min ago' },
    { id: '3', type: 'review', message: 'New 5-star review for Wireless Headphones', time: '8 min ago' },
    { id: '4', type: 'campaign', message: 'AI Popup generated 3 new leads', time: '12 min ago' },
    { id: '5', type: 'sale', message: 'Bulk order #3846 from TechCorp Inc.', time: '15 min ago', amount: '$2,340.00' }
  ]);

  // ... rest of the component code will continue with the proper sidebar structure
}