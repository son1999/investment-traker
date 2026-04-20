import { useTranslation } from 'react-i18next'

import { PageHeader } from '@/components/app'

import PriceTable from './components/PriceTable'

export default function PricesScreen() {
  const { t } = useTranslation()

  return (
    <div className="air-page">
      <PageHeader title={t('prices.title')} description={t('prices.subtitle')} />

      <PriceTable />
    </div>
  )
}
