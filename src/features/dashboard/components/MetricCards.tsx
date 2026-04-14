import { useTranslation } from 'react-i18next'

import { usePortfolioSummary } from '@/hooks/usePortfolio'
import { cn } from '@/lib/utils'

function formatCompact(value: number): string {
  const abs = Math.abs(value)
  if (abs >= 1e9) return `${(value / 1e9).toFixed(2)} ty`
  if (abs >= 1e6) return `${(value / 1e6).toFixed(0)}M`
  if (abs >= 1e3) return `${(value / 1e3).toFixed(1)}k`
  return value.toLocaleString('vi-VN')
}

export default function MetricCards() {
  const { t } = useTranslation()
  const { data } = usePortfolioSummary()

  const stats = [
    {
      label: t('dashboard.capitalInvested'),
      value: data ? formatCompact(data.capitalInvested) : '—',
      unit: '₫',
      sub: data ? `${data.buyOrdersCount} ${t('dashboard.buyOrders')}` : '',
      color: 'var(--foreground)',
    },
    {
      label: t('dashboard.profit'),
      value: data ? `${data.profit >= 0 ? '+' : ''}${formatCompact(data.profit)}` : '—',
      unit: '₫',
      sub: data ? `${data.profitPercentage >= 0 ? '+' : ''}${data.profitPercentage.toFixed(2)}% ${t('dashboard.vsCapital')}` : '',
      color: data && data.profit >= 0 ? 'var(--positive)' : 'var(--negative)',
    },
    {
      label: t('dashboard.assets'),
      value: data ? String(data.assetsCount) : '—',
      unit: t('dashboard.assets'),
      sub: data?.assetCodes?.join(', ') || '',
      color: 'var(--foreground)',
    },
  ]

  const renderCard = (stat: (typeof stats)[number], extraClass = '') => (
    <div
      key={stat.label}
      className={cn('min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5', extraClass)}
    >
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.8px] text-muted-foreground">
          {stat.label}
        </span>
        <div className="flex flex-wrap items-end gap-x-1.5 gap-y-1">
          <span
            className="font-['JetBrains_Mono'] text-lg font-bold tracking-tight sm:text-xl"
            style={{ color: stat.color }}
          >
            {stat.value}
          </span>
          <span className="text-xs text-muted-foreground">{stat.unit}</span>
        </div>
        <span className="break-words text-[11px] text-muted-foreground">{stat.sub}</span>
      </div>
    </div>
  )

  return (
    <div className="grid min-w-0 items-stretch gap-4 xl:grid-cols-10">
      <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:col-span-7">
        {renderCard(stats[0])}
        {renderCard(stats[1])}
      </div>
      <div className="min-w-0 xl:col-span-3">{renderCard(stats[2], 'h-full')}</div>
    </div>
  )
}
