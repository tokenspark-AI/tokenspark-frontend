# 词元闪耀 TokenSpark — AI Economy Infrastructure Layer

> **词元闪耀 (TokenSpark) is not a SaaS tool.** It is the **financial and infrastructure system for the AI Agent economy** — Stripe + AWS for AI agents.
>
> **多语言支持:** 简体中文 | 日本語 | 한국어 | Русский

## 🌍 Internationalization (i18n)

TokenSpark supports 4 languages out of the box:

| Code | Language | Native | Brand Name |
|------|----------|--------|------------|
| `zh` | Simplified Chinese | 简体中文 | **词元闪耀** |
| `ja` | Japanese | 日本語 | **トークンスパーク** |
| `ko` | Korean | 한국어 | **토큰스파크** |
| `ru` | Russian | Русский | **ТокенСпарк** |

### Frontend Usage
```tsx
import { useI18n } from '@/i18n'

function MyComponent() {
  const { t, locale, changeLocale } = useI18n()
  return <h1>{t('brand.name')}</h1> // 词元闪耀 / トークンス파크 / etc.
}
```

### Backend Locale Detection
The API automatically detects language from:
1. `?lang=zh` query parameter
2. `X-Locale` header
3. `Accept-Language` header (auto-detect)

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                             │
│   Web App  │  API Consumers  │  Partner Portals  │  Admin    │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
┌────────────────────────▼────────────────────────────────────┐
│              TOKENSPARK API GATEWAY (:3000)                  │
│  POST /v1/chat/completions  │  Auth  │  Rate Limit  │ Fraud  │
└──────┬──────────────┬──────────────┬──────────────┬─────────┘
       │              │              │              │
       ▼              ▼              ▼              ▼
  ┌─────────┐  ┌───────────┐  ┌──────────┐  ┌──────────┐
  │ LEDGER  │  │  BILLING  │  │AgentSpark│  │Distribute│
  │ (:3002) │  │  Engine   │  │ Runtime  │  │  Network │
  └────┬────┘  └─────┬─────┘  └────┬─────┘  └────┬─────┘
       │              │              │              │
       ▼              ▼              ▼              ▼
┌─────────────────────────────────────────────────────────────┐
│                   SHARED INFRASTRUCTURE                      │
│  PostgreSQL  │  Redis  │  Stripe  │  Alipay  │  WeChat Pay  │
└─────────────────────────────────────────────────────────────┘
```

## Core Systems

### 1. TokenSpark (Financial Core)

| System | Description |
|--------|-------------|
| **API Aggregation** | Unified endpoint for OpenAI, Claude, Gemini, Mistral, Llama |
| **Token Billing** | Per-token pricing with real-time cost calculation |
| **Wallet** | User balances with reserve/release mechanism |
| **Ledger** | Double-entry bookkeeping — the financial source of truth |
| **Settlement** | Provider payout and commission distribution |
| **Distribution** | 3-tier partner network (Agent → Partner → Enterprise) |

### 2. AgentSpark (Execution Subsystem)

| System | Description |
|--------|-------------|
| **Router** | Cost/latency/health-based provider selection |
| **Executor** | AI request execution with automatic fallback |
| **Monitor** | Provider health tracking and latency optimization |

## Request Flow

```
1. User → POST /v1/chat/completions
2. TokenSpark → Validate API key + Rate limit
3. TokenSpark → Fraud detection (self-pay, circular calls)
4. TokenSpark → Estimate cost from input tokens
5. TokenSpark → Reserve funds in wallet
6. AgentSpark → Route to best provider (cost + latency scoring)
7. AgentSpark → Execute AI call (with fallback)
8. TokenSpark → Calculate actual cost from usage
9. TokenSpark → Create ledger entries (double-entry)
10. TokenSpark → Charge wallet, release reserved balance
11. TokenSpark → Calculate partner commissions (3-tier)
12. TokenSpark → Return response to user
```

## Financial System Design

### Double-Entry Ledger

Every transaction creates balanced entries:

```
Transaction: API call costing $1.00

  DEBIT  user_wallet        $1.00  (user pays)
  CREDIT system_revenue     $0.30  (platform keeps 30%)
  CREDIT provider_payable   $0.70  (provider gets 70%)
  ───────────────────────────────
  SUM: $1.00 debit = $1.00 credit ✓
```

### Wallet Flow

```
1. Reserve: balance -= reserved (frozen for pending tx)
2. Charge: balance -= actual, reserved -= reserved
3. Release: reserved -= difference (if estimate > actual)
4. Credit: balance += amount (for top-ups, refunds)
```

### Commission Distribution

```
$1.00 API call:
  ├─ Tier 1 (Agent):    $0.10 (10%)
  ├─ Tier 2 (Partner):  $0.05 (5%)
  ├─ Tier 3 (Enterprise): $0.02 (2%)
  └─ TokenSpark:        $0.83 - provider cost
```

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 16+
- Redis 7+

### Development

```bash
cd backend

# Install dependencies
npm install

# Copy and configure environment
cp shared/.env.example shared/.env

# Run database migrations
psql -U tokenspark -d tokenspark -f shared/db/migrations/001_users_api_keys.sql
psql -U tokenspark -d tokenspark -f shared/db/migrations/002_wallet_ledger.sql
psql -U tokenspark -d tokenspark -f shared/db/migrations/003_providers_models.sql
psql -U tokenspark -d tokenspark -f shared/db/migrations/004_billing_requests.sql
psql -U tokenspark -d tokenspark -f shared/db/migrations/005_distribution.sql
psql -U tokenspark -d tokenspark -f shared/db/migrations/006_security_payments.sql

# Seed demo data
psql -U tokenspark -d tokenspark -f shared/db/seeds/001_seed_data.sql

# Start all services
npm run dev
```

### Docker Compose

```bash
docker-compose up -d
```

## API Reference

### Unified Chat API

```bash
curl -X POST http://localhost:3000/v1/chat/completions \
  -H "Authorization: Bearer tsk_live_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4.1",
    "messages": [{"role": "user", "content": "Hello, world!"}]
  }'
```

### Wallet & Billing

```bash
# Check balance
curl http://localhost:3000/wallet/balance \
  -H "Authorization: Bearer tsk_live_xxx"

# Create top-up
curl -X POST http://localhost:3000/wallet/topup \
  -H "Authorization: Bearer tsk_live_xxx" \
  -d '{"amount": 100, "provider": "stripe"}'

# Get pricing
curl http://localhost:3000/billing/models
```

### Usage

```bash
curl http://localhost:3000/v1/usage \
  -H "Authorization: Bearer tsk_live_xxx"
```

## Security

| Feature | Implementation |
|---------|---------------|
| API Key Auth | SHA-256 hashed keys, prefix identification |
| Rate Limiting | Redis sliding window (20/60/600 rpm tiers) |
| Fraud Detection | Self-payment, circular calls, IP velocity |
| Encryption | AES-256-GCM for provider API keys |
| Ledger Integrity | Double-entry invariant, idempotent transactions |

## Project Structure

```
backend/
├── packages/
│   ├── api/              # TokenSpark API Gateway
│   ├── ledger/           # Ledger & Wallet Service
│   ├── billing/          # Pricing & Metering
│   ├── agentspark/       # AI Execution Runtime
│   ├── distribution/     # Partner Network & Commissions
│   └── domain/           # Shared Domain Types
├── shared/
│   ├── lib/              # Database, Crypto, Money, Fraud, Payments
│   └── db/               # Migrations & Seeds
├── apps/
│   └── web/              # Admin Dashboard (React)
└── docker-compose.yml
```

## License

© 2026 TokenSpark. All rights reserved.
