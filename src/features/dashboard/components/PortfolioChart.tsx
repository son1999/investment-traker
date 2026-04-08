import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const periods = ['1m', '3m', '6m', '1y', 'all'] as const

// Mock data for each period (portfolio value over time)
const periodData: Record<string, number[]> = {
  '1m': [1180, 1195, 1170, 1210, 1200, 1225, 1215, 1240, 1235, 1250],
  '3m': [1050, 1080, 1060, 1100, 1090, 1130, 1120, 1160, 1180, 1170, 1200, 1220, 1250],
  '6m': [920, 960, 940, 980, 1010, 990, 1030, 1060, 1040, 1080, 1100, 1120, 1150, 1130, 1170, 1200, 1220, 1250],
  '1y': [780, 820, 800, 860, 840, 900, 880, 920, 960, 940, 980, 1010, 990, 1030, 1060, 1080, 1100, 1130, 1150, 1180, 1200, 1220, 1250],
  'all': [650, 700, 680, 750, 720, 780, 800, 770, 830, 860, 840, 890, 920, 900, 950, 980, 960, 1010, 1040, 1060, 1080, 1100, 1130, 1150, 1180, 1200, 1220, 1250],
}

function buildPath(points: number[], w: number, h: number, pad = 4) {
  const min = Math.min(...points) * 0.98
  const max = Math.max(...points) * 1.02
  const range = max - min || 1
  const stepX = w / (points.length - 1)

  const coords = points.map((v, i) => ({
    x: i * stepX,
    y: pad + (1 - (v - min) / range) * (h - pad * 2),
  }))

  const line = coords.map((c, i) => (i === 0 ? `M${c.x},${c.y}` : `L${c.x},${c.y}`)).join(' ')
  const area = `${line} L${w},${h} L0,${h} Z`
  return { line, area }
}

export default function PortfolioChart() {
  const { t } = useTranslation()
  const [activePeriod, setActivePeriod] = useState<string>('6m')

  const data = periodData[activePeriod]
  const svgW = 800
  const svgH = 160
  const { line, area } = buildPath(data, svgW, svgH)

  const startVal = data[0]
  const endVal = data[data.length - 1]
  const change = ((endVal - startVal) / startVal) * 100
  const positive = change >= 0

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-edge bg-panel">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-3">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-bold text-heading">{t('reports.performance')}</h3>
          <span
            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold ${
              positive ? 'bg-positive/10 text-positive' : 'bg-negative/10 text-negative'
            }`}
          >
            {positive ? '↑' : '↓'} {positive ? '+' : ''}{change.toFixed(1)}%
          </span>
        </div>

        {/* Period selector */}
        <div className="flex gap-1">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setActivePeriod(p)}
              className={`cursor-pointer rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                activePeriod === p
                  ? 'bg-field text-heading'
                  : 'bg-transparent text-caption hover:text-body'
              }`}
            >
              {t(`reports.periods.${p}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="px-2 pb-2">
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="block h-[140px] w-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={positive ? 'var(--positive)' : 'var(--negative)'} stopOpacity="0.15" />
              <stop offset="100%" stopColor={positive ? 'var(--positive)' : 'var(--negative)'} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#perfGrad)" />
          <path
            d={line}
            fill="none"
            stroke={positive ? 'var(--positive)' : 'var(--negative)'}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}
