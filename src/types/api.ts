// =====================================================
// TokenSpark API Request/Response Types
// =====================================================

import type { User, Wallet, Model, Provider, LedgerTransaction, LedgerEntry, Commission, Partner } from './domain';

// Auth
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// API Response wrapper
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: {
    message: string;
    type: string;
    code?: string;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

// Chat Completion
export interface ChatCompletionRequest {
  model: string;
  messages: Array<{ role: string; content: string }>;
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: { role: string; content: string };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  _tokenspark?: {
    cost: number;
    currency: string;
    provider: string;
    latency_ms: number;
  };
}

// Wallet
export interface WalletBalanceResponse {
  wallet: Wallet;
  available: number;
}

export interface TopUpRequest {
  amount: number;
  provider: 'stripe' | 'alipay' | 'wechat_pay' | 'usdt';
  currency?: string;
}

// Usage
export interface UsageRecord {
  date: string;
  modelSlug: string;
  requestCount: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCost: number;
}

export interface UsageSummary {
  totalRequests: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCost: number;
  period: string;
}

// Model pricing
export interface PricingInfo {
  inputPricePerMillion: number;
  outputPricePerMillion: number;
  contextWindow: number;
}

export interface ModelWithPricing extends Model {
  provider: Provider;
  pricing: PricingInfo;
  latency?: number;
  successRate?: number;
}

// Dashboard overview
export interface DashboardOverview {
  totalRevenue: number;
  totalTokens: number;
  activeAgents: number;
  apiRequests: number;
  revenueChange: number;
  tokensChange: number;
  agentsChange: number;
  requestsChange: number;
  topModels: Array<{ slug: string; name: string; requests: number; cost: number }>;
  topAgents: Array<{ id: string; name: string; executions: number; revenue: number }>;
  requestTrend: Array<{ date: string; requests: number; cost: number }>;
  costStructure: Array<{ name: string; value: number; color: string }>;
}

// Log entry
export interface ApiLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
  provider: string;
  status: 'completed' | 'failed' | 'timeout';
  latencyMs: number;
}

// Ledger view
export interface LedgerTransactionView extends LedgerTransaction {
  entries: LedgerEntry[];
}

// Partner view
export interface PartnerView extends Partner {
  referralsCount: number;
  commissions: Commission[];
}

// Settlement
export interface SettlementRecord {
  id: string;
  date: string;
  type: 't0' | 't1';
  totalAmount: number;
  agentPayout: number;
  partnerPayout: number;
  platformRevenue: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}
