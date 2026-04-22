// =====================================================
// TokenSpark Frontend Domain Types
// 镜像后端 packages/domain/src/index.ts
// =====================================================

export type UserType = 'individual' | 'agent' | 'partner' | 'enterprise';
export type UserStatus = 'active' | 'suspended' | 'pending_verification' | 'banned';
export type KycStatus = 'none' | 'pending' | 'verified' | 'rejected';
export type AdminRole = 'super_admin' | 'admin' | 'support';

export interface User {
  id: string;
  email: string;
  name: string;
  userType: UserType;
  status: UserStatus;
  kycStatus: KycStatus;
  referralCode: string | null;
  referredBy: string | null;
  adminRole: AdminRole | null;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ApiKey {
  id: string;
  userId: string;
  keyPrefix: string;
  name: string | null;
  permissions: Record<string, boolean>;
  rateLimitTier: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}

export type AccountType =
  | 'user_wallet'
  | 'system_revenue'
  | 'provider_payable'
  | 'partner_commission'
  | 'refund_reserve'
  | 'fee_income'
  | 'adjustment'
  | 'payment_gateway';

export type LedgerTransactionType =
  | 'charge'
  | 'refund'
  | 'topup'
  | 'withdrawal'
  | 'commission_payout'
  | 'provider_settlement'
  | 'adjustment'
  | 'reserve'
  | 'release';

export type LedgerEntryType = 'debit' | 'credit';

export interface LedgerTransaction {
  id: string;
  idempotencyKey: string;
  userId: string;
  totalAmount: number;
  currency: string;
  type: LedgerTransactionType;
  status: 'pending' | 'completed' | 'failed' | 'reversed';
  description: string | null;
  metadata: Record<string, any>;
  createdAt: string;
  completedAt: string | null;
}

export interface LedgerEntry {
  id: string;
  transactionId: string;
  entryType: LedgerEntryType;
  accountType: AccountType;
  accountId: string;
  amount: number;
  currency: string;
  referenceType: string;
  referenceId: string | null;
  description: string | null;
  metadata: Record<string, any>;
  createdAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  currency: string;
  balance: number;
  reservedBalance: number;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export type ProviderHealthStatus = 'healthy' | 'degraded' | 'down' | 'maintenance';

export interface Provider {
  id: string;
  slug: string;
  displayName: string;
  baseUrl: string;
  healthStatus: ProviderHealthStatus;
  avgLatencyMs: number;
  successRate: number;
  priority: number;
  rateLimitRpm: number | null;
  rateLimitTpm: number | null;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Model {
  id: string;
  slug: string;
  displayName: string;
  providerId: string;
  providerModelId: string;
  inputPricePerMillion: number;
  outputPricePerMillion: number;
  contextWindow: number;
  maxOutputTokens: number | null;
  capabilities: string[];
  isActive: boolean;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export type PartnerTier = 'agent' | 'partner' | 'enterprise';
export type PayoutMethod = 'stripe' | 'alipay' | 'wechat_pay' | 'usdt' | 'bank';
export type PartnerStatus = 'active' | 'suspended' | 'terminated';

export interface Partner {
  id: string;
  userId: string;
  parentPartnerId: string | null;
  tier: PartnerTier;
  commissionRate: number;
  overrideRate: number | null;
  payoutThreshold: number;
  payoutMethod: PayoutMethod;
  payoutAddress: Record<string, any> | null;
  totalEarnings: number;
  totalPaid: number;
  pendingEarnings: number;
  downlineCount: number;
  monthlyVolume: number;
  status: PartnerStatus;
  whiteLabelConfig: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerTreeNode {
  partner: Partner;
  user: { name: string; email: string; status: UserStatus };
  children: PartnerTreeNode[];
  level: number;
  totalCommission: number;
  customerCount: number;
}

export interface CommissionRule {
  id: string;
  name: string;
  tierLevel: number;
  baseRate: number;
  minVolume: number;
  maxVolume: number | null;
  bonusRate: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CommissionStatus = 'pending' | 'available' | 'paid' | 'reversed';

export interface Commission {
  id: string;
  partnerId: string;
  sourceTransactionId: string | null;
  sourceUserId: string;
  tierLevel: number;
  sourceAmount: number;
  commissionRate: number;
  commissionAmount: number;
  currency: string;
  status: CommissionStatus;
  availableAt: string | null;
  paidAt: string | null;
  createdAt: string;
}

export type PaymentProvider = 'stripe' | 'alipay' | 'wechat_pay' | 'usdt';
export type PaymentStatus = 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded';

export interface PaymentIntent {
  id: string;
  userId: string;
  provider: PaymentProvider;
  providerPaymentId: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  metadata: Record<string, any>;
  createdAt: string;
  completedAt: string | null;
}

export type FraudEventType =
  | 'self_payment'
  | 'circular_call'
  | 'refund_abuse'
  | 'rate_limit_exceeded'
  | 'token_anomaly'
  | 'ip_velocity'
  | 'model_hopping'
  | 'pattern_match'
  | 'balance_manipulation';

export type FraudSeverity = 'low' | 'medium' | 'high' | 'critical';
export type FraudAction = 'none' | 'warning' | 'throttle' | 'block' | 'suspend';

export interface FraudEvent {
  id: string;
  userId: string | null;
  apiKeyId: string | null;
  eventType: FraudEventType;
  severity: FraudSeverity;
  riskScore: number;
  description: string | null;
  evidence: Record<string, any> | null;
  actionTaken: FraudAction | null;
  reviewed: boolean;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
}
