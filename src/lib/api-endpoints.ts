// =====================================================
// TokenSpark API Endpoint Definitions
// =====================================================

const endpoints = {
  // Auth
  auth: {
    login: { url: '/auth/login', method: 'POST' as const },
    register: { url: '/auth/register', method: 'POST' as const },
    google: { url: '/auth/google', method: 'POST' as const },
    refresh: { url: '/auth/refresh', method: 'POST' as const },
    profile: { url: '/auth/profile', method: 'GET' as const },
    updateProfile: { url: '/auth/profile', method: 'PATCH' as const },
    changePassword: { url: '/auth/change-password', method: 'POST' as const },
  },

  // Public API
  api: {
    chatCompletions: { url: '/v1/chat/completions', method: 'POST' as const },
    listModels: { url: '/v1/models', method: 'GET' as const },
    getUsage: { url: '/v1/usage', method: 'GET' as const },
    health: { url: '/health', method: 'GET' as const },
  },

  // Wallet
  wallet: {
    balance: { url: '/wallet/balance', method: 'GET' as const },
    topUp: { url: '/wallet/topup', method: 'POST' as const },
    transactions: { url: '/wallet/transactions', method: 'GET' as const },
  },

  // Billing
  billing: {
    models: { url: '/billing/models', method: 'GET' as const },
  },

  // API Keys
  apiKeys: {
    list: { url: '/api-keys', method: 'GET' as const },
  },

  // Admin
  admin: {
    users: { url: '/admin/users', method: 'GET' as const },
    getUser: (id: string) => ({ url: `/admin/users/${id}`, method: 'GET' as const }),
    updateUserStatus: (id: string) => ({ url: `/admin/users/${id}/status`, method: 'PATCH' as const }),
    ledgerHealth: { url: '/admin/ledger/health', method: 'GET' as const },
    ledgerTransactions: { url: '/admin/ledger/transactions', method: 'GET' as const },
    providers: { url: '/admin/providers', method: 'GET' as const },
    updateProvider: (id: string) => ({ url: `/admin/providers/${id}`, method: 'PATCH' as const }),
    fraudEvents: { url: '/admin/fraud/events', method: 'GET' as const },
    reviewFraudEvent: (id: string) => ({ url: `/admin/fraud/events/${id}`, method: 'PATCH' as const }),
    pricing: { url: '/admin/pricing', method: 'GET' as const },
    updatePricing: (id: string) => ({ url: `/admin/pricing/${id}`, method: 'PATCH' as const }),
    analytics: { url: '/admin/analytics/overview', method: 'GET' as const },
    health: { url: '/admin/health', method: 'GET' as const },
  },

  // Ledger
  ledger: {
    createTransaction: { url: '/ledger/transactions', method: 'POST' as const },
    getTransaction: (id: string) => ({ url: `/ledger/transactions/${id}`, method: 'GET' as const }),
    reverseTransaction: (id: string) => ({ url: `/ledger/transactions/${id}/reverse`, method: 'POST' as const }),
    health: { url: '/ledger/health', method: 'GET' as const },
    getWallet: (userId: string) => ({ url: `/wallet/${userId}`, method: 'GET' as const }),
    creditWallet: (userId: string) => ({ url: `/wallet/${userId}/credit`, method: 'POST' as const }),
    walletTransactions: (userId: string) => ({ url: `/wallet/${userId}/transactions`, method: 'GET' as const }),
    userLedger: (userId: string) => ({ url: `/admin/users/${userId}/ledger`, method: 'GET' as const }),
  },

  // Webhooks
  webhooks: {
    stripe: { url: '/webhooks/stripe', method: 'POST' as const },
  },
} as const;

export default endpoints;
