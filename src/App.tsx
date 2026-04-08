import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MasterLayout } from '@/components/layout'
import AuthGuard from '@/components/AuthGuard'
import { ConnectScreen } from '@/features/connect'
import { DashboardScreen } from '@/features/dashboard'
import { TransactionsScreen } from '@/features/transactions'
import { ReportsScreen } from '@/features/reports'
import { PricesScreen } from '@/features/prices'
import { AssetDetailScreen } from '@/features/asset-detail'
import { AllocationScreen } from '@/features/allocation'


import { LoginScreen } from '@/features/login'
import { NotFoundScreen } from '@/features/not-found'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/connect" element={<ConnectScreen />} />
        <Route path="/login" element={<LoginScreen />} />

        {/* Protected routes */}
        <Route element={<AuthGuard />}>
          <Route element={<MasterLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardScreen />} />
            <Route path="/transactions" element={<TransactionsScreen />} />
            <Route path="/reports" element={<ReportsScreen />} />
            <Route path="/prices" element={<PricesScreen />} />
            <Route path="/assets/:code" element={<AssetDetailScreen />} />
            <Route path="/allocation" element={<AllocationScreen />} />
            <Route path="/journal" element={<Navigate to="/transactions" replace />} />
            <Route path="/settings" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundScreen />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
