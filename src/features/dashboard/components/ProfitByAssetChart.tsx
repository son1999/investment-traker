import { useTranslation } from 'react-i18next'
import { useProfitByAsset } from '@/hooks/usePortfolio'

export default function ProfitByAssetChart() {
  const { t } = useTranslation()
  const { data } = useProfitByAsset()

  const items = data || []
  const maxAbs = Math.max(...items.map((i) => Math.abs(i.profitPercent)), 1)

  return (
    <div className="flex h-full w-full min-w-0 flex-col rounded-2xl border border-border bg-card p-4 sm:p-5">
      <h3 className="mb-4 text-sm font-bold text-foreground">{t('dashboard.profitByCode')}</h3>
      <div className="flex flex-col gap-3">
        {items.map((item) => {
          const color = item.positive ? '#22c55e' : '#ef4444'
          const widthPct = (Math.abs(item.profitPercent) / maxAbs) * 85
          return (
            <div key={item.symbol} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-['JetBrains_Mono'] text-xs font-bold text-foreground">{item.symbol}</span>
                <span className="font-['JetBrains_Mono'] text-xs font-bold" style={{ color }}>{item.positive ? '+' : ''}{item.profitPercent.toFixed(1)}%</span>
              </div>
              <div className={`flex h-1.5 overflow-hidden rounded-full bg-muted ${!item.positive ? 'flex-row-reverse' : ''}`}>
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${widthPct}%`, backgroundColor: color }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
