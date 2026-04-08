import { useTranslation } from 'react-i18next'
import { usePortfolioSummary } from '@/hooks/usePortfolio'

function formatCompact(value: number): string {
  const abs = Math.abs(value)
  if (abs >= 1e9) return (value / 1e9).toFixed(2) + ' tỷ'
  if (abs >= 1e6) return (value / 1e6).toFixed(0) + 'M'
  if (abs >= 1e3) return (value / 1e3).toFixed(1) + 'k'
  return value.toLocaleString('vi-VN')
}

export default function MetricCards() {
  const { t } = useTranslation()
  const { data } = usePortfolioSummary()

  const stats = [
    {
      label: t('dashboard.capitalInvested'),
      value: data ? formatCompact(data.capitalInvested) : '—',
      unit: '���',
      sub: data ? `${data.buyOrdersCount} ${t('dashboard.buyOrders')}` : '',
      color: 'var(--heading)',
    },
    {
      label: t('dashboard.profit'),
      value: data ? (data.profit >= 0 ? '+' : '') + formatCompact(data.profit) : '—',
      unit: '₫',
      sub: data ? `${data.profitPercentage >= 0 ? '+' : ''}${data.profitPercentage.toFixed(2)}% ${t('dashboard.vsCapital')}` : '',
      color: data && data.profit >= 0 ? 'var(--positive)' : 'var(--negative)',
    },
    {
      label: t('dashboard.assets'),
      value: data ? String(data.assetsCount) : '—',
      unit: t('dashboard.assets'),
      sub: data?.assetCodes?.join(', ') || '',
      color: 'var(--heading)',
    },
  ]

  return (
    <div className="flex items-stretch rounded-xl border border-edge bg-panel">
      {stats.map((s, i) => (
        <div key={s.label} className="flex flex-1 items-center gap-4">
          <div className={`flex flex-1 flex-col gap-1 py-4 ${i === 0 ? 'pl-6' : 'pl-5'} pr-5`}>
            <span className="text-[10px] font-semibold uppercase tracking-[0.8px] text-caption">{s.label}</span>
            <div className="flex items-baseline gap-1">
              <span className="font-['JetBrains_Mono'] text-xl font-bold tracking-tight" style={{ color: s.color }}>{s.value}</span>
              <span className="text-xs text-caption">{s.unit}</span>
            </div>
            <span className="text-[11px] text-caption">{s.sub}</span>
          </div>
          {i < stats.length - 1 && <div className="h-10 w-px bg-edge" />}
        </div>
      ))}
    </div>
  )
}
