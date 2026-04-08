import { useTranslation } from 'react-i18next'

export default function PerformanceComparison() {
  const { t } = useTranslation()

  const assets = [
    { name: t('common.metal'), pct: '+5.2%', color: '#f59e0b', positive: true, invest: 60, gain: 12 },
    { name: t('common.bitcoin'), pct: '+24.8%', color: '#f97316', positive: true, invest: 38, gain: 30 },
    { name: t('common.stock'), pct: '-2.1%', color: '#ef4444', positive: false, invest: 52, gain: 4 },
  ]

  return (
    <div className="flex flex-col gap-6 rounded-lg border border-edge bg-panel p-5">
      <div>
        <h3 className="text-sm font-medium text-heading">{t('reports.comparison')}</h3>
        <p className="mt-0.5 text-xs text-caption">{t('reports.comparisonSub')}</p>
      </div>

      <div className="flex flex-col gap-5">
        {assets.map((a) => (
          <div key={a.name} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-body">{a.name}</span>
              <span
                className="font-mono text-xs font-medium"
                style={{ color: a.positive ? 'var(--positive)' : 'var(--negative)' }}
              >
                {a.pct}
              </span>
            </div>
            <div className="flex h-2 overflow-hidden rounded-full bg-field">
              <div className="h-full bg-dim/60" style={{ width: `${a.invest}%` }} />
              <div className="h-full" style={{ width: `${a.gain}%`, backgroundColor: a.color }} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 border-t border-edge pt-4">
        <div className="flex items-center gap-1.5">
          <div className="size-2 rounded-sm bg-dim/60" />
          <span className="text-[11px] text-caption">{t('reports.invested')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="size-2 rounded-sm bg-gold" />
          <span className="text-[11px] text-caption">{t('reports.profitLoss')}</span>
        </div>
      </div>
    </div>
  )
}
