import { useTranslation } from 'react-i18next'

import { PageHeader } from '@/components/app'

import LivePriceCard from './components/LivePriceCard'
import PriceForm from './components/PriceForm'
import PriceTable from './components/PriceTable'
import QuickUpdate from './components/QuickUpdate'
import RefreshCard from './components/RefreshCard'

export default function PricesScreen() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-[1400px] flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader title={t('prices.title')} description={t('prices.subtitle')} />

      <div className="grid min-w-0 gap-8 lg:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-8 lg:col-span-8">
          <PriceForm />
          <PriceTable />
        </div>

        <div className="flex min-w-0 flex-col gap-8 lg:col-span-4">
          <RefreshCard />
          <QuickUpdate />
          <LivePriceCard />
        </div>
      </div>
    </div>
  )
}
