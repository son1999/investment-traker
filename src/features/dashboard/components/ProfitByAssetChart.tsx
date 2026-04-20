import { ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { AssetIcon } from '@/components/ui/asset-icon'
import { Badge } from '@/components/ui/badge'
import { useProfitByAsset } from '@/hooks/usePortfolio'
import { formatCurrency } from '@/lib/format'

export default function ProfitByAssetChart() {
  const { t } = useTranslation()
  const { data } = useProfitByAsset()

  const items = (data || [])
    .slice()
    .sort((left, right) => right.profitPercent - left.profitPercent)
    .slice(0, 5)

  return (
    <section className="air-surface px-5 py-5 sm:px-6">
      <div className="space-y-2">
        <span className="air-section-eyebrow">{t('dashboard.profitByCode')}</span>
        <h3 className="text-xl font-semibold tracking-[-0.03em] text-foreground">Featured movers</h3>
      </div>

      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <article key={item.symbol} className="rounded-[20px] bg-[var(--palette-surface-subtle)] px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <AssetIcon
                  code={item.symbol}
                  assetType={item.assetType}
                  fallback={item.icon}
                  fallbackBg={item.iconBg}
                  sizeClass="size-10"
                />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">{item.symbol}</p>
                  <p className="text-sm text-muted-foreground">{formatCurrency(item.value)}</p>
                </div>
              </div>
              <ArrowUpRight size={16} className="text-muted-foreground" />
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">{formatCurrency(item.cost)}</p>
              <Badge variant={item.positive ? 'default' : 'destructive'}>
                {item.positive ? '+' : ''}
                {item.profitPercent.toFixed(2)}%
              </Badge>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
