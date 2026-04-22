import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import { LoginPage } from './components/auth/LoginPage'
import { RegisterPage } from './components/auth/RegisterPage'
import { AuthGuard, PublicRoute } from './components/auth/AuthGuard'
import { PartnerGuard } from './components/auth/PartnerGuard'
import { AdminGuard } from './components/auth/AdminGuard'
import { DashboardLayout } from './components/dashboard/DashboardLayout'
import { PartnerLayout } from './components/dashboard/PartnerLayout'
import { AdminLayout } from './components/dashboard/AdminLayout'
import { OverviewPage } from './pages/dashboard/OverviewPage'
import { ConsolePage } from './pages/dashboard/ConsolePage'
import { AgentsPage } from './pages/dashboard/AgentsPage'
import { UsagePage } from './pages/dashboard/UsagePage'
import { BillingPage } from './pages/dashboard/BillingPage'
import { WalletPage } from './pages/dashboard/WalletPage'
import { LedgerPage } from './pages/dashboard/LedgerPage'
import { SettlementPage } from './pages/dashboard/SettlementPage'
import { PartnersPage } from './pages/dashboard/PartnersPage'
import { ModelsPage } from './pages/dashboard/ModelsPage'
import { LogsPage } from './pages/dashboard/LogsPage'
import { SettingsPage } from './pages/dashboard/SettingsPage'
// Partner Panel pages
import { PartnerOverviewPage } from './pages/partner/PartnerOverviewPage'
import { DownlinePage } from './pages/partner/DownlinePage'
import { CommissionsPage as PartnerCommissionsPage } from './pages/partner/CommissionsPage'
import { PricingPage } from './pages/partner/PricingPage'
import { CustomersPage } from './pages/partner/CustomersPage'
// Admin Console pages
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage'
import { AdminPartnersPage } from './pages/admin/PartnersPage'
import { UsersPage } from './pages/admin/UsersPage'
import { AdminCommissionsPage } from './pages/admin/CommissionsPage'
import { FraudPage } from './pages/admin/FraudPage'
import { AnalyticsPage } from './pages/admin/AnalyticsPage'

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Protected dashboard routes */}
      <Route
        path="/dashboard"
        element={
          <AuthGuard>
            <DashboardLayout>
              <Routes>
                <Route index element={<OverviewPage />} />
                <Route path="overview" element={<OverviewPage />} />
                <Route path="console" element={<ConsolePage />} />
                <Route path="agents" element={<AgentsPage />} />
                <Route path="usage" element={<UsagePage />} />
                <Route path="billing" element={<BillingPage />} />
                <Route path="wallet" element={<WalletPage />} />
                <Route path="ledger" element={<LedgerPage />} />
                <Route path="settlement" element={<SettlementPage />} />
                <Route path="partners" element={<PartnersPage />} />
                <Route path="models" element={<ModelsPage />} />
                <Route path="logs" element={<LogsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Routes>
            </DashboardLayout>
          </AuthGuard>
        }
      />

      {/* Partner Panel routes */}
      <Route
        path="/partner"
        element={
          <PartnerGuard>
            <PartnerLayout>
              <Routes>
                <Route index element={<PartnerOverviewPage />} />
                <Route path="overview" element={<PartnerOverviewPage />} />
                <Route path="downline" element={<DownlinePage />} />
                <Route path="commissions" element={<PartnerCommissionsPage />} />
                <Route path="api-keys" element={<WalletPage />} />
                <Route path="pricing" element={<PricingPage />} />
                <Route path="customers" element={<CustomersPage />} />
                <Route path="wallet" element={<WalletPage />} />
                <Route path="ledger" element={<LedgerPage />} />
                <Route path="analytics" element={<UsagePage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Routes>
            </PartnerLayout>
          </PartnerGuard>
        }
      />

      {/* Admin Console routes */}
      <Route
        path="/admin"
        element={
          <AdminGuard>
            <AdminLayout>
              <Routes>
                <Route index element={<AdminOverviewPage />} />
                <Route path="overview" element={<AdminOverviewPage />} />
                <Route path="partners" element={<AdminPartnersPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="providers" element={<ModelsPage />} />
                <Route path="models" element={<ModelsPage />} />
                <Route path="ledger" element={<LedgerPage />} />
                <Route path="commissions" element={<AdminCommissionsPage />} />
                <Route path="fraud" element={<FraudPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="logs" element={<LogsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Routes>
            </AdminLayout>
          </AdminGuard>
        }
      />
    </Routes>
  )
}

export default App
