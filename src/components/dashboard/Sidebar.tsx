import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Terminal,
  Bot,
  BarChart3,
  CreditCard,
  Wallet,
  BookOpen,
  Repeat,
  Users,
  Cpu,
  ScrollText,
  Settings,
  Sparkles,
  Network,
  Key,
  DollarSign,
  Shield,
  TrendingUp,
  Server,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types/dashboard';
import { useUIStore } from '@/stores/ui-store';

interface SidebarProps {
  collapsed?: boolean;
  navItems?: NavItem[];
  groupLabels?: Record<string, string>;
}

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Terminal,
  Bot,
  BarChart3,
  CreditCard,
  Wallet,
  BookOpen,
  Repeat,
  Users,
  Cpu,
  ScrollText,
  Settings,
  Network,
  Key,
  DollarSign,
  Shield,
  TrendingUp,
  Server,
};

const defaultGroupLabels: Record<string, string> = {
  main: 'Main',
  market: 'Market',
  finance: 'Finance',
  network: 'Network',
  monitor: 'Monitor',
  system: 'System',
  tools: 'Tools',
};

export function Sidebar({ collapsed = false, navItems = [], groupLabels }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { closeSidebar } = useUIStore();

  const handleNav = (path: string) => {
    navigate(path);
    closeSidebar();
  };

  const labels = groupLabels || defaultGroupLabels;

  // Group nav items
  const grouped = navItems.reduce<Record<string, typeof navItems>>((acc, item) => {
    const group = item.group || 'main';
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-border">
        <Sparkles className="h-6 w-6 text-spark flex-shrink-0" />
        {!collapsed && (
          <span className="ml-2 font-bold text-lg gradient-text-spark whitespace-nowrap">
            词元闪耀
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4">
        {Object.entries(grouped).map(([groupKey, items]) => (
          <div key={groupKey} className="mb-4">
            {!collapsed && (
              <div className="px-4 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {labels[groupKey] || groupKey}
              </div>
            )}
            {items.map((item) => {
              const Icon = iconMap[item.icon.name] || LayoutDashboard;
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.path)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors relative",
                    isActive
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary" />
                  )}
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && (
                    <span className="whitespace-nowrap">{item.label}</span>
                  )}
                  {item.badge && !collapsed && (
                    <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="p-4 border-t border-border">
        {/* Placeholder for collapse toggle if needed */}
      </div>
    </div>
  );
}
