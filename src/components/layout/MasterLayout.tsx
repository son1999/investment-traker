import { Outlet } from 'react-router-dom'
import AppHeader from './AppHeader'
import AppFooter from './AppFooter'

export default function MasterLayout() {
  return (
    <div className="min-h-screen bg-page">
      <AppHeader />
      <main className="pt-12">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  )
}
