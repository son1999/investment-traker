import { useTranslation } from 'react-i18next'
import { usePerformanceComparison } from '@/hooks/useReports'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

export default function PerformanceComparison() {
  const { t } = useTranslation()
  const { data, isLoading } = usePerformanceComparison()

  if (isLoading) return <Skeleton className="h-64 rounded-lg" />

  const items = data || []

  return (
    <Card className="w-full min-w-0 border-border">
      <CardHeader>
        <CardTitle className="text-sm">{t('reports.comparison')}</CardTitle>
        <CardDescription>{t('reports.comparisonSub')}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {(() => {
          const maxBase = Math.max(
            ...items.map((i) => Math.max(i.invested, i.currentValue)),
            1,
          )
          return items.map((a) => {
            const profit = a.currentValue - a.invested
            const investWidth = (a.invested / maxBase) * 100
            const gainWidth = (Math.max(profit, 0) / maxBase) * 100
            const lossWidth = (Math.max(-profit, 0) / maxBase) * 100
            const grayLeft = a.positive ? investWidth : investWidth - lossWidth
            return (
              <div key={a.assetCode} className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="min-w-0 text-xs font-medium">{a.name}</span>
                  <span
                    className="font-mono text-xs font-medium"
                    style={{ color: a.positive ? 'var(--positive)' : 'var(--negative)' }}
                  >
                    {a.positive ? '+' : ''}
                    {a.profitPercent.toFixed(1)}%
                  </span>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted/40">
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-muted-foreground/40"
                    style={{ width: `${grayLeft}%` }}
                  />
                  {a.positive ? (
                    <div
                      className="absolute top-0 bottom-0 bg-positive"
                      style={{ left: `${investWidth}%`, width: `${gainWidth}%` }}
                    />
                  ) : (
                    <div
                      className="absolute top-0 bottom-0 bg-negative"
                      style={{ left: `${grayLeft}%`, width: `${lossWidth}%` }}
                    />
                  )}
                </div>
              </div>
            )
          })
        })()}
        <Separator />
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-sm bg-muted-foreground/40" />
            <span className="text-[11px] text-muted-foreground">{t('reports.invested')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-sm bg-positive" />
            <span className="text-[11px] text-muted-foreground">{t('common.profit')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-sm bg-negative" />
            <span className="text-[11px] text-muted-foreground">{t('common.loss')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
