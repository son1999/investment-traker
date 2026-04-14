import { useTranslation } from 'react-i18next'

import { PageHeader } from '@/components/app'

import PriceTable from './components/PriceTable'

export default function PricesScreen() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-[1400px] flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader title={t('prices.title')} description={t('prices.subtitle')} />

      <PriceTable />
    </div>
  )
}
