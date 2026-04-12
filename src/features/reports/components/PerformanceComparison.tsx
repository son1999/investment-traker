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
        {items.map(a => {
          const maxInvest = Math.max(...items.map(i => i.invested), 1)
          const investPct = (a.invested / maxInvest) * 60
          const gainPct = Math.abs(a.profitPercent) / 100 * 30
          const color = a.positive ? '#f59e0b' : '#ef4444'
          return (
            <div key={a.assetCode} className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="min-w-0 text-xs font-medium">{a.name}</span>
                <span className="font-mono text-xs font-medium" style={{ color: a.positive ? 'var(--positive)' : 'var(--negative)' }}>{a.positive ? '+' : ''}{a.profitPercent.toFixed(1)}%</span>
              </div>
              <div className="flex h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-muted-foreground/30" style={{ width: `${investPct}%` }} />
                <div className="h-full" style={{ width: `${gainPct}%`, backgroundColor: color }} />
              </div>
            </div>
          )
        })}
        <Separator />
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-1.5"><div className="size-2 rounded-sm bg-muted-foreground/30" /><span className="text-[11px] text-muted-foreground">{t('reports.invested')}</span></div>
          <div className="flex items-center gap-1.5"><div className="size-2 rounded-sm bg-gold" /><span className="text-[11px] text-muted-foreground">{t('reports.profitLoss')}</span></div>
        </div>
      </CardContent>
    </Card>
  )
}
