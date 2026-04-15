import { useTranslation } from 'react-i18next'
import { useReportSummary } from '@/hooks/useReports'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Period } from '@/types/api'
import { formatCurrency, formatCurrencySigned } from '@/lib/format'

export default function SummaryCards({ period }: { period: Period }) {
  const { t } = useTranslation()
  const { data, isLoading } = useReportSummary(period)

  if (isLoading) return <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">{[1,2,3,4].map(i => <Skeleton key={i} className="h-24 rounded-lg" />)}</div>

  const cards = [
    { label: t('reports.totalDeposited'), value: data ? formatCurrency(data.totalDeposited) : '—', sub: t('reports.fromYearStart') },
    { label: t('reports.totalWithdrawn'), value: data ? formatCurrency(data.totalWithdrawn) : '—', sub: t('reports.paymentAccount') },
    { label: t('reports.realizedPnl'), value: data ? formatCurrencySigned(data.realizedPnl) : '—', color: data && data.realizedPnl >= 0 ? 'var(--positive)' : 'var(--negative)', sub: t('reports.realizedProfit') },
    { label: t('reports.unrealizedPnl'), value: data ? formatCurrencySigned(data.unrealizedPnl) : '—', color: data && data.unrealizedPnl >= 0 ? 'var(--positive)' : 'var(--negative)', sub: t('reports.marketValue') },
  ]

  return (
    <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(c => (
        <Card key={c.label} className="border-border">
          <CardContent className="flex flex-col gap-1.5 p-5">
            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{c.label}</span>
            <span className="font-mono text-lg font-semibold tracking-tight" style={{ color: c.color || 'var(--foreground)' }}>{c.value}</span>
            <span className="text-[11px] text-muted-foreground">{c.sub}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
