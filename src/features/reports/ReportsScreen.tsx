import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import PerformanceChart from './components/PerformanceChart'
import SummaryCards from './components/SummaryCards'
import PerformanceComparison from './components/PerformanceComparison'
import TopAssets from './components/TopAssets'
import CashFlowChart from './components/CashFlowChart'
import DCASection from './components/DCASection'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import type { Period } from '@/types/api'

const periodKeys: Period[] = ['1m', '3m', '6m', '1y', 'all']

export default function ReportsScreen() {
  const { t } = useTranslation()
  const [period, setPeriod] = useState<Period>('all')

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-6 py-8">
      <div className="flex flex-col gap-12">
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold text-heading">{t('reports.title')}</h1>
            <p className="text-sm text-caption">{t('reports.subtitle')}</p>
          </div>
          <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
            <TabsList>
              {periodKeys.map((p) => (
                <TabsTrigger key={p} value={p}>{t(`reports.periods.${p}`)}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <PerformanceChart period={period} />
        <SummaryCards period={period} />
        <div className="grid grid-cols-3 gap-8">
          <PerformanceComparison />
          <div className="col-span-2"><TopAssets period={period} /></div>
        </div>
        <CashFlowChart period={period} />

        <Separator />

        {/* DCA Analysis Section */}
        <DCASection />
      </div>
    </div>
  )
}
