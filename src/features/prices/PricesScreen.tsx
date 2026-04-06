import { useTranslation } from 'react-i18next'
import PriceForm from './components/PriceForm'
import PriceTable from './components/PriceTable'
import QuickUpdate from './components/QuickUpdate'
import PromoCard from './components/PromoCard'

export default function PricesScreen() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-6 py-8">
      {/* Header */}
      <div className="mb-12 flex flex-col gap-2">
        <h1 className="text-xl font-semibold text-heading">{t('prices.title')}</h1>
        <p className="text-base text-caption">{t('prices.subtitle')}</p>
      </div>

      {/* 12-col grid: 8 left + 4 right */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left column */}
        <div className="col-span-8 flex flex-col gap-8">
          <PriceForm />
          <PriceTable />
        </div>

        {/* Right column */}
        <div className="col-span-4 flex flex-col gap-8">
          <QuickUpdate />
          <PromoCard />
        </div>
      </div>
    </div>
  )
}
