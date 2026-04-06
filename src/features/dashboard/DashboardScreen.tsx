import { useTranslation } from 'react-i18next'
import PriceAlertCard from './components/PriceAlertCard'
import MetricCards from './components/MetricCards'
import AssetAllocationChart from './components/AssetAllocationChart'
import ProfitByAssetChart from './components/ProfitByAssetChart'
import HoldingsTable from './components/HoldingsTable'
import RecentTransactions from './components/RecentTransactions'
import FAB from './components/FAB'

export default function DashboardScreen() {
  const { t } = useTranslation()

  return (
    <>
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-6 py-8">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold text-body">{t('dashboard.title')}</h1>
            <p className="text-sm text-caption">{t('dashboard.subtitle')}</p>
          </div>
          <PriceAlertCard />
        </div>
        <MetricCards />
        <div className="grid grid-cols-2 gap-6">
          <AssetAllocationChart />
          <ProfitByAssetChart />
        </div>
        <HoldingsTable />
        <RecentTransactions />
      </div>
      <FAB />
    </>
  )
}
