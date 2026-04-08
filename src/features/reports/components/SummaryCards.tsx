import { useTranslation } from 'react-i18next'
import { useReportSummary } from '@/hooks/useReports'
import type { Period } from '@/types/api'

function formatVND(v: number): string { return (v >= 0 ? '+' : '') + v.toLocaleString('vi-VN') }

export default function SummaryCards({ period }: { period: Period }) {
  const { t } = useTranslation()
  const { data } = useReportSummary(period)

  const cards = [
    { label: t('reports.totalDeposited'), value: data ? data.totalDeposited.toLocaleString('vi-VN') : '—', sub: t('reports.fromYearStart') },
    { label: t('reports.totalWithdrawn'), value: data ? data.totalWithdrawn.toLocaleString('vi-VN') : '—', sub: t('reports.paymentAccount') },
    { label: t('reports.realizedPnl'), value: data ? formatVND(data.realizedPnl) : '—', color: data && data.realizedPnl >= 0 ? 'var(--positive)' : 'var(--negative)', sub: t('reports.realizedProfit') },
    { label: t('reports.unrealizedPnl'), value: data ? formatVND(data.unrealizedPnl) : '—', color: 'var(--gold)', sub: t('reports.marketValue') },
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="flex flex-col gap-1.5 rounded-lg border border-edge bg-panel p-5">
          <span className="text-[11px] font-medium uppercase tracking-wide text-caption">{c.label}</span>
          <span className="font-mono text-lg font-semibold tracking-tight" style={{ color: c.color || 'var(--heading)' }}>{c.value}</span>
          <span className="text-[11px] text-dim">{c.sub}</span>
        </div>
      ))}
    </div>
  )
}
