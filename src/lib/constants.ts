import type { NavItem } from '@/types/dashboard';
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
  Network,
  Key,
  DollarSign,
  Shield,
  TrendingUp,
  Server,
} from 'lucide-react';

// Dashboard navigation items
export const dashboardNavItems: NavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    i18nKey: 'dashboard.overview',
    icon: LayoutDashboard,
    path: '/dashboard/overview',
    group: 'main',
  },
  {
    id: 'console',
    label: 'API Console',
    i18nKey: 'dashboard.console',
    icon: Terminal,
    path: '/dashboard/console',
    group: 'main',
  },
  {
    id: 'agents',
    label: 'Agents',
    i18nKey: 'dashboard.agents',
    icon: Bot,
    path: '/dashboard/agents',
    group: 'market',
  },
  {
    id: 'models',
    label: 'Models',
    i18nKey: 'dashboard.models',
    icon: Cpu,
    path: '/dashboard/models',
    group: 'market',
  },
  {
    id: 'usage',
    label: 'Usage',
    i18nKey: 'dashboard.usage',
    icon: BarChart3,
    path: '/dashboard/usage',
    group: 'finance',
  },
  {
    id: 'billing',
    label: 'Billing',
    i18nKey: 'dashboard.billing',
    icon: CreditCard,
    path: '/dashboard/billing',
    group: 'finance',
  },
  {
    id: 'wallet',
    label: 'Wallet',
    i18nKey: 'dashboard.wallet',
    icon: Wallet,
    path: '/dashboard/wallet',
    group: 'finance',
  },
  {
    id: 'ledger',
    label: 'Ledger',
    i18nKey: 'dashboard.ledger',
    icon: BookOpen,
    path: '/dashboard/ledger',
    group: 'finance',
  },
  {
    id: 'settlement',
    label: 'Settlement',
    i18nKey: 'dashboard.settlement',
    icon: Repeat,
    path: '/dashboard/settlement',
    group: 'finance',
  },
  {
    id: 'partners',
    label: 'Partners',
    i18nKey: 'dashboard.partners',
    icon: Users,
    path: '/dashboard/partners',
    group: 'network',
  },
  {
    id: 'logs',
    label: 'Logs',
    i18nKey: 'dashboard.logs',
    icon: ScrollText,
    path: '/dashboard/logs',
    group: 'monitor',
  },
  {
    id: 'settings',
    label: 'Settings',
    i18nKey: 'dashboard.settings',
    icon: Settings,
    path: '/dashboard/settings',
    group: 'system',
  },
];

// Navigation groups
export const navGroups = {
  main: { label: 'Main', i18nKey: 'navGroups.main' },
  market: { label: 'Market', i18nKey: 'navGroups.market' },
  finance: { label: 'Finance', i18nKey: 'navGroups.finance' },
  network: { label: 'Network', i18nKey: 'navGroups.network' },
  monitor: { label: 'Monitor', i18nKey: 'navGroups.monitor' },
  system: { label: 'System', i18nKey: 'navGroups.system' },
};

// Status maps
export const userStatusMap: Record<string, { label: string; color: string }> = {
  active: { label: 'Active', color: 'text-green-400' },
  suspended: { label: 'Suspended', color: 'text-yellow-400' },
  pending_verification: { label: 'Pending', color: 'text-blue-400' },
  banned: { label: 'Banned', color: 'text-red-400' },
};

export const providerHealthMap: Record<string, { label: string; color: string }> = {
  healthy: { label: 'Healthy', color: 'text-green-400' },
  degraded: { label: 'Degraded', color: 'text-yellow-400' },
  down: { label: 'Down', color: 'text-red-400' },
  maintenance: { label: 'Maintenance', color: 'text-blue-400' },
};

export const commissionStatusMap: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'text-yellow-400' },
  available: { label: 'Available', color: 'text-green-400' },
  paid: { label: 'Paid', color: 'text-blue-400' },
  reversed: { label: 'Reversed', color: 'text-red-400' },
};

// Routing modes
export const routingModes = [
  { value: 'auto', label: 'Auto', description: 'Best balance of cost & speed' },
  { value: 'cheapest', label: 'Cheapest', description: 'Lowest cost provider' },
  { value: 'fastest', label: 'Fastest', description: 'Lowest latency provider' },
  { value: 'premium', label: 'Premium', description: 'Highest quality provider' },
];

// Payment methods
export const paymentMethods = [
  { value: 'stripe', label: 'Stripe', icon: 'credit-card' },
  { value: 'alipay', label: 'Alipay', icon: 'smartphone' },
  { value: 'wechat_pay', label: 'WeChat Pay', icon: 'message-circle' },
  { value: 'usdt', label: 'USDT (TRC20)', icon: 'coins' },
];

