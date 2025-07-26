import { useState } from "react";
import { BarChart3, Bot, Building2, CreditCard, Globe, HeadphonesIcon, Home, MessageSquare, Settings, Star, Users, Zap, ChevronDown, ChevronRight, LogOut, User, Puzzle, Search, Mail, PenTool, ShoppingBag, TrendingUp, Palette, PlugZap } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface AppSidebarProps {
  userRole?: "admin" | "user";
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export function AppSidebar({ userRole = "user", activeTab, setActiveTab }: AppSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["main", "plugins"]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId) 
        : [...prev, groupId]
    );
  };

  // Check if we're in the Shopify dashboard and should use internal navigation
  const isShopifyDashboard = currentPath.includes('/shopify/dashboard');

  const isActive = (path: string, tabId?: string) => {
    if (isShopifyDashboard && tabId && activeTab) {
      return activeTab === tabId;
    }
    return currentPath === path;
  };

  const handleNavigation = (path: string, tabId?: string) => {
    if (isShopifyDashboard && tabId && setActiveTab) {
      setActiveTab(tabId);
    } else {
      window.location.href = path;
    }
  };

  // User Dashboard Navigation for Shopify Dashboard
  const shopifyNavigation = [
    {
      id: "main",
      label: "Main",
      items: [
        { title: "Overview", tabId: "overview", icon: Home },
        { title: "Premium Widgets", tabId: "widgets", icon: Zap },
        { title: "Analytics", tabId: "analytics", icon: BarChart3 },
        { title: "Marketplace", tabId: "marketplace", icon: MessageSquare },
        { title: "Settings", tabId: "settings", icon: Settings },
      ]
    },
    {
      id: "plugins",
      label: "Plugins & Tools",
      items: [
        { title: "AI Tools", tabId: "ai-tools", icon: Bot },
        { title: "SEO Tools", tabId: "seo-tools", icon: Search },
        { title: "Social Media", tabId: "social-media", icon: MessageSquare },
        { title: "Email Marketing", tabId: "email-marketing", icon: Mail },
        { title: "Content Creation", tabId: "content-creation", icon: PenTool },
      ]
    },
    {
      id: "tools",
      label: "Advanced Tools",
      items: [
        { title: "Product Research", tabId: "product-research", icon: ShoppingBag },
        { title: "Creative Studio", tabId: "creative-studio", icon: Palette },
        { title: "Integrations", tabId: "integrations", icon: PlugZap },
        { title: "Team Management", tabId: "team-management", icon: Users },
        { title: "Billing", tabId: "billing-plans", icon: CreditCard },
      ]
    }
  ];

  // Regular navigation for other pages
  const regularNavigation = [
    {
      id: "main",
      label: "Main",
      items: [
        { title: "Overview", url: "/dashboard", icon: Home },
        { title: "My Widgets", url: "/dashboard/widgets", icon: Bot },
        { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
        { title: "Reviews", url: "/dashboard/reviews", icon: MessageSquare },
      ]
    },
    {
      id: "plugins",
      label: "Plugins & Widgets",
      items: [
        { title: "Browse Plugins", url: "/plugins", icon: Puzzle },
        { title: "AI Tools", url: "/ai-tools", icon: Bot },
        { title: "SEO Tools", url: "/seo-tools", icon: Globe },
        { title: "Social Media", url: "/social-media", icon: MessageSquare },
        { title: "Review Management", url: "/review-management", icon: Star },
      ]
    },
    {
      id: "tools",
      label: "Tools",
      items: [
        { title: "Connected Shops", url: "/dashboard/shops", icon: Building2 },
        { title: "Billing", url: "/dashboard/billing", icon: CreditCard },
        { title: "Settings", url: "/dashboard/settings", icon: Settings },
      ]
    }
  ];

  const navigation = isShopifyDashboard ? shopifyNavigation : regularNavigation;

  return (
    <Sidebar className="border-sidebar-border bg-sidebar">
      <SidebarHeader className="border-b border-sidebar-border p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            <span className="text-xs sm:text-sm font-bold text-white">B3</span>
          </div>
          {state === "expanded" && (
            <div>
              <h2 className="text-base sm:text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">B3ACON</h2>
              <p className="text-xs text-sidebar-foreground/60">
                {userRole === "admin" ? "Admin Dashboard" : "Marketing Platform"}
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        {navigation.map((group) => (
          <SidebarGroup key={group.id}>
            {state === "expanded" && (
              <Collapsible
                open={expandedGroups.includes(group.id)}
                onOpenChange={() => toggleGroup(group.id)}
              >
                <CollapsibleTrigger asChild>
                  <SidebarGroupLabel className="flex items-center justify-between hover:bg-sidebar-accent hover:text-sidebar-accent-foreground min-h-[44px] py-2">
                    <span className="text-sm sm:text-base">{group.label}</span>
                    {expandedGroups.includes(group.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </SidebarGroupLabel>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            onClick={() => handleNavigation(item.url || '#', item.tabId)}
                            className={`w-full min-h-[44px] py-2 ${
                              isActive(item.url || '#', item.tabId)
                                ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-glow'
                                : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                            }`}
                          >
                            <item.icon className="h-4 w-4 flex-shrink-0" />
                            <span className="text-sm sm:text-base truncate">{item.title}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </Collapsible>
            )}
            {state === "collapsed" && (
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => handleNavigation(item.url || '#', item.tabId)}
                      className={`w-full ${
                        isActive(item.url || '#', item.tabId)
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                          : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      }`}
                      title={item.title}
                    >
                      <item.icon className="h-4 w-4" />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-2 px-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="/avatars/sarah.jpg" alt="Sarah Chen" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              {state === "expanded" && (
                <>
                  <div className="flex flex-col items-start text-sm">
                    <span className="font-medium">Sarah Chen</span>
                    <span className="text-xs text-muted-foreground">Premium Plan</span>
                  </div>
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}