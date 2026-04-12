import { Outlet } from 'react-router-dom'
import AppHeader from './AppHeader'
import AppFooter from './AppFooter'

export default function MasterLayout() {
  return (
    <div className="min-h-screen overflow-x-clip bg-background">
      <AppHeader />
      <main className="min-w-0 overflow-x-clip pt-14">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  )
}
