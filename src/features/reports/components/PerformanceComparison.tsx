import { useTranslation } from 'react-i18next'
import { usePerformanceComparison } from '@/hooks/useReports'

export default function PerformanceComparison() {
  const { t } = useTranslation()
  const { data } = usePerformanceComparison()
  const items = data || []

  return (
    <div className="flex flex-col gap-6 rounded-lg border border-edge bg-panel p-5">
      <div><h3 className="text-sm font-medium text-heading">{t('reports.comparison')}</h3><p className="mt-0.5 text-xs text-caption">{t('reports.comparisonSub')}</p></div>
      <div className="flex flex-col gap-5">
        {items.map((a) => {
          const maxInvest = Math.max(...items.map((i) => i.invested), 1)
          const investPct = (a.invested / maxInvest) * 60
          const gainPct = Math.abs(a.profitPercent) / 100 * 30
          const color = a.positive ? '#f59e0b' : '#ef4444'
          return (
            <div key={a.assetCode} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-body">{a.name}</span>
                <span className="font-mono text-xs font-medium" style={{ color: a.positive ? 'var(--positive)' : 'var(--negative)' }}>{a.positive ? '+' : ''}{a.profitPercent.toFixed(1)}%</span>
              </div>
              <div className="flex h-2 overflow-hidden rounded-full bg-field">
                <div className="h-full bg-dim/60" style={{ width: `${investPct}%` }} />
                <div className="h-full" style={{ width: `${gainPct}%`, backgroundColor: color }} />
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex gap-4 border-t border-edge pt-4">
        <div className="flex items-center gap-1.5"><div className="size-2 rounded-sm bg-dim/60" /><span className="text-[11px] text-caption">{t('reports.invested')}</span></div>
        <div className="flex items-center gap-1.5"><div className="size-2 rounded-sm bg-gold" /><span className="text-[11px] text-caption">{t('reports.profitLoss')}</span></div>
      </div>
    </div>
  )
}
