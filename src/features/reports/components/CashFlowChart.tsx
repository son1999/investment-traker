import { useTranslation } from 'react-i18next'
import { useCashFlow } from '@/hooks/useReports'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Period } from '@/types/api'

export default function CashFlowChart({ period }: { period: Period }) {
  const { t } = useTranslation()
  const { data, isLoading } = useCashFlow(period)

  if (isLoading) return <Skeleton className="h-64 rounded-lg" />

  const months = data || []
  const maxVal = Math.max(...months.map(m => Math.max(m.inflow, m.outflow)), 1)

  return (
    <Card className="border-edge">
      <CardHeader className="flex-row items-center justify-between">
        <div><CardTitle className="text-sm">{t('reports.cashFlow')}</CardTitle><CardDescription>{t('reports.cashFlowSub')}</CardDescription></div>
        <div className="flex gap-5">
          <div className="flex items-center gap-1.5"><div className="size-2 rounded-sm bg-positive/60" /><span className="text-[11px] text-caption">{t('reports.inflow')}</span></div>
          <div className="flex items-center gap-1.5"><div className="size-2 rounded-sm bg-destructive/60" /><span className="text-[11px] text-caption">{t('reports.outflow')}</span></div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-6 px-2">
          {months.map(m => (
            <div key={m.month} className="flex flex-1 flex-col items-center gap-3">
              <div className="flex w-full items-end justify-center gap-1" style={{ height: '180px' }}>
                <div className="w-full max-w-7 rounded-t bg-positive/50" style={{ height: `${(m.inflow / maxVal) * 160}px` }} />
                <div className="w-full max-w-7 rounded-t bg-destructive/40" style={{ height: `${(m.outflow / maxVal) * 160}px` }} />
              </div>
              <span className="font-mono text-[11px] text-caption">{m.month}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
