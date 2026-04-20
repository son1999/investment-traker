import { Wallet, ChartNoAxesCombined, Target } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import { usePortfolioSummary } from '@/hooks/usePortfolio'

const icons = [Wallet, ChartNoAxesCombined, Target]
const accents = [
  'radial-gradient(circle at top right, rgba(255,56,92,0.18), transparent 34%), linear-gradient(180deg, #fff 0%, #fbfbfb 100%)',
  'radial-gradient(circle at top right, rgba(70,4,121,0.12), transparent 36%), linear-gradient(180deg, #fff 0%, #fbfbfb 100%)',
  'radial-gradient(circle at top right, rgba(146,23,77,0.12), transparent 36%), linear-gradient(180deg, #fff 0%, #fbfbfb 100%)',
]

export default function MetricCards() {
  const { t } = useTranslation()
  const { data } = usePortfolioSummary()

  const stats = [
    {
      label: t('dashboard.capitalInvested'),
      value: `${(data?.capitalInvested ?? 0).toLocaleString('vi-VN')} ₫`,
      note: `${data?.buyOrdersCount ?? 0} ${t('dashboard.buyOrders')}`,
      badge: t('transactions.title'),
    },
    {
      label: t('dashboard.profit'),
      value: `${data && data.profit > 0 ? '+' : ''}${(data?.profit ?? 0).toLocaleString('vi-VN')} ₫`,
      note: `${data?.profitPercentage?.toFixed(2) ?? '0.00'}% ${t('dashboard.vsCapital')}`,
      badge: t('reports.title'),
    },
    {
      label: t('dashboard.assets'),
      value: `${data?.assetsCount ?? 0}`,
      note: data?.assetCodes?.join(', ') || '—',
      badge: t('assets.title'),
    },
  ]

  return (
    <div className="air-stagger-grid grid gap-4 lg:grid-cols-3">
      {stats.map((stat, index) => {
        const Icon = icons[index]

        return (
          <article
            key={stat.label}
            className="air-surface air-interactive-card relative overflow-hidden px-5 py-5"
            style={{ background: accents[index] }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <Badge variant="outline">{stat.badge}</Badge>
                <div className="space-y-2">
                  <p className="air-section-eyebrow">{stat.label}</p>
                  <p className="text-[1.7rem] leading-none font-semibold tracking-[-0.04em] text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-sm leading-6 text-muted-foreground">{stat.note}</p>
                </div>
              </div>
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white shadow-[var(--shadow-card)]">
                <Icon size={18} className="text-[var(--palette-bg-primary-core)]" />
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
