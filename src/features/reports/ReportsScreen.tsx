import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { PageHeader } from '@/components/app'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Period } from '@/types/api'

import CashFlowChart from './components/CashFlowChart'
import DCASection from './components/DCASection'
import PerformanceChart from './components/PerformanceChart'
import PerformanceComparison from './components/PerformanceComparison'
import SummaryCards from './components/SummaryCards'
import TopAssets from './components/TopAssets'

const periodKeys: Period[] = ['1m', '3m', '6m', '1y', 'all']

export default function ReportsScreen() {
  const { t } = useTranslation()
  const [period, setPeriod] = useState<Period>('all')

  return (
    <div className="air-page">
      <PageHeader
        title={t('reports.title')}
        description={t('reports.subtitle')}
        actions={
          <Tabs value={period} onValueChange={(value) => setPeriod(value as Period)}>
            <TabsList className="h-auto flex-wrap">
              {periodKeys.map((item) => (
                <TabsTrigger key={item} value={item}>
                  {t(`reports.periods.${item}`)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        }
      />

      <PerformanceChart period={period} />
      <SummaryCards period={period} />

      <div className="grid gap-6 xl:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.35fr)]">
        <PerformanceComparison />
        <TopAssets period={period} />
      </div>

      <CashFlowChart period={period} />

      <Separator />

      <DCASection />
    </div>
  )
}
