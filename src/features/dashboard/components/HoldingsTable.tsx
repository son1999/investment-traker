import { ArrowUpRight, Heart, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { EmptyState } from '@/components/app'
import { AssetIcon } from '@/components/ui/asset-icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useHoldings } from '@/hooks/usePortfolio'
import { formatCurrency, formatCurrencySigned } from '@/lib/format'

const typeLabel: Record<string, string> = {
  metal: 'common.metal',
  crypto: 'common.crypto',
  stock: 'common.stock',
  savings: 'common.savings',
}

const cardArt: Record<string, string> = {
  metal:
    'linear-gradient(145deg, rgba(255,255,255,0.08), transparent 50%), radial-gradient(circle at top right, rgba(243,195,79,0.34), transparent 38%), linear-gradient(180deg, #fdf4d8 0%, #f6e8b1 100%)',
  crypto:
    'linear-gradient(145deg, rgba(255,255,255,0.08), transparent 50%), radial-gradient(circle at top right, rgba(70,4,121,0.28), transparent 40%), linear-gradient(180deg, #f5eefc 0%, #ebdbf6 100%)',
  stock:
    'linear-gradient(145deg, rgba(255,255,255,0.08), transparent 50%), radial-gradient(circle at top right, rgba(255,56,92,0.26), transparent 40%), linear-gradient(180deg, #fff1f4 0%, #ffdfe7 100%)',
  savings:
    'linear-gradient(145deg, rgba(255,255,255,0.08), transparent 50%), radial-gradient(circle at top right, rgba(0,138,98,0.22), transparent 38%), linear-gradient(180deg, #eef9f5 0%, #dbf1e8 100%)',
}

export default function HoldingsTable() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: holdings, isLoading } = useHoldings()

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Skeleton key={item} className="h-[340px] rounded-[20px]" />
        ))}
      </div>
    )
  }

  const items = holdings || []

  if (items.length === 0) {
    return (
      <EmptyState
        title={t('dashboard.holdings')}
        description={t('assets.noAssets')}
      />
    )
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <span className="air-section-eyebrow">{t('dashboard.holdings')}</span>
          <h2 className="text-[1.75rem] leading-[1.1] font-bold tracking-[-0.04em] text-foreground">
            Browse open positions as if they were curated stays.
          </h2>
        </div>
        <Button variant="outline" size="lg" onClick={() => navigate('/assets')}>
          {t('dashboard.viewDetails')}
        </Button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((holding) => (
          <article
            key={holding.assetCode}
            className="air-surface group overflow-hidden transition-transform duration-200 hover:-translate-y-0.5"
          >
            <button
              type="button"
              onClick={() => navigate(`/assets/${holding.assetCode}`)}
              className="w-full text-left"
            >
              <div
                className="relative aspect-[16/10] overflow-hidden rounded-t-[20px] p-5"
                style={{ background: cardArt[holding.assetType] || cardArt.stock }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(34,34,34,0.02)_0%,rgba(34,34,34,0.08)_100%)]" />
                <div className="relative z-10 flex items-start justify-between gap-3">
                  <Badge variant="outline">{t(typeLabel[holding.assetType] || holding.assetType)}</Badge>
                  <div className="flex size-9 items-center justify-center rounded-full bg-white/92 shadow-[var(--shadow-card)]">
                    <Heart size={15} className="text-[var(--palette-bg-primary-core)]" />
                  </div>
                </div>
                <div className="relative z-10 mt-10 flex items-end justify-between gap-4">
                  <div className="rounded-full bg-white/88 p-2 shadow-[var(--shadow-card)] backdrop-blur-sm">
                    <AssetIcon
                      code={holding.assetCode}
                      assetType={holding.assetType}
                      fallback={holding.icon}
                      fallbackBg={holding.iconBg}
                      sizeClass="size-11"
                    />
                  </div>
                  <div className="rounded-full bg-white/88 px-3 py-2 text-sm font-medium text-foreground shadow-[var(--shadow-card)] backdrop-blur-sm">
                    {holding.quantity.toLocaleString('en-US')}
                  </div>
                </div>
              </div>

              <div className="space-y-4 px-5 py-5">
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-[1.15rem] leading-[1.15] font-semibold tracking-[-0.03em] text-foreground">
                      {holding.name}
                    </h3>
                    <ArrowUpRight
                      size={16}
                      className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={13} />
                    <span>{holding.assetCode}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="space-y-1">
                    <p className="air-section-eyebrow">{t('dashboard.colAvgCost')}</p>
                    <p className="font-medium text-foreground">
                      {formatCurrency(holding.averageCost, holding.currency)}
                    </p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="air-section-eyebrow">{t('dashboard.colCurrentPrice')}</p>
                    <p className="font-medium text-foreground">
                      {formatCurrency(holding.currentPrice, holding.currency)}
                    </p>
                  </div>
                </div>

                <div className="flex items-end justify-between gap-3 border-t border-black/5 pt-4">
                  <div>
                    <p className="air-section-eyebrow">{t('dashboard.colValue')}</p>
                    <p className="mt-1 text-lg font-semibold tracking-[-0.03em] text-foreground">
                      {formatCurrency(holding.value)}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={holding.positive ? 'default' : 'destructive'}>
                      {holding.positive ? '+' : ''}
                      {holding.profitLossPercent.toFixed(2)}%
                    </Badge>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {formatCurrencySigned(holding.profitLossAmount)}
                    </p>
                  </div>
                </div>
              </div>
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
