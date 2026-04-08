import { useTranslation } from 'react-i18next'

export default function PerformanceChart() {
  const { t } = useTranslation()

  const months = [t('reports.month1'), t('reports.month2'), t('reports.month3'), t('reports.month4'), t('reports.month5'), t('reports.month6')]
  const yLabels = ['300M', '200M', '100M', '0']
  const legend = [
    { label: t('common.metal'), color: '#f59e0b' },
    { label: t('common.bitcoin'), color: '#f97316' },
    { label: t('common.stock'), color: '#60a5fa' },
  ]
  return (
    <div className="flex flex-col gap-5 rounded-lg border border-edge bg-panel p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-heading">{t('reports.performance')}</h2>
        <div className="flex gap-5">
          {legend.map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="size-2 rounded-full" style={{ backgroundColor: l.color }} />
              <span className="text-xs text-caption">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        {/* Y-axis */}
        <div className="flex w-10 flex-col justify-between pb-7 text-right">
          {yLabels.map((v) => (
            <span key={v} className="font-mono text-[10px] text-dim">{v}</span>
          ))}
        </div>

        {/* Chart area */}
        <div className="relative flex-1">
          {/* Grid lines */}
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="absolute left-0 right-0 border-t border-edge"
              style={{ top: `${i * 33.33}%` }}
            />
          ))}

          {/* SVG area chart */}
          <svg className="relative z-10 h-[280px] w-full" viewBox="0 0 1000 280" preserveAspectRatio="none">
            <defs>
              <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="btcFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="stockFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.10" />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Bitcoin */}
            <path d="M0 220 C100 200 200 220 350 170 C500 120 650 100 800 70 C900 50 950 40 1000 30 L1000 280 L0 280Z" fill="url(#btcFill)" />
            <path d="M0 220 C100 200 200 220 350 170 C500 120 650 100 800 70 C900 50 950 40 1000 30" stroke="#f97316" strokeWidth="1.5" fill="none" />
            {/* Gold */}
            <path d="M0 250 C150 235 300 210 500 180 C650 160 850 130 1000 100 L1000 280 L0 280Z" fill="url(#goldFill)" />
            <path d="M0 250 C150 235 300 210 500 180 C650 160 850 130 1000 100" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
            {/* Stock */}
            <path d="M0 200 C120 190 250 165 400 150 C550 135 700 130 850 125 C950 122 980 120 1000 118 L1000 280 L0 280Z" fill="url(#stockFill)" />
            <path d="M0 200 C120 190 250 165 400 150 C550 135 700 130 850 125 C950 122 980 120 1000 118" stroke="#60a5fa" strokeWidth="1.5" fill="none" />
          </svg>

          {/* X-axis labels */}
          <div className="flex justify-between pt-3">
            {months.map((m) => (
              <span key={m} className="text-[11px] text-caption">{m}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
