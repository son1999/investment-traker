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
    <Card className="w-full min-w-0 border-border">
      <CardHeader className="flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div><CardTitle className="text-sm">{t('reports.cashFlow')}</CardTitle><CardDescription>{t('reports.cashFlowSub')}</CardDescription></div>
        <div className="flex flex-wrap gap-4 md:gap-5">
          <div className="flex items-center gap-1.5"><div className="size-2 rounded-sm bg-positive/60" /><span className="text-[11px] text-muted-foreground">{t('reports.inflow')}</span></div>
          <div className="flex items-center gap-1.5"><div className="size-2 rounded-sm bg-destructive/60" /><span className="text-[11px] text-muted-foreground">{t('reports.outflow')}</span></div>
        </div>
      </CardHeader>
      <CardContent className="min-w-0">
        <div className="w-full min-w-0 overflow-x-auto">
          <div className="flex min-w-[520px] items-end gap-4 px-2 sm:gap-6">
          {months.map((m, index) => (
            <div key={`${m.month}-${index}`} className="flex flex-1 flex-col items-center gap-3">
              <div className="flex w-full items-end justify-center gap-1" style={{ height: '180px' }}>
                <div className="w-full max-w-7 rounded-t bg-positive/50" style={{ height: `${(m.inflow / maxVal) * 160}px` }} />
                <div className="w-full max-w-7 rounded-t bg-destructive/40" style={{ height: `${(m.outflow / maxVal) * 160}px` }} />
              </div>
              <span className="font-mono text-[11px] text-muted-foreground">{m.month}</span>
            </div>
          ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
