import AssetAllocationChart from './components/AssetAllocationChart'
import FAB from './components/FAB'
import HeroSection from './components/HeroSection'
import HoldingsTable from './components/HoldingsTable'
import MetricCards from './components/MetricCards'
import PortfolioChart from './components/PortfolioChart'
import ProfitByAssetChart from './components/ProfitByAssetChart'
import RecentTransactions from './components/RecentTransactions'

export default function DashboardScreen() {
  return (
    <>
      <div className="air-page">
        <HeroSection />
        <MetricCards />

        <div className="air-stagger-grid grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.7fr)]">
          <HoldingsTable />
          <div className="air-stagger-list flex min-w-0 flex-col gap-6">
            <AssetAllocationChart />
            <ProfitByAssetChart />
          </div>
        </div>

        <PortfolioChart />
        <RecentTransactions />
      </div>
      <FAB />
    </>
  )
}
