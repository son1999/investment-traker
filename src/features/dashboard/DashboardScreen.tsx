import HeroSection from './components/HeroSection'
import MetricCards from './components/MetricCards'
import AssetAllocationChart from './components/AssetAllocationChart'
import ProfitByAssetChart from './components/ProfitByAssetChart'
import HoldingsTable from './components/HoldingsTable'
import PortfolioChart from './components/PortfolioChart'
import RecentTransactions from './components/RecentTransactions'
import FAB from './components/FAB'

export default function DashboardScreen() {
  return (
    <>
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-5 px-6 py-6">
        {/* Hero */}
        <HeroSection />

        {/* Stat strip */}
        <MetricCards />

        {/* Row 1: Holdings + Allocation (same height) */}
        <div className="grid grid-cols-10 items-stretch gap-5">
          <div className="col-span-7">
            <HoldingsTable />
          </div>
          <div className="col-span-3">
            <AssetAllocationChart />
          </div>
        </div>

        {/* Row 2: Portfolio Chart + Profit bars */}
        <div className="grid grid-cols-10 items-stretch gap-5">
          <div className="col-span-7">
            <PortfolioChart />
          </div>
          <div className="col-span-3">
            <ProfitByAssetChart />
          </div>
        </div>

        {/* Recent transactions */}
        <RecentTransactions />
      </div>
      <FAB />
    </>
  )
}
