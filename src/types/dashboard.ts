// =====================================================
// TokenSpark Dashboard Types
// =====================================================

import type { LucideIcon } from 'lucide-react';

// Navigation
export interface NavItem {
  id: string;
  label: string;
  i18nKey: string;
  icon: LucideIcon;
  path: string;
  badge?: string;
  group?: string;
}

// KPI Card
export interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
}

// Chart data types
export interface TrendDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface PieDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface BarDataPoint {
  name: string;
  values: Record<string, number>;
}

// Table column definition (simplified)
export interface TableColumn<T = any> {
  key: string;
  header: string;
  accessor: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'switch';
  placeholder?: string;
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
  validate?: (value: any) => string | undefined;
}

// Dialog/Modal
export interface DialogConfig {
  open: boolean;
  title: string;
  description?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive';
}

// Empty state
export interface EmptyStateConfig {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

// Pagination
export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

// Filter
export interface FilterState {
  search: string;
  dateRange?: { start: string; end: string };
  status?: string;
  category?: string;
}

// Agent types
export interface AgentCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface AgentCard {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  priceUnit: 'task' | 'token' | 'hour';
  successRate: number;
  latencyMs: number;
  executions: number;
  rating: number;
  isActive: boolean;
}

// Console state
export interface ConsoleMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  tokens?: number;
  cost?: number;
  model?: string;
}

export type RoutingMode = 'auto' | 'cheapest' | 'fastest' | 'premium';

// Settings
export interface ApiKeyForm {
  name: string;
  permissions: Record<string, boolean>;
  rateLimitTier: 'free' | 'standard' | 'enterprise';
}

export interface UserProfileForm {
  name: string;
  email: string;
  avatar?: string;
}
