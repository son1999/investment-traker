import { useTranslation } from 'react-i18next'
import { useReportSummary } from '@/hooks/useReports'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Period } from '@/types/api'

function formatVND(v: number): string { return (v >= 0 ? '+' : '') + v.toLocaleString('vi-VN') }

export default function SummaryCards({ period }: { period: Period }) {
  const { t } = useTranslation()
  const { data, isLoading } = useReportSummary(period)

  if (isLoading) return <div className="grid grid-cols-4 gap-4">{[1,2,3,4].map(i => <Skeleton key={i} className="h-24 rounded-lg" />)}</div>

  const cards = [
    { label: t('reports.totalDeposited'), value: data ? data.totalDeposited.toLocaleString('vi-VN') : '—', sub: t('reports.fromYearStart') },
    { label: t('reports.totalWithdrawn'), value: data ? data.totalWithdrawn.toLocaleString('vi-VN') : '—', sub: t('reports.paymentAccount') },
    { label: t('reports.realizedPnl'), value: data ? formatVND(data.realizedPnl) : '—', color: data && data.realizedPnl >= 0 ? 'var(--positive)' : 'var(--negative)', sub: t('reports.realizedProfit') },
    { label: t('reports.unrealizedPnl'), value: data ? formatVND(data.unrealizedPnl) : '—', color: 'var(--gold)', sub: t('reports.marketValue') },
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map(c => (
        <Card key={c.label} className="border-edge">
          <CardContent className="flex flex-col gap-1.5 p-5">
            <span className="text-[11px] font-medium uppercase tracking-wide text-caption">{c.label}</span>
            <span className="font-mono text-lg font-semibold tracking-tight" style={{ color: c.color || 'var(--heading)' }}>{c.value}</span>
            <span className="text-[11px] text-muted-foreground">{c.sub}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
