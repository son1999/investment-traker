import { useTranslation } from 'react-i18next'

import { Skeleton } from '@/components/ui/skeleton'
import { useReportSummary } from '@/hooks/useReports'
import { formatCurrency, formatCurrencySigned } from '@/lib/format'
import type { Period } from '@/types/api'

export default function SummaryCards({ period }: { period: Period }) {
  const { t } = useTranslation()
  const { data, isLoading } = useReportSummary(period)

  if (isLoading) {
    return (
      <div className="air-stagger-grid grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <Skeleton key={item} className="h-32 rounded-[20px]" />
        ))}
      </div>
    )
  }

  const cards = [
    {
      label: t('reports.totalDeposited'),
      value: data ? formatCurrency(data.totalDeposited) : '—',
      sub: t('reports.fromYearStart'),
    },
    {
      label: t('reports.totalWithdrawn'),
      value: data ? formatCurrency(data.totalWithdrawn) : '—',
      sub: t('reports.paymentAccount'),
    },
    {
      label: t('reports.realizedPnl'),
      value: data ? formatCurrencySigned(data.realizedPnl) : '—',
      color: data && data.realizedPnl < 0 ? 'var(--destructive)' : 'var(--foreground)',
      sub: t('reports.realizedProfit'),
    },
    {
      label: t('reports.unrealizedPnl'),
      value: data ? formatCurrencySigned(data.unrealizedPnl) : '—',
      color: data && data.unrealizedPnl < 0 ? 'var(--destructive)' : 'var(--foreground)',
      sub: t('reports.marketValue'),
    },
  ]

  return (
    <div className="air-stagger-grid grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => (
        <article
          key={card.label}
          className="air-surface air-interactive-card relative overflow-hidden px-5 py-5"
          style={{
            background:
              index % 2 === 0
                ? 'radial-gradient(circle at top right, rgba(255,56,92,0.14), transparent 32%), linear-gradient(180deg, #fff 0%, #fbfbfb 100%)'
                : 'radial-gradient(circle at top right, rgba(70,4,121,0.1), transparent 34%), linear-gradient(180deg, #fff 0%, #fbfbfb 100%)',
          }}
        >
          <span className="air-section-eyebrow">{card.label}</span>
          <p className="mt-4 text-[1.55rem] leading-none font-semibold tracking-[-0.04em]" style={{ color: card.color || 'var(--foreground)' }}>
            {card.value}
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{card.sub}</p>
        </article>
      ))}
    </div>
  )
}
