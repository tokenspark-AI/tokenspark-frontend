import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import { LoginPage } from './components/auth/LoginPage'
import { RegisterPage } from './components/auth/RegisterPage'
import { AuthGuard, PublicRoute } from './components/auth/AuthGuard'
import { DashboardLayout } from './components/dashboard/DashboardLayout'
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
    </Routes>
  )
}

export default App