// Rate limit tiers
export const rateLimitTiers = {
  free: { rpm: 20, tpm: 40_000, label: 'Free' },
  standard: { rpm: 60, tpm: 150_000, label: 'Standard' },
  enterprise: { rpm: 600, tpm: 2_000_000, label: 'Enterprise' },
};

// Partner Panel navigation items
export const partnerNavItems: NavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    i18nKey: 'partner.overview',
    icon: LayoutDashboard,
    path: '/partner/overview',
    group: 'main',
  },
  {
    id: 'downline',
    label: 'Downline',
    i18nKey: 'partner.downline',
    icon: Network,
    path: '/partner/downline',
    group: 'network',
  },
  {
    id: 'commissions',
    label: 'Commissions',
    i18nKey: 'partner.commissions',
    icon: DollarSign,
    path: '/partner/commissions',
    group: 'finance',
  },
  {
    id: 'api-keys',
    label: 'API Keys',
    i18nKey: 'partner.apiKeys',
    icon: Key,
    path: '/partner/api-keys',
    group: 'tools',
  },
  {
    id: 'pricing',
    label: 'Pricing',
    i18nKey: 'partner.pricing',
    icon: TrendingUp,
    path: '/partner/pricing',
    group: 'tools',
  },
  {
    id: 'customers',
    label: 'Customers',
    i18nKey: 'partner.customers',
    icon: Users,
    path: '/partner/customers',
    group: 'network',
  },
  {
    id: 'wallet',
    label: 'Wallet',
    i18nKey: 'partner.wallet',
    icon: Wallet,
    path: '/partner/wallet',
    group: 'finance',
  },
  {
    id: 'ledger',
    label: 'Ledger',
    i18nKey: 'partner.ledger',
    icon: BookOpen,
    path: '/partner/ledger',
    group: 'finance',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    i18nKey: 'partner.analytics',
    icon: BarChart3,
    path: '/partner/analytics',
    group: 'monitor',
  },
  {
    id: 'settings',
    label: 'Settings',
    i18nKey: 'partner.settings',
    icon: Settings,
    path: '/partner/settings',
    group: 'system',
  },
];

// Admin Console navigation items
export const adminNavItems: NavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    i18nKey: 'admin.overview',
    icon: LayoutDashboard,
    path: '/admin/overview',
    group: 'main',
  },
  {
    id: 'partners',
    label: 'Partners',
    i18nKey: 'admin.partners',
    icon: Network,
    path: '/admin/partners',
    group: 'network',
  },
  {
    id: 'users',
    label: 'Users',
    i18nKey: 'admin.users',
    icon: Users,
    path: '/admin/users',
    group: 'network',
  },
  {
    id: 'providers',
    label: 'Providers',
    i18nKey: 'admin.providers',
    icon: Server,
    path: '/admin/providers',
    group: 'market',
  },
  {
    id: 'models',
    label: 'Models',
    i18nKey: 'admin.models',
    icon: Cpu,
    path: '/admin/models',
    group: 'market',
  },
  {
    id: 'ledger',
    label: 'Ledger',
    i18nKey: 'admin.ledger',
    icon: BookOpen,
    path: '/admin/ledger',
    group: 'finance',
  },
  {
    id: 'commissions',
    label: 'Commissions',
    i18nKey: 'admin.commissions',
    icon: DollarSign,
    path: '/admin/commissions',
    group: 'finance',
  },
  {
    id: 'fraud',
    label: 'Fraud',
    i18nKey: 'admin.fraud',
    icon: Shield,
    path: '/admin/fraud',
    group: 'monitor',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    i18nKey: 'admin.analytics',
    icon: BarChart3,
    path: '/admin/analytics',
    group: 'monitor',
  },
  {
    id: 'logs',
    label: 'Logs',
    i18nKey: 'admin.logs',
    icon: ScrollText,
    path: '/admin/logs',
    group: 'monitor',
  },
  {
    id: 'settings',
    label: 'Settings',
    i18nKey: 'admin.settings',
    icon: Settings,
    path: '/admin/settings',
    group: 'system',
  },
];

// Partner Panel group labels
export const partnerGroupLabels: Record<string, string> = {
  main: 'Main',
  network: 'Network',
  finance: 'Finance',
  tools: 'Tools',
  monitor: 'Monitor',
  system: 'System',
};

// Admin Console group labels
export const adminGroupLabels: Record<string, string> = {
  main: 'Main',
  network: 'Network',
  market: 'Market',
  finance: 'Finance',
  monitor: 'Monitor',
  system: 'System',
};
