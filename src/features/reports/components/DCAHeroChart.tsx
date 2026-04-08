import { useTranslation } from 'react-i18next'

export default function DCAHeroChart() {
  const { t } = useTranslation()

  const barHeights = [40, 60, 35, 85, 55, 70, 45, 90]
  const currentPricePct = 65

  const stats = [
    { label: t('reports.numPurchases'), value: '8' },
    { label: t('reports.avgInterval'), value: '15 ngày' },
    { label: t('reports.avgPerPurchase'), value: '20.5 tr ₫' },
  ]

  const yLeft = ['40M', '20M', '0']
  const yRight = ['120M', '60M', '0']
  const xAxis = ['01/01', '01/02', '01/03', '01/04']
  return (
    <div className="rounded-lg border border-edge bg-panel p-6">
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-sm font-medium text-heading">{t('reports.dca')}</h2>
            <p className="mt-0.5 text-xs text-caption">{t('reports.dcaSub')}</p>
          </div>
          <div className="flex gap-5">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-end gap-0.5">
                <span className="text-[10px] uppercase tracking-wide text-caption">{s.label}</span>
                <span className="font-mono text-base font-semibold text-heading">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="relative flex h-[200px] items-end pt-2">
          {/* Y left */}
          <div className="absolute bottom-0 left-0 top-2 flex flex-col justify-between">
            {yLeft.map((v) => (
              <span key={v} className="font-mono text-[10px] text-dim">{v}</span>
            ))}
          </div>

          {/* Bars */}
          <div className="flex flex-1 items-end justify-between gap-2 px-12">
            {barHeights.map((h, i) => (
              <div
                key={i}
                className="relative flex-1 rounded-t bg-dim/40"
                style={{ height: `${(h / 100) * 170}px` }}
              >
                <div className="absolute left-0 right-0 top-0 h-0.5 rounded-full bg-gold" />
              </div>
            ))}
          </div>

          {/* Y right */}
          <div className="absolute bottom-0 right-0 top-2 flex flex-col justify-between">
            {yRight.map((v) => (
              <span key={v} className="font-mono text-[10px] text-dim">{v}</span>
            ))}
          </div>

          {/* Current price line */}
          <div
            className="absolute left-12 right-12 border-t border-dashed border-positive/50"
            style={{ bottom: `${currentPricePct}%` }}
          >
            <span className="absolute -top-2 right-0 bg-panel px-1.5 text-[10px] text-positive">
              {t('reports.currentPrice')}
            </span>
          </div>
        </div>

        {/* Legend + X-axis */}
        <div className="flex items-center justify-between px-12">
          <div className="flex gap-5">
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-sm bg-dim/40" />
              <span className="text-[11px] text-caption">{t('reports.purchaseAmount')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-0.5 w-3 rounded-full bg-gold" />
              <span className="text-[11px] text-caption">{t('reports.avgCostPrice')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-px w-3 border-t border-dashed border-positive" />
              <span className="text-[11px] text-caption">{t('reports.currentPrice')}</span>
            </div>
          </div>
          <div className="flex gap-12">
            {xAxis.map((d) => (
              <span key={d} className="font-mono text-[10px] text-dim">{d}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
